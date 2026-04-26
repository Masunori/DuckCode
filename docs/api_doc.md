# DuckCode API Doc (Server, not proxy)

## 1. Thông tin chung

- Base URL: `http://<host>:4000`
- Tất cả route được mount trực tiếp tại `/` (không có prefix `/api` trong backend hiện tại).
- Request body dùng `Content-Type: application/json`.

### Auth mechanism hiện tại

- Các route có đánh dấu **Auth: Yes** sử dụng middleware `authenticated`.
- Middleware đọc token từ `req.headers.cookie` theo **JSON string**, không theo cookie format thông thường.
- Mẫu header backend đang mong đợi:

```http
cookie: {"accessToken":"<jwt_access_token>","refreshToken":"<jwt_refresh_token>"}
```

### Rate limit

- Nhóm `/auth/*`: tối đa `20 request / 1 phút` theo `userId` hoặc `ip`.
- Nhóm `/execute/*`: tối đa `10 request / 1 phút` theo `userId` hoặc `ip`.

---

## 2. Auth APIs

### POST `/auth/login`

- Auth: No
- Body:

```json
{
  "email": "user@example.com",
  "password": "StrongPass123!"
}
```

- Success `200`:

```json
{
  "message": "Login successful",
  "data": "<access_token>"
}
```

---

### POST `/auth/register`

- Auth: No
- Body:

```json
{
  "userData": {
    "email": "user@example.com",
    "username": "duck_user",
    "password": "StrongPass123!",
    "confirmPassword": "StrongPass123!"
  }
}
```

- Success `200`: `{ "message": "Registration successful, please verify your email" }`

---

### POST `/auth/verify-otp`

- Auth: No
- Body:

```json
{
  "email": "user@example.com",
  "inputOTP": "123456"
}
```

- Success `200`: kết quả từ `authService.verifyOTP`.

---

### POST `/auth/request-otp`

- Auth: No
- Body:

```json
{
  "email": "user@example.com"
}
```

- Success `200`: `{ "message": "OTP sent to your email" }`

---

### POST `/auth/reset-password`

- Auth: No
- Body:

```json
{
  "email": "user@example.com",
  "newPassword": "NewStrongPass123!",
  "newConfirmedPassword": "NewStrongPass123!"
}
```

- Success `200`: `{ "message": "Password reset successfully" }`

---

### POST `/auth/change-password`

- Auth: Yes
- Body:

```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!",
  "newConfirmedPassword": "NewPass123!"
}
```

- Success `200`:

```json
{
  "message": "Password changed successfully",
  "token": "<new_access_token>"
}
```

---

### GET `/auth/me`

- Auth: Yes
- Query: none
- Success `200`:

```json
{
  "message": "Session info retrieved successfully",
  "data": {
    "userid": 1,
    "name": "duck_user",
    "email": "user@example.com",
    "exp": 0,
    "rankPoint": 0,
    "bio": "",
    "isTwoFactored": false,
    "profilePicture": "",
    "userPreference": ""
  }
}
```

---

### POST `/auth/logout`

- Auth: Yes
- Body: none
- Success `200`: `{ "message": "Logout successful" }`

---

### POST `/auth/refresh-token`

- Auth: No (nhưng cần `refreshToken` trong header cookie JSON)
- Body: none
- Success `200`:

```json
{
  "message": "Refresh Successfully",
  "data": "<new_access_token>"
}
```

---

### GET `/auth/oauth/google`

- Auth: No
- Mô tả: bắt đầu Google OAuth flow.

---

### GET `/auth/oauth/google/callback`

- Auth: No
- Mô tả: callback sau khi Google xác thực.

---

### GET `/auth/oauth/github`

- Auth: No
- Mô tả: bắt đầu GitHub OAuth flow.

---

## 3. Question APIs

Tất cả route dưới đây đều **Auth: Yes**.

### GET `/question/get_question`

- Query: `question_id=<string>`
- Success `200`: object question đầy đủ (qid, title, difficulty, description, input, output, examples, constraints, publicTestCases).

---

### GET `/question/get_random_question`

- Query: none
- Success `200`: object question.

---

### GET `/question/get_question_by_difficulty`

- Query: `difficulty=<number>`
- Success `200`: object question.

---

### GET `/question/get_questions_in_range`

- Query: `minDifficulty=<number>&maxDifficulty=<number>`
- Success `200`: mảng object tối giản:

```json
[
  {
    "qid": "question-id",
    "title": "Question title",
    "difficulty": 800
  }
]
```

---

### GET `/question/get_random_question_in_range`

- Query: `minDifficulty=<number>&maxDifficulty=<number>`
- Success `200`:

```json
{
  "qid": "question-id"
}
```

---

### GET `/question/get_n_questions_in_range`

- Query: `n=<number>&minDifficulty=<number>&maxDifficulty=<number>`
- Success `200`:

```json
{
  "qid": ["question-id-1", "question-id-2"]
}
```

---

## 4. Admin Question API

### POST `/admin_question/add_question`

- Auth: No (hiện tại chưa gắn middleware auth/admin)
- Body:

```json
{
  "questionid": "two-sum",
  "title": "Two Sum",
  "difficulty": 500,
  "description": "Problem statement",
  "input_type": "Input description",
  "output_type": "Output description",
  "example": "[{\"input\":\"1 2\\n\",\"output\":\"3\"}]",
  "ques_constraint": "Constraints",
  "testcases": [
    {
      "isPublic": true,
      "input": "1 2",
      "expectedOutput": "3"
    },
    {
      "isPublic": false,
      "input": "100 200",
      "expectedOutput": "300"
    }
  ]
}
```

- Success `201`: object question mới tạo.

---

## 5. Execute APIs

Tất cả route dưới đây đều **Auth: Yes**.

### POST `/execute/execute-code`

- Body:

```json
{
  "sourceCode": "print('hello')",
  "languageId": 71
}
```

- Success `200`: kết quả từ `codeExecutionService.executeCode`.

---

### POST `/execute/run-all-test-cases`

- Body:

```json
{
  "questionId": "two-sum",
  "sourceCode": "your code",
  "languageId": 71
}
```

- Success `200`: kết quả chấm public test cases.

---

### POST `/execute/submit-code`

- Body:

```json
{
  "questionId": "two-sum",
  "sourceCode": "your code",
  "languageId": 71
}
```

- Success `200`: kết quả submit + lưu submission.

---

## 6. User APIs

### POST `/update-profile`

- Auth: Yes
- Body:

```json
{
  "name": "Duck User",
  "bio": "Competitive programmer",
  "profilePicture": "https://example.com/avatar.png"
}
```

- Success `200`:

```json
{
  "message": "Profile updated successfully",
  "data": {}
}
```

---

### PUT `/update-preferences`

- Auth: Yes
- Body:

```json
{
  "preferences": {
    "theme": "dark",
    "language": "vi"
  }
}
```

- Success `200`: kết quả từ `userPreferencesService.setUserPreferences`.

---

## 7. Error format thông dụng

- `400`: missing/invalid input
- `401`: unauthorized / invalid token
- `404`: không tìm thấy dữ liệu
- `422`: validation error
- `429`: vượt rate limit
- `500`: internal server error
