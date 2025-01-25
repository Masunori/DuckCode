import { useNavigate } from "react-router-dom";
import './landing.css';
import { useEffect, useState } from "react";
import { SECTIONS } from "../../globalcomponents/constants";

export default function Landing() {
    const navigate = useNavigate();

    const handleGoToDuckCode = () => {
        navigate('/portal');
    }

    const dummyLink = "https://youtu.be/dQw4w9WgXcQ?si=pbHjWVWDclnIJgTS";

    // each section is 100vh
    // enable special scrolling behaviour where each scroll directs you to another section neatly
    const [currentSection, setCurrentSection] = useState(0);
    
    useEffect(() => {
        const sectionElement = document.getElementById(`landing-section-${Object.keys(SECTIONS)[currentSection]}`);
        sectionElement?.scrollIntoView({ behavior: 'smooth' });
    }, [currentSection]);

    useEffect(() => {
        const handleScroll = (event) => {
            const delta = event.deltaY;
    
            if (delta > 0 && currentSection < Object.keys(SECTIONS).length - 1) {
                // scroll down
                setCurrentSection(currentSection + 1);
            } else if (delta < 0 && currentSection > 0) {
                // scroll up
                setCurrentSection(currentSection - 1);
            }
        };

        const handleMouseEnter = (event) => {
            event.target.style.backgroundColor = 'var(--second-layer-background-color)';
        }

        const handleMouseLeave = (event) => {
            event.target.style.backgroundColor = parseInt(event.target.dataset.key, 10) === currentSection
                ? 'var(--second-layer-background-color)'
                : 'var(--first-layer-background-color)';
        }

        const navbarOptions = document.getElementById('landing-navbar-options').querySelectorAll('li');
        navbarOptions.forEach(element => {
            element.addEventListener('mouseenter', handleMouseEnter);
            element.addEventListener('mouseleave', handleMouseLeave);
        })

        window.addEventListener('wheel', handleScroll, { passive: false });
        return () => {
            window.removeEventListener('wheel', handleScroll);
            navbarOptions.forEach(element => {
                element.removeEventListener('mouseenter', handleMouseEnter);
                element.removeEventListener('mouseleave', handleMouseLeave);
            })
        };
    });

    return (
        <div id="landing">
            <header>
                <nav>
                    <div>
                        <h3>DuckCode</h3>
                    </div>
                    <ul id="landing-navbar-options">
                        {Object.entries(SECTIONS).map(([key, value], idx) => (
                            <li key={idx} data-key={idx} style={{
                                backgroundColor: idx === currentSection ? "var(--second-layer-background-color)" : "var(--first-layer-background-color)"
                            }}
                            onClick={() => setCurrentSection(idx)}>
                                {value.name}
                            </li>
                        ))}
                    </ul>
                    <div id="landing-navbar-play-duckcode-button-wrapper">
                        <button id="landing-play-duckcode-button" onClick={handleGoToDuckCode}>Play</button>
                    </div>
                </nav>
            </header>
            <main>
                {Object.entries(SECTIONS).map(([key, value], idx) => (
                    <div id={`landing-section-${key}`} key={idx}>
                        {value.section}
                    </div>
                ))}
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
                <p>&copy; {new Date().getFullYear()} DuckCode Project. All rights reserved.</p>
            </footer>
        </div>
    )
}