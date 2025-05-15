"use client";

import { PortalMode } from "@/app/portal/PortalMode";
import styles from '../page.module.css';

type PopupOverlayProps = {
    children: React.ReactNode;
    portalMode: PortalMode;
    referencePortalMode: PortalMode;
}

export default function PopupOverlay({ children, portalMode, referencePortalMode }: PopupOverlayProps) {
    return (
        <div className={styles.overlay} style={{ display: portalMode === referencePortalMode ? 'block' : 'none' }}>
            {children}
        </div>
    )
}