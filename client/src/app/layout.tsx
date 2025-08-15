import type { Metadata } from "next";
import "./globals.css";
import UnsupportedForMobileWrapper from "./UnsupportedForMobileWrapper";

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
			<body>
				<UnsupportedForMobileWrapper>
					{children}
				</UnsupportedForMobileWrapper>
			</body>
		</html>
	);
}
