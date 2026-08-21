import { printd } from "@/utils/debugUtils";
import { ApiModule } from "./apiModule";
import type { ApiTransport } from "./transport";
import type { ChangePasswordResponse, GetProfileResponse, GetVerificationCodeResponse, LoginResponse, LogoutResponse, RefreshTokenResponse, SignUpResponse, VerifyOtpResponse } from "./types";

/**
 * AuthenticationApi provides operations for the authentication API.
 * It provides methods for user login, signup, verification, password management, and profile retrieval.
 * 
 * @param transport - An instance of `ApiTransport` for making HTTP requests.
 * @param path - The base path for the authentication API. Defaults to "/api/auth".
 */
class AuthenticationApi extends ApiModule {
    constructor(transport: ApiTransport, path: string = "/api/auth") {
        super(transport, path);
    }

    public async login(email: string, password: string): Promise<LoginResponse> {
        const result = await this.transport.post<LoginResponse>(this.endpoint("login"), {
            email: email,
            password: password,
        });

        printd("@services/apiClient/auth.ts", "login response:", result);
        return result;
    }

    public async signUp(username: string, email: string, password: string, confirmPassword: string): Promise<SignUpResponse> {
        const result = await this.transport.post<SignUpResponse>(this.endpoint("register"), {
            userData: {
                username: username,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
            }
        });

        return result;
    }

    public async getVerificationCode(email: string): Promise<GetVerificationCodeResponse> {
        const result = await this.transport.post<GetVerificationCodeResponse>(this.endpoint("request-otp"), {
            email: email,
        });

        return result;
    }

    public async verifyCode(email: string, code: string): Promise<VerifyOtpResponse> {
        const result = await this.transport.post<VerifyOtpResponse>(this.endpoint("verify-otp"), {
            email: email,
            inputOTP: code,
        });

        return result;
    }

    public async logout(): Promise<LogoutResponse> {
        const result = await this.transport.post<LogoutResponse>(this.endpoint("logout"), {});

        return result;
    }

    public async changePassword(oldPassword: string, newPassword: string, newConfirmPassword: string): Promise<ChangePasswordResponse> {
        const result = await this.transport.post<ChangePasswordResponse>(this.endpoint("change-password"), {
            oldPassword: oldPassword,
            newPassword: newPassword,
            newConfirmPassword: newConfirmPassword
        });

        return result;
    }

    public async refreshToken(): Promise<RefreshTokenResponse> {
        const result = await this.transport.post<RefreshTokenResponse>(this.endpoint("refresh-token"), {});
        
        return result;
    }

    public async verifyNewPassword(email: string, newPassword: string, newConfirmPassword: string, otp?: string): Promise<ChangePasswordResponse> {
        const result = await this.transport.post<ChangePasswordResponse>(this.endpoint("reset-password"), {
            email: email,
            newPassword: newPassword,
            newConfirmPassword: newConfirmPassword,
            // otp: otp
        });

        return result;
    }

    public async getProfile(): Promise<GetProfileResponse> {
        const result = await this.transport.get<GetProfileResponse>(this.endpoint("me"));

        return result;
    }
}

export { AuthenticationApi };
