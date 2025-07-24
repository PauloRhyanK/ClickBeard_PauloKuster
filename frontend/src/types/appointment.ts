export interface HourSlot {
    hour: string;
    selected: boolean;
}

export interface HourResponse {
    success: boolean;
    hours: HourSlot[];
    barbers: BarberSlot[];
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
    email: string;
    specialities: string[];
    appointments: AppointmentData[];
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
    email_barber: string;
    email_client: string;
    speciality: string;
}