/**
 * Parses the response from the API and returns the data as a typed object.
 * 
 * @param response The response object from the fetch API.
 * @returns A promise resolving to the parsed data as a typed object.
 */
export async function parseResponse<T>(response: Response): Promise<T> {
    const data: unknown = await response.json();

    if (typeof data === "object" && data !== null && !Array.isArray(data)) {
        return {
            ...data,
            status: (data as { status?: number }).status ?? response.status,
        } as T;
    }

    return data as T;
}