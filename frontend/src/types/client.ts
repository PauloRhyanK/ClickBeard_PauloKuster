export interface Client {
    id: string;
    name: string;
}

export interface ClientsResponse {
    success: boolean;
    clients: Client[];
    message?: string;
}