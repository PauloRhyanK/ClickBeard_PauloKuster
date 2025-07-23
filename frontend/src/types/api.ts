export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    page: number;
    totalPages: number;
    totalItems: number;
}