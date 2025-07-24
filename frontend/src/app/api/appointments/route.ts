import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            return NextResponse.json({ error: "Token Required" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const date = searchParams.get("date");
        const email_user = searchParams.get("email_user");

        if (!email_user) {
            return NextResponse.json({
                error: "Email user is required"
            }, { status: 400 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const params = new URLSearchParams();
        const queryDate = date || new Date().toLocaleDateString('pt-BR');
        params.append('date', queryDate);
        params.append('user_id', email_user ?? '');

        const fullUrl = `${baseUrl}/appointments/list?${params.toString()}`;

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
            error: "Failed to fetch appointments",
            message: response.data
        }, { status: response.status });

    } catch (error: unknown) {
        return NextResponse.json({ 
            error: "Internal server error" 
        }, { status: 500 });
    }
}