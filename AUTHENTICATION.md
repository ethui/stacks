# Authentication API

This document describes the email-based authentication system with 6-digit verification codes and JWT tokens.

## Overview

The authentication flow consists of two steps:
1. Send email address to receive a 6-digit verification code
2. Submit the verification code to receive a JWT token

## Endpoints

### 1. Send Verification Code

**POST** `http://api.localhost:4000/auth/send-code`

Send a 6-digit verification code to the provided email address.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success - 200):**
```json
{
  "message": "Verification code sent"
}
```

**Response (Error - 422):**
```json
{
  "errors": {
    "email": ["must have the @ sign and no spaces"]
  }
}
```

### 2. Verify Code and Get JWT Token

**POST** `http://api.localhost:4000/auth/verify-code`

Verify the 6-digit code and receive a JWT token for authentication.

**Request Body:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response (Success - 200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Error - 401):**
```json
{
  "error": "Invalid or expired verification code"
}
```

## Using JWT Tokens

Once you have a JWT token, include it in the `Authorization` header for protected endpoints:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Protected Endpoints

The following endpoints require JWT authentication:

- **POST** `/stacks` - Create a new stack
- **GET** `/stacks` - List stacks
- **GET** `/stacks/:slug` - Get stack details
- **PUT** `/stacks/:slug` - Update stack
- **DELETE** `/stacks/:slug` - Delete stack

## Code Expiration

- Verification codes expire after **1 hour**
- JWT tokens expire after **7 days**

## Example Usage

### 1. Request verification code

```bash
curl -X POST http://api.localhost:4000/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### 2. Verify code and get token

```bash
curl -X POST http://api.localhost:4000/auth/verify-code \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "code": "123456"}'
```

### 3. Use token to access protected endpoints

```bash
curl -X POST http://api.localhost:4000/stacks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name": "my-stack", "description": "My development stack"}'
```

## Configuration

The JWT secret can be configured via environment variable:

```bash
export JWT_SECRET="your-secret-key-here"
```

## Email Configuration

For development, emails are sent to the local mailbox which can be viewed at:
http://localhost:4000/dev/mailbox

For production, configure the mailer in `config/runtime.exs`.