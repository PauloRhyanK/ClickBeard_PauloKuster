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
        localStorage.setItem("role", res.data.user.type_user);
        localStorage.setItem("user", res.data.user.id_user);
        
        return res.data;
    } catch (error: any) {
        console.log(error.message);
        throw new Error("Login request failed: " + (error.response?.data?.error || error.message));
    }
}

export async function verifyToken(token: string, user: string, role: string ): Promise<boolean> {
    try {
        const res = await axios.post("/api/token", { token, user, role });
        if (res.status !== 200) {
            throw new Error("Token verification failed");
        }
        return res.data.valid;
    } catch (error) {
        console.error("Token verification failed:", error);
        return false;
    }
}