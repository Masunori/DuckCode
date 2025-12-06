import StarryBackground from "../components/backgrounds/StarryBackground";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PortalLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const accessToken = (await cookies()).get("accessToken")?.value;
    const refreshToken = (await cookies()).get("refreshToken")?.value;

    if (accessToken || refreshToken) {
        redirect("/home");
        return;
    }

    return (
        <StarryBackground>
            {children}
        </StarryBackground>
    );
}