"use client";

import { JSX, useCallback, useEffect, useRef, useState } from 'react';
import Home from './components/Home';
import News from './components/News';
import styles from './page.module.css';
import Link from 'next/link';

type Section = {
    name: string;
    component: () => JSX.Element;
};

const SECTIONS: Record<string, Section> = {
    "home": {
        "name": "Home",
        "component": Home
    },
    "news": {
        "name": "News",
        "component": News
    }
}

const dummyLink = "https://youtu.be/dQw4w9WgXcQ?si=pbHjWVWDclnIJgTS";

export default function Page() {
    // React hooks to store the index of the current landing section and the landing sections
    const [currentSection, setCurrentSection] = useState(0);
    const sectionRef = useRef<(HTMLDivElement | null)[]>([]);

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

    // attaches the jump scrolling handler to the window
    useEffect(() => {
        window.addEventListener('wheel', handleScroll, { passive: false });

        return () => {
            window.removeEventListener("wheel", handleScroll);
        };
    }, [handleScroll]);

    // styles navbar buttons
    const handleMouseEnter = useCallback((event: React.MouseEvent<HTMLLIElement>) => {
        const target = event.currentTarget as HTMLLIElement;
        target.style.backgroundColor = 'var(--second-layer-background-color)';
    }, []);

    const handleMouseLeave = useCallback((event: React.MouseEvent<HTMLLIElement>) => {
        const target = event.currentTarget as HTMLLIElement;
        target.style.backgroundColor = target.dataset.key === Object.keys(SECTIONS)[currentSection]
            ? 'var(--second-layer-background-color)'
            : 'var(--first-layer-background-color)';
    }, [currentSection]);

    return (
        <div className={`${styles.landing} ${styles.fullscreen}`}>
            <header>
                <nav>
                    <div>
                        <h3>DuckCode</h3>
                    </div>
                    <ul>
                        {Object.entries(SECTIONS).map(([key, value]: [string, Section], idx: number) => (
                            <li key={idx} data-key={key} 
                                style={{
                                    backgroundColor: idx === currentSection ? "var(--second-layer-background-color)" : "var(--first-layer-background-color)"
                                }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => { setCurrentSection(idx) }}
                            >{value.name}</li>
                        ))}
                    </ul>
                    <div className={`${styles.playDuckcodeButtonWrapper}`}>
                        <Link href='/portal' className={`${styles.playDuckcodeButton}`}>Play DuckCode</Link>
                    </div>
                </nav>
            </header>
            <main>
                {Object.entries(SECTIONS).map(([key, value]: [string, Section], idx: number) => (
                    <div key={key} ref={el => { sectionRef.current[idx] = el; }}>
                        {<value.component />}
                    </div>
                ))}
            </main>
            <footer>
                <ul>
                    <li>
                        <a href={dummyLink}>Privacy Policy</a>
                    </li>
                    <li>
                        <a href={dummyLink}>Terms of Service</a>
                    </li>
                    <li>
                        <a href={dummyLink}>Contact Us</a>
                    </li>
                    <li>
                        <a href={dummyLink}>Help Centre</a>
                    </li>
                </ul>
                <p>&copy; {new Date().getFullYear()} DuckCode Project. All rights reserved.</p>
            </footer>
        </div>
    )
}