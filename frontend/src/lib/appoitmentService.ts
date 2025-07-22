import axios from "axios";

interface HourRequest {
    date: string;
    token: string;
    user: string;
    role: string;
}
export interface HourSlot {
    hour: string;
    selected: boolean;
}

export interface BarberSlot {
    name: string;
    specialities: string[];
    hours: HourSlot[];
}


export interface NewAppointmentResponse {
    date: string;
    barbers: BarberSlot[];
    hoursDay: HourSlot[];
}

export interface createAppointmentData {
    success: boolean;
    message: string;
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

export async function fetchNewAppointment(data: {
    date: string;
    hour: string;
    barber: string;
    speciality: string;
    role: string;
    client?: string; 
}): Promise<createAppointmentData> {
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
        return response.data as createAppointmentData;
    } catch (error: any) {
        console.error("Error creating appointment:", error);
        if (error.response?.status === 401) {
            throw new Error("Token expirado ou inválido");
        }
        
        throw new Error("Falha ao criar agendamento");
    }
}