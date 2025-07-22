import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const date = searchParams.get("date");
        const user = searchParams.get("user");
        const role = searchParams.get("role");
        const token = request.headers.get("Authorization")?.replace("Bearer ", "");
        if (!date || !user || !role) {
            return NextResponse.json({ error: "Missing or invalid parameters" }, { status: 400 });
        }if(!token){
            return NextResponse.json({ error: "Token Required" }, { status: 400 });
        }

        const formattedDate = date ? new Date(date).toISOString().slice(0, 10) : "";
        let baseUrl = 'http://localhost:3002/dashboard?date=' + formattedDate ;     
        baseUrl += `&barber_id=${user}&role=${role}`;
        const response = await axios.get(baseUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        if (response.status >= 200 && response.status < 300) {
            return NextResponse.json(response.data);
        }
        return NextResponse.json({ error: "Failed to fetch hours" }, { status: response.status });
    } catch (error: any) {
        console.error(`Status: ${(error as any).status} Error fetching hours:`, error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}