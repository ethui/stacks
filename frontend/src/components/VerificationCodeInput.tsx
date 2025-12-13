import { useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface VerificationCodeInputProps {
  name: string;
  disabled?: boolean;
}

export function VerificationCodeInput({
  name,
  disabled,
}: VerificationCodeInputProps) {
  const { control } = useFormContext();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const value = field.value || "";
        const code = Array.from({ length: 6 }, (_, i) => value[i] || "");

        const handleDigitChange = (index: number, value: string) => {
          if (!/^\d*$/.test(value)) return;
          if (value.length > 1) return;

          const newCode = [...code];
          newCode[index] = value;
          const codeString = newCode.join("");
          field.onChange(codeString);

          if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
          }
        };

        const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
          if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
          }
        };

        return (
          <div className="flex justify-center gap-3">
            {code.map((digit: string, index: number) => (
              <input
                key={index + name}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                disabled={disabled}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl font-mono border-2 border-border rounded-lg focus:border-primary focus:outline-none bg-background disabled:opacity-50"
              />
            ))}
          </div>
        );
      }}
    />
  );
}
