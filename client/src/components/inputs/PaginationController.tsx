import { useEffect, useState } from "react";
import styles from "./input.module.css";

type PaginationControllerProps = {
    pageNumber: number;
    onPageChange: (newPageNumber: number) => void;
    maxPage: number; // optional prop to specify the maximum page number, if not provided, there is no maximum
}

/**
 * A component that displays pagination controls for a list of items. It allows the user to navigate between pages of items and displays the current page number.
 * 
 * @param param0 The props:
 * - `initialPageNumber (number)`: the initial page number to display, starting from 1
 * - `onPageChange (function)`: a callback function that is called when the page number changes, with the new page number as its argument
 * - `maxPage (number)`: the maximum page number
 * @returns The pagination controller component
 */
export default function PaginationController({ pageNumber, onPageChange, maxPage }: PaginationControllerProps) {
    const [currentPage, setCurrentPage] = useState<number>(pageNumber);

    // Sync internal state with prop changes
    useEffect(() => {
        setCurrentPage(pageNumber);
    }, [pageNumber]);

    return <div className={styles.paginationController}>
        {/* previous page (arrow) */}
        <button
            onClick={() => {
                const newPageNumber = Math.max(1, currentPage - 1); // ensure the new page number is at least 1
                setCurrentPage(newPageNumber);
                onPageChange(newPageNumber);
            }}
            title="Previous"
            disabled={currentPage <= 1}
        >{'<'}</button>
        {/* 4 placeholders */}
        {
            currentPage <= 1 &&
            <button
                className={styles.placeholderButton}
                disabled={currentPage <= 1}
            >1</button>
        }
        {
            currentPage <= 2 &&
            <button
                className={styles.placeholderButton}
                disabled={currentPage <= 2}
            >2</button>
        }
        {
            currentPage <= 3 &&
            <button
                className={styles.placeholderButton}
                disabled={currentPage <= 3}
            >0</button>
        }
        {
            currentPage <= 4 &&
            <button
                className={styles.placeholderButton}
                disabled={currentPage <= 4}
            >8</button>
        }
        {/* page 1 when not selected */}
        {
            currentPage > 1 && <button
                onClick={() => {
                    setCurrentPage(1);
                    onPageChange(1);
                }}
            >1</button>
        }
        {/* page 1 when selected */}
        {
            currentPage === 1 && <button
                className={styles.selected}
                onClick={() => {
                    setCurrentPage(1);
                    onPageChange(1);
                }}
            >1</button>
        }
        {/* go back 5 pages */}
        {
            currentPage > 4 &&
            <button
                onClick={() => {
                    const nextPage = Math.max(1, currentPage - 5);
                    setCurrentPage(nextPage);
                    onPageChange(nextPage);
                }}
                title="Previous 5 pages"
            >...</button>
        }
        {/* go back 2 pages */}
        {
            currentPage > 3 &&
            <button
                onClick={() => {
                    const nextPage = Math.max(1, currentPage - 2);
                    setCurrentPage(nextPage);
                    onPageChange(nextPage);
                }}
            >{currentPage - 2}</button>
        }
        {/* previous page */}
        {
            currentPage > 2 &&
            <button
                onClick={() => {
                    const nextPage = Math.max(1, currentPage - 1);
                    setCurrentPage(nextPage);
                    onPageChange(nextPage);
                }}
            >{currentPage - 1}</button>
        }
        {/* current page */}
        {
            currentPage > 1 && currentPage < maxPage &&
            <button
                className={styles.selected}
            >{currentPage}</button>
        }
        {/* next page */}
        {
            currentPage < maxPage - 1 &&
            <button
                onClick={() => {
                    const nextPage = Math.min(currentPage + 1, maxPage);
                    setCurrentPage(nextPage);
                    onPageChange(nextPage);
                }}
            >{currentPage + 1}</button>
        }
        {/* go forward 2 pages */}
        {
            currentPage < maxPage - 2 &&
            <button
                onClick={() => {
                    const nextPage = Math.min(currentPage + 1, maxPage);
                    setCurrentPage(nextPage);
                    onPageChange(nextPage);
                }}
            >{currentPage + 2}</button>
        }
        {/* go forward 5 pages */}
        {
            currentPage < maxPage - 3 &&
            <button
                className={styles.skipPagesButton}
                onClick={() => {
                    const nextPage = Math.min(currentPage + 5, maxPage);
                    setCurrentPage(nextPage);
                    onPageChange(nextPage);
                }}
                title="Next 5 pages"
            >...</button>
        }
        {/* last page when not selected */}
        {
            currentPage < maxPage && <button
                onClick={() => {
                    setCurrentPage(maxPage);
                    onPageChange(maxPage);
                }}
            >{maxPage}</button>
        }
        {/* last page when selected */}
        {
            currentPage === maxPage && <button
                className={styles.selected}
                onClick={() => {
                    setCurrentPage(maxPage);
                    onPageChange(maxPage);
                }}
            >{maxPage}</button>
        }
        {/* 4 placeholder buttons */}
        {
            currentPage >= maxPage - 3 &&
            <button
                className={styles.placeholderButton}
                disabled={currentPage <= 1}
            >2</button>
        }
        {
            currentPage >= maxPage - 2 &&
            <button
                className={styles.placeholderButton}
                disabled={currentPage <= 2}
            >0</button>
        }
        {
            currentPage >= maxPage - 1 &&
            <button
                className={styles.placeholderButton}
                disabled={currentPage <= 2}
            >0</button>
        }
        {
            currentPage >= maxPage &&
            <button
                className={styles.placeholderButton}
                disabled={currentPage <= 2}
            >
                4</button>
        }
        {/* last page (arrow) */}
        <button
            onClick={() => {
                const newPageNumber = Math.min(currentPage + 1, maxPage);
                setCurrentPage(newPageNumber);
                onPageChange(newPageNumber);
            }}
            title="Next"
            disabled={currentPage >= maxPage}
        >{'>'}</button>

    </div>;
}