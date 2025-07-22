import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            return NextResponse.json({ error: "Token Required" }, { status: 401 });
        }

        const body = await request.json();
        const { date, hour, barber, speciality, role } = body;

        if (!date || !hour || !barber || !role) {
            return NextResponse.json({ 
                error: "Missing required fields" 
            }, { status: 400 });
        }

        const formattedDate = new Date(date).toISOString().slice(0, 10);
        const appointmentData = {
            date: formattedDate,
            hour,
            barber,
            speciality: speciality || "",
            role
        };

        const baseUrl = 'http://localhost:3002/appointments';
        const response = await axios.post(baseUrl, appointmentData, {
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

    } catch (error: any) {;
        if (error.response) {
            return NextResponse.json({ 
                success: false,
                error: error.response.data?.message || "Failed to create appointment",
            }, { status: error.response.status });
        }

        return NextResponse.json({ 
            success: false,
            error: "Internal server error" 
        }, { status: 500 });
    }
}