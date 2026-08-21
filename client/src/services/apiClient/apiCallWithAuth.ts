import { printd } from "@/utils/debugUtils";

const MAX_RETRY_COUNT = 1;

type RefreshResponse = {
    status: number;
};

type RefreshSession = () => Promise<RefreshResponse>;

let refreshPromise: Promise<RefreshResponse> | null = null;

export class SessionExpiredError extends Error {
    constructor() {
        super("Session expired. Please log in again.");
        this.name = "SessionExpiredError";
    }
}

export async function tryApiCallWithAuth<T>(
    apiCall: () => Promise<T>,
    refreshSession: RefreshSession,
    onSessionExpired: () => void = () => {},
    retryCount = MAX_RETRY_COUNT
): Promise<T> {
    const response = await apiCall();
    
    // Check if response has a status property (indicating an API response)
    const status = (response as any)?.status;
    
    if (status === 401 && retryCount > 0) {
        printd("@/services/apiClient/apiCallWithAuth", `Got 401, attempting token refresh`);
        
        if (!refreshPromise) {
            refreshPromise = refreshSession().finally(() => {
                refreshPromise = null;
            });
        }

        try {
            const refreshResponse = await refreshPromise;

            if (refreshResponse.status < 200 || refreshResponse.status >= 300) {
                throw new SessionExpiredError();
            }
        } catch (error) {
            onSessionExpired();
            throw error;
        }

        return tryApiCallWithAuth(apiCall, refreshSession, onSessionExpired, retryCount - 1);
    }
    
    return response;
}
