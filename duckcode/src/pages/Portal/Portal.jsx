import { useState } from "react";
import { Login } from "./Login";
import './portal.css';
import StarryBackground from "../../globalcomponents/StarryBackground";
import { Signup } from "./Signup";

export function Portal() {
    const [isLogin, setIsLogin] = useState(false);
    const [isSignup, setIsSignup] = useState(false);

    const child = <div id="landing-container">
        <div id="landing-content">
            <h1 style={{ margin: 0, fontSize: '3em' }}>It's not just about learning to code or competitive programming</h1>
            <p style={{ fontSize: '1.25em' }}>DuckCode is your one-stop destination for programming. Dive into gamified tutorials, challenge peers in ranked matches, and participate in simulated contests with prizes!</p>
            <button onClick={() => setIsLogin(true)} id="landing-login-button">Login</button>
            <button onClick={() => setIsSignup(true)} id="landing-signup-button">Sign Up</button>
        </div>
        <Login isLogin={isLogin} setIsLogin={setIsLogin} />
        <Signup isSignup={isSignup} setIsSignup={setIsSignup}/>
    </div>

    return (
        <StarryBackground child={child} />
    )
}