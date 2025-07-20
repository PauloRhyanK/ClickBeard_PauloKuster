"use client"

import { verifyToken } from "@/lib/auth";
import { useRouter } from "next/navigation";


export default function Dashboard() {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");
    const Router = useRouter();

    if (!token || !user || !role || !verifyToken(token, user, role)) {
        Router.push('/login');
        return null;
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <h1 className="text-2xl font-bold">Bem-vindo ao Dashboard!</h1>
        </div>
        
    );
}