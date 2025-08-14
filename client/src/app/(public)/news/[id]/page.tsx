import { notFound } from "next/navigation";
import { ARTICLES, formatDatetimeString, Tag } from "../articles";
import styles from "./page.module.css";

type ArticleProps = {
    params: Promise<{ id: number }>;
}

function TagBox({ tag }: { tag: Tag }) {
    return (
        <div className={styles.tagBox}>
            {tag}
        </div>
    )
}

export default async function Page({ params }: ArticleProps) {
    const {id} = await params;
    const article = ARTICLES[id];

    if (!article) {
        notFound();
    }

    return (
        <div className={styles.articlePage}>
            <header className={styles.articleHeader}>
                <h1>{article.title}</h1>
                <time dateTime={article.date}>
                    {formatDatetimeString(article.date)}
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