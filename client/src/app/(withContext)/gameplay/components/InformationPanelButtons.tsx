type InformationPanelButtonsProps = {
    informationMode: "question" | "testCases" | "output";
    setInformationMode: (mode: "question" | "testCases" | "output") => void;
}

import styles from '../page.module.css';

export default function InformationPanelButtons({ informationMode, setInformationMode }: InformationPanelButtonsProps) {
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