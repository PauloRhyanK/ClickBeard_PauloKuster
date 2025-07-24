export interface Client {
    id: string;
    name: string;
}

export interface ClientsResponse {
    success: boolean;
    clients: Client[];
    message?: string;
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