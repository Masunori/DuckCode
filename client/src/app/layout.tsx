import type { Metadata } from "next";
import "./globals.css";
import UnsupportedForMobileWrapper from "./UnsupportedForMobileWrapper";
import { getZIndexCss } from "./zIndex";

export const metadata: Metadata = {
	title: "DuckCode",
	description: "It's not just writing any code. It's DuckCode!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			{/* Injected before any external CSS so that CSS custom properties are
			    always resolved correctly, regardless of production bundle order. */}
			<style href="z-index-vars" precedence="high" dangerouslySetInnerHTML={{ __html: getZIndexCss() }} />
			<body>
				<UnsupportedForMobileWrapper>
					{children}
				</UnsupportedForMobileWrapper>
			</body>
		</html>
	);
}
