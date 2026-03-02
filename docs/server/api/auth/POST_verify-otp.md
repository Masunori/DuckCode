#### Function 
Verify a user's one-time password (OTP).

**Note**: The OTP is generated using [`api/auth/request-otp`](./POST_request-otp.md), and because the OTP has a time-to-live, this is expected to be called before the OTP expires. 

#### Method: 
`POST`

#### Source
```
/api/auth/request-otp
```

#### Body
```ts
{
    "inputOTP": string;
    "email": string;
}
```

| Field | Description | Type |
| - | - | - |
| email | The user's email | string |
| inputOTP | The corresponding OTP | string |

#### Response
```ts
{
    "message": string;
}
```

| Status | Description |
| - | - |
| 200 | The OTP has been successfully verified. |
| 400 | Bad user input. This is due to failed client-side validation (email does not conform to the specified format) or server-side validation (non-existent email or wrong OTP). However, for security reasons, the specific error is ignored in the response. |
| 500 | Internal Server Error |


