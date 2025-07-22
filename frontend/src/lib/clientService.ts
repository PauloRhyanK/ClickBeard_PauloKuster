import axios from "axios";
import { Client, ClientsResponse } from "@/types";

export async function fetchClients(token: string): Promise<Client[]> {
    if (!token) {
        throw new Error("Token is required");
    }
    
    try {
        const response = await axios.get('/api/clients', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        const data = response.data as ClientsResponse;
        
        if (data.success) {
            return data.clients || [];
        } else {
            throw new Error(data.message || "Failed to fetch clients");
        }
    } catch (error: any) {
        console.error("Error fetching clients:", error);
        
        if (error.response?.status === 401) {
            throw new Error("Token expirado ou inválido");
        }
        
        throw new Error("Falha ao buscar clientes");
    }
}