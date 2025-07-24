"use client"

import { useRouter } from "next/navigation";
import NewAppointment from "@/components/NewAppointment";
import ListAppointment from "@/components/ListAppointment";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const Router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
        setUser(localStorage.getItem("user"));
        setRole(localStorage.getItem("role"));
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (isReady) {
            if (!token || !user || !role) {
                Router.push('/login');
            }
        }
    }, [token, user, role, isReady]);

    if (!isReady) return null; 

    return (
        <>
            <img className="absolute w-50 h-13 top-2 left-2" src="/clickbeader_logo.webp" alt="ClickBeader Logo" />
            <div className="dashboardContainer">
                <NewAppointment role={role ?? ""} />
                <ListAppointment role={role ?? ""} email={user ?? ""} />
            </div>
        </>
    );
}