import { useEffect, useState } from "react";
import styles from "./input.module.css";

type PaginationControllerProps = {
    pageNumber: number;
    onPageChange: (newPageNumber: number) => void;
    maxPage: number;
}

/**
 * A component that displays pagination controls for a list of items. It allows the user to navigate between pages of items and displays the current page number.
 * 
 * The layout uses a 3-column grid (1fr | auto | 1fr) so the current page button always
 * sits in the physical center of the container regardless of how many surrounding
 * page buttons are visible. No placeholder buttons are needed.
 * 
 * @param param0 The props:
 * - `pageNumber (number)`: the current page number, starting from 1
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

    const goto = (page: number) => {
        setCurrentPage(page);
        onPageChange(page);
    };

    return (
        <div className={styles.paginationController}>
            {/* ── Previous arrow (always at far left) ── */}
            <button
                onClick={() => goto(Math.max(1, currentPage - 1))}
                title="Previous"
                disabled={currentPage <= 1}
            >{'<'}</button>

            {/* ── Left section (right-aligned) ── */}
            <div className={styles.paginationLeft}>
                {/* page 1 anchor – shown when current is far enough from start */}
                {currentPage > 2 && (
                    <button onClick={() => goto(1)}>1</button>
                )}

                {/* skip back 5 pages */}
                {currentPage > 4 && (
                    <button
                        className={styles.skipPagesButton}
                        onClick={() => goto(Math.max(1, currentPage - 5))}
                        title="Previous 5 pages"
                    >...</button>
                )}

                {/* cur - 2 */}
                {currentPage > 3 && (
                    <button onClick={() => goto(currentPage - 2)}>{currentPage - 2}</button>
                )}

                {/* cur - 1 */}
                {currentPage > 1 && (
                    <button onClick={() => goto(currentPage - 1)}>{currentPage - 1}</button>
                )}
            </div>

            {/* ── Center: always the current page ── */}
            <button className={styles.selected}>{currentPage}</button>

            {/* ── Right section (left-aligned) ── */}
            <div className={styles.paginationRight}>
                {/* cur + 1 */}
                {currentPage < maxPage && (
                    <button onClick={() => goto(currentPage + 1)}>{currentPage + 1}</button>
                )}

                {/* cur + 2 */}
                {currentPage < maxPage - 2 && (
                    <button onClick={() => goto(currentPage + 2)}>{currentPage + 2}</button>
                )}

                {/* skip forward 5 pages */}
                {currentPage < maxPage - 3 && (
                    <button
                        className={styles.skipPagesButton}
                        onClick={() => goto(Math.min(currentPage + 5, maxPage))}
                        title="Next 5 pages"
                    >...</button>
                )}

                {/* last page anchor – shown when current is far enough from end */}
                {currentPage < maxPage - 1 && (
                    <button onClick={() => goto(maxPage)}>{maxPage}</button>
                )}
            </div>

            {/* ── Next arrow (always at far right) ── */}
            <button
                onClick={() => goto(Math.min(currentPage + 1, maxPage))}
                title="Next"
                disabled={currentPage >= maxPage}
            >{'>'}</button>
        </div>
    );
}