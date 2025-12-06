#### Function 
Resets a specified user's password.

#### Method: 
`POST`

#### Source
```
/api/auth/reset-password
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
| newPassword | The user's new password | string |
| newConfirmPassword | The user's retyped new password | string |

#### Response
```ts
{
    "message": string;
}
```

| Status | Description |
| - | - |
| 200 | Password reset is successful. |
| 400 | Bad user input. This is due to failed client-side validation (email/newPassword do not conform to the specified format, newConfirmPassword does not match newPassword). |
| 500 | Internal Server Error |


