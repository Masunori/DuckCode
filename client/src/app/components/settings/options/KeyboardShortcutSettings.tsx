import styles from "../settings.module.css";
import { GAMEPLAY_KEY_BINDINGS, GENERAL_KEY_BINDINGS } from "../settingsUtils";

export default function KeyboardShortcutSettings() {
    function translateCombo(combo: { ctrl: boolean, shift: boolean, key: string }): string {
        if (combo.ctrl) {
            if (combo.shift) {
                return "CTRL + Shift + " + combo.key;
            } else {
                return "CTRL + " + combo.key;
            }
        } else if (combo.shift) {
            return "Shift + " + combo.key;
        } else {
            return combo.key;
        }
    }

    return (
        <div
            className={`${styles.settingsOptionDisplay} ${styles.keyboardShortcutDisplay}`}
        >
            <div className={styles.settingsContentChunk}>
                <h2>General Key Bindings</h2>
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
            </div>
            <h2>Gameplay Key Bindings</h2>
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
        </div>
    )
}