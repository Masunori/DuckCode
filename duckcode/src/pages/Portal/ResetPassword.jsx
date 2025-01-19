import { useRef, useState } from "react";

export function ResetPassword({ isResetPassword, setIsResetPassword, setIsLogin }) {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const otpInputRefs = useRef([]);

    const [allowVerify, setAllowVerify] = useState(false);
    const [allowOtpSubmission, setAllowOtpSubmission] = useState(false);

    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            otpInputRefs.current[index + 1].focus();
        }

        if (index === 5 && value !== "") {
            setAllowOtpSubmission(true);
        }
    };

    const handleBackspace = (event, index) => {
        if (event.key === "Backspace") {
            if (!otp[index] && index > 0) {
                otpInputRefs.current[index - 1].focus();
            }
            setAllowOtpSubmission(false);
        }
    };

    function getVerificationCode(event) {
        setAllowVerify(true);
        otpInputRefs.current[0].focus();
    }

    return (
        <div style={{ display: isResetPassword ? "block" : "none" }}>
            <div className='login-signup-fullscreen' ></div>
            <div className='login-signup-container-border'>
                <div className="login-signup-container">
                    <button id="login-close-button" onClick={() => {
                        setIsResetPassword(false);
                        setIsLogin(false);
                    }}>×</button>
                    <h2>Mistakes happen...</h2>
                    <form action='#' method='POST'>
                        <div style={{
                            opacity: allowVerify ? 0.25 : 1,
                            pointerEvents: allowVerify ? 'none' : 'auto',
                            transitionDuration: '0.25s'
                        }}>
                            <div className="login-signup-options-separator">
                                <span></span>
                                <h4>Tell us your email</h4>
                                <span></span>
                            </div>
                            <label htmlFor="reset-password-binding-email">
                                <input id="reset-password-binding-email" type="email" name="email" placeholder="you@domain.com" required />
                            </label>
                            <button id="get-verification-code-button" type="button" onClick={getVerificationCode}>Get verification code</button>
                        </div>
                        
                        <div id="forgot-email-verification" style={{
                            opacity: allowVerify ? 1 : 0.25,
                            pointerEvents: allowVerify ? 'auto' : 'none',
                            transitionDuration: '0.25s'
                        }}>
                            <div id="key-in-code-guiding-text" className="login-signup-options-separator">
                                <span></span>
                                <h4>AND key in the code here!</h4>
                                <span></span>
                            </div>
                            {otp.map((value, index) => (
                                <label key={index} htmlFor={`verification-input-${index}`}>
                                    <input 
                                        id={`verification-input-${index}`} 
                                        type="text"
                                        maxLength="1"
                                        value={value}
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        onKeyDown={(e) => handleBackspace(e, index)}
                                        ref={(el) => (otpInputRefs.current[index] = el)}
                                        className="otp-input"
                                        autoComplete="off"
                                    />
                                </label>
                            ))}
                            <button style={{ pointerEvents: allowOtpSubmission ? 'auto' : 'none', opacity: allowOtpSubmission ? 1 : 0.5 }} id="check-verification-code-button" type="button">Verify</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}