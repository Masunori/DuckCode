import styles from "../article.module.css";

export function Version_0_1_3_beta_speculation() {
    return (
        <div className={styles.article}>
            <p>
                DuckCode v0.1.3 (beta) is coming soon, and we expect the following features and improvements to be included in this release:
            </p>
            <ul>
                <h2>I - New Features</h2>
                <li>
                    <p>
                        <b>Multiplayer 1v1</b> - A prototypical matchmaking queue and lobby system for the DuckCode team to figure out how the ranked system sould work.
                        3v3 multiplayer is still on the roadmap.
                    </p>
                </li>
            </ul>
            <ul>
                <h2>II - Improvements</h2>
                <li>
                    <p>
                        <b>Language Server Support</b> - We are working on integrating a language server for Python to provide better code completion, error checking, and overall improved coding experience in the editor. 
                    </p>
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        style={{
                            width: "100%",
                            height: "auto",
                        }}
                    >
                        <source src="/videos/duckcode_v0_1_3_python_support.webm" type="video/webm" /><source src="/videos/duckcode_v0_1_3_python_support.webm" type="video/webm" />
                        <source src="/videos/duckcode_v0_1_3_python_support.mp4" type="video/mp4" />
                    </video>
                    <p>This will allow players to write code more efficiently while playing. If this works, language server support will also be rolled out for other programming languages in the future.</p>
                    <p>With this, at the start of v0.1.3, the following languages will be supported:</p>
                    <ul>
                        <li>JavaScript (by Monaco Editor default)</li>
                        <li>Python (by <a href="https://github.com/SardineFish/monaco-pyright-lsp" target="_blank" rel="noopener noreferrer external">@SardineFish/monaco-pyright-lsp</a>)</li>
                    </ul>
                </li>
            </ul>
            <p>
                We look forward to seeing you there!
            </p>
            <p className={styles.signature}>The DuckCode Team</p>
        </div>
    )
}