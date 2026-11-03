# US-04 — Get and Update User Profile

## 1. User Story

As an authenticated user, I want to view and update my profile information so that I can manage my personal information and customize my Focus App experience.

## 2. API Endpoints

- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`

Note: The GET endpoint is also defined in US-03. It is reused here as the profile retrieval operation.

## 3. Preconditions

- The user must have an existing account.
- The user must provide a valid Access Token.
- The authentication session must be valid.

## 4. Get Profile

### Endpoint

`GET /api/v1/users/me`

The endpoint returns the authenticated user's current profile information.

### Acceptance Criteria

- The system must return the latest persisted profile information.
- The response must contain only approved profile fields.
- The response must not expose password hashes or authentication secrets.
- The system must return HTTP `200 OK`.

## 5. Update Profile

### Endpoint

`PATCH /api/v1/users/me`

### Example Request Body

```json
{
  "nickname": "Ahmed",
  "profileImage": "https://example.com/avatar.jpg",
  "dateOfBirth": "2000-05-15",
  "gender": "male",
  "bio": "I enjoy studying and learning new things.",
  "locale": "ar-EG",
  "timezone": "Africa/Cairo"
}
```

All fields are optional in the PATCH request, but at least one valid field must be provided.

## 6. Acceptance Criteria

### AC-01: Successful Profile Update
- The system must allow an authenticated user to update their own profile.
- The system must update only the fields provided in the request.
- Fields not included in the request must remain unchanged.
- The system must return HTTP `200 OK`.
- The response must contain the updated profile.

### AC-02: Nickname Validation
- Nickname is optional during an update.
- If provided, nickname must contain between 2 and 30 characters after trimming.
- Nickname must not be empty or contain only whitespace.
- Leading and trailing whitespace must be removed.

### AC-03: Profile Image Validation
- Profile image is optional.
- If provided, it must be a valid URL or an approved storage reference.
- Only supported image formats should be accepted by the image upload service.
- The system must not accept arbitrary executable or unsafe file content.
- Image storage and upload processing must follow the application's file upload policy.

### AC-04: Date of Birth Validation
- Date of birth is optional.
- If provided, it must use the `YYYY-MM-DD` format.
- Invalid calendar dates must be rejected.
- Future dates must be rejected.
- The date must be stored without time or timezone conversion.

### AC-05: Gender Validation
- Gender is optional.
- If provided, it must match one of the supported values:
  - `male`
  - `female`
  - `other`
  - `prefer_not_to_say`

### AC-06: Bio Validation
- Bio is optional.
- Maximum length is 160 characters.
- Leading and trailing whitespace should be removed.
- Empty or whitespace-only bio values should be normalized to null or rejected according to the agreed API policy.

### AC-07: Locale Validation
- Locale is optional.
- Supported initial values:
  - `en`
  - `ar-EG`
  - `ar-SA`
- Unsupported locales must be rejected.
- The selected locale must not be inferred or forced from the user's country.

### AC-08: Timezone Validation
- Timezone is optional.
- The value must be a valid IANA timezone identifier.
- Examples:
  - `Africa/Cairo`
  - `Asia/Riyadh`
  - `UTC`
- Invalid timezone identifiers must be rejected.

### AC-09: Protected Fields
- The user must not be allowed to modify:
  - `id`
  - `email`
  - `passwordHash`
  - `emailVerifiedAt`
  - `createdAt`
  - `updatedAt`
- The system must reject attempts to modify protected fields.
- The server must control `updatedAt`.

### AC-10: Empty Update Request
- An empty PATCH request must be rejected.
- The system must return HTTP `400 Bad Request`.
- The error code must be `EMPTY_UPDATE`.

### AC-11: Authentication and Ownership
- Requests without a valid Access Token must be rejected.
- The system must derive the user ID from the authenticated server-side context.
- The client must not provide a user ID to select which account to update.
- Users must not be able to update another user's profile.

## 7. Business Rules

- Users can update only their own profile.
- Profile updates must be partial.
- Fields not provided must remain unchanged.
- Email changes are not supported through this endpoint.
- Password changes are not supported through this endpoint.
- Email verification status cannot be modified through this endpoint.
- Profile image URLs must reference approved image storage.
- Locale and timezone preferences are controlled by the user.

## 8. Security Requirements

- Require authentication for all profile operations.
- Validate every incoming field using server-side runtime validation.
- Use an explicit allowlist of editable fields.
- Never pass arbitrary request objects directly into database update operations.
- Validate image URLs or storage references.
- Apply reasonable request-size limits.
- Do not expose internal database errors.
- Log profile updates without logging sensitive values unnecessarily.

## 9. Error Cases

| Scenario | HTTP Status | Error Code |
|---|---:|---|
| Missing or invalid token | 401 | UNAUTHENTICATED |
| Invalid nickname | 400 | INVALID_NICKNAME |
| Invalid date of birth | 400 | INVALID_DATE_OF_BIRTH |
| Unsupported gender | 400 | INVALID_GENDER |
| Invalid profile image reference | 400 | INVALID_PROFILE_IMAGE |
| Unsupported locale | 400 | INVALID_LOCALE |
| Invalid timezone | 400 | INVALID_TIMEZONE |
| Empty update request | 400 | EMPTY_UPDATE |
| Disabled account | 403 | ACCOUNT_DISABLED |
| Unexpected server error | 500 | INTERNAL_ERROR |

## 10. Testing Scenarios

1. Retrieve the current user's profile.
2. Update nickname successfully.
3. Update profile image successfully.
4. Update date of birth successfully.
5. Update gender successfully.
6. Update bio successfully.
7. Update locale successfully.
8. Update timezone successfully.
9. Update multiple profile fields in one request.
10. Verify omitted fields remain unchanged.
11. Reject invalid nickname length.
12. Reject future date of birth.
13. Reject invalid gender.
14. Reject unsupported locale.
15. Reject invalid timezone.
16. Reject an empty PATCH request.
17. Reject attempts to update protected fields.
18. Verify that one user cannot update another user's profile.
19. Verify that the response never contains password hashes or authentication secrets.

## 11. Out of Scope

- Email address changes.
- Password changes.
- Profile image upload infrastructure.
- Public profile discovery.
- Follow and friend systems.
- Account deletion.
- Profile completion percentage.

