import { useNavigate } from "react-router-dom";
import './landing.css';

export default function Landing() {
    const navigate = useNavigate();

    const handleGoToDuckCode = () => {
        navigate('/portal');
    }

    const dummyLink = "https://youtu.be/dQw4w9WgXcQ?si=pbHjWVWDclnIJgTS";

    return (
        <div id="landing">
            <header>
                <nav>
                    <div>
                        <h3>DuckCode</h3>
                    </div>
                    <div id="landing-play-duckcode-button-wrapper">
                        <button id="landing-play-duckcode-button" onClick={handleGoToDuckCode}>Play</button>
                    </div>
                </nav>
            </header>
            <main>
                <section id="landing-welcome-section">
                    <h1>Welcome to DuckCode!</h1>
                    <p>DuckCode is your one-stop solution for learning programming, and honing your programming skills!</p>
                </section>
                <section>
                    <h2 id="landing-latest-news">Latest News</h2>
                    <article>
                        <h3>What is DuckCode?</h3>
                        <time dateTime="2025-01-20">20 January, 2025</time>
                        <p>
                            DuckCode is a multiplayer game about programming for all demographic of users.<br />
                            - <strong>Gamified Lessons</strong>: People new to programming can acquire computational thinking and programming methodologies with DuckCode's series of gamified lessons.<br />
                            - <strong>Practice Matches</strong>: Zero-pressure environment for all programmers to hone their programming skills by tackling DuckCode's diverse database of interview-type (and some challenging) programming questions.<br />
                            - <strong>Ranked Matches</strong>: Either 1v1 or in teams, test your programming skills by competing against other programmers and rise to the top.<br />
                            - <strong>Simulated Competitions</strong>: Feeling disheartened or afraid of large-scale, professional competitive programming competitions? Try DuckCode's simulated competition! Enjoy a realistic competition environment at the comfort of your home,
                            gaining exposure, and get tangible prizes! Maybe you can be the next champion?
                        </p>
                    </article>
                    <article>
                        <h3>DuckCode Global Invitational coming to you...</h3>
                        <time dateTime="2025-01-20">20 January, 2025</time>
                        <p>
                            The most anticipated event hosted by the DuckCode team, DuckCode Global Invitational, is coming to you!<br />
                            <strong>Date</strong>: 21 - 23 July 2028<br />
                            <strong>Venue</strong>: To be confirmed...<br /><br />

                            <strong>Activities</strong><br />
                            - <strong>DuckCode ACG Fest</strong>: You cannot mention Computer Science without mentioning the Anime-Cosplay-Game culture. Dress up (or simply join us) in one of the biggest ACG event in Asia, with more than 200 international and regional artists, cosplayers and content creators, and tons of fulfilling activities awaiting you.<br />
                            - <strong>DuckCode Career Fest</strong>: How about not just having fun, but also getting a job? Get your resume ready, and meet up with recruiters from more than 500 companies and businesses from all over the world!<br />
                            - <strong>DuckCode Talkshow</strong>: Attend talks from professors and industrial specialists across various fields of Computer Science, and gain new insights into the field, or just be mind-blown!<br />
                            - <strong>DuckCode Global Invitational</strong>: The best teams that have cleared the regional qualifiers will be invited to Singapore in a 7-day, 6-night trip to compete in one of the most (self-proclaimed) prestigious competitive programming competition, with a prize pool of up to USD1,000,000 and other opportunities. Audience will be allowed to watch the entire competition live, with commentary from professionals.<br />
                            - <strong>DuckCode Concert</strong>: End the exciting 3-day event with a booming concert, with our special guests!
                        </p>
                    </article>
                    <article>
                        <h3>DuckCode v1.0 is in production!</h3>
                        <time dateTime="2025-01-20">20 January, 2025</time>
                        <p>
                            As of January 20, 2025, the DuckCode team is actively working on creating the minimum viable product (MVP) for DuckCode!
                            <br />Our team expects to bring DuckCode to you by June 2025.
                        </p>
                    </article>
                </section>
            </main>
            <footer>
                <ul>
                    <li>
                        <a href={dummyLink}>Privacy Policy</a>
                    </li>
                    <li>
                        <a href={dummyLink}>Terms of Service</a>
                    </li>
                    <li>
                        <a href={dummyLink}>Contact Us</a>
                    </li>
                    <li>
                        <a href={dummyLink}>Help Centre</a>
                    </li>
                </ul>
                <p>&copy; 2025 DuckCode Project. All rights reserved.</p>
            </footer>
        </div>
    )
}