import { useState } from "react";
import Login from "./Login";
import './portal.css';
import StarryBackground from "../../globalcomponents/StarryBackground";
import Signup from "./Signup";
import ResetPassword from "./ResetPassword";
import { useNavigate } from "react-router-dom";

export default function Portal() {
    const [isLogin, setIsLogin] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [isResetPassword, setIsResetPassword] = useState(false);

    const navigate = useNavigate();

    const handleGoToLanding = () => {
        navigate('/');
    }

    const child = <div id="portal-container">
        <p id="to-landing" onClick={handleGoToLanding}>About Us</p>
        <div id="portal-content">
            <h1 style={{ margin: 0, fontSize: '3em' }}>It's not just about learning to code or competitive programming</h1>
            <p style={{ fontSize: '1.25em', textAlign: 'center' }}>Dive into gamified tutorials, challenge peers in ranked matches, and participate in simulated contests with prizes!</p>
            <button onClick={() => setIsLogin(true)} id="landing-login-button">Login</button>
            <button onClick={() => setIsSignup(true)} id="landing-signup-button">Sign Up</button>
        </div>
        <Login isLogin={isLogin} setIsLogin={setIsLogin} setIsResetPassword={setIsResetPassword} />
        <Signup isSignup={isSignup} setIsSignup={setIsSignup}/>
        <ResetPassword isResetPassword={isResetPassword} setIsResetPassword={setIsResetPassword} setIsLogin={setIsLogin} />
    </div>

    return (
        <StarryBackground child={child} />
    )
}