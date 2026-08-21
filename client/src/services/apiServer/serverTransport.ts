import { parseResponse } from "../parseResponse";
import { ApiRequestOptions, ApiTransport } from "../transport";

type ServerTransportOptions = {
    baseUrl: string;
    cookieHeader: string;
}

/**
 * ServerTransport is a transport layer for making API requests from server components in a Next.js application.
 * It uses the Fetch API to send requests to the specified base URL and includes cookies in the request headers.
 * 
 * @param options - Configuration options for the ServerTransport, including `baseUrl` and `cookieHeader`.
 * @returns A promise resolving to the parsed data as a typed object.
 */
export class ServerTransport extends ApiTransport {
    constructor(private readonly options: ServerTransportOptions) {
        super();
    }

    async request<T>(endpoint: string, init: RequestInit = {}, options: ApiRequestOptions = {}): Promise<T> {
        if (options.retryWithAuth) {
            throw new Error("retryWithAuth is not supported in ServerTransport");
        }

        const response = await fetch(`${this.options.baseUrl}${endpoint}`, {
            ...init,
            cache: init.cache ?? 'no-store',
            headers: {
                ...init.headers,
                'Cookie': this.options.cookieHeader,
            },
        });

        return parseResponse<T>(response);
    }
}