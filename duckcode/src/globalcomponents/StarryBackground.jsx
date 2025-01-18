import React, { useRef, useEffect } from "react";
import '../styles/background.css';

/**
 * A wrapper for a starry background.
 * 
 * @param {Object} param0 The object literal containing:
 * - child (React.JSX.Element) The children that will be wrapped in this background.
 * @returns The starry background component, wrapping the specified child.
 */
export default function StarryBackground({ child=<div></div> }) {
    const starsRef = useRef(null);

    useEffect(() => {
        const starsContainer = starsRef.current;
        const totalStars = 250;

        for (let i = 0; i < totalStars; i++) {
            const star = document.createElement('div');
            star.classList.add('star');

            const size = Math.random() * 2 + 1;
            const top = Math.random() * window.innerHeight;
            const left = Math.random() * window.innerWidth;
            const delay = Math.random() * 2;

            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.top = `${top}px`;
            star.style.left = `${left}px`;
            star.style.animationDelay = `${delay}s`;

            starsContainer.appendChild(star);
        }
    }, [])

    return <div className="stars" ref={starsRef}>
        {child}
    </div>
}