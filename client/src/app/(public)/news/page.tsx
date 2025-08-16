"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { ARTICLES, articleTags, formatDatetimeString, Tag } from "./articles";
import { useState } from "react";


type ArticleBoxProps = {
    id: number;
    title: string;
    date: string;
    summary: string;
    tags: Tag[];
}

function TagBox({ tag }: { tag: Tag }) {
    return (
        <div className={styles.tagBox}>
            {tag}
        </div>
    )
}

function ArticleBox({ title, date, id, summary, tags }: ArticleBoxProps) {
    return (
        <div className={styles.articleBox}>
            <Link href={`/news/${id}`}>
                <div className={styles.tagBoxes}>
                    {tags.map((tag, index) => (
                        <div key={index}>
                            <TagBox tag={tag}></TagBox>
                        </div>
                    ))}
                </div>
                <h2>{title}</h2>
                <time dateTime={date}>{formatDatetimeString(date)}</time>
                <p>{summary}</p>
            </Link>
        </div>
    )
}

export default function Page() {
    const [filter, setFilter] = useState<Tag | "All">("All");
    const filteredArticles = filter === "All"
        ? ARTICLES
        : ARTICLES.filter(a => a.tags.includes(filter));

    return (
        <div className={styles.newsContainer}>
            <div className={styles.news}>
                <h1>NEWS</h1>
                <div className={styles.tagFilter}>
                    <button 
                        className={filter === "All" ? styles.active : ""}
                        value={"All"} 
                        onClick={() => setFilter("All")}
                    >All</button>
                    {articleTags.map((tag, index) => (
                        <button 
                            className={filter === tag ? styles.active : ""}
                            key={index} 
                            value={tag}
                            onClick={() => setFilter(tag)}
                        >{tag}</button>
                    ))}
                </div>
                <ul>
                    {filteredArticles.map((article, index) => (
                        <li key={index}>
                            <ArticleBox
                                title={article.title}
                                date={article.date}
                                id={index}
                                summary={article.summary}
                                tags={article.tags}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}