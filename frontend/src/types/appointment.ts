export interface HourSlot {
    hour: string;
    selected: boolean;
}

export interface AppointmentData {
    date: string;
    hour: string;
    barber: string;
    speciality: string;
    role?: string;
    client?: string;
}

export interface BarberSlot {
    name: string;
    specialities: string[];
    hours: AppointmentData[];
}

export interface NewAppointmentResponse {
    date: string;
    barbers: BarberSlot[];
    hoursDay?: HourSlot[];
}

export interface CreateAppointmentData {
    success: boolean;
    message: string;
}

export interface CreateAppointmentRequest {
    date: string;
    hour: string;
    barber: string;
    speciality: string;
    role: string;
    client?: string;
}