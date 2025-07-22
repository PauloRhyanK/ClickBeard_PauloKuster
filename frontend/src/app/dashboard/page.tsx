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
        <div className="dashboardContainer">
            <NewAppointment role={role} />
            <ListAppointment role={role} />
        </div>
    )

}