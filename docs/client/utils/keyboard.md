# Keyboard Shortcuts

**All keyboard events should not be handled using the default way.** Instead, use the provided [keyboard manager](../../../client/src/lib/utils/keyboardManager.ts).

## Defining a keyboard shortcut

All keyboard shortcuts are defined in the [key binding](../../../client/src/lib/utils/keyBindings.ts) utility in the format

```ts
export type KeyBinding = {
    action: string;
    combo: {
        ctrl: boolean;
        shift: boolean;
        key: string;
    }
}
```

The combo is self-explanatory. The action is the description of the keyboard shortcut, which will be shown to the user in 
> `Settings` => `Keyboard Shortcut Settings`. 

For example, to define the escape settings action of keyboard shortcut "Esc", you do:
```ts
{
    action: "Escaspe Settings",
    combo: {
        ctrl: false,
        shift: false,
        key: "Escape"
    }
}
```

## Classify the keyboard shortcut

The keyboard shortcut then must belong to some group (shortcut for gameplay, general, etc.). Declare the said shortcut in the respective record for key bindings. In the keyboard shortcut settings UI, keyboard shortcuts belonging to the same record will appear in the same group. Make sure to give the shortcut an identifier.

```ts
// 1. Declare the idenfitier
export type GameplayKeyBindingNames =
    "FOCUS_EDITOR"
    | "DEFOCUS_EDITOR"
    | ...;

// 2. Put the keyboard shortcut in the respective record using the above identifier
export const GAMEPLAY_KEY_BINDINGS: Record<GameplayKeyBindingNames, KeyBinding> = {
    FOCUS_EDITOR: {
        action: "Focus on code editor",
        combo: { ctrl: false, shift: false, key: 'I' }
    },
    DEFOCUS_EDITOR: {
        action: "Defocus from code editor",
        combo: { ctrl: false, shift: false, key: 'Escape' }
    },
    ...
}
```

## Declare the priority level of the keyboard binding

Keyboard shortcuts may overlap, and there must have a way to resolve that. Additionally, when some components are mounted (e.g. popup) and should block keyboard events, active key bindings may still propagate to components behind and cause unintended effects (e.g. while popup is open, users expect no key bindings to pass through, but somehow settings can still be opened by "F1").

Thus, priorities should be defined. The `priority` attribute acts as a tie-breaker for conflicting keyboard shortcuts. A higher priority keyboard shortcut would be chosen first to resolve conflict, blocking propagation to all keyboard shortcuts of the same combo but lower priorities. Declare the priority in the [keyboard manager](../../../client/src/lib/utils/keyboardManager.ts) file.

```ts
type PriorityInfo = {
    priority: number;
    blocksFlow: boolean;
}
```

Then, add that to the `PRIORITY_INFO` record with an identifier.

```ts
// 1. Declare the priority
export type PriorityName = 
    "GENERAL_KEY_PRIORITY"
    | "GAMEPLAY_KEY_PRIORITY"
    | ...;

// 2. Add that to the record
export const PRIORITY_INFO: Record<PriorityName, PriorityInfo> = {
    GENERAL_KEY_PRIORITY: { priority: 1, blocksFlow: false, },
    GAMEPLAY_KEY_PRIORITY: { priority: 2, blocksFlow: false, },
    ...
};
```

## Use within a component

### Parsing a keyboard event
To parse a keyboard event, use the provided [`isKeyCombo`](../../../client/src/lib/utils/keyBindings.ts). The function takes in a `KeyboardEvent` and a `KeyBinding`, and return a boolean whether the keyboard event matches the combo of the key binding. For example,
```ts
function handleKeyPressed(e: KeyboardEvent) {
    if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["FOCUS_EDITOR"].combo)) {
        console.log("Editor focused!");
    }
}
```

### Creating a handler
A function that handles keyboard events must follow this type definition
```ts
type KeyHandler = (event: KeyboardEvent) => boolean;
```

If the keyboard event matches the combo signature of the action, handle the logic and return `true`. Else, return `false`.
```ts
function handleKeyPressed(e: KeyboardEvent) {
    if (isKeyCombo(e, GAMEPLAY_KEY_BINDINGS["FOCUS_EDITOR"].combo)) {
        console.log("Editor focused!");
        return true;
    }

    return false;
}
```

### Using within a component

For a keyboard shortcut to be active, the component must be mounted. That is, one of the followinf must be satisfied.
**(1)** If the component is not conditionally rendered, the parent must conditionally render the component.
**(2)** If the component is conditionally rendered, all of the following must be satisfied:
  - The value that controls the rendering state must come from outside (passed down as a prop from parent, global context, Zustand hook, etc.)
  - When registering the keyboard shortcut, the same control value must dictate whether the keyboard shortcut is registered into the system.

The [keyboard manager](../../../client/src/lib/utils/keyboardManager.ts) handles keyboard logic. It exposes a keyboard manager singleton that exposes two methods, `register` and `unregister`.

The `register` method takes in an ID, a priority (declared in `PriorityName` and registered in `PRIORITY_INFO`) and the keyboard event handling function. It then registers the keyboard shortcut handler function into its internal list.
```ts
function register(id: string, priority: PriorityName, handler: KeyHandler): void
```
The `id` can be any string but should be unique. The reason there is no registration for this `id` is because the name is intended to only be scoped within the `useEffect` that registers this key binding, and proper, descriptive names would suffice for uniqueness. However, the keyboard manager would still throw an error for duplicate `id` as a standard procedure.

The `unregister` method will remove the handler function with the `id` above from its internal list.
```ts
function unregister(id: string): void
```
___
## Example

We will create three key bindings:
- Make a "Hello, world!" popup on Enter. This has priority 3 and does not block flow.
- Close the popup while it is open with Esc. This has priority 10 and blocks flow.
- Color a box red on R. This has priority 3 and does not block flow.
- Color the same box blue on B. This has priority 3 and does not block flow.
- Color the same box black on B. This has priority 2 and does not block flow.

#### 1. Boilerplate
```ts
// @/src/lib/utils/keyBinding.ts
export type GeneralKeyBindingNames = ... 
    | "HELLO_WORLD"
    | "GOODBYE_WORLD"
    | "PAINT_BOX_RED"
    | "PAINT_BOX_BLUE"
    | "PAINT_BOX_BLACK";

export const GENERAL_KEY_BINDINGS: Record<GeneralKeyBindingNames, KeyBinding> = {
    ...,
    HELLO_WORLD: {
        action: "Make a 'Hello, world!' popup.",
        combo: { ctrl: false, shift: false, key: "Enter" }
    },
    GOODBYE_WORLD: {
        action: "Make a 'Hello, world!' popup.",
        combo: { ctrl: false, shift: false, key: "Esc" }
    },
    PAINT_BOX_RED: {
        action: "Paint the box red.",
        combo: { ctrl: false, shift: false, key: "R" }
    },
    PAINT_BOX_BLUE: {
        action: "Paint the box blue.",
        combo: { ctrl: false, shift: false, key: "B" }
    },
    PAINT_BOX_BLACK: {
        action: "Paint the box black.",
        combo: { ctrl: false, shift: false, key: "B" }
    }
}

// @/src/lib/utils/keyboardManager.ts
export type PriorityName = ... | "POPUP_KEY_PRIORITY" | "GENERAL_KEY_PRIORITY" | "BLACK_KEY_PRIORITY";

// 2. Add that to the record
export const PRIORITY_INFO: Record<PriorityName, PriorityInfo> = {
    ...,
    POPUP_KEY_PRIORITY: { priority: 10, blocksFlow: true },
    GENERAL_KEY_PRIORITY: { priority: 3, blocksFlow: false },
    BLACK_KEY_PRIORITY: { priority: 2, blocksFlow: false },
};
```
#### 2. Component
```tsx
// Popup.tsx
import { keyboardManager } from "@/lib/utils/keyboardManager";
import { useEffect } from "react";

export default function Popup({ setIsPopupOpen }: { setIsPopupOpen: (open: boolean) => void }) {
    useEffect(() => {
        function handleClosePopup(e: KeyboardEvent) {
            if (isKeyCombo(e, GENERAL_KEY_BINDINGS["GOODBYE_WORLD"].combo)) {
                setIsPopupOpen(false);
                return true;
            }

            return false;
        }

        keyboardManager.register("goodbye-world", "POPUP_KEY_PRIORITY", handleClosePopup);

        return () => keyboardManager.unregister("goodbye-world");
    }, [setIsPopupOpen]);

    return (
        <div>
            <h1>Popup</h1>
            <p>Hello, world!</p>
        </div>
    )
}
```

```tsx
// LevelThree.tsx
import { keyboardManager } from "@/lib/utils/keyboardManager";
import { useEffect } from "react";

export default function LevelThree({ setColor }: { setColor: (color: string) => void }) {
    useEffect(() => {
        function handleColor(e: KeyboardEvent) {
            if (isKeyCombo(e, GENERAL_KEY_BINDINGS["PAINT_BOX_RED"].combo)) {
                setColor("red");
                return true;
            } else if (isKeyCombo(e, GENERAL_KEY_BINDINGS["PAINT_BOX_BLUE"].combo)) {
                setColor("blue");
                return true;
            }

            return false;
        }

        keyboardManager.register("red-blue", "GENERAL_KEY_PRIORITY", handleColor);

        return () => keyboardManager.unregister("red-blue");
    }, [setColor]);

    return <div />
}
```

```tsx
// Box.tsx

export default function Box({ color }: { color: string }) {
    return <div style={{
        backgroundColor: color
    }}>The Box</div>
}
```

```tsx
// Page.tsx
import { keyboardManager } from "@/lib/utils/keyboardManager";
import { useEffect, useState } from "react";

export default function Page() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [enableLevelThree, setEnableLevelThree] = useState(false);
    const [color, setColor] = useState<string>("black");

    useEffect(() => {
        function handleColor(e: KeyboardEvent) {
            if (isKeyCombo(e, GENERAL_KEY_BINDINGS["PAINT_BOX_BLACK"].combo)) {
                setColor("black");
                return true;
            } 

            return false;
        }

        function handleOpenPopup(e: KeyboardEvent) {
            if (isKeyCombo(e, GENERAL_KEY_BINDINGS["HELLO_WORLD"].combo)) {
                setIsPopupOpen(true);
                return true;
            } 

            return false;
        }

        keyboardManager.register("black", "BLACK_KEY_PRIORITY", handleColor);
        keyboardManager.register("hello-world", "GENERAL_KEY_PRIORITY", handleOpenPopup);

        return () => {
            keyboardManager.unregister("black");
            keyboardManager.unregister("hello-world");
        }
    }, [setColor, setIsPopupOpen]);

    return (
        <div>
            {
                isPopupOpen && <Popup setIsPopupOpen={setIsPopupOpen} />
            }
            {
                enableLevelThree && <LevelThree setColor={setColor} />
            }
            <Box color={color} />
            <button 
                type="button"
                onClick={() => setEnableLevelThree(prev => !prev)}
            >Toggle Priority Level 3 Key Bindings</button>
        </div>
    )
}
```