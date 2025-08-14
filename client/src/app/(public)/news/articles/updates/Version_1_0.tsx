import styles from "../article.module.css";

export function Version_1_0() {
    return (
        <div className={styles.article}>
            <p>
                The Pond is being built! While not all features of DuckCode are delivered in version 1.0, you
                can at least expect the following game modes to appear.
            </p>
            <ul>
                
                <li>
                    <p>
                        <b>Multiplayer</b> - If you know your stuff well, straight-up jump into intense competitive matches with 
                        other like-minded programmers, or have some fun with your friends with some of our most chaotic programming game modes ever!
                    </p>
                </li>
                <li>
                    <p>
                        <b>Arcade</b> - Prefer to code at your own pace? Enjoy our collection of content similar to multiplayer,
                        but with absolutely zero pressure. It&apos;s just you, your code, and the joy of doing things at your own pace
                        and solving problems.
                    </p>
                </li>
            </ul>
            <p>
                Meanwhile, the beta version will be opened soon. Be among the first pioneers to get a glimpse of the Pond and help us improve
                it. We look forward to seeing you there!
            </p>
            <p className={styles.signature}>The DuckCode Team</p>
        </div>
    )
}