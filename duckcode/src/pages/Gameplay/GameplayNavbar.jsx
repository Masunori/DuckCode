import { useContext } from "react";
import CountdownTimer from "../../globalcomponents/utility_components/CountdownTimer";
import { SettingsContext } from "../../App";
import { openConfirmWithMessage } from "../../globalcomponents/utility_components/Confirm";

export default function GameplayNavbar() {
    const {setFrozen} = useContext(SettingsContext);

    function confirmExit(event) {
        openConfirmWithMessage(
            "Exit the game? Your progress will not be saved!",
            "Stay",
            "Exit" 
        )
    }

    return (
        <nav id="gameplay-navbar">
            <button id="gameplay-settings"
                    onClick={() => {
                        setFrozen(false);
                    }}
                >
                    <img src='/icons/settings.png' alt='settings' />
                </button>
            <CountdownTimer id={"gameplay-countdown-timer"} initialTime={900} />
            <button id="game-exit-button" onClick={confirmExit}>
                Exit
            </button>
        </nav>
    )
}