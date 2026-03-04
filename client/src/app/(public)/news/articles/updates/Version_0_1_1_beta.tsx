import styles from "../article.module.css";

export function Version_0_1_1_beta() {
    return (
        <div className={styles.article}>
            <p>
                DuckCode v0.1.1 (beta) is finally here! While we are still working hard on building the Pond and all its 
                features, we are excited to share with you a sneak peek of what we have been working on. In this beta version, 
                you can expect to see the following features:
            </p>
            <ul>
                <li>
                    <p>
                        <b>Playground</b> - A space for you to code, without the hassle of setting up any environment. 
                        Pick your language, start coding, and see the results right away! 
                    </p>
                </li>
                <li>
                    <p>
                        <b>Arcade</b> - Currently supports Classic mode (DSA and competitive programming level questions).
                        More modes and questions will be added in the future, so stay tuned! Highly programmer-centric with
                        many useful keyboard shortcuts to make sure you barely need to take your hands off the keyboard.
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