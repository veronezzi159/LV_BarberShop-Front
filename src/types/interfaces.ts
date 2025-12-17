import type { Locale } from "date-fns/locale";
import {
  AppointmentStatus,
  ReschedulingStatus,
  UnitOfMeasure,
  MovementType,
  MovementExitType,
} from "./enums";

export interface PersonSummary {
  name: string;
  phone: string;
}

export interface ServiceSummary {
  id: string;
  name: string;
  price: number;
}

export interface ProductSummary {
  _id: string;
  priceCost: number;
  priceSale: number;
}

export interface User {
  _id?: string;
  name: string;
  phone: string;
  password?: string;
  roles: string[];
  active: boolean;
}

export interface Service {
  _id: string;
  name: string;
  price: number;
  time: number;
}

export interface Appointment {
  _id: string;
  barber: PersonSummary;
  client: PersonSummary;
  services: ServiceSummary[];
  date: string; // Formato ISO "YYYY-MM-DD"
  time: string; // Formato "HH:mm"
  status: AppointmentStatus;
  observation?: string;
}

export interface Rescheduling {
  _id: string;
  barber: PersonSummary;
  client: PersonSummary;
  services: ServiceSummary[];
  date: string;
  time: string;
  status: ReschedulingStatus;
  observation?: string;
}

export interface Code {
  code: number;
  dateCreate: string | Date;
  expirationCreate: string | Date;
}

export interface Product {
  _id: string;
  name: string;
  quantity: number;
  unitOfMeasure: UnitOfMeasure;
  priceCost: number;
  priceSale: number;
}

export interface Movement {
  _id: string;
  name: string;
  product: ProductSummary;
  unitOfMeasure: UnitOfMeasure;
  quantity: number;
  typeMovimentation: MovementType;
  typeMovimentationExit?: MovementExitType;
  date?: string | Date;
}

// -------- Parte da agenda ----------

export interface WeeklyCalendarProps {
  date?: Date;
  onDateChange?: (date: Date) => void;
  appointments?: Appointment[];
  onAddAppointment?: (appointment: Omit<Appointment, "id">) => void;
  onUpdateAppointment?: (appointment: Appointment) => void;
  startHour?: number;
  endHour?: number;
  timeInterval?: number;
  locale?: Locale;
  barbers?: string[];
  services?: string[];
  role?: "manager" | "barber";
  currentBarberId?: string;
}