import { printd } from "../utils/debugUtils";
import { refresh } from "./user";

const MAX_RETRY_COUNT = 1;
let refreshPromise: Promise<Response> | null = null;

export async function tryApiCallWithAuth<T>(apiCall: () => Promise<T>, retryCount = MAX_RETRY_COUNT): Promise<T> {
    const response = await apiCall();
    
    // Check if response has a status property (indicating an API response)
    const status = (response as any)?.status;
    
    if (status === 401 && retryCount > 0) {
        printd("@/lib/apiClient/apiCallWithAuth", `Got 401, attempting token refresh`);
        
        if (!refreshPromise) {
            refreshPromise = refresh().finally(() => {
                refreshPromise = null;
            });
        }

        try {
            const refreshResponse = await refreshPromise;

            if (!refreshResponse.ok) {
                window.location.href = "/portal";
                throw new Error('Session expired. Please log in again.');
            }
        } catch (error) {
            window.location.href = "/portal";
            throw error;
        }

        return tryApiCallWithAuth(apiCall, retryCount - 1);
    }
    
    return response;
}