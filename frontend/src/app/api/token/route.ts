import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const [token, user, role] = await request.json();
        const res = await axios.post("http://localhost:3002/token", {token, user, role});
        if(res.status >= 200 && res.status < 300) {            
            return NextResponse.json({ response: res.data, message: "Token Válido!" });
        }
    }catch (error: any) {
        if (axios.isAxiosError(error)) {
            return NextResponse.json({
                error: error.response?.data?.error || "Erro de conexão com o backend"
            }, { status: 500 });
        }
        return NextResponse.json({
            error: "Erro interno do servidor"
        }, { status: 500 });
    }

}