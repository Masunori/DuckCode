"use client";

import { useBaseGameplayStore } from '@/lib/gameplay/hooks/useBaseGameplayStore';
import styles from '../page.module.css';
import { useShallow } from 'zustand/shallow';

export default function InformationPanelButtons() {
    const [informationMode, setInformationMode] = useBaseGameplayStore(
        useShallow(
            state => [state.informationMode, state.setInformationMode]
        )
    );

    return (
        <div className={styles.informationPanelButtons}>
            <button 
                className={informationMode === "question" ? styles.selected : styles.unselected}
                onClick={() => setInformationMode("question")}
            >Question</button>
            <button 
                className={informationMode === "testCases" ? styles.selected : styles.unselected}
                onClick={() => setInformationMode("testCases")}
            >Test Cases</button>
            <button 
                className={informationMode === "output" ? styles.selected : styles.unselected}
                onClick={() => setInformationMode("output")}
            >Output</button>
        </div>
    );
}