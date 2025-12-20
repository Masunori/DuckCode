import styles from "../settings.module.css";
import { GAMEPLAY_KEY_BINDINGS, GENERAL_KEY_BINDINGS, MULTIPLAYER_KEY_BINDINGS, translateCombo } from "../settingsUtils";

export default function KeyboardShortcutSettings() {
    return (
        <div
            className={`${styles.settingsOptionDisplay} ${styles.keyboardShortcutDisplay}`}
        >
            <section className={styles.settingsContentChunk}>
                <h2>General Key Bindings</h2>
                <p style={{ margin: "1rem 0" }}>When the popup is open, all other key bindings will be disabled until the popup is closed.</p>
                
                <table>
                    <tbody>
                        {Object.values(GENERAL_KEY_BINDINGS).map((bind, index) => (
                            <tr key={index}>
                                <td>{bind.action}</td>
                                <td>
                                    <code>{translateCombo(bind.combo)}</code>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            <section className={styles.settingsContentChunk}>
                <h2>Gameplay Key Bindings</h2>
                <p style={{ margin: "1rem 0" }}>When the code editor is focused on, all other key bindings will be disabled until you defocus from the editor, except for popup.</p>
                <p style={{ margin: "1rem 0" }}>In <b>Two Tabs</b>, <b>Two Tabs Inverted</b> or <b>Fullscreen Editor Layout</b>, &quot;Toggle Output/Test Case Mode&quot; will also toggle Question mode.</p>
                
                <table>
                    <tbody>
                        {Object.values(GAMEPLAY_KEY_BINDINGS).map((bind, index) => (
                            <tr key={index}>
                                <td>{bind.action}</td>
                                <td>
                                    <code>{translateCombo(bind.combo)}</code>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            <section className={styles.settingsContentChunk}>
                <h2>Multiplayer Key Bindings</h2>
                <p style={{ margin: "1rem 0" }}>When the chatbox is opened, all other key bindings will be disabled until you close the chatbox.</p>
                
                <table>
                    <tbody>
                        {Object.values(MULTIPLAYER_KEY_BINDINGS).map((bind, index) => (
                            <tr key={index}>
                                <td>{bind.action}</td>
                                <td>
                                    <code>{translateCombo(bind.combo)}</code>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    )
}