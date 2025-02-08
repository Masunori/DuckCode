export default function HoverableContent({ mainContent, popUpContent }) {
    return (
        <div className="tooltip">
            {mainContent}
            <span className="tooltip-text">{popUpContent}</span>
        </div>
    )
}