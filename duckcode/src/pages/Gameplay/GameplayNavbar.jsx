import CountdownTimer from "../../globalcomponents/CountdownTimer";

export default function GameplayNavbar({ setSettiings }) {
    return (
        <div id="gameplay-navbar">
            <div id="gameplay-settings">
                <button onClick={() => setSettiings("block")}>Settings</button>
            </div>
            <CountdownTimer initialTime={900} asSpan={false} />
        </div>
    )
}