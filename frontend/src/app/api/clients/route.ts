import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            return NextResponse.json({ error: "Token Required" }, { status: 401 });
        }

        const baseUrl = 'http://localhost:3002/clients';
        const response = await axios.get(baseUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (response.status >= 200 && response.status < 300) {
            return NextResponse.json({
                success: true,
                clients: response.data.clients || response.data || [],
                message: "Clients fetched successfully"
            });
        }

        return NextResponse.json({ 
            success: false,
            error: "Failed to fetch clients",
            clients: []
        }, { status: response.status });

    } catch (error: any) {
        console.error("Error fetching clients:", error);
        
        if (error.response) {
            return NextResponse.json({ 
                success: false,
                error: error.response.data?.message || "Failed to fetch clients",
                clients: []
            }, { status: error.response.status });
        }

        return NextResponse.json({ 
            success: false,
            error: "Internal server error",
            clients: []
        }, { status: 500 });
    }
}