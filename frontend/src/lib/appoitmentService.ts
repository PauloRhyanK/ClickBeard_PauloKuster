import axios from "axios";
import { 
    BarberSlot, 
    HourResponse, 
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

export async function fetchAvailableHours({ date, token, user, role }: HourRequest): Promise<HourResponse> {
    if (!date) {
        throw new Error("Date is required");
    }
    if (!token) {
        throw new Error("Token is required");
    }
    if (!user) {
        throw new Error("User is required");
    }
    const baseUrl = '/api/hours?date=' + new Date(date).toISOString().slice(0, 10) ;
    try {
        const response = await axios.get(baseUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        if(response.data.success !== true) {
            throw new Error("Invalid date from server");
        }
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
    if (!data.email_barber) {
        throw new Error("Barber is required");
    }
    if (!data.email_client) {
        throw new Error("Client is required");
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
    };

    try {
        const response = await axios.post('/api/appointment', appointmentData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data as CreateAppointmentData;
    } catch (error: unknown) {
        console.error("Error creating appointment:", error);
        throw new Error("Falha ao criar agendamento");
    }
}

export async function fetchAppointments(date: string, email: string): Promise<AppointmentData[]> {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token) {
        throw new Error("Token is required");
    }

    try {
        const response = await axios.get(`/api/appointments?date=${date}&email_user=${email}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if(response.data.success !== true) {
            throw new Error("Alerta:" + response.data.message || "");
        }
        return response.data.appointments as AppointmentData[];
    } catch (error) {
        console.error("Error fetching appointments:", error);
        throw new Error("Failed to fetch appointments");
    }
}

export async function cancelAppointment(date: string, hour: string, email_barber: string, email_client: string): Promise<{ success: boolean }> {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Token is required");
    }

    try {
        const response = await axios.post('/api/appointments/cancel', {
            date,
            hour,
            email_barber,
            email_client
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Response from cancel appointment:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error canceling appointment:", error);
        throw new Error("Failed to cancel appointment");
    }
}