import type { ApiTransport } from "./transport";

/**
 * ApiModule is an abstract base class for API modules that provides a common structure for making HTTP requests to specific API endpoints.
 * It requires an instance of `ApiTransport` for making HTTP requests and a base path for the API endpoints.
 * 
 * @param transport - An instance of `ApiTransport` for making HTTP requests.
 * @param path - The base path for the API endpoints.
 */
export abstract class ApiModule {
    constructor(
        protected readonly transport: ApiTransport,
        protected readonly path: string
    ) {}

    /**
     * Constructs the full endpoint URL by combining the base path and the relative path.
     * 
     * @param relativePath - The relative path for the endpoint.
     * @returns The full endpoint URL.
     */
    protected endpoint(relativePath: string): string {
        return `${this.path}/${relativePath}`;
    }
}