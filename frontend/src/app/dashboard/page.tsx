"use client"

import { verifyToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import NewAppointment from "@/components/NewAppointment";
import ListAppointment from "@/components/ListAppointment";

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
        <>
        <img className="absolute w-50 h-13 top-2 left-2" src="/clickbeader_logo.webp" alt="ClickBeader Logo" />
        <div className="dashboardContainer">
            <NewAppointment role={role} />
            <ListAppointment role={role} />
        </div>
        </>
    )

}