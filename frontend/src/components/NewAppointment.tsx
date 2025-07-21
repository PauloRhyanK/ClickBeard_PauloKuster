import { fetchAvailableHours } from "@/lib/hoursService";
import React, { useState,useEffect } from "react";
import HoursApointment from "./HoursApointment";

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
                const resp = availableHours.hoursDay.map(hour => ({ hour: hour.hour, selected: hour.selected }));
                setHours(resp);
                console.log("Available hours:", resp);
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
            <form className="flex flex-col gap-5 w-full max-w-md mt-6">
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="appointmentDate" className="label">Data</label>
                    <input className="w-full" type="date" id="appointmentDate" name="appointmentDate" required />
                </div>
                <div className="flex flex-col gap-2">
                    <HoursApointment hours={hours} setHours={setHours} />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="specialities">Selecione a especialidade</label>
                    <select name="specilities" id="specilities">
                        <option value="beard">Barba</option>
                        <option value="hair">Cabelo</option>
                        <option value="manicure">Manicure</option>
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="barber">Selecione o barbeiro</label>
                    <select name="barber" id="barber">
                        <option value="fulano">fulano</option>
                        <option value="ciclano">ciclano</option>
                        <option value="beltrano">beltrano</option>
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="client">Selecione o cliente</label>
                    <select name="client" id="client">
                        <option value="fulano">fulano</option>
                        <option value="ciclano">ciclano</option>
                        <option value="beltrano">beltrano</option>
                    </select>
                </div>
                <button type="submit" className="btn-submit">Agendar</button>
           </form>
        </div>
    );
}

export default NewAppointment;