// import { NextRequest, NextResponse } from "next/server";
import { printd } from "@/app/utils/debugUtils";

// export function proxy(req: NextRequest) {
//     const pathname = req.nextUrl.pathname;

//     printd("@proxy.ts", `Proxying request for path: ${pathname}`);

//     const accessToken = req.cookies.get("accessToken")?.value;
//     const refreshToken = req.cookies.get("refreshToken")?.value;

//     if (!refreshToken) {
//         return NextResponse.redirect(new URL("/portal", req.url));
//     }

//     if (!accessToken) {
//         const next = encodeURIComponent(pathname + req.nextUrl.search);
//         return NextResponse.redirect(new URL(`/refresh?next=${next}`, req.url));
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: [
//         '/portal/:path*',
//         '/gameplay/:path*',
//         '/home/:path*',
//         '/multiplayer/:path*',
//         '/playground/:path*',
//     ],
// };

// proxy.ts (project root or src/proxy.ts)
import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
    const pathname = req.nextUrl.pathname;
    // console.log(`[proxy] ${new Date().toISOString()} ${pathname}`);
    printd("@proxy.ts", `Proxying request for path: ${pathname}`);

    // allowlisted public prefixes (no auth)
    const publicPrefixes = ["/portal", "/landing", "/dev", "/news", "/api/auth"];
    for (const p of publicPrefixes) {
        if (pathname.startsWith(p)) {
            return NextResponse.next();
        }
    };

    const accessToken = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) return NextResponse.redirect(new URL("/portal", req.url));

    if (!accessToken) {
        const next = encodeURIComponent(pathname + req.nextUrl.search);
        return NextResponse.redirect(new URL(`/refresh?next=${next}`, req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/gameplay/:path*",
        "/home/:path*",
        "/multiplayer/:path*",
        "/playground/:path*",
    ],
};
