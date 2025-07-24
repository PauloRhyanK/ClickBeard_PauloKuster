import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return NextResponse.json({ error: "Token Required" }, { status: 401 });
        }

        // Pegue os dados do body
        const body = await request.json();
        const { date, hour, email_barber, email_client } = body;

        if (!date || !hour || !email_barber || !email_client) {
            return NextResponse.json({
                error: "All fields are required"
            }, { status: 400 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const response = await axios.post(`${baseUrl}/appointments/cancel`, body, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (response.status >= 200 && response.status < 300) {
            return NextResponse.json(response.data);
        }

        return NextResponse.json({ 
            error: "Failed to cancel appointments",
            message: response.data
        }, { status: response.status });

    } catch (error: unknown) {
        let status = 500;
        let message = "Internal server error";

        if (axios.isAxiosError(error)) {
            status = error.response?.status || 500;
            message = error.response?.data || error.message;
        }

        return NextResponse.json({ 
            error: "Internal server error",
            message
        }, { status });
    }
}