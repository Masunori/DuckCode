import { useState, useRef, useEffect } from 'react';
import { PASSWORD_CONDITIONS } from '../../globalcomponents/constants';

export function Signup({ isSignup, setIsSignup }) {
    const EMPTY_STRING = 'var(--fourth-layer-background-color)';
    const INVALID_STRING = '#DC143C';
    const VALID_STRING = '#00DD00';

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [usernameColor, setUsernameColor] = useState(EMPTY_STRING);
    const [passwordColor, setPasswordColor] = useState(EMPTY_STRING);
    const [confirmPasswordColor, setConfirmPasswordColor] = useState(EMPTY_STRING);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const conditionsRef = useRef([]);

    useEffect(() => {
        // This will ensure that conditionsRef has the correct length and references.
        conditionsRef.current = conditionsRef.current.slice(0, Object.entries(PASSWORD_CONDITIONS).length);
    });

    /**
     * Dynamically check for valid username (which is an email).
     * 
     * @param {Event} event when a change in the username field is detected. 
     */
    function handleUsernameChange(event) {
        const newUsername = event.target.value;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/;

        setEmail(newUsername);

        if (newUsername === "") {
            setUsernameColor(EMPTY_STRING);
        } else if (!emailRegex.test(newUsername)) {
            setUsernameColor(INVALID_STRING);
        } else {
            setUsernameColor(VALID_STRING);
        }
    }

    /**
     * Dynamically check for valid password.
     * 
     * @param {Event} event when a change in the password field is detected.
     */
    function handlePasswordChange(event) {
        const newPassword = event.target.value;
        setPassword(newPassword);

        let isPasswordValid = true;

        conditionsRef.current.forEach(el => {
            if (newPassword === "") {
                el.innerText = `  ${el.innerText.replace(/^[✔✖]\s*/, '')}`;
                el.style.color = EMPTY_STRING;
            } else if (!PASSWORD_CONDITIONS[el.dataset.key].checkFn(newPassword)) {
                isPasswordValid = false;
                el.innerText = `✖ ${el.innerText.replace(/^[✔✖]\s*/, '')}`;
                el.style.color = INVALID_STRING;
            } else {
                el.innerText = `✔ ${el.innerText.replace(/^[✔✖]\s*/, '')}`;
                el.style.color = VALID_STRING;
            }
        });

        setPasswordColor(newPassword === ""
            ? EMPTY_STRING
            : isPasswordValid
            ? VALID_STRING
            : INVALID_STRING
        )
    }

    function handleConfirmPasswordChange(event) {
        const newCfmPassword = event.target.value;
        setConfirmPassword(newCfmPassword);

        if (newCfmPassword === "") {
            setConfirmPasswordColor(EMPTY_STRING);
        } else if (newCfmPassword === password) {
            setConfirmPasswordColor(VALID_STRING);
        } else {
            setConfirmPasswordColor(INVALID_STRING);
        }
    }

    return (
        <div style={{ display: isSignup ? "block" : "none" }}>
            <div className='login-signup-fullscreen' ></div>
            <div className='login-signup-container-border'>
                <div className="login-signup-container">
                    <button id="signup-close-button" onClick={() => setIsSignup(false)}>×</button>
                    <h2>Welcome to DuckCode!<br />Your journey starts here!</h2>
                    <form action='#' method='POST'>
                        <label htmlFor="signup-username">
                            <input style={{ borderColor: usernameColor }} id="signup-username" type="text" name="username" value={email} onChange={handleUsernameChange} placeholder="Enter your email" required />
                        </label>
                        <label htmlFor="signup-password" id='signup-password-label'>
                            <input style={{ borderColor: passwordColor }} id="signup-password" type={isPasswordVisible ? "text" : "password"} name="password" value={password} onChange={handlePasswordChange} placeholder="Password" required />
                            <button type='button' onClick={() => setIsPasswordVisible(!isPasswordVisible)}>{isPasswordVisible ? "Hide" : "Show"}</button>
                        </label>
                        <label htmlFor="signup-confirm-password" id='signup-confirm-password-label'>
                            <input style={{ borderColor: confirmPasswordColor }} id="signup-confirm-password" type={isPasswordVisible ? "text" : "password"} name="password" value={confirmPassword} onChange={handleConfirmPasswordChange} placeholder="Confirm Password" required />
                            <button type='button' onClick={() => setIsPasswordVisible(!isPasswordVisible)}>{isPasswordVisible ? "Hide" : "Show"}</button>
                        </label>
                        <ul style={{ paddingLeft: '1em' }}>
                            {Object.entries(PASSWORD_CONDITIONS).map(([key, value], index) => (
                                <li key={key} ref={el => conditionsRef.current[index] = el} data-key={key} style={{ listStyleType: 'none', transitionDuration: '0.25s' }}>
                                   {value.name}
                                </li>
                            ))}
                        </ul>

                        <button id="sign-up-button" type="submit">Sign Up</button>

                        <div className="login-signup-options-separator">
                            <span></span>
                            <h4>OR continue with</h4>
                            <span></span>
                        </div>
                        <section className="login-signup-alternative-options">
                            <button>Google</button>
                            <button>GitHub</button>
                            <button>Facebook</button>
                        </section>
                    </form>
                </div>
            </div>
        </div>
    )
}
