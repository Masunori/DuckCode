import styles from "../article.module.css";

export function DuckCodeGlobalInvitational() {
    return (
        <div className={styles.article}>
            <p>
                The most anticipated event organised by the DuckCode team, also the most (self-proclaimed) prestigious
                competitive programming competition, DuckCode Global Invitational - The Wetlands, is coming to you!
            </p>
            <p>
                <b>Date:</b> 21 - 23 July, 2028
            </p>
            <p>
                <b>Venue:</b> To be confirmed
            </p>
            <ul>
                <b>Activities:</b>
                <li>
                    <p>
                        <b>DuckCode ACG</b> - Many of us programmers grow up with animation, comics and games. Just for this 
                        week, dress up (or not...) and embrace yourself in one of the largest ACG events in Asia. Hundreds of 
                        international and regional artists, cosplayers and creators, as well as tons of immersive activities 
                        are waiting for you!
                    </p>
                </li>
                <li>
                    <p>
                        <b>DuckCode Career Fest</b> - How about not just enjoying the festive atmosphere, but also getting a job
                        out of it? Get your resume ready, and network with recruiters from hundreds of tech-related companies and  
                        businesses around the world!
                    </p>
                </li>
                <li>
                    <p>
                        <b>DuckCode Talkshow</b> - New to programming or senior experts in computing fields, there is a talk that
                        you can attend! Our lineup of industrial experts and university professors will bring you great insights 
                        into various Computer Science fields, or just simply, blow your minds.
                    </p>
                </li>
                <li>
                    <p>
                        <b>DuckCode Global Invitational - The Wetlands</b> - The best teams from ponds all over the world will meet
                        each other and compete in one of the most (self-proclaimed) prestigious competitive programming competitions 
                        around the world. Get ready to cheer for your favourite teams: all event-goers can join the arena for free as 
                        audiences, and everything will be broadcast online with professional commentary.
                    </p>
                </li>
                <li>
                    <p>
                        <b>DuckCode Concert</b> - What can be better than ending the exciting 3-day event with a booming concert, with 
                        our special guests?
                    </p>
                </li>
            </ul>
            <p>We will release more information nearer to the event, so please stay tuned, and enjoy DuckCode!</p>
            <p className={styles.signature}>The DuckCode Team</p>
        </div>
    )
}