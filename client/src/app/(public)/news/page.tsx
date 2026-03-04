"use client";

import { ARTICLE_TAGS, Tag } from "@/lib/publicRoutes/news/utils";
import { formatArticleDatetimeString } from "@/lib/utils/datetime";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ARTICLES } from "./articles/articles";
import styles from "./page.module.css";
import TagBox from "./TagBox";


type ArticleBoxProps = {
    id: number;
    title: string;
    date: string;
    summary: string;
    tags: Tag[];
}

function ArticleBox({ title, date, id, summary, tags }: ArticleBoxProps) {
    return (
        <div className={styles.articleBox}>
            <div className={styles.tagBoxes}>
                {tags.map((tag, index) => (
                    <div key={index}>
                        <TagBox tag={tag} />
                    </div>
                ))}
            </div>
            <Link href={`/news/${id}`}>
                <h2>{title}</h2>
                <time dateTime={date}>{formatArticleDatetimeString(date)}</time>
                <p>{summary}</p>
            </Link>
        </div>
    )
}

function NewsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tagParam = searchParams.get('tag');
    const initialFilter: Tag | "All" = ARTICLE_TAGS.find(t => t.toLowerCase() === tagParam) ?? "All";
    const [filter, setFilter] = useState<Tag | "All">(initialFilter);

    const filteredArticles = filter === "All"
        ? ARTICLES
        : ARTICLES.filter(a => a.tags.includes(filter));

    function handleFilterChange(newFilter: Tag | "All") {
        setFilter(newFilter);

        if (newFilter === "All") {
            router.replace("/news", { scroll: false });
        } else {
            router.replace(`/news?tag=${newFilter.toLowerCase()}`, { scroll: false });
        }
    }

    return (
        <div className={styles.newsContainer}>
            <div className={styles.news}>
                <h1>NEWS</h1>
                <div className={styles.tagFilter}>
                    <button
                        className={filter === "All" ? styles.active : ""}
                        value={"All"}
                        onClick={() => handleFilterChange("All")}
                    >All</button>
                    {ARTICLE_TAGS.map((tag, index) => (
                        <button
                            className={filter === tag ? styles.active : ""}
                            key={index}
                            value={tag}
                            onClick={() => handleFilterChange(tag)}
                        >{tag}</button>
                    ))}
                </div>
                <ul>
                    {filteredArticles.map((article) => (
                        <li key={article.id}>
                            <ArticleBox
                                title={article.title}
                                date={article.date}
                                id={article.id}
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

export default function Page() {
    return (
        <Suspense>
            <NewsContent />
        </Suspense>
    )
}