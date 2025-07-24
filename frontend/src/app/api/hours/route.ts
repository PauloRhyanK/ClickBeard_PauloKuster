import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const date = searchParams.get("date");
        const token = request.headers.get("Authorization")?.replace("Bearer ", "");
        if (!date) {
            return NextResponse.json({ error: "Missing or invalid parameters" }, { status: 400 });
        }if(!token){
            return NextResponse.json({ error: "Token Required" }, { status: 400 });
        }

        const formattedDate = date ? new Date(date).toISOString().slice(0, 10) : "";
        const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/hours?date=${formattedDate}`;
        const response = await axios.get(baseUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        if (response.status >= 200 && response.status < 300) {
            return NextResponse.json(response.data);
        }
        return NextResponse.json({ error: "Failed to fetch hours", details: response.data }, { status: response.status });
    } catch (error: unknown) {
        return NextResponse.json({ error: "Internal server error", details: error }, { status: 500 });
    }
}