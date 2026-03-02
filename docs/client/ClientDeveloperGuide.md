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
- [`/arcade`](#arcade)
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

[User Preferences](#user-preferences)

[Future Improvements](#future-improvements)

---
## Documentation Revision History
| Version | Date | Content |
| --- | --- | --- |
| 0.1.0 | 28 June, 2025 | UI skeleton for `arcade`, `multiplayer`, `landing`, `portal`, `home`, and `playground` |
---

## Setting Up and Getting Started

Refer to the [Setting Up and Getting Started](SettingUp.md) document.

---

## Routes and Pages Design
DuckCode uses file-based routing, and as you navigate the application, there will be the following routes:


### [`/landing`](../../client/src/app/landing/page.tsx)
The user will first see the landing page when entering DuckCode.
Refer to the [Landing](./routes/Landing.md) documentation for more details.


### [`/portal`](../../client/src/app/portal/page.tsx)
The portal is where all authentication activities (login, sign up, reset password) occur.
Refer to the [Portal](./routes/Portal.md) documentation for more details.


### [`/home`](../../client/src/app/(withContext)/home/page.tsx)
After a successful login, the home interface is what the user sees.
Refer to the [Home](./routes/Home.md) documentation for more details.


### [`/arcade`](../../client/src/app/(withContext)/arcade/page.tsx)
This is an interface where single-player games
Refer to the [Arcade](./routes/Arcade.md) documentation for more details.

### [`/multiplayer`](../../client/src/app/(withContext)/multiplayer/page.tsx)
This interface inherits the gameplay interface by adding on multiplayer logic.
Refer to the [Multiplayer](./routes/Multiplayer.md) documentation for more details.

---

## Reusable Components Design 
All reusable components are located [here](../../client/src/app/components).

---

### [Backgrounds](../../client/src/app/components/backgrounds)

This defines backgrounds that can be used in the layout of certain routes. By convention, each background should take in a `children` of type `ReactNode`, and write HTML code to wrap over the children. 

We will use the given [Starry Background](../../client/src/app/components/backgrounds/StarryBackground.tsx) as an example, which sets the background as black and inserts flickering stars at random points on the background. Then, for any route, you can do
```tsx
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

### [Contexts](../../client/src/app/components/contexts)

To avoid prop drilling, contexts allow components to directly access certain attributes and variables without receiving them as a prop. As of version 0.1.0, there are three contexts to be noted of.

#### [Popup Context](../../client/src/app/components/contexts/PopupContext.tsx)

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

In the [`(withContext)`](../../client/src/app/(withContext)) directory, the `layout.tsx` is as follows:

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

#### [Settings Context](../../client/src/app/components/contexts/SettingsContext.tsx)

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

#### [User Context](../../client/src/app/components/contexts/UserContext.tsx)

User Context is the biggest and most complex context to handle. While its designs may vary, the user context is expected to:
- Be set to an empty value while the user is not logged in.
- Be set to a certain user's profile when he/she successfully logs into the system.
- Provides the state and a way to update it.

Because the user context is big and not every component subscribes to all context at the same time, we use the Zustand, a small, but fast state management tool.
- [Zustand documentation](https://zustand.docs.pmnd.rs/getting-started/introduction)

`UserContext.ts` exposes one custom hook, named `useUserStore`, which can be **globally** accessed, and there are three usable attribtutes.

- `user: User`: The user object
- `setUser: (user: User) => void`: A function that sets the entire user object to this new user object
- `setUserField: (path: Paths<User>, value: unknown) => void`: A function that sets the specified field of the user object to the specified value. The path to the field has a type that is restricted to only the available fields of a `User` object, called `Paths<User>`.

```ts
// app/utils/types.ts
export type Paths<T, Prev extends string = ""> = {
    [K in keyof T]: T[K] extends object
        ? `${Prev}${Extract<K, string>}` | Paths<T[K], `${Prev}${Extract<K, string>}.`>
        : `${Prev}${Extract<K, string>}`;
}[keyof T];
```

Then, other components wanting to use the user context can call.
```ts
const user = useUserStore(state => state.user);
const setUser = useUserStore(state => state.setUser);
const setUserField = useUserStore(state => state.setUserField);
```

The `User` type can be found at [`userPrefUtils.tsx`](../../client/src/app/userPrefs/userPrefsUtils.tsx).

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

export type userPreference = {
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
    rankPoint: number;
    userPreference: userPreference;
}
```

---

### [Countdown Timer](../../client/src/app/components/countdownTimer)

[`CountdownTimer.tsx`](../../client/src/app/components/countdownTimer/CountdownTimer.tsx) is a reusable component that encapsulates a countdown timer. The countdown timer component receives two props:
- `initialTime: number`: the time that the countdown timer will start the countdown
- `onCountdownEnds: () => void`: a function that will be executed once the countdown reaches 0

The countdown timer is currently used in Multiplayer and Arcade mode.

**NOTE**: The server will keep track of the time to avoid users manipulating the countdown timer using DevTools. This will be discussed in future iterations.

**NOTE**: The countdown timer is being resetted with each layout change. Fix.

---

### [Custom Inputs](../../client/src/app/components/inputs)

Because default HTML inputs do not leave too much leeway for styling, we define certain custom inputs.

#### [Checkbox Input](../../client/src/app/components/inputs/CheckboxInput.tsx)
This renders a custom checkbox input, which receives the following props:
- `inputName (string)`: the description for the input
- `inputId (string)`: the checkbox contains a label and an input, use this value to set label's `htmlFor` and input's `id` attributes
- `defaultChecked (boolean)`: the default checked status of the checkbox input
- `handleOptionChange (string => void)`: the function that will be executed upon a change of the checked status

#### [Color Input](../../client/src/app/components/inputs/ColorInput.tsx)
This renders a custom color input, containing both the visual color and its hexadecimal value, which receives the following props:
- `inputName (string)`: the description for the input
- `inputId (string)`: the ColorInput contains a label and an input, use this value to set label's htmlFor and input's id attributes
- `defaultValue (string)`: the default color value as a hexadecimal RGB color string (`#123456`)
- `handleOptionChange (string => void)`: the function that will be executed upon a change of colour
- `directInjectionValue? (string)`: if set, directly and programmatically inject a color value to the color input display. After set, the user can still change the color.

#### [Double Thumb Range Input](../../client/src/app/components/inputs/DoubleThumbRangeInput.tsx)
This renders a range input with two thumbs to set the minimum and maximum values for the range. This component receives the following props:
- `inputName (string)`: the text to describe the number input
- `inputId (string`): this uses a label-input underneath, so an id is needed to bind label's htmlFor to input's ID
- `defaultMinThumb (number)`: the default value for the min thumb, note that the user has to ensure this already bounded between `min` and `max`. 
- `defaultMaxThumb (number)`: the default value for the min thumb, note that the user has to ensure this already bounded between `min` and `max`. 
- `min (number)`: the smallest value the input can hold, inclusive
- `max (number)`: the largest calue the input can hold, inclusive
- `step (number)`: after finish dragging the slider, snaps to the nearest multiple of this value. Do not pass 0 into this.
- `onChange: ((lowerbound: number, upperbound: number) => void)`: the function that is applied on the new lowerbound and upperbound inputs

#### [Dropdown Input](../../client/src/app/components/inputs/DropdownInput.tsx)
This renders a dropdown input, and receives the following props:
- `options (string[])`: the list of options to choose from the dropdown
- `inputId (string`): this uses a label-input underneath, so an id is needed to bind label's htmlFor to input's ID
- `defaultOption (string)`: the default option, note that the user has to ensure this value is within options
- `dropdownName (string)`: the text to describe the dropdown
- `handleOptionChange (string => void)`: the function that is applied on the new selected option

#### [Number Input](../../client/src/app/components/inputs/NumberInput.tsx)
This renders a number input, which also goes with custom buttons to increase and decrease the number value. This component receives the following props:
- `inputId (string`): this uses a label-input underneath, so an id is needed to bind label's htmlFor to input's ID
- `defaultValue (number)`: the default option, note that the user has to ensure this already bounded between `min` and `max`
- `min (number)`: the smallest value the input can hold, inclusive
- `max (number)`: the largest calue the input can hold, inclusive
- `increment (number)`: this input has a button that jumps the input up and down by some number more than 1, you can set it here
- `inputName (string)`: the text to describe the number input
- `handleInputChange (number => void)`: the function that is applied on the new number input

#### [Radio Input](../../client/src/app/components/inputs/RadioInput.tsx)
This renders a collection of radio inputs, where the user can only select one of the choices. Contrary to the checkbox input, this has to be a collection of radio inputs to keep track of which option is selected. This component receives the following props:
- `inputName (string)`: the description of the input
- `options (string[])`: the options that the user can choose from
- `defaultOptionIndex (string)`: the index of the default chosen option, in which the user must make sure that it is within the bounds of options
- `handleOptionChange (number => void)`: the function that will be executed upon a change of option

---

### [Custom Popup](../../client/src/app/components/popup)
[`Popup.tsx`](../../client/src/app/components/popup/Popup.tsx) is a component that renders DuckCode's custom popup. When a user triggers a popup by performing an action, the user will see
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

### [Settings](../../client/src/app/components/settings)

[`Settings.tsx`](../../client/src/app/components/settings/Settings.tsx) is a component that renders the settings UI. It consumes the settings context to determine whether it is being opened.

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
const [nextuserPreference, setNextuserPreference] = useState<userPreference>(structuredClone(user.userPreference));
```

The list of settings options and the tab to display the active settings option are controlled by a JS object literal:

```tsx
const SETTINGS_OPTIONS: Record<SettingsOptionNames, { component: React.JSX.Element }> = {
    "General": {
        component: <GeneralSettings nextuserPreference={nextuserPreference} setNextuserPreference={setNextuserPreference} />
    },
    "Code Editor": {
        component: <CodeEditorSettings nextuserPreference={nextuserPreference} setNextuserPreference={setNextuserPreference} />
    },
    "Keyboard Shortcut Configuration": {
        component: <KeyboardShortcutSettings />
    },
    "Account": {
        component: <AccountSettings nextuserPreference={nextuserPreference} setNextuserPreference={setNextuserPreference} />
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

Different settings options UI are stored at [`app/components/settings/options`](../../client/src/app/components/settings/options).

### [Themes for Code Editor](../../client/src/app/components/themes)

The [`themes.tsx`](../../client/src/app/components/themes/themes.tsx) file stores all editor theme objects that are compliant with Monaco Editor's [`IStandaloneThemeData`](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneThemeData.html) object. 

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

**NOTE**: As of version 0.1.0, only default themes provided by Monaco Editor are stored. More themes will be added in the future.

---

## Utilities
All utilities are located [here](../../client/src/app/utils).

### [Color Utilities](../../client/src/app/utils/colors.ts)
The color utilities expose two functions related to colors:

- `toGrayScale: (color: string) => number`: converts an RGB color to grayscale using the NTSC formula
- `computeHoverColor: (color: string) => string`: given a color X, compute the color Y, which is the color to display if an element of color X is hovered upon.
  
  The idea behind this is that any color can be represented as a 3-dimensional vector. The color space is a cube from (0, 0, 0) to (255, 255, 255), with the center color located at (128, 128, 128). Color Y will tend towards the center from color X, with each dimension shifting 40% closer to the center, shifting minimally by 24, even if it will cause an overshoot from the center.

  ```ts
  // app/utils/colors.ts
  const brighten = (val: number) => val + Math.max(Math.round(0.4 * (128 - val)), 24);
  const darken = (val: number) => val - Math.max(Math.round(0.4 * (val - 128)), 24);
  ```

### [Debounce Utility Function](../../client/src/app/utils/debounce.ts)
The debounce utility exposes a debounce function:
- `debounce<Fn extends (...args: never[]) => unknown>(fn: Fn, delay: number)`: Calls a function only after a delay in milliseconds.

  This function is used in functions that involve API calls. If the users spams a button and trigger the `onClick` function multiple times, only the last click will leave a time gap sufficient for the function to actually be called.

### [Locking Mutually Exclusive Functionalities](../../client/src/app/utils/lock.ts)
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

- `async call<T>: (func: () => Promise<T>) => T`: Invoke a function that will attempt to acquire the lock, execute itself, and release the lock. This will throw an error if the lock is already acquired by another function.

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

// define an asynchronous function which only resolves after 1 second
async function sayHello(): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Hello, world!");
        }, 1000);
    });
}

// run the demo
async function runDemo() {
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

### [Managing Keyboard Events](../../client/src/app/utils/keyboardManager.ts)
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

Priority values are in number, and the higher the number, the higher the priority. The convention is that you will define constants that are the priority values of certain elements. Numbers are arbitrary, but they must reflect the order in which you want to arrange your keyboard events.


```ts
// format: <SOMETHING>_KEY_PRIORITY
export const GENERAL_KEY_PRIORITY = 1;
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

Then, when a keydown event is triggered, the keyboard manager would traverse the stack in order of decreasing priority and attempt to execute the key handler. If the execution returns true, stop traversing and return. That is, any key binding will not propagate to lower layers.

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

### [Simulating a Delay](../../client/src/app/utils/delay.ts)

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

### [Utility Types](../../client/src/app/utils/types.ts)
We define some generic utility types that may be used by more than one component in more than one place.

- `SetState` mimics React's setter function in a `useState`.
```ts
export type SetState<T> = (arg: T | ((prev: T) => T)) => void;
```

- `Paths` will list all path in an object literal. 
```ts
export type Paths<T, Prev extends string = ""> = {
    [K in keyof T]: T[K] extends object
        ? `${Prev}${Extract<K, string>}` | Paths<T[K], `${Prev}${Extract<K, string>}.`>
        : `${Prev}${Extract<K, string>}`;
}[keyof T];

// Usage:
type MyObject = {
    name: string;
    age: number;
    preferences: {
        food: string;
        color: string;
    }
}

// expect: name | age | preferences | preferences.food | preferences.color
type MyObjectPaths = Paths<MyObject>; 
```

- `LeafPaths` will list all paths in an object literal whose value is NOT an object literal (thus the "leaf").
```ts
export type LeafPaths<T, Prev extends string = ""> = {
    [K in keyof T]: T[K] extends object
        ? LeafPaths<T[K], `${Prev}${Extract<K, string>}.`>
        : `${Prev}${Extract<K, string>}`;
}[keyof T];

// Usage:
type MyObject = {
    name: string;
    age: number;
    preferences: {
        food: string;
        color: string;
    }
}

// expect: name | age | preferences.food | preferences.color
type MyObjectPaths = LeafPaths<MyObject>; 
```
---

## User Preferences
User preferences are located at the [`/userPrefs`](../../client/src/app/userPrefs/) path, and contains all information related to a user.

### [`UserPrefRootSEtter.tsx`](../../client/src/app/userPrefs/UserPrefRootSetter.tsx)
Because some user preferences deal with CSS variables, this component is responsible for setting the CSS variables when the user object is loaded.

### [`userPrefSerializer.tsx`](../../client/src/app/userPrefs/userPrefSerializer.ts)
Because a user preference object is large, there needs a way to compress the information into a lightweight format to store in the server's database. This is achievable because we know the structure of the user preference object.

At the same time, we acknowledge that more customisable options for users may come in the future, so the encoding algorithm must take into account the version number. In particular, the encoding algorithm is as follows:

1. The user preference object literal has known key-value pairs for each version.
2. The encoding algorithm manually convert the value from each key-value pair into the most compact string representation possible:
  - Colors are preserved as hexstrings with hash "#" sign.
  - Enums or enums-like are converted into numbers. A mapping between enums and numbers is maintained for versions, and mapping must be backward-compatible (if in version X, a value V of property P is assigned a number N, then for all versions Y > X, V must always map to N).
  - Numbers are preserved as numbers.
  - Strings with no representation restrictions are preserved (but rare).
3. The values are then chained together in a string, comma-separated. The **version number** is the first value to be in the string.

Then, the encoding algorithm:
1. Splits the values from the string into a list.
2. Reads the version number and directs the encoded representation to the corresponding decoder for the version.

> **EXAMPLE**
> 
> Let us define a simple user preference object:
> ```ts
> export type UserPreference = {
>     fontSize: number;
>     color: string;
>     codeEditor: {
>         theme: "light" | "dark";
>         indentation: number;
>         unrestrictedStringProperty: string;
>     }
> }
> ```
> 
> Now, there is an enum-like property called `theme`. We need to define a mapping:
> ```ts
> const CODE_EDITOR_THEME_TO_IDS: Record<"light" | "dark", number> = {
>     "light": 0,
>     "dark": 1,
> };
> 
> const IDS_TO_CODE_EDITOR_THEME: string[] = ["light", "dark"];
> ```
> 
> Object literals do not maintain a proper order by themselves, but our encoding algorithm will maintain the following (arbitrarily chosen but consistently used) order:
> 
> ```
> 0. Version number
> 1. fontSize 
> 2. color
> 3. codeEditor.theme 
> 4. codeEditor.indentation 
> 5. codeEditor.unrestrictedStringProperty
> ```
> 
> Thus, the encoding and decoding algorithms will manipulate the user preference object as follows:
> ```ts
> const CURRENT_VERSION = "0.2.0"; // asuume current version
> 
> function encodeUserPref(userPrefs: UserPreference): string {
>     // ...
> }
> 
> function decodeUserPref_V0_1_0(encodedUserPref: string): UserPreferences {
>     // ...
> }
>
> function decodeUserPref_V0_2_0(encodedUserPref: string): UserPreferences {
>     // ...
> }
> 
> function extractVersion(encodedUserPref: string): string {
>     // ...
> }
> 
> function decodeUserPref(encodedUserPref: string): UserPreferece {
>     const version = extractVersion(encodedUserPref);
> 
>     switch (version) {
>         case "0.1.0":
>             return decodeUserPref_V0_1_0(encodedUserPref);
>         case "0.2.0":
>             return decodeUserPref_V0_2_0(encodedUserPref);
>         default:
>             // or return a copy of the default user preference 
>             throw new Error("Unrecognized version.");
>     }
> }
>
> const demoUserPref: UserPrerefence = {
>     fontSize: 16,
>     color: "#12efa6",
>     codeEditor: {
>         theme: "light",
>         indentation: 4,
>         unrestrictedStringProperty: "hello";
>     }
> }
> 
> const expectedEncodedUserPref = "0.2.0,16,#12efa6,0,4,hello";
> const encodedUserPref = encodeUserPref(demoUserPref)
> 
> console.log(encodedUserPref === expectedEncodedUserPref);
> console.log(decodeUserPref(encodedUserPref) === demoUserPref);
> ```
> 
> For correctly implemented algorithms, the expected result is:
> ```
> true
> true
> ```

## Future Improvements

### Accessibility
- Add colorblindness-friendly color schemes to differentiate visually between different states, such as correct-wrong.
- As dyslexia-friendly fonts for both text and code.

