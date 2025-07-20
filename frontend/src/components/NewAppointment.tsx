import { fetchAvailableHours } from "@/lib/hoursService";
import React, { useState,useEffect } from "react";

interface NewAppointmentProps {
    role: string;
}

interface HoursAppointment{
    hour: string;
    selected: boolean;
}

const NewAppointment: React.FC<NewAppointmentProps> = ({ role }) => {
    const userRole = role;
    const [hours, setHours] = useState<HoursAppointment[]>([]);
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    // const addHour = (hour: HoursAppointment) => {
    //     setHours(prevHours => ([
    //         ...prevHours,
    //         hour
    //     ]));
    // }

    useEffect(() => {
        const fetchHours = async () => {
            try {
                const availableHours = await fetchAvailableHours({ date: new Date().toISOString(), token: token || "", user: user || "", role: userRole });
                // Map the API response to HoursAppointment[]
                const resp = availableHours.hoursDay.map(hour => ({ hour: hour.hour, selected: hour.selected }));
                setHours(resp);
                console.log("Available hours:", resp);
                // If you want to debug, use the availableHours directly:
                alert(JSON.stringify(availableHours.hoursDay));
                alert(JSON.stringify(resp));
            } catch (error) {
                console.error("Failed to fetch available hours:", error);
            }
        };
        fetchHours();
    }, [token, user, userRole]);

    return (
        <div className="window-color m-3 rounded-2xl flex flex-col items-center justify-center new-appointment-container pt-20 pb-10 pr-10 pl-10">
            <div className="flex flex-col items-start">
                <h2 className="title-lg">Agende um atendimento</h2>
                <p className="p-sm subt-color">Selecione data, hoário e informe o nome do barbeiro para criar o agendamento</p>
            </div>  
            <form className="flex flex-col gap-4 w-full max-w-md mt-6">
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="appointmentDate" className="label">Data</label>
                    <input className="w-full" type="date" id="appointmentDate" name="appointmentDate" required />
                </div>
                <div className="flex flex-col gap-2">
                    <HoursApointment hours={hours} setHours={setHours} />
                </div>
                <button type="submit" className="btn-submit">Agendar</button>
           </form>
        </div>
    );
}

export default NewAppointment;