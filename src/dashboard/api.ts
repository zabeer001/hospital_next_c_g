import type { Booking, BookingInput, Doctor, DoctorInput, Patient, PatientInput, PatientStatus } from "./types";
import { authenticatedRequest } from "@/auth/client";

export type PaginationMeta = { page: number; limit: number; total: number; totalPages: number };
type Envelope<T> = { data: T };
type ListEnvelope<T> = Envelope<T[]> & { meta: PaginationMeta };

type DoctorRecord = Omit<Doctor, "id" | "hospital" | "phone" | "email"> & {
  id: number; hospital: string | null; phone: string | null; email: string | null;
  patientCount?: number; upcomingCount?: number;
};
type PatientRecord = Omit<Patient, "id" | "bookingId" | "doctorId" | "phone" | "condition" | "appointmentAt" | "admittedAt" | "visitCompletedAt"> & {
  id: number; bookingId?: number | null; doctorId: number; phone: string | null; condition: string | null;
  admittedAt?: string | null;
  appointmentAt?: string | null; visitCompletedAt?: string | null;
  doctorName?: string; doctorSpecialization?: string;
};
type BookingRecord = Omit<Booking, "id" | "patientId" | "doctorId" | "condition" | "admittedAt" | "visitCompletedAt" | "patient" | "doctor"> & {
  id: number;
  patientId: number;
  doctorId: number;
  condition: string | null;
  admittedAt: string | null;
  visitCompletedAt: string | null;
  patient: Omit<Booking["patient"], "id" | "phone"> & { id: number; phone: string | null };
  doctor: Omit<Booking["doctor"], "id" | "hospital"> & { id: number; hospital: string | null };
};

export type DashboardSummary = {
  metrics: { totalDoctors: number; totalPatients: number; activePatients: number; newThisMonth: number };
  patientStatuses: Array<{ status: PatientStatus; count: number }>;
  topConditions: Array<{ condition: string; count: number }>;
  monthlyAdmissions: Array<{ month: string; count: number }>;
  busiestDoctors: Array<{ id: string; name: string; specialization: string; patientCount: number }>;
  recentPatients: Patient[];
};
type DashboardSummaryRecord = Omit<DashboardSummary, "busiestDoctors" | "recentPatients"> & {
  busiestDoctors: Array<{ id: number; name: string; specialization: string; patientCount: number }>;
  recentPatients: PatientRecord[];
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  return authenticatedRequest<T>(path, init);
}

function mapDoctor(record: DoctorRecord): Doctor {
  return { ...record, id: String(record.id), hospital: record.hospital || "", phone: record.phone || "", email: record.email || "" };
}
function mapPatient(record: PatientRecord): Patient {
  return { ...record, id: String(record.id), bookingId: record.bookingId == null ? undefined : String(record.bookingId), doctorId: String(record.doctorId), phone: record.phone || "", condition: record.condition || "", appointmentAt: record.appointmentAt || undefined, admittedAt: record.admittedAt || undefined, visitCompletedAt: record.visitCompletedAt || undefined };
}
function mapBooking(record: BookingRecord): Booking {
  return {
    ...record,
    id: String(record.id),
    patientId: String(record.patientId),
    doctorId: String(record.doctorId),
    condition: record.condition || "",
    admittedAt: record.admittedAt || undefined,
    visitCompletedAt: record.visitCompletedAt || undefined,
    patient: { ...record.patient, id: String(record.patient.id), phone: record.patient.phone || "" },
    doctor: { ...record.doctor, id: String(record.doctor.id), hospital: record.doctor.hospital || "" },
  };
}
function bookingBody(input: Partial<BookingInput>) {
  return {
    ...input,
    ...(input.patientId !== undefined && { patientId: Number(input.patientId) }),
    ...(input.doctorId !== undefined && { doctorId: Number(input.doctorId) }),
  };
}
function patientBody(input: Partial<PatientInput>) {
  return {
    ...input,
    ...(input.doctorId !== undefined && { doctorId: Number(input.doctorId) }),
    ...(input.appointmentAt !== undefined && { appointmentAt: input.appointmentAt || null }),
    ...(input.admittedAt !== undefined && { admittedAt: input.admittedAt || null }),
    ...(input.visitCompletedAt !== undefined && { visitCompletedAt: input.visitCompletedAt || null }),
  };
}
async function getAll<T>(path: string): Promise<T[]> {
  const separator = path.includes("?") ? "&" : "?";
  const first = await request<ListEnvelope<T>>(`${path}${separator}page=1&limit=100`);
  const remaining = await Promise.all(Array.from({ length: Math.max(0, first.meta.totalPages - 1) }, (_, index) => request<ListEnvelope<T>>(`${path}${separator}page=${index + 2}&limit=100`)));
  return [first, ...remaining].flatMap((result) => result.data);
}

export const hospitalApi = {
  health: () => request<{ status: string }>("/health"),
  getDoctors: async () => (await getAll<DoctorRecord>("/doctors")).map(mapDoctor),
  getDoctor: async (id: string) => mapDoctor((await request<Envelope<DoctorRecord>>(`/doctors/${id}`)).data),
  createDoctor: async (input: DoctorInput) => mapDoctor((await request<Envelope<DoctorRecord>>("/doctors", { method: "POST", body: JSON.stringify(input) })).data),
  updateDoctor: async (id: string, input: Partial<DoctorInput>) => mapDoctor((await request<Envelope<DoctorRecord>>(`/doctors/${id}`, { method: "PATCH", body: JSON.stringify(input) })).data),
  deleteDoctor: (id: string) => request<void>(`/doctors/${id}`, { method: "DELETE" }),
  getDoctorPatients: async (id: string, upcoming = false) => (await getAll<PatientRecord>(`/doctors/${id}/patients${upcoming ? "?upcoming=true" : ""}`)).map(mapPatient),
  getPatients: async () => (await getAll<PatientRecord>("/patients")).map(mapPatient),
  getPatient: async (id: string) => mapPatient((await request<Envelope<PatientRecord>>(`/patients/${id}`)).data),
  createPatient: async (input: PatientInput) => mapPatient((await request<Envelope<PatientRecord>>("/patients", { method: "POST", body: JSON.stringify(patientBody(input)) })).data),
  updatePatient: async (id: string, input: Partial<PatientInput>) => mapPatient((await request<Envelope<PatientRecord>>(`/patients/${id}`, { method: "PATCH", body: JSON.stringify(patientBody(input)) })).data),
  completePatientVisit: async (id: string, completedAt = new Date().toISOString()) => mapPatient((await request<Envelope<PatientRecord>>(`/patients/${id}/complete-visit`, { method: "PATCH", body: JSON.stringify({ completedAt }) })).data),
  deletePatient: (id: string) => request<void>(`/patients/${id}`, { method: "DELETE" }),
  getBookings: async () => (await getAll<BookingRecord>("/bookings")).map(mapBooking),
  getBooking: async (id: string) => mapBooking((await request<Envelope<BookingRecord>>(`/bookings/${id}`)).data),
  createBooking: async (input: BookingInput) => mapBooking((await request<Envelope<BookingRecord>>("/bookings", { method: "POST", body: JSON.stringify(bookingBody(input)) })).data),
  updateBooking: async (id: string, input: Partial<BookingInput>) => mapBooking((await request<Envelope<BookingRecord>>(`/bookings/${id}`, { method: "PATCH", body: JSON.stringify(bookingBody(input)) })).data),
  deleteBooking: (id: string) => request<void>(`/bookings/${id}`, { method: "DELETE" }),
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    const summary = (await request<Envelope<DashboardSummaryRecord>>("/dashboard/summary")).data;
    return { ...summary, busiestDoctors: summary.busiestDoctors.map((doctor) => ({ ...doctor, id: String(doctor.id) })), recentPatients: summary.recentPatients.map(mapPatient) };
  },
};
