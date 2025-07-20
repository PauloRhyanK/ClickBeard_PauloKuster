import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        
        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { error: "Email é obrigatório" }, 
                { status: 400 }
            );
        }
        
        if (!password || typeof password !== 'string') {
            return NextResponse.json(
                { error: "Senha é obrigatória" }, 
                { status: 400 }
            );
        }
        const sanitizedEmail = email.trim().toLowerCase();
        const sanitizedPassword = password.trim();
        
        if (sanitizedPassword.length < 3) {
            return NextResponse.json(
                { error: "Senha muito curta" }, 
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitizedEmail)) {
            return NextResponse.json(
                { error: "Formato de email inválido" }, 
                { status: 400 }
            );
        }
        
        
        const response = await axios.post('http://localhost:3002/login', { 
            email: sanitizedEmail, 
            password: sanitizedPassword 
        });
        
        if (response.status === 200) {
            const data = response.data;
            return NextResponse.json(data);
        }
        
    } catch (error: any) {        
        if (axios.isAxiosError(error)) {
            return NextResponse.json({
                "error": "Erro de conexão com backend"
            }, { status: 500 });
        }
        
        return NextResponse.json({
            "error": "Erro interno do servidor"
        }, { status: 500 });
    }

    return NextResponse.json({
        "error": "Credenciais inválidas"
    });
}