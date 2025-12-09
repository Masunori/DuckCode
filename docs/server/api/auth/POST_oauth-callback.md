#### Function 
(For the backend to) perform third-party login.
The client (by right) should not invoke this.

#### Method: 
`POST`

#### Source
```
/api/auth/login
```

#### Body
```ts
const fd = new FormData();
fd.append("accessToken", "<access>"); // string
fd.append("refreshToken", "<refresh>"); // string
fd.append("provider", "<provider>"); // string

fetch("/auth/oauth-callback", {
    method: "POST",
    body: fd,
});
```

| Field | Description | Type |
| - | - | - |
| accessToken | The generated access token | string |
| refreshToken | The generated refresh token | string |
| provider | The third party used for login | string |

#### Response

| Status | Description |
| - | - |
| 302 | OAuth callback is successful, and tokens have been set. The browser should perform a redirection. |
| 400 | Bad input. This is caught with any field above is missing. |
| 500 | Internal Server Error |


