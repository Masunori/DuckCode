export type ApiRequestOptions = {
    retryWithAuth?: boolean;
}

/**
 * ApiTransport is an abstract class that defines the interface for making API requests.
 * It provides methods for sending GET, POST, PUT, and DELETE requests to a specified endpoint.
 */
export abstract class ApiTransport {
    constructor() {}

    abstract request<T>(
        endpoint: string,
        init?: RequestInit,
        clientOptions?: ApiRequestOptions
    ): Promise<T>;

    get<T>(endpoint: string, init?: RequestInit, clientOptions?: ApiRequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...init, method: 'GET' }, clientOptions);
    }

    post<T>(endpoint: string, body: unknown, init?: RequestInit, clientOptions?: ApiRequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...init, method: 'POST', body: JSON.stringify(body) }, clientOptions);
    }

    put<T>(endpoint: string, body: unknown, init?: RequestInit, clientOptions?: ApiRequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...init, method: 'PUT', body: JSON.stringify(body) }, clientOptions);
    }

    delete<T>(endpoint: string, init?: RequestInit, clientOptions?: ApiRequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...init, method: 'DELETE' }, clientOptions);
    }
}