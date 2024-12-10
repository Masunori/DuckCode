import CountdownTimer from "../../globalcomponents/CountdownTimer";

export default function GameplayNavbar() {
    return (
        <div id="gameplay-navbar">
            <div id="gameplay-settings">
                <button>Settings</button>
            </div>
            <CountdownTimer initialTime={900} asSpan={false} />
        </div>
    )
}