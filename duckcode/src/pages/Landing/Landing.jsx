import { useNavigate } from "react-router-dom"

export function Landing() {
    const navigate = useNavigate();

    const handleGoToDuckCode = () => {
        navigate('/portal');
    }

    return (
        <div id="landing">
            <button onClick={handleGoToDuckCode}>Go to DuckCode</button>
        </div>
    )
}