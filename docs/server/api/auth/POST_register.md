#### Function 
Registers a new user into the DuckCode system using the traditional registration method.

#### Method: 
`POST`

#### Source
```
/api/auth/register
```

#### Body
```ts
{
    "userData" : {
        "email": string;
        "password": string;
        "confirmPassword": string;
        "username": string;
    }
}
```

| Field | Description | Type |
| - | - | - |
| email | The user's email | string |
| password | The user's password | string |
| confirmPassword | The user's retyped password | string |
| username | The user's username | string |

#### Response
```ts
{
    "message": string;
}
```

| Status | Description |
| - | - |
| 200 | Registration is successful. |
| 400 | Bad user input. This can be failed client-side validation (username/email/password do not conform to the specified format, confirmPassword does not match password), or server-side validation (email has existed). Read the `message` for more details. |
| 500 | Internal Server Error |


