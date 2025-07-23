import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    let body: { name: string; email: string; password: string; type: string; date?: string; appointments?: string[] };
    try {
        body = await request.json();
        const { name, email, password, type, date, appointments } = body
        const res = await axios.post("http://localhost:3002/register", { name, email, password, type, date, appointments });
        if(res.status >= 200 && res.status < 300) {            
            return NextResponse.json({ response: res.data, message: "Cadastro realizado com sucesso!" });
        }
    }catch (error: unknown) {
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