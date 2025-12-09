#### Function 
Uses the refresh token on the user's browser to obtain a new pair of access and refresh tokens.

#### Method: 
`POST`

#### Source
```
/api/auth/request-otp
```

#### Header
```ts
{
    "Content-Type": "application/json";
    "Cookie": {
        "refreshToken": string;
    }
}
```

#### Body
No body

#### Response
```ts
{
    "message": string;
    "data": {
        "accessToken": string;
        "refreshToken": string;
    }
}
```

| Status | Description |
| - | - |
| 200 | Refresh is successful, `accessToken` and `refreshToken` have been returned. |
| 401 | Unauthorized access (because the refresh token does not exist). |
| 500 | Internal Server Error |


