import { fetchAvailableHours, fetchNewAppointment } from "@/lib/appoitmentService";
import { BarberSlot, HourSlot, ClientsResponse, HourResponse } from "@/types";
import { fetchClients, } from "@/lib/clientService";
import React, { useState, useEffect } from "react";
import HoursApointment from "./HoursApointment";

interface NewAppointmentProps {
    role: string;
}

const NewAppointment: React.FC<NewAppointmentProps> = ({ role }) => {
    const userRole = role;
    const [hours, setHours] = useState<HourSlot[]>([]);
    const [barbers, setBarbers] = useState<BarberSlot[]>([]);
    const [allBarbers, setAllBarbers] = useState<BarberSlot[]>([]);
    const [specialities, setSpecialities] = useState<string[]>([]);
    const [date, setDate] = useState<Date>(new Date());
    const [clients, setClients] = useState<ClientsResponse[]>([]);

    const [speciality, setSpeciality] = useState<string>("");
    const [selectedBarber, setSelectedBarber] = useState<string>(role === "barber" ? localStorage.getItem("user") || "" : "");
    const [barberEmail, setBarberEmail] = useState<string>("");
    const [hoursSelected, setHoursSelected] = useState<string>("");
    const [client, setClient] = useState<string>("");
    const [clientEmail, setClientEmail] = useState<string>("");

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
        const updateEmail = (email: string) => {
            if(role === "barber"){
                setBarberEmail(email);
            }else if(role === "client"){
                setClientEmail(email);
            }
        }
        updateEmail(user || "");
    }, [role, user, isReady]);

    useEffect(() => {
        const fetchData = async () => {
            if (userRole === "admin" || userRole === "barber") {
                try {
                    const clientsData = await fetchClients(token || "");
                    setClients(clientsData);
                    setIsReady(true);
                } catch (error) {
                    console.error("Erro ao buscar clientes:", error);
                }
            }
        };
        fetchData();
    }, [token, userRole, isReady]);

    const getAllSpecialities = (barbersList: BarberSlot[]): string[] => {
        const allSpecs = new Set<string>();
        barbersList.map(barber => {
            barber.specialities?.forEach(spec => allSpecs.add(spec));
        });
        return Array.from(allSpecs);
    };

    const isBarberAvailable = (barber: BarberSlot, targetHour: string): boolean => {
        if (!Array.isArray(barber.appointments)) return true;
        const reservedHour = barber.appointments.find(h => h.hour === targetHour);
        return !reservedHour;
    };

    useEffect(() => {
        let filteredBarbers = [...allBarbers];
        let availableSpecialities: string[] = [];
        if (selectedBarber) {
            const barber = allBarbers.find(b => b.name === selectedBarber);
            if (barber) {
                setSpecialities(barber.specialities || []);
                setBarbers([barber]);
                return;
            }
        }
        if (speciality) {
            filteredBarbers = filteredBarbers.filter(barber =>
                Array.isArray(barber.specialities) &&
                barber.specialities.includes(speciality)
            );
        }
        if (hoursSelected) {
            filteredBarbers = filteredBarbers.filter(barber =>
                isBarberAvailable(barber, hoursSelected)
            );
        }
        availableSpecialities = getAllSpecialities(filteredBarbers);
        setBarbers(filteredBarbers);
        setSpecialities(availableSpecialities);
    }, [speciality, selectedBarber, hoursSelected, allBarbers]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const availableHours = await fetchAvailableHours({
                    date: date.toISOString().split('T')[0],
                    token: token || "",
                    user: user || "",
                    role: userRole || ""
                });
                const allHours = availableHours.hours || [];
                const allBarbersData = availableHours.barbers.map(barber => ({
                    name: barber.name,
                    email: barber.email,
                    specialities: barber.specialities || [],
                    appointments: barber.appointments || []
                }));
                setHours(allHours);
                setAllBarbers(allBarbersData);
                setBarbers(allBarbersData);

                const allSpecs = getAllSpecialities(allBarbersData);
                setSpecialities(allSpecs);

            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        fetchData();
    }, [date, userRole, token, user]);

    const resetFilters = () => {
        setSpeciality("");
        if(userRole !== "barber") {
            setSelectedBarber("");
        }
        setHoursSelected("");
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!hoursSelected) {
            alert("Selecione um horário");
            return;
        }

        if (!selectedBarber) {
            alert("Selecione um barbeiro");
            return;
        }

        if (!speciality) {
            alert("Selecione uma especialidade");
            return;
        }
        if ((userRole === "admin" || userRole === "barber") && !client) {
            alert("Selecione um cliente");
            return;
        }

        const appointmentData = {
            date: date.toISOString().split('T')[0],
            hour: hoursSelected,
            email_barber: barberEmail,
            email_client: clientEmail,
            speciality: speciality,
            ...(client && { client })
        };

        try {
            const resp = await fetchNewAppointment(appointmentData);
            if(resp.success === true) {
                alert("Agendamento criado com sucesso!");
                resetFilters();
                setClient("");
            }else {
                alert(resp.message || "Erro ao criar agendamento");
            }

        } catch (error: unknown) {
            console.error("Erro ao criar agendamento: ", error);
            alert("Erro ao criar agendamento");
        }
    };

    return (
        <div className="window-color m-3 rounded-2xl flex flex-col items-center justify-start new-appointment-container pt-20 pb-10 pr-10 pl-10">
            <div className="flex flex-col items-start">
                <h2 className="title-lg">Agende um atendimento</h2>
                <p className="p-sm subt-color">Selecione data, horário e informe o nome do barbeiro para criar o agendamento</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-md mt-6">
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="appointmentDate" className="label">Data</label>
                    <input
                        onChange={(e) => setDate(new Date(e.target.value))}
                        className="w-full"
                        type="date"
                        id="appointmentDate"
                        name="appointmentDate"
                        min={new Date().toISOString().split('T')[0]}
                        value={date.toISOString().split('T')[0]}
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <HoursApointment
                        hours={hours}
                        setHour={setHoursSelected}
                        selectedHour={hoursSelected}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="specialities">Selecione a especialidade</label>
                    <select
                        onChange={(e) => setSpeciality(e.target.value)}
                        name="specialities"
                        id="specialities"
                        value={speciality}
                    >
                        <option value="">Todas as especialidades</option>
                        {specialities.map((spec, index) => (
                            <option key={index} value={spec}>
                                {spec.charAt(0).toUpperCase() + spec.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {(userRole === "admin" || userRole === "client") && (
                    <div className="flex flex-col gap-2">
                        <label htmlFor="barber">Selecione o barbeiro</label>
                        <select
                            onChange={(e) => { 
                                const target = e.target as HTMLSelectElement;
                                setSelectedBarber(target.value);
                                setBarberEmail(target.selectedOptions[0].dataset.email || "");
                            }}
                            name="barber"
                            id="barber"
                            value={selectedBarber}
                        >
                            <option value="">Todos os barbeiros</option>
                            {barbers.map((barber, index) => (
                                <option key={index} value={barber.name} data-email={barber.email}>
                                    {barber.name}
                                </option>
                            ))}
                        </select>
                    </div>)}

                {(userRole === "admin" || userRole === "barber") && (
                    <div className="flex flex-col gap-2">
                        <label htmlFor="client">Selecione o cliente</label>
                        <select
                            name="client"
                            id="client"
                            value={client}
                            onChange={(e) => {
                                const target = e.target as HTMLSelectElement;
                                setClient(target.value);
                                setClientEmail(target.selectedOptions[0].dataset.email || "");
                            }}
                            required={userRole === "admin" || userRole === "barber"}
                        >
                            <option value="">Selecione um cliente...</option>
                            {Array.isArray(clients) && clients.map((clientItem, key) => (
                                <option
                                    key={key}
                                    value={clientItem.id_user}
                                    data-email={clientItem.email_user}
                                >
                                    {clientItem.name_user}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="btn-secondary flex-1 border"
                    >
                        Limpar
                    </button>
                    <button
                        type="submit"
                        className="btn-submit flex-1"
                        disabled={
                          !hoursSelected ||
                          ((userRole === "admin" || userRole === "client") && !selectedBarber)
                        }
                    >
                        Agendar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewAppointment;