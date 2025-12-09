#### Function 
Sends an one-time password (OTP) to a specified user.

**Note**: The OTP has a certain timeout, so it is expected that [`api/auth/verify-otp`](./POST_verify-otp.md) is called to use the OTP before it expires. 

#### Method: 
`POST`

#### Source
```
/api/auth/request-otp
```

#### Body
```ts
{
    "email": string;
}
```

| Field | Description | Type |
| - | - | - |
| email | The user's email | string |

#### Response
```ts
{
    "message": string;
}
```

| Status | Description |
| - | - |
| 200 | An OTP has been sent to the user. |
| 400 | Bad user input. This is due to failed client-side validation (email does not conform to the specified format). |
| 500 | Internal Server Error |


