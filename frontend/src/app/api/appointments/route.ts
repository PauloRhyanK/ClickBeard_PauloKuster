import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            return NextResponse.json({ error: "Token Required" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const role = searchParams.get("role");
        const date = searchParams.get("date");
        const user = searchParams.get("user");
        const myAppointment = searchParams.get("myAppointment");

        if (!role) {
            return NextResponse.json({
                error: "Role is required"
            }, { status: 400 });
        }

        
        let baseUrl = 'http://localhost:3002/dashboard';
        const params = new URLSearchParams();
        
        const queryDate = date || new Date().toLocaleDateString('pt-BR');
        params.append('date', queryDate);

        let userType = role;
        if (role === 'client') userType = 'client';
        else if (role === 'barber') userType = 'barber';
        else if (role === 'admin') userType = 'admin';
        
        params.append('user_type', userType);
        params.append('user_id', user ?? '');

        if (role === 'client') {
            params.append('myAppointment', 'true');
        }
        
        const fullUrl = `${baseUrl}?${params.toString()}`;
        
        const response = await axios.get(fullUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (response.status >= 200 && response.status < 300) {
            return NextResponse.json(response.data);
        }

        return NextResponse.json({ 
            error: "Failed to fetch appointments" 
        }, { status: response.status });

    } catch (error: any) {
        console.error("Error fetching appointments:", error);
        
        if (error.response) {
            return NextResponse.json({ 
                error: error.response.data?.message || "Failed to fetch appointments",
            }, { status: error.response.status });
        }

        return NextResponse.json({ 
            error: "Internal server error" 
        }, { status: 500 });
    }
}