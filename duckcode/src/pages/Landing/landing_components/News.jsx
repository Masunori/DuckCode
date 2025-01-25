import { useRef, useState } from "react"

export default function News() {
    const articles = {
        "001": {
            title: "What is DuckCode?",
            date: "20 January, 2025",
            content: [
                {
                    paragraph: [
                        { text: "DuckCode is a multiplayer game about programming for all demographic of users.", bold: false }
                    ]
                },
                {
                    paragraph: [
                        { text: "- ", bold: false },
                        { text: "Gamified Lessons", bold: true },
                        { text: ": People new to programming can acquire computational thinking and programming methodologies with DuckCode's series of gamified lessons.", bold: false },
                    ]
                },
                {
                    paragraph: [
                        { text: "- ", bold: false },
                        { text: "Practice Matches", bold: true },
                        { text: ": Zero-pressure environment for all programmers to hone their programming skills by tackling DuckCode's diverse database of interview-type (and some challenging) programming questions.", bold: false },
                    ]
                },
                {
                    paragraph: [
                        { text: "- ", bold: false },
                        { text: "Ranked Matches", bold: true },
                        { text: ": Either 1v1 or in teams, test your programming skills by competing against other programmers and rise to the top.", bold: false },
                    ]
                },
                {
                    paragraph: [
                        { text: "- ", bold: false },
                        { text: "Simulated Competitions", bold: true },
                        { text: `: Feeling disheartened or afraid of large-scale, professional competitive programming competitions? Try DuckCode's simulated competition! 
                            Enjoy a realistic competition environment at the comfort of your home, gaining exposure, and get tangible prizes! Maybe you can be the next champion?`
                            , bold: false },
                    ]
                },
            ]
        },
        "002": {
            title: "DuckCode Global Invitational coming to you...",
            date: "20 January, 2025",
            content: [
                {
                    paragraph: [
                        { text: "The most anticipated event hosted by the DuckCode team, DuckCode Global Invitational, is coming to you!", bold: false }
                    ]
                },
                {
                    paragraph: [
                        { text: "Date", bold: true },
                        { text: ": 21 - 23 July 2028", bold: false },
                    ]
                },
                {
                    paragraph: [
                        { text: "Venue", bold: true },
                        { text: ": To be confirmed...", bold: false },
                    ]
                },
                {
                    paragraph: [
                        { text: "Activities", bold: true },
                    ]
                },
                {
                    paragraph: [
                        { text: "- ", bold: false },
                        { text: "DuckCode ACG Fest", bold: true },
                        { text: `: You cannot mention Computer Science without mentioning the Anime-Cosplay-Game culture. Dress up (or simply join us) in one of the biggest ACG 
                            event in Asia, with more than 200 international and regional artists, cosplayers and content creators, and tons of fulfilling activities awaiting you.`
                            , bold: false },
                    ]
                },
                {
                    paragraph: [
                        { text: "- ", bold: false },
                        { text: "DuckCode Career Fest", bold: true },
                        { text: `: How about not just having fun, but also getting a job? Get your resume ready, and meet up with recruiters from more than 500 companies 
                            and businesses from all over the world!`
                            , bold: false },
                    ]
                },
                {
                    paragraph: [
                        { text: "- ", bold: false },
                        { text: "DuckCode Talkshow", bold: true },
                        { text: `: Attend talks from professors and industrial specialists across various fields of Computer Science, and gain new insights into the field, 
                            or just be mind-blown!`
                            , bold: false },
                    ]
                },
                {
                    paragraph: [
                        { text: "- ", bold: false },
                        { text: "DuckCode Global Invitational", bold: true },
                        { text: `: The best teams that have cleared the regional qualifiers will be invited to Singapore in a 7-day, 6-night trip to compete in one of the most 
                            (self-proclaimed) prestigious competitive programming competition, with a prize pool of up to USD1,000,000 and other opportunities. Audience will be 
                            allowed to watch the entire competition live, with commentary from professionals.`
                            , bold: false },
                    ]
                },
                {
                    paragraph: [
                        { text: "- ", bold: false },
                        { text: "DuckCode Concert", bold: true },
                        { text: `: End the exciting 3-day event with a booming concert, with our special guests!`
                            , bold: false },
                    ]
                },
            ]
        },
        "003": {
            title: "DuckCode v1.0 is in production!",
            date: "20 January, 2025",
            content: [
                {
                    paragraph: [
                        { text: "As of January 20, 2025, the DuckCode team is actively working on creating the minimum viable product (MVP) for DuckCode!", bold: false },
                    ]
                },
                {
                    paragraph: [
                        { text: "Our team expects to bring DuckCode to you by the end 2025.", bold: false },
                    ]
                },
                {
                    paragraph: [
                        { text: "Version 1.0 will support the following features:", bold: false },
                    ]
                },
                {
                    paragraph: [
                        { text: "- ", bold: false },
                        { text: "Practice Matches", bold: true },
                        { text: `: Zero-pressure environment for all programmers to hone their programming skills by tackling 
                            DuckCode's diverse database of interview-type (and some challenging) programming questions.`
                            , bold: false },
                    ]
                },
                {
                    paragraph: [
                        { text: "- ", bold: false },
                        { text: "1v1 Ranked Matches", bold: true },
                        { text: `: Test your programming skills by competing against other programmers in 1v1 ranked matches 
                            and rise to the top. Your points will be kept tracked of by DuckCode's point system.`
                            , bold: false },
                    ]
                },
                {
                    paragraph: [
                        { text: "Please look forward to our beta test opening in spring/summer 2025.", bold: false },
                    ]
                },
            ]
        }
    }

    const newsRef = useRef();
    const [currentArticle, setCurrentArticle] = useState('001');

    // Disables jump scrolling when the user's cursor is on the article displayer
    const handleWheel = (event) => {
        const newsElement = newsRef.current;
    
        // Check if the event occurred in the news section
        if (newsElement && newsElement.contains(event.target)) {
            event.stopPropagation();
        }
    };

    const handleMouseEnter = event => {
        event.target.style.backgroundColor = 'var(--second-layer-background-color)';
    }

    const handleMouseLeave = event => {
        event.target.style.backgroundColor = event.target.dataset.key === currentArticle
            ? 'var(--second-layer-background-color)'
            : 'var(--first-layer-background-color)';
    }

    return (
        <section>
            <h1 id="landing-latest-news">Latest News</h1>
            <div id="news-container">
                <div id="news-display-wrapper">
                    <article id="news-displayer" ref={newsRef} onWheel={handleWheel}>
                        <h3>{articles[currentArticle].title}</h3>
                        <time dateTime="2025-01-20">{articles[currentArticle].date}</time>
                        <div style={{
                            border: '1px solid var(--third-layer-background-color)',
                            margin: '1em 0'
                        }}></div>
                        {articles[currentArticle].content.map((paragraph, index) => (
                            <div key={index} style={{ margin: "0.8em 0" }}>
                                {paragraph.paragraph.map((segment, index2) => (
                                    <span key={index2} style={{ fontWeight: segment.bold ? 600 : 400 }}>
                                        {segment.text}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </article>
                </div>
                
                <ul id="news-list">
                    {Object.entries(articles).map(([key, value], idx) => (
                        <li key={idx} data-key={key} 
                            onClick={() => setCurrentArticle(key)}
                            style={{ backgroundColor: key === currentArticle ? 'var(--second-layer-background-color)' : 'var(--first-layer-background-color)' }}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <span style={{ display: 'block' }}>{value.title}</span>
                            <span id="news-list-date" style={{ display: 'block' }}>{value.date}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}