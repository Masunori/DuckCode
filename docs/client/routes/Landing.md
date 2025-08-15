# Landing

**Route**: [`client/src/app/landing`](../../../client/src/app/landing/page.tsx)
**Introduced**: Version 0.1.0

**Components**:
- [Home](#hometsx)
- [News](#newstsx) 

---

When the user first clicks on the link to the website, this will be the first page they see.

The important part of the landing page is the components in the [`/components`](../../../client/src/app//landing/components/) directory, which contains the components whose dimensions are exactly `100vw * 100vh`, that is, each component will span the entire user's screen.

As of version 0.1.0, the landing component contains the JSON string
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
The [`Home`](../../../client/src/app/landing/components/Home.tsx) is the first component the user sees, which introduces DuckCode and includes a way for them to go to the portal for login/sign-up.

#### `News.tsx`
The more notable component here is the [`News`](../../../client/src/app/landing/components/News.tsx) component, which fetches articles from the DuckCode article database. This component will help the user update on DuckCode events and notifications.

API URL:

As of version 0.1.0, the structure of an article is as follows:
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