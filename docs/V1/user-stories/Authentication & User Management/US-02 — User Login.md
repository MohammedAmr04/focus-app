# US-02 — User Login

## 1. User Story

As a registered user, I want to log in using my email address and password so that I can securely access my Focus App account.

## 2. API Endpoints

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`

Note: The refresh endpoint is included in this story because it is required for the Access Token + Refresh Token authentication strategy.

## 3. Preconditions

- The user must have an existing account.
- The user must provide valid login credentials.
- The account must not be blocked or disabled.

## 4. Login Request

### Endpoint

`POST /api/v1/auth/login`

### Request Body

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

## 5. Acceptance Criteria

### AC-01: Successful Login

- The system must allow a registered user to log in using a valid email and password.
- The email must be normalized before lookup.
- The system must verify the submitted password against the stored password hash using Argon2id.
- The system must issue a short-lived Access Token.
- The system must issue a Refresh Token.
- The system must establish an authenticated session.
- The system must return the authenticated user's public profile information.

### AC-02: Invalid Credentials

- The system must reject login attempts with an incorrect email or password.
- The system must return the same generic error message for both cases.
- The response must not reveal whether the email address exists.
- The system must return HTTP `401 Unauthorized`.
- The application error code must be `INVALID_CREDENTIALS`.

### AC-03: Access Token

- The Access Token must have a short expiration time.
- The token must identify the authenticated user.
- Protected API endpoints must validate the token before granting access.
- Expired or invalid tokens must be rejected.
- The token must not contain sensitive user information.

### AC-04: Refresh Token

- The Refresh Token must have a longer expiration time than the Access Token.
- The Refresh Token must be securely generated.
- The system must associate the Refresh Token with a specific authentication session.
- The system must support Refresh Token Rotation.
- Each successful refresh operation must issue a new Access Token and a new Refresh Token.
- The previous Refresh Token must become invalid after rotation.
- Reuse of an already rotated Refresh Token must be detected and handled according to the token-reuse policy.

### AC-05: Refresh Token Request

#### Endpoint

`POST /api/v1/auth/refresh`

The client must provide a valid Refresh Token using the authentication mechanism defined for its platform.

The system must:
- Validate the Refresh Token.
- Verify that its associated session is active.
- Verify that the token has not expired or been revoked.
- Rotate the Refresh Token.
- Issue a new Access Token.
- Return the new authentication credentials.

### AC-06: Invalid or Expired Refresh Token

- The system must reject expired, invalid, or revoked Refresh Tokens.
- The system must return HTTP `401 Unauthorized`.
- The system must return a consistent error code such as `INVALID_REFRESH_TOKEN`.
- The client must be required to authenticate again.

### AC-07: Disabled or Blocked Accounts

- The system must not issue authentication tokens to disabled or blocked accounts.
- The system must return a safe, consistent authentication error.
- The system must not expose internal account status information unnecessarily.

### AC-08: Rate Limiting

- Login attempts must be rate-limited.
- Excessive failed attempts must trigger additional protection.
- Rate limiting must consider abuse from repeated requests without unnecessarily blocking legitimate users.

### AC-09: Successful Login Response

The response must contain:
- Access Token.
- Access Token expiration information.
- Refresh Token, or an indication that it was issued through a secure cookie.
- Authenticated user's public profile.

The response must never contain:
- Password.
- Password hash.
- Internal authentication secrets.

## 6. Business Rules

- Users authenticate using email and password.
- Email matching must be case-insensitive.
- Email verification is not required in the initial MVP.
- Access Tokens and Refresh Tokens must have separate expiration policies.
- Refresh Token rotation must be enforced.
- Each device or login session should have its own authentication session.
- Logging in from another device must not automatically invalidate existing sessions unless a separate policy requires it.

## 7. Security Requirements

- Verify passwords using Argon2id.
- Never store plain-text passwords.
- Never log passwords or authentication tokens.
- Use cryptographically secure random Refresh Tokens if using opaque tokens.
- Store only a secure hash of opaque Refresh Tokens in the database.
- Use HTTPS in production.
- Protect token refresh against replay and token reuse.
- Use secure token storage appropriate to each platform.
- Apply appropriate CSRF protection when authentication uses cookies.
- Validate authentication and authorization on every protected endpoint.

## 8. Testing Scenarios

1. Login with valid credentials.
2. Reject an incorrect password.
3. Reject an unknown email.
4. Verify that invalid email and password produce the same generic error.
5. Verify that email normalization works.
6. Verify that successful login issues an Access Token.
7. Verify that successful login issues a Refresh Token.
8. Reject an expired Access Token.
9. Reject a malformed Access Token.
10. Successfully refresh an expired Access Token using a valid Refresh Token.
11. Verify Refresh Token Rotation.
12. Reject reuse of a rotated Refresh Token.
13. Reject an expired Refresh Token.
14. Reject a revoked Refresh Token.
15. Verify that disabled accounts cannot authenticate.
16. Verify that passwords and tokens never appear in logs.
17. Verify login rate limiting.
18. Verify that separate devices can maintain separate sessions.

## 9. Out of Scope

- Social Login.
- Multi-factor Authentication (MFA).
- Email Verification.
- Password Reset.
- Device management UI.
- Login notifications.
- Account deletion.

## 10. Open Technical Decisions

The following implementation details must be finalized before development:

- Access Token format and expiration time.
- Refresh Token format and expiration time.
- Refresh Token storage strategy.
- Cookie-based authentication strategy for Web.
- Secure token storage strategy for Mobile.
- Refresh Token reuse detection and session revocation policy.