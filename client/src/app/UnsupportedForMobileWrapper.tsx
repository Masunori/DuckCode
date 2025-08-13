"use client";

import StarryBackground from "./components/backgrounds/StarryBackground";
import "./globals.css";
import UserPrefRootSetter from "./userPrefs/UserPrefRootSetter";
import { useEffect, useState } from "react";

export default function UnsupportedForMobileWrapper({ children }: Readonly<{
  	children: React.ReactNode;	
}>) {
	const [isMobile, setIsMobile] = useState<null | boolean>(null);

	useEffect(() => {
		const check = () => setIsMobile(window.innerWidth < 768);
		check();
		
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, [setIsMobile]);

    if (isMobile === null) {
        return null;
    }

	if (isMobile) {
		return (
			<StarryBackground>
                <div 
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                    }}
                >
                    <p>
                        DuckCode is optimized for desktops and laptops.
                        Some features may not work properly on mobile devices.
                    </p>
                    <p>
                        Please use a desktop or laptop for the best experience.
                        If you insist on proceeding, you can use desktop view from your browser settings, but layout issues and broken workflows may occur.
                    </p>
                </div>
            </StarryBackground>
		);
	}

	return (
		<>
            <UserPrefRootSetter />
            {children}
        </>
	);
}
