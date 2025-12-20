"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./layout.module.css";
import debounce from "../../utils/debounce";

type Star = {
    size: number;
    top: number;
    left: number;
    delay: number;
}

export default function StarryBackground({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const [stars, setStars] = useState<Star[]>([]);

    // Hydration check to ensure the component is only rendered on the client side
    // Scroll to the end of the file for explanation 
    const [hydrated, setHydrated] = useState(false);

    const generateStars = useCallback(() => {
        if (!hydrated) {
            return [];
        }

        const totalStars = Math.floor((window.innerHeight * window.innerWidth) / 5000);
        const starsArray: Star[] = [];

        for (let i = 0; i < totalStars; i++) {
            const size = Math.random() * 2 + 1;
            const top = Math.random() * window.innerHeight;
            const left = Math.random() * window.innerWidth;
            const delay = Math.random() * 2;

            starsArray.push({ size, top, left, delay });
        }

        return starsArray;
    }, [hydrated]);

    const debouncedGenerateStars = useMemo(
        () => 
            debounce(() => {
                setStars(generateStars());
            }, 200),
        [generateStars]
    );

    useEffect(() => {
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return; // Ensure the container exists and is hydrated

        setStars(generateStars());
        window.addEventListener("resize", debouncedGenerateStars);
        return () => {
            window.removeEventListener("resize", debouncedGenerateStars);
        }; 
    }, [hydrated, generateStars, debouncedGenerateStars]);
    
    return (
        <div className={styles.stars}>
            <div>
                {stars.map((star, index) => (
                    <div
                        key={index}
                        className={styles.star}
                        style={{
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            top: `${star.top}px`,
                            left: `${star.left}px`,
                            animationDelay: `${star.delay}s`,
                        }}
                    />
                ))}
            </div>
            <div>
                {children}
            </div>
        </div>
    );
}

/*
    The StarryBackground has too much client-side logic (direct DOM manipulation by creating stars).
    React may pause or delay rendering the page (page.tsx) until hydration is complete.

    Thus, the portal content did not render on the first navigation. The starry background effect runs too early, so React is confused.

    Thus, the flag `const [hydrated, setHydrated] = useState(false);` is used to defer DOM-heavy logic until React confirms that we are running on the client-side only.
    After hydration is done, 
    
    useEffect(() => {
        setHydrated(true);
    }, []);

    will fire and the background logic (direct DOM manipulation) is executed.

    `if (!hydrated) return null;` means that the background is not rendered until the component is hydrated
*/