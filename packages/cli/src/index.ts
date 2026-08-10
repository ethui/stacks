#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir, platform } from "node:os";
import { dirname, join } from "node:path";
import { confirm, input } from "@inquirer/prompts";

const DEFAULT_API_URL = "https://api.stacks.ethui.dev";

interface AuthConfig {
	apiUrl: string;
}

type TokenMap = Record<string, string>;

function getConfigPath(): string {
	const home = homedir();
	if (platform() === "darwin") {
		return join(
			home,
			"Library",
			"Application Support",
			"dev.ethui",
			"stacks.json",
		);
	}
	return join(home, ".config", "dev.ethui", "stacks.json");
}

async function loadTokens(): Promise<TokenMap> {
	const configPath = getConfigPath();
	try {
		const content = await readFile(configPath, "utf-8");
		return JSON.parse(content) as TokenMap;
	} catch {
		return {};
	}
}

async function saveToken(apiUrl: string, token: string): Promise<void> {
	const configPath = getConfigPath();
	const tokens = await loadTokens();
	tokens[apiUrl] = token;

	await mkdir(dirname(configPath), { recursive: true });
	await writeFile(configPath, JSON.stringify(tokens, null, 2), "utf-8");
}

async function sendVerificationCode(
	email: string,
	apiUrl: string,
): Promise<boolean> {
	try {
		const response = await fetch(`${apiUrl}/auth/send-code`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email }),
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			console.error(
				"Failed to send verification code:",
				error.message || response.statusText,
			);
			return false;
		}

		return true;
	} catch (error) {
		console.error(
			"Network error:",
			error instanceof Error ? error.message : error,
		);
		return false;
	}
}

async function verifyCode(
	email: string,
	code: string,
	apiUrl: string,
): Promise<string | null> {
	try {
		const response = await fetch(`${apiUrl}/auth/verify-code`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, code }),
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			console.error(
				"Failed to verify code:",
				error.message || response.statusText,
			);
			return null;
		}

		const data = await response.json();
		return data.token;
	} catch (error) {
		console.error(
			"Network error:",
			error instanceof Error ? error.message : error,
		);
		return null;
	}
}

async function authenticate(config: AuthConfig): Promise<string | null> {
	console.log("\n🔐 ethui Stacks Authentication\n");

	const email = await input({
		message: "Enter your email address:",
		validate: (value) => {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(value)) {
				return "Please enter a valid email address";
			}
			return true;
		},
	});

	console.log(`\nSending verification code to ${email}...`);

	const sent = await sendVerificationCode(email, config.apiUrl);
	if (!sent) {
		return null;
	}

	console.log("✓ Verification code sent! Check your email.\n");

	const code = await input({
		message: "Enter the 6-digit verification code:",
		validate: (value) => {
			if (!/^\d{6}$/.test(value)) {
				return "Please enter a 6-digit code";
			}
			return true;
		},
	});

	console.log("\nVerifying code...");

	const token = await verifyCode(email, code, config.apiUrl);
	if (!token) {
		return null;
	}

	console.log("✓ Authentication successful!\n");
	return token;
}

async function main(): Promise<void> {
	const useCustomUrl = await confirm({
		message: "Use a custom API URL?",
		default: false,
	});

	let apiUrl = DEFAULT_API_URL;
	if (useCustomUrl) {
		apiUrl = await input({
			message: "Enter the API URL:",
			default: DEFAULT_API_URL,
			validate: (value) => {
				try {
					new URL(value);
					return true;
				} catch {
					return "Please enter a valid URL";
				}
			},
		});
	}

	const token = await authenticate({ apiUrl });

	if (token) {
		await saveToken(apiUrl, token);
		const configPath = getConfigPath();
		console.log(`✓ Token saved to ${configPath}\n`);
	} else {
		console.error("\n✗ Authentication failed.\n");
		process.exit(1);
	}
}

main().catch((error) => {
	console.error("Error:", error);
	process.exit(1);
});
