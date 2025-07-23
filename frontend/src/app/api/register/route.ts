import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const body: { name: string; email: string; password: string; type: string; date?: string; appointments?: string[], age: number } = await request.json();
        const req: {
            name_user: string;
            email_user: string; 
            pass_user: string;
            type_user: string;
            age_user?: number;
            hiring_date?: Date;
            appointments?: string[];
        } = {
            name_user: body.name,
            email_user: body.email,
            pass_user: body.password,
            type_user: body.type,
            age_user: body.age,
            hiring_date: body.date ? new Date(body.date) : undefined,
            appointments: body.appointments && body.type == "barber" ? body.appointments : undefined
        };
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const res = await axios.post(`${baseUrl}/users/register`, req);
        if(res.status >= 200 && res.status < 300) {
            return NextResponse.json({ response: res.data, message: "Cadastro realizado com sucesso!" , status: 201});
        }
    }catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return NextResponse.json({
                teste: process.env.NEXT_PUBLIC_API_BASE_URL|| '',
                error: error.response?.data?.error || "Erro de conexão com o backend"
            }, { status: 200 });
        }
        return NextResponse.json({
            error: "Erro interno do servidor"
        }, { status: 200 });
    }

}