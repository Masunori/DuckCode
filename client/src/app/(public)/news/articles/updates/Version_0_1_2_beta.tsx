import styles from "../article.module.css";

export function Version_0_1_2_beta() {
    return (
        <div className={styles.article}>
            <p>
                DuckCode v0.1.2 (beta) has introduced new features and improvements to enhance your programming experience!
                While multiplayer has not been supported yet, here are the changes you can look forward to in this update:
            </p>
            <ul>
                <h2>I - New Features</h2>
                <li>
                    <p>
                        <b>Tutorial</b> - Learn the basic controls of DuckCode and other programming knowledge, mostly catered
                        to our ducklings! More advanced topics will be added in the future, so stay tuned!
                    </p>
                    <p>All ducklings would have to clear the "Getting Started" tutorial to understand the controls of DuckCode before they can access all features.</p>
                </li>
            </ul>
            <ul>
                <h2>II - Improvements</h2>
                <li>
                    <p>
                        <b>Settings</b> - More accessibility options have been added, such as font size and color scheme options!
                        We have also reworked the account settings to make it easier to navigate and manage your account. 
                    </p>
                </li>
                <li>
                    <p>
                        <b>Autosave</b> - Return to right where you have programmed with the new autosave feature! 
                    </p>
                </li>
            </ul>
            <p>
                We look forward to seeing you there!
            </p>
            <p className={styles.signature}>The DuckCode Team</p>
        </div>
    )
}