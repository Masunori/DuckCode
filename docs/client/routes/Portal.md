# Portal

**Route**: [`client/src/app/portal`](../../../client/src/app/portal/page.tsx)
**Introduced**: Version 0.1.0

**Components**:
- [PortalClient](#portalclienttsx)
- [Login](#logintsx)
- [Signup](#signuptsx)
- [ResetPassword](#resetpasswordtsx)

---

The portal page is where the user performs login, sign up and related operations. While the design may change, the user should be able to redirect to this portal page from the landing page.

#### [`PortalClient.tsx`](../../../client/src/app/portal/PortalClient.tsx)

The `page.tsx` wraps over the [`<PortalClient />`](../../client/src/app/portal/PortalClient.tsx) component, which encapsulates all interactivity in this page.

Within `PortalClient`, three popups, 
- [`Login`](./client/src/app/portal/components/Login.tsx)
- [`Signup`](./client/src/app/portal/components/Signup.tsx)
- [`ResetPassword`](./client/src/app/portal/components/ResetPassword.tsx)

appear mutually exclusively on the screen (none, or only one of the popups can appear), and this behaviour is controlled using a React state:

```tsx
// PortalMode.ts
export enum PortalMode {
    None,
    Login,
    Register,
    ResetPassword
}

// PortalClient.tsx
const [portalMode, setPortalMode] = useState<PortalMode>(PortalMode.None);
```

All of the popups listed above use the same [`PopupOverlay`](../../client//src/app/portal/components/PopupOverlay.tsx), which controls its appearance on the screen based on the current React state portal mode and a referenced portal mode.

As of version 0.1.0, the `display` CSS attribute is responsible for this appearance. In the future, this will change to conditional rendering.

#### `Login.tsx`

The `Login` popup is responsible for login interaction. Instead of the traditional use of HTML form, user credentials are stored using React states. When submitting the login form, the React states will be used instead.

API URL:
```
POST - /api/portal/login
```

There are three login statuses in the non-standard use case,
```ts
enum LoginStatus {
    NONE,
    EMPTY_FIELDS,
    WRONG_USERNAME_OR_PASSWORD
}
```
all of which are checked on the server side.

#### `Signup.tsx`

The `Signup` popup is responsible for signup interactions. Similar to `Login.tsx`, instead of the traditional use of HTML form, user credentials are stored using React states. This is to enable dynamic client-side validation of username and password criteria. The conditions are stated in [`fieldConditions.ts`](../../client//src//app/portal/components/fieldConditions.ts).

```ts
type Condition = {
    name: string;
    checkFn: (password: string) => boolean;
}

export const PASSWORD_CONDITIONS: Record<string, Condition> = {
    hasTenCharOrMore: {
        name: 'At least 10 characters',
        checkFn: str => str.length >= 10
    },
    hasUppercase: {
        name: 'At least 1 uppercase letter',
        checkFn: str => /[A-Z]/.test(str)
    },
    hasLowercase: {
        name: 'At least 1 lowercase letter',
        checkFn: str => /[a-z]/.test(str)
    },
    hasDigit: {
        name: 'At least 1 numerical digit',
        checkFn: str => /\d/.test(str)
    },
    hasSpecialChar: {
        name: 'At least 1 special character: !, @, #, $, %, ^, &, *, ?',
        checkFn: str => /[!@#$%^&*?]/.test(str)
    },
    hasNoSpaces: {
        name: 'No space',
        checkFn: str => !/\s/.test(str)
    }
}

export const USERNAME_CONDITIONS: Record<string, Condition> = {
    fiveToTwentyCharacters: {
        name: 'Between 5 and 30 characters',
        checkFn: str => str.length >= 5 && str.length <= 30
    },
    containsAllowedChars: {
        name: 'Only contains letters (from any language), numbers, underscores (_), dot (.) or hyphen (-)',
        checkFn: str => /^[\p{L}\p{N}_.-]+$/u.test(str)
    }
}
```

Each of these conditions are checked independently, and each field condition will be styled differently based on whether the field is empty, the field fails the given condition or the field satisfies the condition.

The current color guideline (not yet accounted for color deficiency, will have other indicators besides colors):
- **Empty field**: Grey (also default color scheme)
- **Client-side validation failure**: Red
- **Client-side validation success**: Green
- **Server-side validation error**: Orange

There are a few signup statuses in the non-standard use case,
```ts
// src/app/api/portal/signup/SignupStatus.ts
export enum SignupStatuses {
    USERNAME_TAKEN, // if the username is already taken
    EMAIL_USED, // if the email is already used
    INVALID_CLIENT_SIDE_CREDENTIALS, // if someone bypasses client-side validation
}

// Signup.tsx
enum FieldState {
    EMPTY,
    VALID,
    INVALID,
    SERVER_SIDE_INVALID
}
```

**NOTE**: The client-side conditions will be dynamically checked as a user guidance, but all conditions will be checked again on the server side. This is to ensure that the client-side validation is enforced and users cannot bypass these.

When submitting the sign up form, the React states will be used instead.

#### `ResetPassword.tsx`

The `ResetPassword` popup is responsible for password reset interactions. While designs may change, this option should not directly visible in the portal page, but is accessible when the user chooses the reset password option in the `Login` popup.

This is split into four stages, where users cannot navigate to previous stages, but can reset the process if they exit the reset password popup. The stages are controlled by a React state:

```ts
const [stage, setStage] = useState(0);
```

Where
- `stage == 0` means the email verification stage
- `stage == 1` means the one-time password (OTP) verification stage
- `stage == 2` means the password reset stage
- `stage == 3` means the password reset success confirmation stage

Each of these stages have their dimensions the same as the popup dimension. All four stages are stacked vertically into a `<div>` element of height equivalent to 400% of the popup's height. Each stage will have a vertical translation of `${stage * -25}%`, meaning that at any point in time, only one of the stages will fit the popup's dimension.

In the email verification stage, the email is dynamically checked to enforce valid email format. After the user confirms the email, the server will check if the email exists in the database and sends the code.

The following reset password statuses related to email verification are listed here:

```ts
// src/app/api/portal/resetPassword/resetPasswordStatuses.ts
export enum ResetPasswordStatuses {
    // ...
    INVALID_CLIENT_SIDE_CREDENTIALS, // if someone intentionally bypasses 
    CODE_SENT, // if the verification code is sent successfully
    // ...
}
```

In the OTP verification stage, after the user enters the OTP, the server will check if the OTP matches the server-generated one and proceeds to the password reset stage.

The following reset password statuses related to OTP verification are listed here:

```ts
// src/app/api/portal/resetPassword/resetPasswordStatuses.ts
export enum ResetPasswordStatuses {
    // ...
    INVALID_CLIENT_SIDE_CREDENTIALS, // if someone intentionally bypasses
    VERIFICATION_SUCCESS, // if the verification code is correct
    WRONG_VERIFICATION_CODE, // if the verification code is wrong
    // ...
}
```

In the password reset stage, after user enters the password and confirmed password, the server will check if the old and new passwords are the same and informs successful password reset

The following reset password statuses related to OTP verification are listed here:

```ts
// src/app/api/portal/resetPassword/resetPasswordStatuses.ts
export enum ResetPasswordStatuses {
    // ...
    INVALID_CLIENT_SIDE_CREDENTIALS, // if someone intentionally bypasses
    PASSWORD_RESET_SUCCESS, // if the password is reset successfully
    SAME_PASSWORD // if the new password is the same as the old password
    // ...
}
```