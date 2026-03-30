"use client";

import OTPInput from "@/components/inputs/OTPInput";

export default function DumpPage() {
    const toHome = () => {
        window.location.href = "/home";
    }

    return (
        <div style={{
            width: "500px",
            marginTop: "50%",
            marginLeft: "50%",
            transform: "translate(-50%, -50%)"
        }}>
            <p>This is a dump page for debugging purposes.</p>
            <OTPInput n={6} onOtpChange={otp => console.log(`OTP changed: ${otp}`)} onOtpValidate={isValid => console.log(`OTP valid: ${isValid}`)} />
            <button onClick={toHome}>To Home</button>
        </div>
    );
}