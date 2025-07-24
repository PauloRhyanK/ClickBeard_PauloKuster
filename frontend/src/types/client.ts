export interface ClientsResponse {
    id_user: number;
    name_user: string;
    email_user: string;
    age_user?: number;
    created_at: string;
}

export interface ClientFormData {
    name: string;
    email: string;
    password: string;
    type: string;
    appointments: string[];
    date?: string;
    age?: number;
}