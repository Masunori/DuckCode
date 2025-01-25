import { useContext } from "react";
import CountdownTimer from "../../globalcomponents/CountdownTimer";
import { SettingsContext } from "../../App";

export default function GameplayNavbar() {
    const {setFrozen} = useContext(SettingsContext);

    return (
        <nav id="gameplay-navbar">
            <div id="gameplay-settings">
                <button 
                    onClick={() => {
                        setFrozen(false);
                    }}
                >
                    <img src='/icons/settings.png' alt='settings' />
                </button>
            </div>
            <CountdownTimer initialTime={900} asSpan={false} />
        </nav>
    )
}