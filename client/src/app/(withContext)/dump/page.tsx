"use client";

import { useToast } from "@/contexts/ToastContext";
import styles from "./dump.module.css";

function Cube() {
    return <div className={styles.scene}>
        <div className={styles.cube}>
            <div className={`${styles.face} ${styles.front}`}>F</div>
            <div className={`${styles.face} ${styles.back}`}>B</div>
            <div className={`${styles.face} ${styles.left}`}>L</div>
            <div className={`${styles.face} ${styles.right}`}>R</div>
            <div className={`${styles.face} ${styles.top}`}>T</div>
            <div className={`${styles.face} ${styles.bottom}`}>D</div>
        </div>
    </div>
}

export default function DumpPage() {
    // return null;
    const { openPopup } = useToast();

    return (
        <>
            <button onClick={() => openPopup("Toast opened", "success", 5, false)}>Open Toast (Success)</button>
            <button onClick={() => openPopup("Toast opened", "warning", 5, false)}>Open Toast (Warning)</button>
            <button onClick={() => openPopup("Toast opened", "error", 5, true)}>Open Toast (Error)</button>
            <button onClick={() => openPopup("Toast opened", "info", 5, true)}>Open Toast (Info)</button>
            <Cube />
        </>
    );
}