import axios from "axios";
import { 
    BarberSlot, 
    NewAppointmentResponse, 
    CreateAppointmentData, 
    AppointmentData,
    CreateAppointmentRequest 
} from "@/types";

interface HourRequest {
    date: string;
    token: string;
    user: string;
    role: string;
}

export async function fetchAvailableHours({ date, token, user, role }: HourRequest): Promise<NewAppointmentResponse> {
    if (!date) {
        throw new Error("Date is required");
    }
    if (!token) {
        throw new Error("Token is required");
    }
    if (!user) {
        throw new Error("User is required");
    }
    let baseUrl = '/api/hours?date=' + new Date(date).toISOString().slice(0, 10) + `&user=${user}&role=${role}`;
    try {
        const response = await axios.get(baseUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching hours:", error);
        throw new Error("Failed to fetch available hours");
    }
}

export async function fetchNewAppointment(data: CreateAppointmentRequest): Promise<CreateAppointmentData> {
    if (!data.date) {
        throw new Error("Date is required");
    }
    if (!data.hour) {
        throw new Error("Hour is required");
    }
    if (!data.barber) {
        throw new Error("Barber is required");
    }
    if (!data.speciality) {
        throw new Error("Speciality is required");
    }

    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Token is required");
    }

    const appointmentData = {
        ...data,
        userId: localStorage.getItem("user"),
        date: new Date(data.date).toISOString().split('T')[0]
    };

    try {
        const response = await axios.post('/api/appointment', appointmentData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data as CreateAppointmentData;
    } catch (error: any) {
        console.error("Error creating appointment:", error);
        if (error.response?.status === 401) {
            throw new Error("Token expirado ou inválido");
        }
        
        throw new Error("Falha ao criar agendamento");
    }
}

export async function fetchAppointments(role: string): Promise<AppointmentData[]> {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token) {
        throw new Error("Token is required");
    }

    try {
        const response = await axios.get(`/api/appointments?role=${role}&user=${user}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if(role==='barber' || role==='admin') {
            return response.data.barbers?.flatMap((barber: BarberSlot) =>
                barber.hours.map(hour => ({
                    ...hour,
                    date: hour.date,
                    barber: barber.name,
                    hour: hour.hour,
                    speciality: hour.speciality,
                    client: hour.client
                }))
            ) ?? [] as AppointmentData[];
        }
        return response.data as AppointmentData[];
    } catch (error) {
        console.error("Error fetching appointments:", error);
        throw new Error("Failed to fetch appointments");
    }
}