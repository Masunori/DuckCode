# Home

**Route**: [`client/src/app/(withContext)/home`](../../../client/src/app/(withContext)/home/page.tsx)
**Introduced**: Version 0.1.0

**Components**:
- [ChatPanel](#chatpaneltsx)
- [EventMenu](#eventmenutsx)
- [GameMenu](#gamemenutsx)
- [HomeNavbar](#homenavbartsx)
- [NewsCarousel](#newscarouseltsx)

---

After the user logs in successfully, the user will be redirected to the home page. While the design may change, there will persist the following components for the home UI.

#### [`ChatPanel.tsx`](../../../client/src/app/(withContext)/home/components/ChatPanel.tsx)

This is the component where the user can exchange messages with other users.

#### [`EventMenu.tsx`](../../../client/src/app/(withContext)/home/components/EventMenu.tsx)

This is the component that the user can interact with to access version events and other time-limited activities such as Daily Challenge, Battle Pass equivalent, etc.

#### [`GameMenu.tsx`](../../../client/src/app/(withContext)/home/components/GameMenu.tsx)

This is the component that the user can interact with to access permanent features of DuckCode, such as Multiplayer, Arcade, Playground and Tutorials. To separate concerns, the game menu component will also contain and control UI components related to game mode selection, which is in the [`gameMenu`](../../../client/src/app/(withContext)/home/components/gameMenu) directory. There exists zero to one UI component for each game menu options, which again appears mutually exclusively on the screen, and thus, are controlled by a React state:

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

- [`ArcadeModeTab.tsx`](../../../client/src/app/(withContext)/home/components/gameMenu/ArcadeModeTab.tsx): The UI component where the user customises the game settings for Arcade Mode. This will be mounted on the DOM tree if `tab === "Arcade"`. The list of game mode description for arcade mode games are listed as a JS object literal in the [`homeUtils.ts`](../../client/src/app/(withContext)/home/homeUtils.ts) file.

#### [`HomeNavbar.tsx`](../../../client/src/app/(withContext)/home/components/HomeNavbar.tsx)

This is the component usually (and should be) on top of the screen, where the user would see their user information, currency and access to settings.

#### [`NewsCarousel.tsx`](../../../client/src/app/(withContext)/home/components/NewsCarousel.tsx)

This is the component where the user can view current events in DuckCode in a more visually appealing way. News tabs are cycled in a carousel-like effect.

This carousel is coded from scratch, and here is how the effect is achieved.

1. The news content is given as an array. Because the news format has not been decided As of version 0.1.0, we refrain from giving any specific information.
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
