import StarryBackground from "../components/backgrounds/StarryBackground";

export default function PortalLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <StarryBackground>
            {children}
        </StarryBackground>
    );
}