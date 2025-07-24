import { fetchAppointments, cancelAppointment } from "@/lib/appoitmentService";
import { AppointmentData } from "@/types";
import { useEffect, useState } from "react";

const ListAppointment = ({ role, email }: { role: string, email: string }) => {
    const isClient = role === "client";
    const isBarber = role === "barber";
    const isAdmin = role === "admin";

    const [appointments, setAppointments] = useState<AppointmentData[]>([]);
    const [historical, setHistorical] = useState<AppointmentData[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const handleCancelAppointment = async (hour: string, date: string, email_barber: string, email_client: string) => {
        alert("Canceling appointment...");
        try {
            const response = await cancelAppointment(date, hour, email_barber, email_client);
            if (response.success !== true){
                console.error("Error canceling appointment: " + JSON.stringify(response));
            }else {
                setAppointments(prev => prev.filter(app => app.hour !== hour || app.date !== date || app.barber.email !== email_barber));
                alert("Appointment canceled successfully");
            }
        } catch (error) {
            alert("Erro ao cancelar atendimento");
            console.error("Error canceling appointment:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchAppointments(selectedDate, email);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const futureAppointments: AppointmentData[] = [];
                const pastAppointments: AppointmentData[] = [];

                if (isBarber || isAdmin) {
                    setAppointments(response as AppointmentData[]); return;
                } else if (isClient) {
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
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };
        fetchData();
    }, [role, selectedDate]);

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
                    <div className="flex justify-between items-end pt-20 pb-10">
                        <div className="flex flex-col items-start">
                            <h2 className="title-lg">Seus agendamentos</h2>
                            <p className="p-sm subt-color">Aqui você pode visualizar seus horários marcados.</p>
                        </div>
                        <div>
                            <a href="/login" className="text-sm link mx-2">Sair</a>
                        </div>
                    </div>
                    <ul>
                        {appointments.length > 0 ? (
                            appointments.map((appointment: AppointmentData, index) => (
                                <li key={index} className="itemAppointmentClient flex flex-col mb-5">
                                    <div className="itemHeader flex justify-between items-center p-md p-5">
                                        <strong>{formatDate(appointment.date)}</strong>
                                        <span>{appointment.hour}</span>
                                    </div>
                                    <div className="itemData p-md pt-10 pb-10 pl-7 pr-7">
                                        <strong>{appointment.hour}</strong>
                                        <span className="">{appointment.barber.name}</span>
                                        <span>{appointment.speciality.join(", ")}</span>
                                        <strong onClick={() => handleCancelAppointment(appointment.hour, appointment.date, appointment.barber.email, email)} className="flex justify-end cursor-pointer">X</strong>
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
                                        <span className="">{appointment.barber.name}</span>
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
        const groupAppointmentsByPeriod = (appointments: AppointmentData[] | undefined | null) => {
            const periods = {
                morning: [] as AppointmentData[],
                afternoon: [] as AppointmentData[],
                night: [] as AppointmentData[]
            };

            (Array.isArray(appointments) ? appointments : []).forEach(appointment => {
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
            <div>
                <section className="pr-10 pl-20">
                    <div className="flex justify-between items-end pt-20 pb-10">
                        <div className="flex flex-col items-start">
                            <h2 className="title-lg">{isBarber ? "Seus atendimentos" : "Agendamentos"}</h2>
                            <p className="p-sm subt-color">Aqui você pode visualizar os horários marcados.</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <a href="/login" className="text-sm link mx-2">Sair</a>
                            <input
                                type="date"
                                name="appointmentDate"
                                id="appointmentDate"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        </div>
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
                                        <span className="">{appointment.client?.name || "Cliente"}</span>
                                        <span>{appointment.speciality}</span>
                                        {role === "admin" && (
                                            <>
                                                <span>{appointment.barber.name}</span>
                                                <strong onClick={() => handleCancelAppointment(appointment.hour, appointment.date, appointment.barber.email, email)} className="close flex justify-end cursor-pointer">X</strong>
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
                                        <span className="">{appointment.client?.name || "Cliente"}</span>
                                        <span>{appointment.speciality.join(", ")}</span>
                                        {role === "admin" && (
                                            <>
                                                <span>{appointment.barber.name}</span>
                                                <strong onClick={() => handleCancelAppointment(appointment.hour, appointment.date, appointment.barber.email, email)} className="close flex justify-end cursor-pointer">X</strong>
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
                                        <span className="">{appointment.client?.name || "Cliente"}</span>
                                        <span>{appointment.speciality.join(", ")}</span>
                                        {role === "admin" && (
                                            <>
                                                <span>{appointment.barber.name}</span>
                                                <strong onClick={() => handleCancelAppointment(appointment.hour, appointment.date, appointment.barber.email, email)} className="close flex justify-end cursor-pointer">X</strong>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </li>
                        )}
                    </ul>
                </section>
            </div>
        );
    }

    return null;
}

export default ListAppointment;