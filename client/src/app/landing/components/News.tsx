"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from '../page.module.css';
import { Articles } from '@/app/api/articledb';

export default function News() {
    const [articles, setArticles] = useState<Articles | null>(null);
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>("");

    const newsRef = useRef<HTMLLIElement | null>(null);
    const [currentArticle, setCurrentArticle] = useState('001');

    // fetch article from server
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/landing');
                if (res.ok) {
                    const data = await res.json();
                    setArticles(data);
                } else {
                    setError('Article not found');
                }
            } catch (err) {
                setError(`Failed to fetch articles: ${err}`);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, []);

    // disable jump scrolling if the cursor is within the news block
    const handleWheel = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
        const newsElement = newsRef.current;
    
        // Check if the event occurred in the news section
        if (newsElement && newsElement.contains((event.target as HTMLElement))) {
            event.stopPropagation();
        }
    }, []);

    // style news side buttons
    const handleMouseEnter = useCallback((event: React.MouseEvent<HTMLLIElement>) => {
        const target = event.target as HTMLLIElement;
        target.style.backgroundColor = 'var(--second-layer-background-color)';
    }, []);

    const handleMouseLeave = useCallback((event: React.MouseEvent<HTMLLIElement>) => {
        const target = event.target as HTMLLIElement;
        target.style.backgroundColor = target.dataset.key === currentArticle
            ? 'var(--second-layer-background-color)'
            : 'var(--first-layer-background-color)';
    }, [currentArticle]);

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    if (!articles) return <div>No article found</div>

    return (
        <section className={styles.fullscreen}>
            <h1 className={styles.landingLatestNews}>Latest News</h1>
            <div className={styles.newsContainer}>
                <div className={styles.newsDisplayWrapper}>
                    <article className={styles.newsDisplayer} ref={newsRef} onWheel={handleWheel}>
                        <h3>{articles[currentArticle].title}</h3>
                        <time dateTime="2025-01-20">{articles[currentArticle].date}</time>
                        <div style={{
                            border: '1px solid var(--third-layer-background-color)',
                            margin: '1rem 0'
                        }}></div>
                        {articles[currentArticle].content.map((paragraph, index) => (
                            <div key={index} style={{ margin: "0.8rem 0" }}>
                                {paragraph.paragraph.map((segment, index2) => (
                                    <span key={index2} style={{ fontWeight: segment.bold ? 600 : 400 }}>
                                        {segment.text}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </article>
                </div>
                
                <ul className={styles.newsList}>
                    {Object.entries(articles).map(([key, value], idx) => (
                        <li key={idx} data-key={key} 
                            onClick={() => setCurrentArticle(key)}
                            style={{ backgroundColor: key === currentArticle ? 'var(--second-layer-background-color)' : 'var(--first-layer-background-color)' }}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <span style={{ display: 'block' }}>{value.title}</span>
                            <span className={styles.newsListDate} style={{ display: 'block' }}>{value.date}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}