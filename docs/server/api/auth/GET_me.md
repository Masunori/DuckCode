#### Function 
Verify a user's identity if they have already logged in before.

**Note**: The tokens are generated when the user logs in successfully - [`api/auth/login`](./POST_login.md).

#### Method: 
`GET`

#### Source
```
/api/auth/me
```

#### Header
```ts
{
    "Content-Type": "application/json";
    "Cookie": {
        "accessToken": string;
        "refreshToken": string;
    }
}
```

#### Response
```ts
{
    "message": string;
    "data": {
        "userid": number;
        "name": string;
        "email": string;
        "exp": number;
        "rankPoint": number;
        "bio": string;
        "isTwoFactored": boolean;
        "profilePicture": string;
        "userPreference": string;
    }
}
```

| Field | Description | Type |
| - | - | - |
| userid | An unique identification number of a user | string |
| name | The user's in-game username | string |
| email | The user's email | string |
| exp | The user's experience points | number |
| rankPoint | The user's rank points | number |
| bio | A short, user-set description of the user | string |
| isTwoFactored | Whether the user enables two-factor authentication | boolean |
| profilePicture | An URL leading to the user's profile picture | string |
| userPreference | A string that encodes a user's preference | string |

**Note**: The `userPreference` string is encoded in an application-specific way, that is, there is no standardised way to encode user preference into a string, and applications that call this have to decide on their own `userPreference` string encoding.

| Status | Description |
| - | - |
| 200 | The user is successfully verified. Their information can be found in the `data` field. |
| 400 | Bad user input. This is due to expired tokens. |
| 500 | Internal Server Error |


