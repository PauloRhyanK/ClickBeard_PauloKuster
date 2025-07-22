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