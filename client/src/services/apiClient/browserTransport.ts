import { parseResponse } from "../parseResponse";
import { ApiRequestOptions, ApiTransport } from "../transport";
import { tryApiCallWithAuth } from "./apiCallWithAuth";

type RefreshSession = () => Promise<{ status: number }>;

/**
 * BrowserTransport is a transport layer for making API requests from client components in a Next.js application.
 * It uses the Fetch API to send requests to the specified base URL and includes cookies in the request headers.
 * It also supports retrying requests with authentication if the `retryWithAuth` option is set.
 * 
 * @param baseUrl - The base URL for the API requests. Defaults to an empty string.
 * @returns A promise resolving to the parsed data as a typed object.
 */
export class BrowserTransport extends ApiTransport {
    private refreshSession?: RefreshSession;

    constructor(private readonly baseUrl: string = "") {
        super();
    }

    setRefreshSession(refreshSession: RefreshSession): void {
        this.refreshSession = refreshSession;
    }

    async request<T>(endpoint: string, init: RequestInit = {}, clientOptions: ApiRequestOptions = {}): Promise<T> {
        const apiCall = () => fetch(`${this.baseUrl}${endpoint}`, {
            ...init,
            credentials: 'include',
            headers: {
                ...init?.headers
            }
        });

        let response: Response;

        if (clientOptions?.retryWithAuth) {
            if (!this.refreshSession) {
                throw new Error("BrowserTransport refresh session handler is not configured");
            }

            response = await tryApiCallWithAuth(
                apiCall,
                this.refreshSession,
                () => { window.location.href = "/portal"; }
            );
        } else {
            response = await apiCall();
        }

        return parseResponse<T>(response);
    }
}
