import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    function handleGoToDuckCode(event) {
        navigate('/portal');
    }

    return (
        <section id="landing-welcome-section">
            <div id="landing-welcome-container">
                <h1>Welcome to DuckCode!</h1>
                <p>DuckCode is your one-stop solution for learning programming, and honing your programming skills!</p>
                <div id="landing-welcome-play-duckcode-button-wrapper">
                    <button id="landing-welcome-play-duckcode-button" onClick={handleGoToDuckCode}>Play Now</button>
                </div>
            </div>
        </section>
    )
}