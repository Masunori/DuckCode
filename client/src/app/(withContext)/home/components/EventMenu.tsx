import { MouseEventHandler } from "react";
import styles from "../page.module.css";

type StylizedEventMenuButtonProps = {
    buttonName: string;
    onClick: MouseEventHandler<HTMLButtonElement> | undefined;
    buttonDescription: string;
}

function StylizedEventMenuButton({ buttonName, onClick, buttonDescription }: StylizedEventMenuButtonProps) {
    return (
        <div className={styles.stylizedEventMenuButton}>
            <div className={styles.stylizedEventMenuButtonDescription}>
                {buttonDescription}
            </div>
            <button onClick={onClick}>{buttonName}</button>
            <div className={styles.stylizedEventMenuButtonOverlay}>
                
            </div>
        </div>
    )
}

export default function EventMenu() {
    return (
        <div className={styles.eventMenu}>
            <StylizedEventMenuButton buttonName="Daily Challenge" onClick={undefined} buttonDescription="An easy problem to start your day." />
            <StylizedEventMenuButton buttonName="DuckPass" onClick={undefined} buttonDescription="Not yet available..." />
            <StylizedEventMenuButton buttonName="Event" onClick={undefined} buttonDescription="Access time-limited events here!" />
        </div>
    )
}