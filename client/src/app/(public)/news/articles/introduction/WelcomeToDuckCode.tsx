import styles from "../article.module.css";

export function WelcomeToDuckCode() {
    return (
        <div className={styles.article}>
            <p>A warmest, most sincere welcome to DuckCode!</p>
            <p>
                As you may (or may not) be aware of, DuckCode is an online multiplayer game about programming. 
                However, that does not mean that it is exclusive to computing-related students and professionals: we strive to cater to all
                demographics of users, and with that in mind, let us guide you through the Pond, and everything 
                you can explore with it!
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
                <li>
                    <p>
                        <b>Gamified Lessons</b> - If you are new to programming, we have a bunch of tutorials to first
                        help you acquire computational and logical thinking, slowly going from the first print statement to 
                        more advanced concepts and ultimately your first victory.
                    </p>
                </li>
                <li>
                    <p>
                        <b>Flock</b> - Ducks are stronger in flocks! Join force with other players and spar with other flocks.
                        Whether you are seeking the peak of glory or just a sanctuary to hang out, there is definitely a flock 
                        for you in this Pond.
                    </p>
                </li>
                <li>
                    <p>
                        <b>Events</b> - The Pond renovates regularly, and with new renovations comes a bunch of unique version
                        events. Attempt fresh challenges, snag special version-exclusive rewards and prepare to code like never before!
                    </p>
                </li>
                <li>
                    <p>
                        <b>Simulated Competitions</b> - The glorious pond where the strongest of the ducks meet! At the comfort of your 
                        home and with your online friends, participate in DuckCode&apos;s simulated competitive programming contests and snatch
                        some prizes for yourself! Maybe, treat it as your stepping stone for larger, more prestigious competitions...
                    </p>
                </li>
            </ul>
            <p>
                With that, what are you waiting for? Jump straight into DuckCode and make your first remark in the Pond! We wish you gain 
                the most enjoyable moments in DuckCode!
            </p>
            <p className={styles.signature}>The DuckCode Team</p>
        </div>
    )
}