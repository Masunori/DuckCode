"use client";

import debounce from "@/lib/utils/debounce";
import { useCallback, useEffect, useState } from "react";
import styles from "../page.module.css";

export default function NewsCarousel() {
    const [activeNewsTab, setActiveNewsTab] = useState(1);
    const [isAnimating, setIsAnimating] = useState(true);

    const data = ["1", "2", "3", "4", "5"];
    const transitionDuration = 0.5;

    // the last data piece is duplicated and put to the start of the data list
    // the first data piece is duplicated and put to the end of the data list
    // this facilitates the smooth carousel transition later
    // Slides: 1, 2, 3, 4, 5 => slides: 5, 1, 2, 3, 4, 5, 1
    function augmentData<T>(data: T[]) {
        const augmentedData = [...data];
        augmentedData.unshift(data[data.length - 1]);
        augmentedData.push(data[0]);

        return augmentedData;
    }

    const handleLeftShift = useCallback(() => {
        if (isAnimating) {
            return;
        }

        setIsAnimating(true);
        setActiveNewsTab(prev => prev - 1);
    }, [isAnimating]);

    const handleRightShift = useCallback(() => {
        if (isAnimating) {
            return;
        }

        setIsAnimating(true);
        setActiveNewsTab(prev => prev + 1);
    }, [isAnimating]);

    const debounceHandleLeftShift = debounce(handleLeftShift, 250);
    const debounceHandleRightShift = debounce(handleRightShift, 250);

    // When the user is at slide 5 and click right, the 5 transits to the last 1 smoothly
    // 5, 1, 2, 3, 4, 5, 1 => 5, 1, 2, 3, 4, 5, 1
    //                |                         |
    // then, secretly snap back to the first 1 with no animation
    // 5, 1, 2, 3, 4, 5, 1 => 5, 1, 2, 3, 4, 5, 1
    //                   |       |               
    // then the next right click smoothly transits to slide 2
    useEffect(() => {
        setTimeout(() => {
            setIsAnimating(false);

            if (activeNewsTab === 0) {
                setActiveNewsTab(data.length);
            } else if (activeNewsTab === data.length + 1) {
                setActiveNewsTab(1);
            }
        }, transitionDuration * 1001);
    }, [activeNewsTab, data.length]);

    // Automatically shift the carousel to the right every 10 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            handleRightShift();
        }, 10000);

        return () => clearInterval(intervalId);
    }, [handleRightShift]);

    return (
        <div className={styles.newsCarousel}>
            <button className={styles.leftButton} onClick={debounceHandleLeftShift}>{"<"}</button>
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
            <button className={styles.rightButton} onClick={debounceHandleRightShift}>{">"}</button>
            <div className={styles.indicators}>
                {data.map((_, index) => (
                    <div
                        className={styles.indicator}
                        key={index}
                        style={{
                            width: (activeNewsTab + data.length - 1) % data.length === index ? "1.6rem" : "1rem",
                        }}
                    ></div>
                ))}
            </div>
        </div>
    )
}