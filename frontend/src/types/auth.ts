export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id_user: string;
        type_user: string;
    };
}

export interface TokenVerificationRequest {
    token: string;
    user: string;
    role: string;
}