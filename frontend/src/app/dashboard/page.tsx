"use client"

import { verifyToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import "./dashboard.module.css";
import NewAppointment from "@/components/NewAppointment";

export default function Dashboard() {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");
    const Router = useRouter();

    if (!token || !user || !role || !verifyToken(token, user, role)) {
        Router.push('/login');
        return null;
    }

    return <>
    <NewAppointment role={role}/>
    <div>teste2</div>
    
    </>;
}