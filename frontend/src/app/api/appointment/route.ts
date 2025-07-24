import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            return NextResponse.json({ error: "Token Required" }, { status: 401 });
        }

        const body = await request.json();
        const { date, hour, email_barber, email_client, speciality } = body;

        if (!date || !hour || !email_barber || !email_client || !speciality) {
            return NextResponse.json({ 
                error: "Missing required fields" 
            }, { status: 400 });
        }

        const formatDateToISO = (dateString: string): string => {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        };

        const formattedDate = formatDateToISO(date);
        const appointmentData = {
            date: formattedDate,
            hour,
            email_barber,
            email_client,
            speciality: speciality || "",
        };

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const response = await axios.post(`${baseUrl}/appointments`, appointmentData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (response.status >= 200 && response.status < 300) {
            return NextResponse.json({
                success: true,
                message: "Appointment created successfully",
                data: response.data
            });
        }

        return NextResponse.json({ 
            success: false,
            error: "Failed to create appointment" 
        }, { status: response.status });

    } catch (error: unknown) {
        return NextResponse.json({ 
            success: false,
            error: "Internal server error: " + ( error ?? "Unknown error"),
            debug: error
        }, { status: 500 });
    }
}

