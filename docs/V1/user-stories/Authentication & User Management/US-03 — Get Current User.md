# US-03 — Get Current User

## 1. User Story

As an authenticated user, I want to retrieve my account information so that I can access my personal profile and application data.

## 2. API Endpoint

`GET /api/v1/users/me`

## 3. Preconditions

- The user must have an existing account.
- The user must provide a valid Access Token.
- The authentication session must be valid.

## 4. Request

### Headers

`Authorization: Bearer <access_token>`

No request body is required.

## 5. Acceptance Criteria

### AC-01: Successful Request
- The system must retrieve the currently authenticated user's information.
- The user identity must be extracted from the validated Access Token.
- The client must not provide a user ID to identify the requested account.
- The system must return HTTP `200 OK`.

### AC-02: Public User Information
The response must include:
- `id`
- `email`
- `nickname`
- `profileImage`
- `dateOfBirth`
- `gender`
- `bio`
- `locale`
- `timezone`
- `emailVerifiedAt`
- `createdAt`
- `updatedAt`

Optional fields may return `null`.

### AC-03: Authentication Required
- Requests without an Access Token must be rejected.
- Invalid Access Tokens must be rejected.
- Expired Access Tokens must be rejected.
- The system must return HTTP `401 Unauthorized` for unauthenticated requests.

### AC-04: Automatic Token Refresh
- When the Access Token expires, the client must attempt to refresh authentication using its Refresh Token.
- If refresh succeeds, the client must retry the original request using the new Access Token.
- If refresh fails, the client must clear its local authentication state and require the user to log in again.
- The API endpoint itself must not silently accept expired Access Tokens.

### AC-05: Account Availability
- The system must not return account data for disabled or revoked accounts.
- The system must enforce account status checks before returning protected information.

### AC-06: Data Privacy
- The response must never include the password or password hash.
- The response must not include Refresh Tokens, session secrets, or internal security information.
- The system must return only fields explicitly approved for the current user's profile.

## 6. Business Rules

- The authenticated user ID must come from trusted server-side authentication context.
- The endpoint always returns the current authenticated user's account.
- The client cannot retrieve another user's private account data through this endpoint.
- The endpoint must return the latest persisted profile information.

## 7. Security Requirements

- Validate the Access Token signature and expiration.
- Validate the token's intended issuer and audience where applicable.
- Verify that the account and authentication session are still valid.
- Never trust a user ID supplied in request parameters or body.
- Do not log authentication tokens.
- Use HTTPS in production.

## 8. Error Cases

| Scenario | HTTP Status | Error Code |
|---|---:|---|
| Missing Access Token | 401 | UNAUTHENTICATED |
| Invalid Access Token | 401 | INVALID_ACCESS_TOKEN |
| Expired Access Token | 401 | ACCESS_TOKEN_EXPIRED |
| Disabled account | 403 | ACCOUNT_DISABLED |
| Unexpected server error | 500 | INTERNAL_ERROR |

## 9. Testing Scenarios

1. Retrieve current user with a valid Access Token.
2. Reject requests without an Access Token.
3. Reject invalid Access Tokens.
4. Reject expired Access Tokens.
5. Verify that the returned user ID matches the authenticated identity.
6. Verify that client-supplied user IDs are ignored.
7. Verify that password hashes are never returned.
8. Verify that Refresh Tokens are never returned.
9. Verify that updated profile data is reflected in the response.
10. Verify disabled account behavior.
11. Verify that one user cannot retrieve another user's private information.

## 10. Out of Scope

- Profile editing.
- Public user profile discovery.
- User search.
- Account deletion.
- Authentication token refresh implementation (covered by US-02).

