import "server-only";

import { cookies } from "next/headers";
import { ApiClient } from "../client";
import { ServerTransport } from "./serverTransport";

/**
 * Creates a request-scoped API client for use in Server Components.
 *
 * Call this factory inside the component handling the current request, for
 * example: `const serverClient = await createServerClient()`.
 * Do not replace it with a module-level singleton: the cookie header belongs to
 * one incoming request and must never be reused for another user.
 *
 * @returns An API client configured with the current request's cookies.
 */
export async function createServerClient(): Promise<ApiClient> {
    const cookieHeader = (await cookies()).toString();

    return new ApiClient(new ServerTransport({
        baseUrl: process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000",
        cookieHeader,
    }));
}
