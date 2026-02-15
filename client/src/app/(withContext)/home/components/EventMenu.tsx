import { MouseEventHandler } from "react";
import styles from "../page.module.css";

type StylizedEventMenuButtonProps = {
    buttonName: string;
    onClick: MouseEventHandler<HTMLButtonElement> | undefined;
    buttonDescription: string;
    disabled?: boolean;
}

function StylizedEventMenuButton({ buttonName, onClick, buttonDescription, disabled }: StylizedEventMenuButtonProps) {
    return (
        <div className={styles.stylizedEventMenuButton}>
            <div className={styles.stylizedEventMenuButtonDescription}>
                {buttonDescription}
            </div>
            <button 
                onClick={onClick} 
                disabled={disabled} 
                style={{ cursor: disabled ? "not-allowed" : "pointer" }}
            >{buttonName}</button>
            <div className={styles.stylizedEventMenuButtonOverlay}>
                
            </div>
        </div>
    )
}

export default function EventMenu() {
    return (
        <div className={styles.eventMenu}>
            <StylizedEventMenuButton 
                buttonName="Daily Challenge" 
                onClick={undefined} 
                buttonDescription="An easy problem to start your day." 
                disabled={true}
            />
            <StylizedEventMenuButton 
                buttonName="DuckPass" 
                onClick={undefined} 
                buttonDescription="Not yet available..." 
                disabled={true}
            />
            <StylizedEventMenuButton 
                buttonName="Event" 
                onClick={undefined} 
                buttonDescription="Access time-limited events here!" 
                disabled={true}
            />
        </div>
    )
}