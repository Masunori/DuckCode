"use client";

import { useState } from "react";
import styles from './page.module.css';
import Login from "./components/Login";
import Signup from "./components/Signup";
import ResetPassword from "./components/ResetPassword";
import { PortalMode } from "./PortalMode";

export default function PortalClient() {
    const [portalMode, setPortalMode] = useState(PortalMode.None);

   return (
        <div className={styles.portalClient}>
            <button className={styles.loginButton} onClick={() => setPortalMode(PortalMode.Login)}>Login</button>
            <button className={styles.signupButton}  onClick={() => setPortalMode(PortalMode.Register)}>Register</button>

            <Login portalMode={portalMode} setPortalMode={setPortalMode} />
            <Signup portalMode={portalMode} setPortalMode={setPortalMode} />
            <ResetPassword portalMode={portalMode} setPortalMode={setPortalMode} />
        </div>
    );
}