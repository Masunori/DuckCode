"use client";

import { Tag } from '@/lib/publicRoutes/news/utils';
import Link from 'next/link';
import styles from './page.module.css';

export default function TagBox({ tag }: { tag: Tag }) {
    return (
        <Link
            href={`/news?tag=${tag.toLowerCase()}`}
            className={styles.tagBox}
            onClick={e => e.stopPropagation()}
        >
            {tag}
        </Link>
    )
}