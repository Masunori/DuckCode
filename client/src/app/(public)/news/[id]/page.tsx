import { formatArticleDatetimeString } from "@/lib/utils/datetime";
import { notFound } from "next/navigation";
import { ARTICLES } from "../articles/articles";
import TagBox from "../TagBox";
import styles from "./page.module.css";

type ArticleProps = {
    params: Promise<{ id: number }>;
}
export default async function Page({ params }: ArticleProps) {
    const { id } = await params;

    // articles are added to the ARTICLES array in reverse chronological order, 
    // so the article with id 0 is the oldest article, and the article with id ARTICLES.length - 1 is the most recent article
    // thus, to get the article with id, we need to reverse index it from the end of the array
    const article = ARTICLES[ARTICLES.length - 1 - id]; // articles are in reverse chronological order, so the id is reversed indexed

    if (!article) {
        notFound();
    }

    return (
        <div className={styles.articlePage}>
            <header className={styles.articleHeader}>
                <h1>{article.title}</h1>
                <time dateTime={article.date}>
                    {formatArticleDatetimeString(article.date)}
                </time>
                <div className={styles.tagBoxes}>
                    <p>Tags:</p>
                    {article.tags.map((tag, index) => (
                        <div key={index}>
                            <TagBox tag={tag} />
                        </div>
                    ))}
                </div>
            </header>
            <div className={styles.articleContent}>
                {article.content}
            </div>
        </div>
    )
}