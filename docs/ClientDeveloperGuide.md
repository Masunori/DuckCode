# DuckCode Developer Guide

**NOTE**: When looking at this document, it is advised that you also look at the code at the same time. Some code extracts quoted here need context from the code itself.

---

## Contents
[Documentation Revision History](#documentation-revision-history)
[Setting Up and Getting Started](#setting-up-and-getting-started)
[Routes and Pages Design](#routes-and-pages-design)
- [`/landing`](#landing)
- [`/portal`](#portal)
- [`/home`](#home)
- [`/gameplay`](#gameplay)
- [`/playground`](#playground)

[Reusable Components Design](#reusable-components-design)
- [Backgrounds](#backgrounds)
- [Contexts](#contexts)
- [Countdown Timer](#countdown-timer)
- [Custom Inputs](#custom-inputs)
- [Custom Popup](#custom-popup)
- [Settings](#settings)
- [Themes for Code Editor](#themes-for-code-editor)

[Utilities](#utilities)
- [Color Utilities](#color-utilities)
- [Debounce Utility Function](#debounce-utility-function)
- [Locking Mutually Exclusive Functionalities](#locking-mutually-exclusive-functionalities)
- [Managing Keyboard Events](#managing-keyboard-events)
- [Simulating a Delay](#simulating-a-delay)

[Future Improvements](#future-improvements)

---
## Documentation Revision History
| Version | Date |
| --- | --- |
| 1.0 | 28 June, 2025 |
---

## Setting Up and Getting Started

Refer to the [Setting Up and Getting Started](SettingUp.md) document.

---

## Routes and Pages Design
DuckCode uses file-based routing, and as you navigate the application, there will be the following routes:

---

### [`/landing`](../client/src/app/landing/page.tsx)
When the user first clicks on the link to the website, this will be the first page they see.

The important part of the landing page is the components in the [`/components`](../client/src/app//landing/components/) directory, which contains the components whose dimensions are exactly `100vw * 100vh`, that is, each component will span the entire user's screen.

As of version 1.0, the landing component contains the JSON string
```ts
const SECTIONS = {
    home: {
        name: "Home",
        component: Home,
    },
    news: {
        name: "News",
        component: News,
    },
}
```
This maps each component to its
- `name`: The name of the component visible on the navigation bar.
- `component`: The actual component.

The landing page also uses a custom scrolling effect, where each upscroll/downscroll will snap a component to the entire screen.

```ts
// scroll event handler
const handleScroll = useCallback((event: globalThis.WheelEvent) => {
    const delta = event.deltaY;

    setCurrentSection((prev) => {
        if (delta > 0 && prev < Object.keys(SECTIONS).length - 1) {
            return prev + 1; // Scroll down → next section
        } else if (delta < 0 && prev > 0) {
            return prev - 1; // Scroll up → previous section
        }
        return prev;
        });

}, []);

// enables jump scrolling whenever the section changes
useEffect(() => {
    sectionRef.current[currentSection]?.scrollIntoView({ behavior: 'smooth' });
}, [currentSection]);
```

#### `Home.tsx`
The [`Home`](../client/src/app/landing/components/Home.tsx) is the first component the user sees, which introduces DuckCode and includes a way for them to go to the portal for login/sign-up.

#### `News.tsx`
The more notable component here is the [`News`](../client/src/app/landing/components/News.tsx) component, which fetches articles from the DuckCode article database. This component will help the user update on DuckCode events and notifications.

API URL:
```
GET - /api/landing
```

As of 28 June, 2025, the structure of an article is as follows:
```ts
export type Content = {
    paragraph: { 
        text: string, 
        bold: boolean, 
    }[];
};

export type Article = {
    title: string,
    date: string,
    content: Content[],
};

export type Articles = {
    [key: string]: Article;
};
```

**NOTE**: We will migrate to Markdown in the future.

---

### [`/portal`](../client/src/app/portal/page.tsx)
The portal page is where the user performs login, sign up and related operations. While the design may change, the user should be able to redirect to this portal page from the landing page.

The `page.tsx` wraps over the [`<PortalClient />`](../client/src/app/portal/PortalClient.tsx) component, which encapsulates all interactivity in this page.

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

All of the popups listed above use the same [`PopupOverlay`](../client//src/app/portal/components/PopupOverlay.tsx), which controls its appearance on the screen based on the current React state portal mode and a referenced portal mode.

As of 28 June, 2025, the `display` CSS attribute is responsible for this appearance. In the future, this will change to conditional rendering.

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

The `Signup` popup is responsible for signup interactions. Similar to `Login.tsx`, instead of the traditional use of HTML form, user credentials are stored using React states. This is to enable dynamic client-side validation of username and password criteria. The conditions are stated in [`fieldConditions.ts`](../client//src//app/portal/components/fieldConditions.ts).

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

API URL:
```
POST - /api/portal/signup
```

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

API URL:
```
/api/portal/resetPassword/sendVerificationCode
```

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

API URL:
```
/api/portal/resetPassword/verifyOtp
```

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

API URL:
```
/api/portal/resetPassword/verifyNewPassword
```

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

---

### [`/home`](../client/src/app/(withContext)/home/page.tsx)

After the user logs in successfully, the user will be redirected to the home page. While the design may change, there will persist the following components for the home UI.

#### [`ChatPanel.tsx`](../client/src/app/(withContext)/home/components/ChatPanel.tsx)

This is the component where the user can exchange messages with other users.

#### [`EventMenu.tsx`](../client/src/app/(withContext)/home/components/EventMenu.tsx)

This is the component that the user can interact with to access version events and other time-limited activities such as Daily Challenge, Battle Pass equivalent, etc.

#### [`GameMenu.tsx`](../client/src/app/(withContext)/home/components/GameMenu.tsx)

This is the component that the user can interact with to access permanent features of DuckCode, such as Multiplayer, Arcade, Playground and Tutorials. To separate concerns, the game menu component will also contain and control UI components related to game mode selection, which is in the [`gameMenu`](../client/src/app/(withContext)/home/components/gameMenu) directory. There exists zero to one UI component for each game menu options, which again appears mutually exclusively on the screen, and thus, are controlled by a React state:

```ts
// home/homeUtils.ts
export type GameMenuTab = "" 
    | "Multiplayer" 
    | "Arcade" 
    | "Playground" 
    | "Tutorial" 
    | "Join/Host a Private Match" 
    | "Inventory" 
    | "Clan"
;

// home/components/GameMenu.tsx
const [tab, setTab] = useState<GameMenuTab>("");
```

Each of these components are conditionally rendered based on which state is in effect.

- [`ArcadeModeTab.tsx`](../client/src/app/(withContext)/home/components/gameMenu/ArcadeModeTab.tsx): The UI component where the user customises the game settings for Arcade Mode. This will be mounted on the DOM tree if `tab === "Arcade"`. The list of game mode description for arcade mode games are listed as a JS object literal in the [`homeUtils.ts`](../client/src/app/(withContext)/home/homeUtils.ts) file.

#### [`HomeNavbar.tsx`](../client/src/app/(withContext)/home/components/HomeNavbar.tsx)

This is the component usually (and should be) on top of the screen, where the user would see their user information, currency and access to settings.

#### [`NewsCarousel.tsx`](../client/src/app/(withContext)/home/components/NewsCarousel.tsx)

This is the component where the user can view current events in DuckCode in a more visually appealing way. News tabs are cycled in a carousel-like effect.

This carousel is coded from scratch, and here is how the effect is achieved.

1. The news content is given as an array. Because the news format has not been decided as of 28 June, 2025, we refrain from giving any specific information.
<br>
2. The news array is augmented in an immutable way: The first news piece is duplicated and added to the end of the list, while the last news piece is also duplicated and added to the start of the list.
    ```ts
    function augmentData<T>(data: T[]) {
        const augmentedData = [...data];
        augmentedData.unshift(data[data.length - 1]);
        augmentedData.push(data[0]);

        return augmentedData;
    }
    ```

    This is so that when the user is at the end of the news array and wants to shift rightward, it cycles back to the first news piece in a smooth transition, and secretly snaps back to the start of the news array. Same for the other case.
<br>
3. The smooth transition and snapping is controlled by a React state.
    ```ts
    const [isAnimating, setIsAnimating] = useState(true);
    ```

    Then, the active news piece (the one visible to the user on the `NewsCarousel`) is also controlled by another React state. 
    ```ts
    const [activeNewsTab, setActiveNewsTab] = useState(1);
    ```

    This indexing is based on the *augmented* news list, so the React state initialises to 1.
<br>
4. Two functions below handle the smooth transition part of left shifts and right shifts.
    ```ts
    function handleLeftShift() {
        if (isAnimating) {
            return;
        }

        setIsAnimating(true);
        setActiveNewsTab(prev => prev - 1);
    }

    function handleRightShift() {
        if (isAnimating) {
            return;
        }

        setIsAnimating(true);
        setActiveNewsTab(prev => prev + 1);
    }

    const debounceHandleLeftShift = debounce(handleLeftShift, 250);
    const debounceHandleRightShift = debounce(handleRightShift, 250);
    ```

    Note the use of debouncing by 250ms here to make sure that the user cannot spam-click for shifts, which will ruin the snapping effect. The documentation for the `debounce` utility function is available [here](#debounce-utility-function).
<br>
5. Then, the secret snapping is handled by a `useEffect`, where snapping will occur when the active news tab is either the start or the end of the news array.
    ```ts
    const transitionDuration = 0.5;

    useEffect(() => {
        setTimeout(() => {
            setIsAnimating(false);

            if (activeNewsTab === 0) {
                setActiveNewsTab(data.length);
            } else if (activeNewsTab === data.length + 1) {
                setActiveNewsTab(1);
            }
        }, transitionDuration * 1001);
    }, [activeNewsTab, data.length])
    ```

    To explain the `setTimeout` and the "magic number" 1001, the `transitionDuration` variable is in seconds, that is, the smooth transition duration will be 0.5 seconds. However, the state underneath is changed immediately. Without a `setTimeout`, the snapping will happen right at the moment the `activeNewsTab` variable changes. At the same time, components re-rendering due to setting `isAnimating` to false may happen after the if-else statement of `setActiveNewsTab`, so the resulting animation is that the carousel runs backward all the way from the last to first news tab, which is not desirable.

    For example, given an augmented news array `data = [5, 1, 2, 3, 4, 5, 1]`, and the user is index 5 news piece (`data[5] = 5`) and shifts to the left, without setTimeout, instead of going to the index 6 news piece and snapping back to the index 1 news piece 
    > `5 --smooth-transition--> 6 --snap--> 1`

    the animation is that the Carousel traverses immediately back to index 1 news piece 

    > `5 --smooth-transition--> 1`.

    Thus, we have to delay the snapping to after the shifting animation is done, that is, calling `setTimeout` on both `setIsAnimating(false)` and `setActiveNewsTab` with a delay of `transitionDuration * 1001`. `setTimeout` is in milliseconds, and a buffer of 1 millisecond is sufficient for the animation to finish before the secret snapping.
<br>
6. Finally, for the React component, stack all news pieces horizontally within a `<div>`, and set the `transform` CSS attribute according to the `activeNewsTab` value.

    ```css
    <!-- home/page.module.css -->
    .allNewsTabs {
        <!-- ... -->
        display: flex;
        overflow: hidden;
        <!-- ... -->
    }
    ```

    ```ts
    // home/components/NewsCarousel.tsx
    <div className={styles.allNewsTabs}>
        {augmentData(data).map((info, index) => (
            <div 
                key={index}
                style={{
                    width: `${(data.length + 2) * 100}%`,
                    transform: `translateX(${-(activeNewsTab) * 100}%)`,
                    transition: isAnimating ? `transform ${transitionDuration}s ease` : "none",
                }}
                className={styles.newsTab}
            >
                {info}
            </div>
        ))}
    </div>
    ```

    To explain the width, because news pieces are stacked horizontally, each news piece is allocated `parent-div-width / (data.length + 2)`px as 100% width. For each piece to be the same with as the parent `<div>`, you have to scale up by `(data.length + 2)`, that is, set

    ```ts
    style={{
        // ...
        width: `${(data.length + 2) * 100}%`,
        // ...
    }}
    ```
<br>

---

### [`/gameplay`](../client/src/app/(withContext)/gameplay/page.tsx)

> [!NOTE]
> This route will change in the future because its name is very vague and cannot differentiate between multiplayer, arcade, and other modes that use this UI.

The gameplay UI is where interactions with game matches happen. It is a server component where the question/information will be fetched and passed to the `GameplayClient` component.

API URL
```
GET - /api/gameplay/getQuestion
```

```ts
return (
    <div className={styles.container}>
        <GameplayClient question={question} />
    </div>
)
```

The `Question` has the following type:
```ts
// gameplay/gameplayUtils.ts
export type TestCase = {
    tid: number;
    input: string;
    expectedOutput: string;
}

export type Example = {
    input: string[];
    output: string[];
    explanation: string;
}

export type Question = {
    qid: number;
    title: string;
    difficulty: number;
    description: string[];
    input: string[]; // description of the input
    output: string[]; // description of the output
    examples: Example[];
    constraints: string[];
    publicTestCases: TestCase[];
}
```

#### [`GameplayClient.tsx`](../client/src/app/(withContext)/gameplay/GameplayClient.tsx)

This component is the client part of the gameplay UI which takes in the relevant question/information to render and enable intractivity.

Because the gameplay layout is customisable, the `GameplayClient` is again, a wrapper over the user-chosen layout.

```ts
// gameplay/layout/layoutUtils.tsx
export type LayoutInfo = {
    miniPreview: React.JSX.Element;
    implementation: (question: Question) => React.JSX.Element;
}

export const LAYOUTS: Record<string, LayoutInfo> = {
    // ...
}

// gameplay/GameplayClient.tsx
return (
    LAYOUTS[user.userPreference.gameplayLayout].implementation(question)
);
```

The layouts are as follows:
- **Default**:
    <div style="
        display: grid;
        grid-template-rows: 1fr 5fr 2fr;
        grid-template-columns: 2fr 3fr;
        grid-template-areas:
            'nav nav'
            'question editor'
            'question testcases';
        column-gap: 0.5rem;
        row-gap: 0.5rem;
        border: 3px solid #888;
        padding: 0.5rem;
        border-radius: 1.5rem;
    ">
        <div style="
            grid-area: nav;
            padding: 0.5rem 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Navigation Bar
        </div>
        <div style="
            grid-area: question;
            padding: 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Question
        </div>
        <div style="
            grid-area: editor;
            padding: 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Code Editor
        </div>
        <div style="
            grid-area: testcases;
            padding: 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Test Cases
        </div>
    </div>
    <br>
- **Inverted**
    <div style="
        display: grid;
        grid-template-rows: 1fr 5fr 2fr;
        grid-template-columns: 3fr 2fr;
        grid-template-areas:
            'nav nav'
            'editor question'
            'testcases question';
        column-gap: 0.5rem;
        row-gap: 0.5rem;
        border: 3px solid #888;
        padding: 0.5rem;
        border-radius: 1.5rem;
    ">
        <div style="
            grid-area: nav;
            padding: 0.5rem 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Navigation Bar
        </div>
        <div style="
            grid-area: question;
            padding: 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Question
        </div>
        <div style="
            grid-area: editor;
            padding: 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Code Editor
        </div>
        <div style="
            grid-area: testcases;
            padding: 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Test Cases
        </div>
    </div>
    <br>
- **Two Tabs**
    <div style="
        display: grid;
        grid-template-rows: 1fr 5fr 2fr;
        grid-template-columns: 1fr 1fr;
        grid-template-areas:
            'nav nav'
            'question editor'
            'question editor';
        column-gap: 0.5rem;
        row-gap: 0.5rem;
        border: 3px solid #888;
        padding: 0.5rem;
        border-radius: 1.5rem;
    ">
        <div style="
            grid-area: nav;
            padding: 0.5rem 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Navigation Bar
        </div>
        <div style="
            grid-area: question;
            padding: 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Question + Test Cases (Toggle)
        </div>
        <div style="
            grid-area: editor;
            padding: 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Code Editor
        </div>
    </div>
    <br>
- **Two Tabs Inverted**
    <div style="
        display: grid;
        grid-template-rows: 1fr 5fr 2fr;
        grid-template-columns: 1fr 1fr;
        grid-template-areas:
            'nav nav'
            'editor question'
            'editor question';
        column-gap: 0.5rem;
        row-gap: 0.5rem;
        border: 3px solid #888;
        padding: 0.5rem;
        border-radius: 1.5rem;
    ">
        <div style="
            grid-area: nav;
            padding: 0.5rem 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Navigation Bar
        </div>
        <div style="
            grid-area: question;
            padding: 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Question + Test Cases (Toggle)
        </div>
        <div style="
            grid-area: editor;
            padding: 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Code Editor
        </div>
    </div>
    <br>
- **Fullscreen Editor**
    <div style="
        display: grid;
        grid-template-rows: 1fr 7fr;
        grid-template-columns: 1fr 1fr;
        grid-template-areas:
            'nav nav'
            'editor editor';
        column-gap: 0.5rem;
        row-gap: 0.5rem;
        border: 3px solid #888;
        padding: 0.5rem;
        border-radius: 1.5rem;
        position: relative;
        overflow: hidden;
        font-family: sans-serif;
        background-color: #fefefe;
    ">
        <div style="
            grid-area: nav;
            padding: 0.5rem 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Navigation Bar + Toggle Question + Toggle Test Cases
        </div>
        <div style="
            grid-area: editor;
            padding: 1rem;
            border: 1px solid #888;
            border-radius: 1rem;
        ">
            Code Editor
        </div>
        <div style="
            position: absolute;
            top: 0;
            right: 0;
            height: calc(100% - 1rem);
            width: 50%;
            background-color: rgba(127, 127, 127, 0.6); /* Light orange, semi-transparent */
            border: 1px solid #888;
            margin: 0.5rem;
            border-radius: 1rem;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: question-toggle 8s infinite normal;
            box-shadow: -4px 0 8px rgba(0,0,0,0.1);
        ">
            Question (toggle)
        </div>
        <div style="
            position: absolute;
            bottom: 0;
            left: 0;
            height: 50%;
            width: calc(100% - 1rem);
            background-color: rgba(160, 160, 160, 0.75); /* Light green, semi-transparent */
            border: 1px solid #888;
            margin: 0.5rem;
            border-radius: 1rem;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: test-cases-toggle 8s infinite normal;
            box-shadow: 0 -4px 8px rgba(0,0,0,0.1);
        ">
            Test Cases + Output (toggle)
        </div>
        <style>
            @keyframes question-toggle {
                0% { transform: translateX(100%); }
                25% { transform: translateX(0%); }
                50% { transform: translateX(100%); }
                100% { transform: translateX(100%); }
            }
            @keyframes test-cases-toggle {
                0% { transform: translateY(100%); }
                50% { transform: translateY(100%); }
                75% { transform: translateY(0%); }
                100% { transform: translateY(100%); }
            }
        </style>
    </div>

These preview are also available in the Settings UI. Here, we will talk more about the common components that appear across all layouts.

To allow certain component(s) to be resizable, we use the library React Resizable Panels.
- [`react-resizable-panels` library](https://www.npmjs.com/package/react-resizable-panels)


#### [`GameplayNavbar.tsx`](../client/src/app/(withContext)/gameplay/components/GameplayNavbar.tsx)

This component contains most controls of the game for the user, including the timer and access to settings. 

At this point, you may notice the use of custom hooks `useSettings()` and `usePopup()`. These are explained in the [Context](#context) part of the documentation.

#### [`QuestionDisplay.tsx`](../client/src/app/(withContext)/gameplay/components/QuestionDisplay.tsx)

This component takes in the question in the `Question` format and renders it to the user.

#### [`CodeEditor.tsx`](../client/src/app/(withContext)/gameplay/components/CodeEditor.tsx)

This component is the code editor the user can use. It uses Monaco Editor underneath.
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [`@monaco-editor/react` library](https://www.npmjs.com/package/@monaco-editor/react)

The editor is configured according to user preferences, extracted from the user context. You can read more about user context [here](#context).

The `editorOptions` prop of the `<Editor />` component is created from user preference, with more attributes supported in the future.

```ts
import * as monaco from 'monaco-editor';
import { useUserStore } from "@app/components/contexts/UserContext";

const user = useUserStore(state => state.user);

const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
    detectIndentation: false,
    fontSize: user.userPreference.fontSize,
    lineNumbers: LINE_NUMBERS_OPTIONS[user.userPreference.editorOptions.lineNumbers],
    minimap: {
        enabled: user.userPreference.editorOptions.enableMinimap,
    },
    renderWhitespace: RENDER_WHITESPACE_OPTIONS[user.userPreference.editorOptions.renderWhiteSpace],
    tabSize: user.userPreference.editorOptions.tabSize,
    wordWrap: WORD_WRAP_OPTIONS[user.userPreference.editorOptions.wordWrap],
    wordWrapColumn: user.userPreference.editorOptions.wordWrapColumn,
}
```

Other props such as `theme` and `language` are also controlled by user preference. Functional props such as `onMount`, `value` and `onChange` are handled by the layout components that use this code editor component.

Regarding the `onMount` prop for the `Editor` component, the respective layouts will define their own React states and invoke `instantiateEditorOnMount`, a utility function called when the editor first mounts, located at [gameplayUtils.ts](../client/src/app/(withContext)/gameplay/gameplayUtils.ts).

#### [`TestCases.tsx`](../client/src/app/(withContext)/gameplay/components/TestCases.tsx)

Different layouts will implement this differently, but generally, the test cases component will render all public test cases information to the user, and gives visual feedback when they run the public test cases.

While designs may change, the test case UI must satisfy the conditions:
- The user should be able to select any public test cases, and they can view the status of all public test cases (unattempted, failed, passed).
- If the user selects a public test case, the user should be able to see the input, expected output, actual output, and the message.

**NOTE**: As of 28 June, 2025, in the default and inverted settings, the test case UI is merged with the output UI and code execution buttons. In other settings, the test case UI purely displays test cases. This will change in future iterations.

#### [`CodeHandlerButtions.tsx`](../client/src/app/(withContext)/gameplay/components/CodeHandlerButtons.tsx)

This component contains three buttons (or equivalent) that correspond to three different functionalities:

- **Run all Test Cases**: Run the code against all public test cases.
API URL
```
POST /api/gameplay/runAllTestCases
```
- **Run code**: Purely runs the code like a typical compiler/interpreter.
API URL
```
POST /api/gameplay/runCode
```

- **Submit**: Runs the code against both public and private test cases. The behaviour differs for different game modes.
API URL
```
POST - /api/gameplay/submit
```

The user should not be able to perform more than one out of the functionalities at any point in time. To achieve this, the functionalities share the same [lock](../client/src/app/utils/lock.ts), whose documentation can be found [here](#locking-mutually-exclusive-functionalities). 

Also, each layout will define their own React states and call the following three utility functions to achieve the abovementioned three functionalities. The utility functions are located at [gameplayUtils.ts](../client/src/app/(withContext)/gameplay/gameplayUtils.ts).

- Running code will invoke the `runCodeOutputModeClientSide` function.
- Running code against all public test cases will invoke the `runTestCasesClientSide` function.
- Running code against all test cases (also called submission) will invoke the `submitCodeClientSide` function.

**NOTE**: As of 28 June, 2025, the default and inverted layout do not use this. For the sake of consistency with other layouts, this will be changed in future iterations.

#### [`InformationPanelButtons.tsx`](../client/src/app/(withContext)/gameplay/components/InformationPanelButtons.tsx)

This component is exclusive for two tabs and two tabs inverted layout. Because there are two tabs, the user will have to toggle questions, test cases and output mode within the same tab. Hence, the layout that uses the information panel buttons will define their own React states and pass them as props to this component:

```ts
// gameplayUtils.ts
export type InformationMode = "question" | "testCases" | "output" | "-";

// implementing layout for two tabs/two tabs inverted
const [informationMode, setInformationMode] = useState<InformationMode>("question");
// ...
<InformationPanelButtons 
    informationMode={informationMode} 
    setInformationMode={setInformationMode}
/>
// ...
```

#### [`Output.tsx`](../client/src/app/(withContext)/gameplay/layout/twoTabs/components/Output.tsx)

This is an exclusive UI component to two tabs (and inverted) and fullscreen editor layout. While designs for different layouts will vary, it renders compiler/interpreter output when the user runs code, as well as submission output when the user submits the code.

**NOTE**: As of 28 June, 2025, the default and inverted layout do not use this. For the sake of consistency with other layouts, this will be changed in future iterations.

---

### [`/playground`](../client/src/app/(withContext)/playground/page.tsx)

The playground component represents an ordinary code editor that a user can use to run any code. Without the question/information display, it currently uses the two tabs layout, where the other tab is fixed to output mode.

---

## Reusable Components Design 
All reusable components are located [here](../client/src/app/components).

---

### [Backgrounds](../client/src/app/components/backgrounds)

This defines backgrounds that can be used in the layout of certain routes. By convention, each background should take in a `children` of type `ReactNode`, and write HTML code to wrap over the children. 

We will use the given [Starry Background](../client/src/app/components/backgrounds/StarryBackground.tsx) as an example, which sets the background as black and inserts flickering stars at random points on the background. Then, for any route, you can do
```ts
// layout.tsx
import StarryBackground from "@app/components/backgrounds/StarryBackground";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <StarryBackground>
            {children}
        </StarryBackground>
    );
}
```

---

### [Contexts](../client/src/app/components/contexts)

To avoid prop drilling, contexts allow components to directly access certain attributes and variables without receiving them as a prop. As of 28 June, 2025, there are three contexts to be noted of.

#### [Popup Context](../client/src/app/components/contexts/PopupContext.tsx)

Read about the custom Popup UI [here](#custom-popup).

The Popup Context follows the React context mechanism, and provides a context provider for children components to access the following attributes:

1. `isPopupOpen: boolean`: tells whether the popup is open
2. `closePopup: () => void`: closes the popup
3. `popupMessage: string`: the message shown when the popup opens
4. `confirmMessage: string`: the text on the button used to confirm the message/proceed with a decision
5. `cancelMessage: string`: the text on the button used to cancel a decision
6. `confirmFn: () => void`: executes code related to when the decision is confirmed
7. `cancelFn: () => void`: executes code related to when the decision is cancelled
8. `openPopupWith`: a function that takes in arguments 3 to 7, loads the popup UI with the given information, opens the popup, and returns nothing

`PopupContext.tsx` exports two functions, a React component functon named `PopupProvider` which provides the popup context to all its children nodes, and a hook function, named `usePopup`, that when a child component calls this, it can access all aforementioned attributes.

It is to note that only the custom Popup UI will subscribe to arguments 1 to 7 to render proper information for the popup. Then, all of the other children components will call `openPopupWith` to open the popup with their desired information. This explains why React context is sufficient.

In the [`(withContext)`](../client/src/app/(withContext)) directory, the `layout.tsx` is as follows:

```tsx
    // ...
    return (
        <PopupProvider>
            <Popup />
            // ...
            {children}
            // ...
        </PopupProvider>
    )
```

This means that only after the user login, all components are allowed to use the popup context, and consequentially, this popup will only appear after the user logs in.

#### [Settings Context](../client/src/app/components/contexts/SettingsContext.tsx)

Read about the Settings UI [here](#settings).

The Settings Context also follows the React context mechanism, and provides a context provider for children components to access the following attributes:

1. `isSettingsOpen: boolean`: tells whether the settings UI is being shown
2. `toggleSettings: () => void`: flips the shown state of the settings
3. `openSettings: () => void`: opens the settings
4. `closeSettings: () => void`: closes the settings

`SettingsContext.tsx` also exports two functions, a React component function named `SettingsProvider` to provide context for its children elements, and a custom hook nameed `useSettings()` wher children components can invoke this to access the attributes within the context.

Again, in the `(withContext)` directory, for the `layout.tsx` file, 
```tsx
return (
    <PopupProvider>
        <Popup />
        <SettingsProvider>
            <Settings />
                {children}
        </SettingsProvider>
    </PopupProvider>
)
```

This means that only after the user logs in, the settings can be customised. At the same time, `Settings` can use the popup by invoking `usePopup` and call `openPopupWith` when necessary.

#### [User Context](../client/src/app/components/contexts/UserContext.tsx)

User Context is the biggest and most complex context to handle. While its designs may vary, the user context is expected to:
- Be set to an empty value while the user is not logged in.
- Be set to a certain user's profile when he/she successfully logs into the system.
- Provides the state and a way to update it.

Because the user context is big and not every component subscribes to all context at the same time, we use the Zustand, a small, but fast state management tool.
- [Zustand documentation](https://zustand.docs.pmnd.rs/getting-started/introduction)

`UserContext.ts` exposes one custom hook, named `useUserStore`, which can be **globally** accessed, and there are three usable attribtutes.

- `user: User`: The user object
- `setUser: (user: User) => void`: A function that sets the entire user object to this new user object
- `setUserField: (path: Path<User>, value: unknown) => void`: A function that sets the specified field of the user object to the specified value. The path to the field has a type that is restricted to only the available fields of a `User` object, called `Path<User>`.

```ts
// app/userPrefs/userPrefUtils.tsx
export type LeafPath<T, Prev extends string = ""> = {
    [K in keyof T]: T[K] extends object
        ? `${Prev}${Extract<K, string>}` | LeafPath<T[K], `${Prev}${Extract<K, string>}.`>
        : `${Prev}${Extract<K, string>}`;
}[keyof T];
```

Then, other components wanting to use the user context can call.
```ts
const user = useUserStore(state => state.user);
const setUser = useUserStore(state => state.setUser);
const setUserField = useUserStore(state => state.setUserField);
```

The `User` type can be found at [`userPrefUtils.tsx`](../client/src/app/userPrefs/userPrefsUtils.tsx).

```ts
// app/userPrefs/userPrefUtils.tsx
export type EditorOptions = {
    theme: string;
    enableMinimap: boolean;
    lineNumbers: string;
    renderWhiteSpace: string;
    tabSize: number;
    wordWrap: string;
    wordWrapColumn: number;
}

export type UserPreference = {
    fontSize: number;
    language: PLKeys; // just a union of strings of programming languages
    significantButtonColor: string;
    significantButtonHoverColor: string;
    gameplayLayout: string;
    editorOptions: EditorOptions;
}

export type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    level: number;
    exp: number;
    rank: string;
    rankPoints: number;
    userPreference: UserPreference;
}
```

---

### [Countdown Timer](../client/src/app/components/countdownTimer)

[`CountdownTimer.tsx`](../client/src/app/components/countdownTimer/CountdownTimer.tsx) is a reusable component that encapsulates a countdown timer. The countdown timer component receives two props:
- `initialTime: number`: the time that the countdown timer will start the countdown
- `onCountdownEnds: () => void`: a function that will be executed once the countdown reaches 0

The countdown timer is currently used in Multiplayer and Arcade mode.

**NOTE**: The server will keep track of the time to avoid users manipulating the countdown timer using DevTools. This will be discussed in future iterations.

---

### [Custom Inputs](../client/src/app/components/inputs)

Because default HTML inputs do not leave too much leeway for styling, we define certain custom inputs.

#### [Checkbox Input](../client/src/app/components/inputs/CheckboxInput.tsx)
This renders a custom checkbox input, which receives the following props:
- `inputName (string)`: the description for the input
- `inputId (string)`: the checkbox contains a label and an input, use this value to set label's `htmlFor` and input's `id` attributes
- `defaultChecked (boolean)`: the default checked status of the checkbox input
- `handleOptionChange (string => void)`: the function that will be executed upon a change of the checked status

#### [Color Input](../client/src/app/components/inputs/ColorInput.tsx)
This renders a custom color input, containing both the visual color and its hexadecimal value, which receives the following props:
- `inputName (string)`: the description for the input
- `inputId (string)`: the ColorInput contains a label and an input, use this value to set label's htmlFor and input's id attributes
- `defaultValue (string)`: the default color value as a hexadecimal RGB color string (`#123456`)
- `handleOptionChange (string => void)`: the function that will be executed upon a change of colour
- `directInjectionValue? (string)`: if set, directly and programmatically inject a color value to the color input display. After set, the user can still change the color.

#### [Double Thumb Range Input](../client/src/app/components/inputs/DoubleThumbRangeInput.tsx)
This renders a range input with two thumbs to set the minimum and maximum values for the range. This component receives the following props:
- `inputName (string)`: the text to describe the number input
- `inputId (string`): this uses a label-input underneath, so an id is needed to bind label's htmlFor to input's ID
- `defaultMinThumb (number)`: the default value for the min thumb, note that the user has to ensure this already bounded between `min` and `max`. 
- `defaultMaxThumb (number)`: the default value for the min thumb, note that the user has to ensure this already bounded between `min` and `max`. 
- `min (number)`: the smallest value the input can hold, inclusive
- `max (number)`: the largest calue the input can hold, inclusive
- `step (number)`: after finish dragging the slider, snaps to the nearest multiple of this value. Do not pass 0 into this.
- `onChange: ((lowerbound: number, upperbound: number) => void)`: the function that is applied on the new lowerbound and upperbound inputs

#### [Dropdown Input](../client/src/app/components/inputs/DropdownInput.tsx)
This renders a dropdown input, and receives the following props:
- `options (string[])`: the list of options to choose from the dropdown
- `inputId (string`): this uses a label-input underneath, so an id is needed to bind label's htmlFor to input's ID
- `defaultOption (string)`: the default option, note that the user has to ensure this value is within options
- `dropdownName (string)`: the text to describe the dropdown
- `handleOptionChange (string => void)`: the function that is applied on the new selected option

#### [Number Input](../client/src/app/components/inputs/NumberInput.tsx)
This renders a number input, which also goes with custom buttons to increase and decrease the number value. This component receives the following props:
- `inputId (string`): this uses a label-input underneath, so an id is needed to bind label's htmlFor to input's ID
- `defaultValue (number)`: the default option, note that the user has to ensure this already bounded between `min` and `max`
- `min (number)`: the smallest value the input can hold, inclusive
- `max (number)`: the largest calue the input can hold, inclusive
- `increment (number)`: this input has a button that jumps the input up and down by some number more than 1, you can set it here
- `inputName (string)`: the text to describe the number input
- `handleInputChange (number => void)`: the function that is applied on the new number input

#### [Radio Input](../client/src/app/components/inputs/RadioInput.tsx)
This renders a collection of radio inputs, where the user can only select one of the choices. Contrary to the checkbox input, this has to be a collection of radio inputs to keep track of which option is selected. This component receives the following props:
- `inputName (string)`: the description of the input
- `options (string[])`: the options that the user can choose from
- `defaultOptionIndex (string)`: the index of the default chosen option, in which the user must make sure that it is within the bounds of options
- `handleOptionChange (number => void)`: the function that will be executed upon a change of option

---

### [Custom Popup](../client/src/app/components/popup)
[`Popup.tsx`](../client/src/app/components/popup/Popup.tsx) is a component that renders DuckCode's custom popup. When a user triggers a popup by performing an action, the user will see
- The popup message
- The text on the button related to confirming the action
- The text on the button related to cancelling the action
Then, each occurrence of the popup will also have
- A function which will be executed if the user confirms the action
- A function which will be executed if the user cancels the action

This is the only component that will subscribe to the `isPopupOpen`, `popupMessage`, `confirmMessage`, `cancelMessage`, `confirmFn`, `cancelFn` attributes of the [popup context](#popup-context). Other components within the popup context provider can open the popup using the last attribute in the context, `openPopupWith`.

```ts
// Popup.tsx
const { isPopupOpen, popupMessage, confirmMessage, cancelMessage, confirmFn, cancelFn } = usePopup();

// app/(withContext)/layout.tsx
return (
    <PopupProvider>
        <Popup />
        <SettingsProvider>
            <Settings />
                {children}
        </SettingsProvider>
    </PopupProvider>
)
```

Here, you can notice that the settings UI has access to the popup context. This is the desired design, because every time the user wants to save new settings, discard changes, or reset settings to default, you would want to prompt them to confirm the action.

### [Settings](../client/src/app/components/settings)

[`Settings.tsx`](../client/src/app/components/settings/Settings.tsx) is a component that renders the settings UI. It consumes the settings context to determine whether it is being opened.

```tsx
// app/components/settings/Settings.tsx
const { isSettingsOpen, closeSettings } = useSettings();
```

Then, the settings UI will be conditionally rendered with the condition of `isSettingsOpen`

At the same time, because settings is where users change their user preferences, settings also consumes user context.

```tsx
// app/components/settings/Settings.tsx
const user = useUserStore(state => state.user);
const setUserField = useUserStore(state => state.setUserField);
```

While settings design may change, the following design choices should persist:
- **A list of settings options**. This keeps groups of related settings together and avoid cluttering of all settings options together, even if they are unrelated. The user can choose which settings option to be displayed.
- **A tab which displays all settings** belong to the active settings option.
- **Settings functional buttons**: save new settings, discard changes, reset to default, and exit.

Because the user has to preview the settings before applying those changes, we maintain a React state within the settings UI that keeps track of the changes.

```ts
const [nextUserPreference, setNextUserPreference] = useState<UserPreference>(structuredClone(user.userPreference));
```

The list of settings options and the tab to display the active settings option are controlled by a JS object literal:

```tsx
const SETTINGS_OPTIONS: Record<SettingsOptionNames, { component: React.JSX.Element }> = {
    "General": {
        component: <GeneralSettings nextUserPreference={nextUserPreference} setNextUserPreference={setNextUserPreference} />
    },
    "Code Editor": {
        component: <CodeEditorSettings nextUserPreference={nextUserPreference} setNextUserPreference={setNextUserPreference} />
    },
    "Keyboard Shortcut Configuration": {
        component: <KeyboardShortcutSettings />
    },
    "Account": {
        component: <AccountSettings nextUserPreference={nextUserPreference} setNextUserPreference={setNextUserPreference} />
    }
}
```

Then, all keys are mapped to the list of settings options, and the active settings option is rendered.
```tsx
// app/components/settings/Settings.tsx
const [activeSettingsOption, setActiveSettingsOption] = useState<SettingsOptionNames>("Keyboard Shortcut Configuration");

// ...

<ul className={styles.settingsOptions}>
    {Object.keys(SETTINGS_OPTIONS).map((key) => (
        <li 
            key={key}
            onClick={() => setActiveSettingsOption(key as SettingsOptionNames)}
            // ...
        >
            {key}
        </li>
    ))}
</ul>

{SETTINGS_OPTIONS[activeSettingsOption].component}
```

Different settings options UI are stored at [`app/components/settings/options`](../client/src/app/components/settings/options).

### [Themes for Code Editor](../client/src/app/components/themes)

The [`themes.tsx`](../client/src/app/components/themes/themes.tsx) file stores all editor theme objects that are compliant with Monaco Editor's [`IStandaloneThemeData`](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneThemeData.html) object. 

At the same time, this file will also export a JS object literal that stores all available editor themes.

```ts
export const PRESET_THEMES: Record<string, { monacoEditorAlias: string, theme: monaco.editor.IStandaloneThemeData }> = {
    "Visual Studio - Light": {
		monacoEditorAlias: "vs",
		theme: vs,
	},
    "Visual Studio - Dark": {
		monacoEditorAlias: "vs-dark",
		theme: vsDark,
	},
    "High Contrast - Black": {
		monacoEditorAlias: "hc-black",
		theme: hcBlack,
	},
    "High Contrast - White": {
		monacoEditorAlias: "hc-light",
		theme: hcWhite,
	},
}
```

When the `<Editor>` object is mounted, the theme alias must be defined first. This is done using Monaco Editor's provided `defineTheme` method.
```ts
// app/(withContext)/gameplay/gameplayUtils.ts
export function instantiateEditorOnMount(
    editorRef: RefObject<monaco.editor.IStandaloneCodeEditor | null>,
    editor: monaco.editor.IStandaloneCodeEditor, 
    monacoInstance: typeof monaco,
    user: User
) {
    editorRef.current = editor;

    monacoInstance.editor.defineTheme(
        PRESET_THEMES[user.userPreference.editorOptions.theme].monacoEditorAlias,
        PRESET_THEMES[user.userPreference.editorOptions.theme].theme
    );

    // ...
}
```

After defining the theme, you can use it in the `theme` prop of the editor.

```tsx
// app/(withContext)/gameplay/components/CodeEditor.tsx
return (
    <div className={styles.codeEditor}>
        <Editor
            theme={PRESET_THEMES[user.userPreference.editorOptions.theme].monacoEditorAlias}
            // ...
        />
    </div>
);
```

**NOTE**: As of 28 June, 2025, only default themes provided by Monaco Editor are stored. More themes will be added in the future.

---

## Utilities
All utilities are located [here](../client/src/app/utils).

### [Color Utilities](../client/src/app/utils/colors.ts)
The color utilities expose two functions related to colors:

- `toGrayScale: (color: string) => number`: converts an RGB color to grayscale using the NTSC formula
- `computeHoverColor: (color: string) => string`: given a color X, compute the color Y, which is the color to display if an element of color X is hovered upon.
  
  The idea behind this is that any color can be represented as a 3-dimensional vector. The color space is a cube from (0, 0, 0) to (255, 255, 255), with the center color located at (128, 128, 128). Color Y will tend towards the center from color X, with each dimension shifting 40% closer to the center, shifting minimally by 24, even if it will cause an overshoot from the center.

  ```ts
  // app/utils/colors.ts
  const brighten = (val: number) => val + Math.max(Math.round(0.4 * (128 - val)), 24);
  const darken = (val: number) => val - Math.max(Math.round(0.4 * (val - 128)), 24);
  ```

### [Debounce Utility Function](../client/src/app/utils/debounce.ts)
The debounce utility exposes a debounce function:
- `debounce<Fn extends (...args: never[]) => unknown>(fn: Fn, delay: number)`: Calls a function only after a delay in milliseconds.

  This function is used in functions that involve API calls. If the users spams a button and trigger the `onClick` function multiple times, only the last click will leave a time gap sufficient for the function to actually be called.

### [Locking Mutually Exclusive Functionalities](../client/src/app/utils/lock.ts)
The lock utility exposes a class called `Lock`, which encapsulates a locking mechanism that prevents multiple subscribed functions from executing at the same time.

Each lock contains an instance field, called `isLocked`. This controls the state of the lock.
```ts
// app/utils/lock.ts
export class Lock {
    private isLocked = false;
    // ...
}
```

The lock only accepts a function that takes in no argument and returns a promise. 
This makes sense, because multiple functions can only run in parallel of they are asynchronous. When you want such a function to run under the lock's control, you will invoke the `call` method.

- `async call<T>: (func: () => Promise<T>) => T`: Invoke a function that will attempt to acquire the lock, execute itseld, and release the lock. This will throw an error if the lock is already acquired by another function.

```ts
// app/utils/lock.ts
async call<T>(func: () => Promise<T>) {
    const release = this.tryAcquire();

    if (!release) {
        throw new LockUnavailableError();
    }

    try {
        return await func();
    } finally {
        release();
    }
}
```

Here, you notice the `tryAcquire` method. This method attempts to acquire a lock. If acquisition is successful, this returns a function to release the lock.

```ts
// app/utils/lock.ts
tryAcquire(): (() => void) | null {
    if (this.isLocked) {
        return null;
    }

    this.isLocked = true;
    return () => {
        this.isLocked = false;
    }
}
```

The lock utility also exposes a `LockUnavailableError` class to encapsulate an error related to a lock being unavailable when a function tries to acquire the lock.

```ts
// app/utils/lock.ts
export class LockUnavailableError extends Error {
    constructor(message = "Another function is acquiring the same lock, please try again later.") {
        super(message);
        this.name = "LockUnavailableError";
        Object.setPrototypeOf(this, LockUnavailableError.prototype);
    }
}
```

Here is a demonstration of the lock.
```tsx
// instantiates a new lock
const lock: Lock = new Lock();

// define two asynchronous functions which only resolve after 1 second
async function sayHello(): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Hello, world!");
        }, 1000);
    });
}

// run the demo
async function run() {
    const firstCall = lock.call(async () => {
        console.log("First call acquired the lock.");
        const message = await sayHello();
        console.log("First call result: ", message);
        return message;
    });

    // second call is when the first call has already acquired the lock
    setTimeout(async () => {
        try {
            await lock.call(async () => {
                console.log("Second call acquired the lock.");
                const message = await sayHello();
                console.log("Second call results: " , message);
                return message;
            });
        } catch (err) {
            if (err instanceof LockUnavailableError) {
                console.error("Second call failed to acquire the lock: ", err.message);
            } else {
                console.error("Unexpected error: ", err);
            }
        }
    }, 100);
}

runDemo();
```

You will expect
```
First call acquired the lock.
Second call failed to acquire the lock: Another function is acquiring the same lock, please try again later.
First call result: Hello, world!
```

> [!CAUTION]
> When using the lock, always use the `call` method. Do not use the internal method `tryAcquire`, except if you are absolutely sure what you are doing. We will make the `tryAcquire` method private in the future.

### [Managing Keyboard Events](../client/src/app/utils/keyboardManager.ts)
Because some keys are overloaded for multiple actions based on which actions are prioritised, the keyboard manager exposes a global `keyboardManager` object of `KeyboardManager` type. 

The keyboard manager maintains a stack of keyboard events.
```ts
// app/utils/keyboardManager.ts
type KeyHandler = (event: KeyboardEvent) => boolean;

interface Layer {
    id: string;
    priority: number;
    handler: KeyHandler;
}

class KeyboardManager {
    private layers: Layer[];
    // ...
}
```

We define some priority values, which you can change but please keep the relative ordering.

```ts
export const GENERAL_KEY_PRIORITY = 1;
export const GAMEPLAY_KEY_PRIORITY = 2;
export const GAMEPLAY_TAB_KEY_PRIORITY = 3;
export const SETTINGS_KEY_PRIORITY = 4;
export const POPUP_KEY_PRIORITY = 1000;
```

When a component that uses keyboard shortcuts is mounted onto the DOM tree, you have to use a `useEffect` to register all keyboard events related to that UI to the keyboard manager using the `register` instance method. This pushes the keyboard events onto the stack according to priority.

```ts
register(id: string, priority: number, handler: KeyHandler): void {
    // Ensure no duplicate layer IDs
    if (this.layers.some(layer => layer.id === id)) {
        throw new Error(`Layer with ID ${id} is already registered.`);
    }
    
    this.layers.push({ id, priority, handler });
    this.layers.sort((a, b) => a.priority - b.priority);
}
```

Similar to how you remove event listeners when the component is unmounted, you unregister the keyboard events to remove them from the stack.


```ts
unregister(id: string): void {
    this.layers = this.layers.filter(layer => layer.id !== id);
}
```

Then, when a keydown event is triggered, the keyboard manager would traverse the stack in order of decreasing priority and attempt to execute the key handler. If the execution returns true, stop traversing and return.

```tsx
handleEvent(event: KeyboardEvent): void {
    for (let i = 0; i < this.layers.length; i++) {
        const layer = this.layers[i];
        if (layer.handler(event)) {
            return;
        }
    }
}
```

Now, let's pay more attention to the `KeyHandler` type, which takes in a `KeyboardEvent` and returns a boolean. The convention for all `KeyHandler` type here is that 
- When receiving the keyboard event, the `KeyHandler` has to check if the key combination matches the key combination for what you want to handle.
- If the key combinations match, the code related to the event is executed, and returns true.
- Else, immediately returns false.

We also have a convention to store key combinations.
```ts
// app/components/settings/settingsUtils.ts
{
    ctrl: boolean;
    shift: boolean;
    key: string;
}
```

To check if the key combinations from a keyboard event matches a certain key binding, you can invoke the `isKeyCombo` function.

```ts
// app/components/settings/settingsUtils.ts
export function isKeyCombo(event: KeyboardEvent, combo: { ctrl: boolean, shift: boolean, key: string }) {
    const eventKey = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    const comboKey = combo.key.length === 1 ? combo.key.toLowerCase() : combo.key;
    
    return (
        event.ctrlKey === combo.ctrl
        && event.shiftKey === combo.shift
        && eventKey === comboKey
    );
}
```

Now, let's demonstrate the use of the keyboard manager on a React component.
```tsx
import { keyboardManager } from "@/app/utils/keyboardManager";
import { isKeyCombo } from "@/app/components/settings/settingsUtils";
import { useEffect, useState } from 'react';

export function Page() {
    // define the React state to visually see the keyboard events
    const [text, setText] = useState<string>("");

    // register the keyboard event
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // key combination CTRL + H
            const helloWorldKeyCombo = { ctrl: true, shift: false, key: "H" };

            if (isKeyCombo(e, helloWorldKeyCombo)) {
                setText("Hello, world!");
                return true;
            }

            return false;
        }

        const id = "helloWorld";
        const priority = 1;
        keyboardManager.register(id, priority, handleKeyDown);

        return () => {
            keyboardManager.unregister("helloWorld");
        }
    }, [text]);

    return (
        <div>
            Press `CTRL + H` to see the change: {text}
        </div>
    )
}
```

You would expect the text to change from empty to "Hello, world!" after pressing CTRL + H.

### [Simulating a Delay](../client/src/app/utils/delay.ts)

When working with fake API calls on the client side, you would want to simulate a delay caused by an API call. The delay utility exposes a function for this.

- `sleep: (ms: number) => Promise<void>`: Delay by the specified number of milliseconds.

When using the `sleep` function, just call it anywhere you want to delay:

```ts
async function greetAfterOneSecond(): Promise<void> {
    await sleep(1000);
    console.log("Hello, world!");
}

greetAfterOneSecond();
```

This will log "Hello, world!" to the console after 1000ms, or one second.

---

## Future Improvements

### Accessibility
- Add colorblindness-friendly color schemes to differentiate visually between different states, such as correct-wrong.
- As dyslexia-friendly fonts for both text and code.

