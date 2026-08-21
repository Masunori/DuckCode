import { ApiClient } from "../client";
import { BrowserTransport } from "./browserTransport";

/**
 * Shared browser API client for client components.
 *
 * A singleton is safe here because the browser owns one user's session and
 * automatically includes that session's cookies with requests. Authenticated
 * requests use this same client to refresh the session when necessary.
 */
const browserTransport = new BrowserTransport();

export const browserClient = new ApiClient(browserTransport);

browserTransport.setRefreshSession(() => browserClient.auth.refreshToken());
