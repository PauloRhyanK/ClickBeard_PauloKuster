import axios from "axios";
import { LoginResponse } from "@/types";

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
    email = email.trim();
    password = password.trim();
    if (!email) {
        throw new Error("Email é obrigatório");
    }
    if (!email.includes("@")) {
        throw new Error("Email deve ter formato válido");
    }
    if (password.length < 3) {
        throw new Error("Senha deve ter pelo menos 3 caracteres");
    }
    if (!password) {
        throw new Error("Senha é obrigatória");
    }
    try {
        const res = await axios.post("/api/login", {email, password});
        console.log(res.data);
        
        if(res.data.error){
            throw new Error("Login failed: " + res.data.error);
        }
        
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);
        localStorage.setItem("user", res.data.user.email);
        localStorage.setItem("userName", res.data.user.name);
        
        return res.data;
    } catch (error: unknown) {
        console.error("Login request failed:", error);
        throw new Error("Ath" + (error instanceof Error ? ": " + error.message : "SemDetalhes"));
    }
}