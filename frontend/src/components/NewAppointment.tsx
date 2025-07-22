import { fetchAvailableHours, fetchNewAppointment, BarberSlot, HourSlot } from "@/lib/appoitmentService";
import { fetchClients, Client } from "@/lib/clientService";
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
    const [clients, setClients] = useState<Client[]>([]);

    const [speciality, setSpeciality] = useState<string>("");
    const [selectedBarber, setSelectedBarber] = useState<string>("");
    const [hoursSelected, setHoursSelected] = useState<string>("");
    const [client, setClient] = useState<string>("");

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");


    useEffect(() => {
        const fetchData = async () => {
            if (userRole === "admin" || userRole === "barber") {
                try {
                    const clientsData = await fetchClients(token || "");
                    setClients(clientsData);
                } catch (error) {
                    console.error("Erro ao buscar clientes:", error);
                }
            }
        };
        fetchData();
    }, [token, userRole]);

    const getAllSpecialities = (barbersList: BarberSlot[]): string[] => {
        const allSpecs = new Set<string>();
        barbersList.forEach(barber => {
            if (Array.isArray(barber.specialities)) {
                barber.specialities.forEach(spec => allSpecs.add(spec));
            }
        });
        return Array.from(allSpecs);
    };

    const isBarberAvailable = (barber: BarberSlot, targetHour: string): boolean => {
        if (!Array.isArray(barber.hours)) return true;
        const reservedHour = barber.hours.find(h => h.hour === targetHour);
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
                    date: date.toISOString(), 
                    token: token || "", 
                    user: user || "", 
                    role: userRole 
                });
                const allHours = availableHours.hoursDay.map(hour => ({
                    hour: hour.hour,
                    selected: hour.selected
                }));
                const allBarbersData = availableHours.barbers.map(barber => ({
                    name: barber.name,
                    specialities: barber.specialities || [],
                    hours: barber.hours || [] 
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
        setSelectedBarber("");
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
            barber: selectedBarber,
            speciality: speciality,
            role: userRole,
            ...(client && { client })
        };

        try {
            const resp = await fetchNewAppointment(appointmentData);
            
            if (resp.success) {
                alert("Agendamento criado com sucesso!");
                resetFilters();
                setClient(""); 
            } else {
                alert(resp.message || "Erro ao criar agendamento");
            }
        } catch (error: any) {
            alert(error.message || "Erro ao criar agendamento");
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
                        onChange={(e) => setSelectedBarber(e.target.value)} 
                        name="barber" 
                        id="barber"
                        value={selectedBarber}
                    >
                        <option value="">Todos os barbeiros</option>
                        {barbers.map((barber, index) => (
                            <option key={index} value={barber.name}>
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
                            onChange={(e) => setClient(e.target.value)}
                            required={userRole === "admin" || userRole === "barber"}
                        >
                            <option value="">Selecione um cliente...</option>
                            {clients.map((clientItem, key) => (
                                <option key={key} value={clientItem.id}>
                                    {clientItem.name}
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
                        disabled={!hoursSelected || !selectedBarber}
                    >
                        Agendar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewAppointment;