# US-01 — User Registration

## 1. User Story

As a new user, I want to create an account using my email address, password, and nickname so that I can start using the Focus App.

## 2. API Endpoint

`POST /api/v1/auth/register`

## 3. Request Body

```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "nickname": "Ahmed",
  "dateOfBirth": "2000-05-15",
  "gender": "male"
}
```

`dateOfBirth` and `gender` are optional.

## 4. Acceptance Criteria

### AC-01: Successful Registration
- The system must allow a new user to register using a valid email, password, and nickname.
- The system must create a unique user account.
- Optional fields must not be required.
- The system must return the newly created user's public profile.

### AC-02: Email Validation
- Email is required.
- Email must have a valid format.
- Leading and trailing whitespace must be removed.
- Email must be normalized before storage.
- Email comparison must be case-insensitive.
- Duplicate email addresses must be rejected.

### AC-03: Password Validation
- Password is required.
- Minimum password length is 8 characters.
- Password must be hashed using Argon2id before storage.
- Plain-text passwords must never be stored or logged.
- Password hash must never be returned in API responses.

### AC-04: Nickname Validation
- Nickname is required.
- Leading and trailing whitespace must be removed.
- Nickname must contain between 2 and 30 characters after trimming.
- Nickname must not be empty or contain only whitespace.

### AC-05: Date of Birth Validation
- Date of birth is optional.
- If provided, it must use the `YYYY-MM-DD` format.
- Invalid calendar dates must be rejected.
- Future dates must be rejected.
- The value must be stored as a date-only value, not a timestamp.

### AC-06: Gender Validation
- Gender is optional.
- If provided, it must match an allowed value.
- Initial supported values: `male`, `female`, `other`, `prefer_not_to_say`.

### AC-07: Successful Response
- Return HTTP `201 Created`.
- Return the user's public information.
- Never return the password or password hash.
- Follow the standard API response format.

### AC-08: Duplicate Registration
- If the email already exists, reject registration.
- Return HTTP `409 Conflict`.
- Return a consistent application error code: `EMAIL_ALREADY_EXISTS`.
- Enforce uniqueness at the database level, not only through an application-level check.

## 5. Business Rules
- The server generates the user ID.
- The server controls `createdAt` and `updatedAt`.
- The client cannot set system-managed fields.
- Email verification is not required in the initial MVP.
- `emailVerifiedAt` must initially be null.
- Gender and date of birth can be added or updated later through the profile feature.

## 6. Security Requirements
- Use Argon2id for password hashing.
- Apply registration rate limiting.
- Validate all incoming data on the server.
- Use database constraints to prevent duplicate accounts.
- Never expose internal database errors.
- Do not log passwords or sensitive request data.

## 7. Out of Scope
- Email verification.
- Social authentication.
- Forgot password.
- Reset password.
- Profile editing.
- Account deletion.

## 8. Testing Scenarios

1. Register with all valid fields.
2. Register without optional fields.
3. Reject invalid email format.
4. Reject an existing email.
5. Reject passwords shorter than 8 characters.
6. Accept an 8-character password.
7. Reject nicknames shorter than 2 characters.
8. Reject nicknames longer than 30 characters.
9. Reject whitespace-only nicknames.
10. Reject invalid date formats.
11. Reject impossible calendar dates.
12. Reject future dates of birth.
13. Reject unsupported gender values.
14. Verify that passwords are hashed.
15. Verify that password hashes are never returned.
16. Verify duplicate-email protection under concurrent requests.