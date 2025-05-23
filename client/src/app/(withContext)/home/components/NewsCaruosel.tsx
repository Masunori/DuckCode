"use client";

import { useState } from "react";
import styles from "../page.module.css";

export default function NewsCaruosel() {
    const [activeNewsTab, setActiveNewsTab] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);

    const data = ["1", "2", "3", "4", "5"];

    function augmentData<T>(data: T[]) {
        const augmentedData = [...data];
        augmentedData.unshift(data[data.length - 1]);
        augmentedData.push(data[0]);

        return augmentedData;
    }

    


    return (
        <div className={styles.newsCarousel}>
            <button className={styles.leftButton}>{"<"}</button>
            <div className={styles.allNewsTabs}>
                {augmentData(data).map((info, index) => (
                    <div 
                        key={index}
                        style={{
                            width: `${(data.length + 2) * 100}%`,
                            transform: `translateX(${-(activeNewsTab / (data.length + 2))}%)`
                        }}
                    >
                        {info}
                    </div>
                ))}
            </div>
            <button className={styles.rightButton}>{">"}</button>
        </div>
    )
}