import axios from "axios";
import { ClientsResponse } from "@/types";

export async function fetchClients(token: string): Promise<ClientsResponse[]> {
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

        const data = response.data as ClientsResponse[];
        
        if (data) {
            return data || [];
        } else {
            throw new Error("Failed to fetch clients");
        }
    } catch (error: unknown) {
        console.error("Error fetching clients:", error);
        throw new Error("Failed to fetch clients");
    }
}