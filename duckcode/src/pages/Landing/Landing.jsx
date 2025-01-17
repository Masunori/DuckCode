import { useState } from "react";
import { Login } from "./Login";
import './landing.css';
import StarryBackground from "../../globalcomponents/StarryBackground";
import { Signup } from "./Signup";

export function Landing() {
    const [isLogin, setIsLogin] = useState(false);
    const [isSignup, setIsSignup] = useState(false);

    const child = <div id="landing-container">
        <h1 style={{ margin: 0 }}>It's not just about learning to code or competitive programming</h1>
        <p>DuckCode is your one-stop destination for programming. Dive into gamified tutorials, challenge peers in ranked matches, and participate in simulated contests with prizes!</p>
        <button onClick={() => setIsLogin(true)} id="landing-login-button">Login</button>
        <button onClick={() => setIsSignup(true)} id="landing-signup-button">Sign Up</button>
        <Login isLogin={isLogin} setIsLogin={setIsLogin} />
        <Signup isSignup={isSignup} setIsSignup={setIsSignup}/>
    </div>

    return (
        <StarryBackground child={child} />
    )
}