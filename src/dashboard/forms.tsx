"use client";

import { FormEvent, useState } from "react";
import type {
  Doctor,
  DoctorInput,
  Patient,
  PatientInput,
  PatientStatus,
} from "./types";

export function DoctorForm({
  onSubmit,
  onCancel,
}: {
  onSubmit(input: DoctorInput): Promise<boolean>;
  onCancel(): void;
}) {
  const [submitting, setSubmitting] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const data = new FormData(event.currentTarget);
    setSubmitting(true);
    await onSubmit({
      name: String(data.get("name")),
      specialization: String(data.get("specialization")),
      hospital: String(data.get("hospital")),
      phone: String(data.get("phone")),
      email: String(data.get("email")),
    });
    setSubmitting(false);
  }
  return (
    <form onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="name"
          label="Doctor name"
          placeholder="Dr. Ayesha Rahman"
          required
        />
        <Field
          name="specialization"
          label="Specialization"
          placeholder="e.g. Cardiology"
          required
        />
        <Field
          name="hospital"
          label="Hospital or clinic"
          placeholder="Central Medical Centre"
          required
        />
        <Field
          name="phone"
          label="Phone"
          type="tel"
          placeholder="+880 17XX XXX XXX"
          pattern="[+0-9 ()-]{7,}"
          required
        />
        <Field
          name="email"
          label="Email"
          type="email"
          placeholder="doctor@hospital.com"
          required
        />
      </div>
      <FormActions onCancel={onCancel} label="Add doctor" submitting={submitting} />
    </form>
  );
}

export function PatientForm({
  doctors,
  initial,
  defaultDoctorId,
  onSubmit,
  onCancel,
  label = "Add patient",
}: {
  doctors: Doctor[];
  initial?: Patient;
  defaultDoctorId?: string;
  onSubmit(input: PatientInput): Promise<boolean> | void;
  onCancel(): void;
  label?: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [doctorId, setDoctorId] = useState(initial?.doctorId || defaultDoctorId || "");
  const [doctorError, setDoctorError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    if (!doctorId) {
      setDoctorError("Select an assigned doctor from the search results.");
      return;
    }
    const data = new FormData(event.currentTarget);
    setSubmitting(true);
    await onSubmit({
      doctorId,
      name: String(data.get("name")),
      age: Number(data.get("age")),
      gender: String(data.get("gender")) as PatientInput["gender"],
      phone: String(data.get("phone")),
      condition: String(data.get("condition")),
      status: String(data.get("status")) as PatientStatus,
      admittedAt: optionalIsoDate(String(data.get("admittedAt"))),
      appointmentAt: new Date(String(data.get("appointmentAt"))).toISOString(),
      visitCompletedAt: initial?.visitCompletedAt,
    });
    setSubmitting(false);
  }
  return (
    <form onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="name"
          label="Patient name"
          placeholder="Full name"
          defaultValue={initial?.name}
          required
        />
        <Field
          name="age"
          label="Age"
          type="number"
          placeholder="Age"
          min={0}
          max={120}
          defaultValue={initial?.age}
          required
        />
        <Select
          name="gender"
          label="Gender"
          defaultValue={initial?.gender || ""}
          options={["Female", "Male", "Other"]}
        />
        <Field
          name="phone"
          label="Phone"
          type="tel"
          placeholder="+880 17XX XXX XXX"
          pattern="[+0-9 ()-]{7,}"
          defaultValue={initial?.phone}
          required
        />
        <Field
          name="condition"
          label="Condition"
          placeholder="e.g. Hypertension"
          defaultValue={initial?.condition}
          required
        />
        <SearchableDoctorSelect
          label="Assigned doctor"
          value={doctorId}
          doctors={doctors}
          error={doctorError}
          onChange={(value) => {
            setDoctorId(value);
            setDoctorError("");
          }}
        />
        <Select
          name="status"
          label="Status"
          defaultValue={initial?.status || "Active"}
          options={["Active", "Monitoring", "Recovered"]}
        />
        <Field
          name="admittedAt"
          label="Admission date"
          type="date"
          defaultValue={
            initial?.admittedAt ? initial.admittedAt.slice(0, 10) : undefined
          }
        />
        <Field
          name="appointmentAt"
          label="Booked visit"
          type="datetime-local"
          defaultValue={toLocalDateTimeInput(initial?.appointmentAt)}
          required
        />
      </div>
      <FormActions onCancel={onCancel} label={label} submitting={submitting} />
    </form>
  );
}

function optionalIsoDate(value: string) {
  return value ? new Date(`${value}T00:00:00`).toISOString() : undefined;
}

function toLocalDateTimeInput(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required,
  pattern,
  min,
  max,
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  pattern?: string;
  min?: number;
  max?: number;
  defaultValue?: string | number;
}) {
  return (
    <label className="fieldset">
      <span className="fieldset-legend text-xs font-semibold">
        {label}
        {required && <span className="text-error"> *</span>}
      </span>
      <input
        className="input input-bordered w-full bg-base-100"
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        pattern={pattern}
        min={min}
        max={max}
        defaultValue={defaultValue}
      />
    </label>
  );
}

function Select({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue: string;
  options: Array<string | { value: string; label: string }>;
}) {
  return (
    <label className="fieldset">
      <span className="fieldset-legend text-xs font-semibold">
        {label}
        <span className="text-error"> *</span>
      </span>
      <select
        className="select select-bordered w-full bg-base-100"
        name={name}
        defaultValue={defaultValue}
        required
      >
        <option value="" disabled>
          Select {label.toLowerCase()}
        </option>
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const text = typeof option === "string" ? option : option.label;
          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>
    </label>
  );
}

function SearchableDoctorSelect({
  label,
  value,
  doctors,
  error,
  onChange,
}: {
  label: string;
  value: string;
  doctors: Doctor[];
  error: string;
  onChange(value: string): void;
}) {
  const selected = doctors.find((doctor) => doctor.id === value);
  const [query, setQuery] = useState(selected?.name || "");
  const [open, setOpen] = useState(false);
  const normalizedQuery = query.trim().toLowerCase();
  const matches = doctors.filter((doctor) =>
    !normalizedQuery ||
    `${doctor.name} ${doctor.specialization} ${doctor.hospital} ${doctor.phone} ${doctor.email}`
      .toLowerCase()
      .includes(normalizedQuery),
  );
  const inputId = "patient-assigned-doctor";

  return (
    <div
      className="fieldset relative"
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
          setQuery(selected?.name || "");
        }
      }}
    >
      <label className="fieldset-legend text-xs font-semibold" htmlFor={inputId}>
        {label}<span className="text-error"> *</span>
      </label>
      <label className={`input input-bordered flex w-full items-center gap-2 bg-base-100 ${error ? "input-error" : ""}`}>
        <span aria-hidden="true">⌕</span>
        <input
          id={inputId}
          className="grow"
          value={query}
          placeholder="Search name, specialty, phone or email"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${inputId}-options`}
          aria-invalid={Boolean(error)}
          autoComplete="off"
          onFocus={(event) => event.currentTarget.select()}
          onClick={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            onChange("");
            setOpen(true);
          }}
        />
        {selected && <span className="badge badge-success badge-sm">Selected</span>}
      </label>
      {error && <span className="mt-1 text-xs text-error" role="alert">{error}</span>}
      {open && (
        <div id={`${inputId}-options`} role="listbox" className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-box border border-base-300 bg-base-100 p-1 shadow-xl">
          {matches.length ? matches.map((doctor) => (
            <button
              key={doctor.id}
              type="button"
              role="option"
              aria-selected={doctor.id === value}
              className={`flex w-full flex-col rounded-lg px-3 py-2 text-left hover:bg-base-200 ${doctor.id === value ? "bg-primary/10" : ""}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onChange(doctor.id);
                setQuery(doctor.name);
                setOpen(false);
              }}
            >
              <span className="font-semibold">{doctor.name}</span>
              <span className="mt-0.5 text-xs text-base-content/55">
                {[doctor.specialization, doctor.hospital, doctor.phone, doctor.email].filter(Boolean).join(" · ")}
              </span>
            </button>
          )) : (
            <p className="px-3 py-4 text-center text-sm text-base-content/55">No doctors match that search.</p>
          )}
        </div>
      )}
    </div>
  );
}

function FormActions({ onCancel, label, submitting }: { onCancel(): void; label: string; submitting: boolean }) {
  return (
    <div className="mt-6 flex justify-end gap-2 border-t border-base-300 pt-4">
      <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>
        Cancel
      </button>
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting && <span className="loading loading-spinner loading-xs" />}{submitting ? "Saving…" : label} <span>→</span>
      </button>
    </div>
  );
}
