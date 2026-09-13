"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { hospitalApi, type DashboardSummary } from "./api";
import { ApiRequestError } from "@/auth/client";
import type { Doctor, DoctorInput, Patient, PatientInput } from "./types";

type DashboardContextValue = {
  doctors: Doctor[];
  patients: Patient[];
  summary: DashboardSummary | null;
  loading: boolean;
  error: string;
  pending: boolean;
  refresh(): Promise<void>;
  addDoctor(input: DoctorInput): Promise<boolean>;
  addPatient(input: PatientInput): Promise<boolean>;
  updatePatient(id: string, input: PatientInput): Promise<boolean>;
  completeVisit(id: string): Promise<boolean>;
  deletePatient(id: string): Promise<boolean>;
  doctorName(id: string): string;
  notify(message: string, kind?: "success" | "error"): void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingCount, setPendingCount] = useState(0);
  const [toast, setToast] = useState<{ message: string; kind: "success" | "error" } | null>(null);
  const notify = useCallback((message: string, kind: "success" | "error" = "success") => {
    setToast({ message, kind });
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [nextDoctors, nextPatients, nextSummary] = await Promise.all([
        hospitalApi.getDoctors(), hospitalApi.getPatients(), hospitalApi.getDashboardSummary(),
      ]);
      setDoctors(nextDoctors);
      setPatients(nextPatients);
      setSummary(nextSummary);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Could not connect to the hospital API";
      setError(message);
      notify(message, "error");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => { void refresh(); }, [refresh]);

  const run = useCallback(async (operation: () => Promise<void>) => {
    setPendingCount((count) => count + 1);
    setError("");
    try {
      await operation();
      hospitalApi.getDashboardSummary().then(setSummary).catch(() => undefined);
      return true;
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "The request could not be completed";
      setError(message);
      notify(message, "error");
      return false;
    } finally {
      setPendingCount((count) => count - 1);
    }
  }, [notify]);

  const value = useMemo<DashboardContextValue>(
    () => ({
      doctors, patients, summary, loading, error, pending: pendingCount > 0, refresh,
      addDoctor: (input) => run(async () => { const doctor = await hospitalApi.createDoctor(input); setDoctors((items) => [doctor, ...items]); notify("Doctor added successfully"); }),
      addPatient: (input) => run(async () => { const patient = await hospitalApi.createPatient(input); setPatients((items) => [patient, ...items]); notify("Patient added successfully"); }),
      updatePatient: (id, input) => run(async () => { try { const patient = await hospitalApi.updatePatient(id, input); setPatients((items) => items.map((item) => item.id === id ? patient : item)); notify("Patient details updated"); } catch (error) { if (error instanceof ApiRequestError && error.status === 409) throw new Error("This patient has no booking to update. Create a booking before changing appointment details."); throw error; } }),
      completeVisit: (id) => run(async () => { try { const patient = await hospitalApi.completePatientVisit(id); setPatients((items) => items.map((item) => item.id === id ? patient : item)); notify("Visit completed and removed from the upcoming queue"); } catch (error) { if (error instanceof ApiRequestError && error.status === 409) throw new Error("This patient has no active booking to complete."); throw error; } }),
      deletePatient: (id) => run(async () => { await hospitalApi.deletePatient(id); setPatients((items) => items.filter((item) => item.id !== id)); notify("Patient removed"); }),
      doctorName: (id) => doctors.find((doctor) => doctor.id === id)?.name || "Unassigned",
      notify,
    }),
    [doctors, error, loading, notify, patients, pendingCount, refresh, run, summary],
  );

  return (
    <DashboardContext.Provider value={value}>
      {loading && <div className="fixed left-0 right-0 top-0 z-[140] h-1 overflow-hidden bg-primary/20"><div className="h-full w-1/2 animate-pulse bg-primary" /></div>}
      {children}
      {toast && (
        <div className="toast toast-end z-[1100]" role="status" aria-live="polite">
          <div className={`alert shadow-lg ${toast.kind === "error" ? "alert-error" : "alert-success"}`}>
            <span className="font-bold">{toast.kind === "error" ? "!" : "✓"}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context)
    throw new Error("useDashboard must be used inside DashboardProvider");
  return context;
}
