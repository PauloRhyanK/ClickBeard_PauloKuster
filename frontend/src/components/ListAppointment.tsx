import { AppointmentData, fetchAppointments } from "@/lib/appoitmentService";
import { useEffect, useState } from "react";

const ListAppointment = ({ role }: { role: string }) => {
    const isClient = role === "client";
    const isBarber = role === "barber";
    const isAdmin = role === "admin";
    
    const [appointments, setAppointments] = useState<AppointmentData[]>([]);
    const [historical, setHistorical] = useState<AppointmentData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchAppointments(role);
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Zerar horas para comparar apenas a data
                
                const futureAppointments: AppointmentData[] = [];
                const pastAppointments: AppointmentData[] = [];
                
                response.forEach((appointment) => {
                    const appointmentDate = new Date(appointment.date);
                    appointmentDate.setHours(0, 0, 0, 0);
                    
                    if (appointmentDate >= today) {
                        futureAppointments.push(appointment);
                    } else {
                        pastAppointments.push(appointment);
                    }
                });
                
                setAppointments(futureAppointments);
                setHistorical(pastAppointments);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };        
        fetchData();
    }, [role]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { 
            day: 'numeric', 
            month: 'long' 
        });
    };

    if (isClient) {
        return (
            <div>
                <section className="pr-10 pl-20">
                    <div className="flex flex-col items-start pt-20 pb-10">
                        <h2 className="title-lg">Seus agendamentos</h2>
                        <p className="p-sm subt-color">Aqui você pode visualizar seus horários marcados.</p>
                    </div>
                    <ul>
                        {appointments.length > 0 ? (
                            appointments.map((appointment, index) => (
                                <li key={index} className="itemAppointmentClient flex flex-col mb-5">
                                    <div className="itemHeader flex justify-between items-center p-md p-5">
                                        <strong>{formatDate(appointment.date)}</strong>
                                        <span>{appointment.hour}</span>
                                    </div>
                                    <div className="itemData p-md pt-10 pb-10 pl-7 pr-7">
                                        <strong>{appointment.hour}</strong>
                                        <span className="">{appointment.barber}</span>
                                        <span>{appointment.speciality}</span>
                                        <strong className="flex justify-end">X</strong>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p className="p-md">Nenhum agendamento encontrado.</p>
                        )}
                    </ul>
                </section>
                
                <section className="pr-10 pl-20">
                    <div className="flex justify-between items-end pt-20 pb-10">
                        <div className="flex flex-col items-start">
                            <h2 className="title-lg">Seu histórico</h2>
                            <p className="p-sm subt-color">Aqui você pode visualizar seus atendimentos passados.</p>
                        </div>
                    </div>
                    <ul>
                        {historical.length > 0 ? (
                            historical.map((appointment, index) => (
                                <li key={index} className="itemHistoricClient flex flex-col mb-5">
                                    <div className="itemHeader flex justify-between items-center p-md p-5">
                                        <strong>{formatDate(appointment.date)}</strong>
                                        <span>{appointment.hour}</span>
                                    </div>
                                    <div className="itemData p-md pt-10 pb-10 pl-7 pr-7">
                                        <strong>{appointment.hour}</strong>
                                        <span className="">{appointment.barber}</span>
                                        <span>{appointment.speciality}</span>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p className="p-md">Nenhum histórico encontrado.</p>
                        )}
                    </ul>
                </section>
            </div>
        );
    } else if (isBarber || isAdmin) {
        const groupAppointmentsByPeriod = (appointments: AppointmentData[]) => {
            const periods = {
                morning: [] as AppointmentData[],
                afternoon: [] as AppointmentData[],
                night: [] as AppointmentData[]
            };
            
            appointments.forEach(appointment => {
                const hour = parseInt(appointment.hour.split(':')[0]);
                if (hour < 12) {
                    periods.morning.push(appointment);
                } else if (hour < 18) {
                    periods.afternoon.push(appointment);
                } else {
                    periods.night.push(appointment);
                }
            });
            
            return periods;
        };

        const groupedAppointments = groupAppointmentsByPeriod(appointments);
        
        return (
            <section className="pr-10 pl-20">
                <div className="flex justify-between items-end pt-20 pb-10">
                    <div className="flex flex-col items-start">
                        <h2 className="title-lg">{isBarber ? "Seus atendimentos" : "Agendamentos"}</h2>
                        <p className="p-sm subt-color">Aqui você pode visualizar os horários marcados.</p>
                    </div>
                    <input type="date" name="appointmentDate" id="appointmentDate" />
                </div>
                <ul>
                    {groupedAppointments.morning.length > 0 && (
                        <li className={(role === "barber" ? "itemAppointmentBarber" : "itemAppointmentAdmin") + " flex flex-col mb-5 pb-10"}>
                            <div className="itemHeader flex justify-between items-center p-md p-5">
                                <span>
                                    <img src="/icon/morning.svg" alt="Print" className="inline-block w-6 h-6 mr-2" />
                                    Manhã
                                </span>
                                <span>08h-12h</span>
                            </div>
                            {groupedAppointments.morning.map((appointment, index) => (
                                <div key={index} className="itemData p-md pt-10 pl-7 pr-7">
                                    <strong>{appointment.hour}</strong>
                                    <span className="">{appointment.client || "Cliente"}</span>
                                    <span>{appointment.speciality}</span>
                                    {role === "admin" && (
                                        <>
                                            <span>{appointment.barber}</span>
                                            <strong className="close flex justify-end">X</strong>
                                        </>
                                    )}
                                </div>
                            ))}
                        </li>
                    )}
                    
                    {groupedAppointments.afternoon.length > 0 && (
                        <li className={(role === "barber" ? "itemAppointmentBarber" : "itemAppointmentAdmin") + " flex flex-col mb-5 pb-10"}>
                            <div className="itemHeader flex justify-between items-center p-md p-5">
                                <span>
                                    <img src="/icon/afternoon.svg" alt="Print" className="inline-block w-6 h-6 mr-2" />
                                    Tarde
                                </span>
                                <span>12h-18h</span>
                            </div>
                            {groupedAppointments.afternoon.map((appointment, index) => (
                                <div key={index} className="itemData p-md pt-10 pl-7 pr-7">
                                    <strong>{appointment.hour}</strong>
                                    <span className="">{appointment.client || "Cliente"}</span>
                                    <span>{appointment.speciality}</span>
                                    {role === "admin" && (
                                        <>
                                            <span>{appointment.barber}</span>
                                            <strong className="close flex justify-end">X</strong>
                                        </>
                                    )}
                                </div>
                            ))}
                        </li>
                    )}
                    
                    {groupedAppointments.night.length > 0 && (
                        <li className={(role === "barber" ? "itemAppointmentBarber" : "itemAppointmentAdmin") + " flex flex-col mb-5 pb-10"}>
                            <div className="itemHeader flex justify-between items-center p-md p-5">
                                <span>
                                    <img src="/icon/night.svg" alt="Print" className="inline-block w-6 h-6 mr-2" />
                                    Noite
                                </span>
                                <span>18h-22h</span>
                            </div>
                            {groupedAppointments.night.map((appointment, index) => (
                                <div key={index} className="itemData p-md pt-10 pl-7 pr-7">
                                    <strong>{appointment.hour}</strong>
                                    <span className="">{appointment.client || "Cliente"}</span>
                                    <span>{appointment.speciality}</span>
                                    {role === "admin" && (
                                        <>
                                            <span>{appointment.barber}</span>
                                            <strong className="close flex justify-end">X</strong>
                                        </>
                                    )}
                                </div>
                            ))}
                        </li>
                    )}
                    
                    {appointments.length === 0 && (
                        <p className="p-md">Nenhum agendamento encontrado.</p>
                    )}
                </ul>
            </section>
        );
    }

    return null;
}

export default ListAppointment;