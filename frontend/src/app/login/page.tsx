"use client";

import { loginUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    async function handleLogin(e: React.FormEvent){
        e.preventDefault();
        try{    
            await loginUser(email, password); 
            router.push('/dashboard');
        } catch (error) {
            alert(error);
            console.error("Login failed:", error);
        }
    }
    
    return <>
        <header className="m-5 mt-10">
            <Image className="m-auto" src="/clickbeader_logo.webp" alt="Logo Clickbeard" width={150} height={38} />
        </header>
        <main className="flex justify-center">
            <form onSubmit={handleLogin} className="main-container window-color m-auto flex flex-col radius-lg p-10 rounded-xl gap-6">
                <section>
                    <h1 className="title-lg ">
                        Atendimento Rápido
                    </h1>
                    <p className="p-sm subt-color">Para Continuar preencha os campos com dados de usuário</p>
                </section>
                <div className="flex flex-col gap-2">
                    <label className="label title-md" htmlFor="email_usuas">Login</label>
                    <input type="email" name="email_usuas" id="email_usuas" placeholder="Insira seu Email" onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="label" htmlFor="password_usuas">Senha</label>
                    <input type="password" name="password_usuas" id="password_usuas" placeholder="Insira sua Senha" onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="flex justify-between">
                    <button className="w-full text-sm" type="submit">Entrar</button>
                </div>
                <div className="p-sm">
                    Não tem conta?<a className="text-sm link mx-2" href="/register">Cadastrar-se aqui</a>
                </div>
            </form>
        </main>

    </>
}
