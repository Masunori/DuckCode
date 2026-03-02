#### Function 
Performs traditional login for the specified user.

#### Method: 
`POST`

#### Source
```
/api/auth/login
```

#### Body
```ts
{
    "email": string,
    "password": string,
}
```

| Field | Description | Type |
| - | - | - |
| email | The user's email | string |
| password | The user's password | string |

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
| 200, 302 | Login is successful. Returns the `accessToken` and `refreshToken`. The browser should perform a redirection. |
| 401 | Bad user input. This can mean no account associated with an email, or wrong password. For security reasons, the `message` field would not explicitly say which. |
| 500 | Internal Server Error |


