"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { accessApi, type AccessRole, type PermissionOption } from "@/access/api";

const PROTECTED_ROLE = "software_engineer";

export default function RolesPage() {
  const [roles, setRoles] = useState<AccessRole[]>([]);
  const [permissions, setPermissions] = useState<PermissionOption[]>([]);
  const [selected, setSelected] = useState<AccessRole | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [nextRoles, nextPermissions] = await Promise.all([accessApi.roles(), accessApi.permissions()]);
      setRoles(nextRoles);
      setPermissions(nextPermissions);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Access settings could not be loaded");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function saveRole(input: RoleInput) {
    setSaving(true);
    setError("");
    try {
      if (selected) await accessApi.updateRole(selected.id, input);
      else await accessApi.createRole(input);
      setSelected(null);
      setCreating(false);
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Role could not be saved");
    } finally {
      setSaving(false);
    }
  }

  async function removeRole(role: AccessRole) {
    if (!window.confirm(`Delete the ${pretty(role.name)} role?`)) return;
    setError("");
    try {
      await accessApi.deleteRole(role.id);
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Role could not be deleted");
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body flex-row items-center justify-between gap-4 p-5 sm:p-7">
          <div><h2 className="card-title">Roles and access</h2><p className="mt-1 text-sm text-base-content/55">Create roles, then decide exactly what each role can do.</p></div>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => { setSelected(null); setCreating(true); }}>+ New role</button>
        </div>
      </section>

      {error && <div className="alert alert-error"><span>{error}</span><button type="button" className="btn btn-sm" onClick={() => void load()}>Retry</button></div>}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => {
          const protectedRole = role.name === PROTECTED_ROLE;
          return (
            <article key={role.id} className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body p-5">
                <div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{pretty(role.name)}</h3><p className="mt-1 text-xs text-base-content/50">{role.description || "Custom access role"}</p></div>{protectedRole && <span className="badge badge-secondary badge-sm">Protected</span>}</div>
                <div className="mt-2 flex gap-2"><span className="badge badge-outline">{role.userCount} users</span><span className="badge badge-outline">{role.permissions.length} powers</span></div>
                <div className="mt-2 flex min-h-12 flex-wrap content-start gap-1.5">{role.permissions.slice(0, 5).map((permission) => <span key={permission} className="badge badge-ghost badge-sm">{permission}</span>)}{role.permissions.length > 5 && <span className="badge badge-ghost badge-sm">+{role.permissions.length - 5}</span>}</div>
                <div className="card-actions mt-3 justify-end"><button type="button" className="btn btn-ghost btn-sm" disabled={protectedRole} onClick={() => { setCreating(false); setSelected(role); }}>Edit powers</button><button type="button" className="btn btn-ghost btn-sm text-error" disabled={protectedRole || role.userCount > 0} onClick={() => void removeRole(role)}>Delete</button></div>
              </div>
            </article>
          );
        })}
      </section>

      {!roles.length && <div className="card bg-base-100"><div className="card-body items-center text-center"><h3 className="font-bold">No roles yet</h3><p className="text-sm text-base-content/55">Create the first role to start assigning access.</p></div></div>}
      {(creating || selected) && <RoleEditor role={selected} permissions={permissions} saving={saving} onCancel={() => { setCreating(false); setSelected(null); }} onSave={saveRole} />}
    </div>
  );
}

type RoleInput = { name: string; description: string; permissionIds: number[] };

function RoleEditor({ role, permissions, saving, onCancel, onSave }: { role: AccessRole | null; permissions: PermissionOption[]; saving: boolean; onCancel(): void; onSave(input: RoleInput): Promise<void> }) {
  const selectedNames = useMemo(() => new Set(role?.permissions || []), [role]);
  const groups = useMemo(() => permissions.reduce<Record<string, PermissionOption[]>>((all, permission) => {
    const group = permission.name.split(".")[0];
    (all[group] ||= []).push(permission);
    return all;
  }, {}), [permissions]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    void onSave({ name: String(data.get("name")).trim(), description: String(data.get("description")).trim(), permissionIds: data.getAll("permissionIds").map(Number) });
  }

  return (
    <div className="modal modal-open" role="presentation">
      <div className="modal-box max-w-5xl" role="dialog" aria-modal="true" aria-labelledby="role-editor-title">
        <h2 id="role-editor-title" className="text-xl font-bold">{role ? `Edit ${pretty(role.name)}` : "Create role"}</h2>
        <p className="mt-1 text-sm text-base-content/55">Select the powers granted to every user assigned this role.</p>
        <form className="mt-6" onSubmit={submit}>
          <div className="grid gap-4 sm:grid-cols-2"><label className="fieldset"><span className="fieldset-legend">Role name *</span><input className="input input-bordered w-full" name="name" defaultValue={role?.name} placeholder="receptionist" pattern="[a-zA-Z0-9_-]+" required /></label><label className="fieldset"><span className="fieldset-legend">Description</span><input className="input input-bordered w-full" name="description" defaultValue={role?.description || ""} placeholder="What this role is responsible for" /></label></div>
          <div className="mt-6 flex items-center justify-between"><h3 className="font-bold">Route permissions</h3><span className="text-xs text-base-content/50">Choose only what this role needs</span></div>
          <div className="mt-3 grid max-h-[48vh] gap-3 overflow-y-auto pr-1 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(groups).map(([group, options]) => <fieldset key={group} className="rounded-box border border-base-300 p-4"><legend className="px-2 text-sm font-bold">{pretty(group)}</legend><div className="space-y-2">{options.map((permission) => <label key={permission.id} className="flex cursor-pointer items-center gap-3 rounded-lg p-1 hover:bg-base-200"><input className="checkbox checkbox-success checkbox-sm" type="checkbox" name="permissionIds" value={permission.id} defaultChecked={selectedNames.has(permission.name)} /><span><strong className="block text-sm font-medium">{pretty(permission.name.split(".").slice(1).join(" "))}</strong>{permission.description && <small className="text-base-content/45">{permission.description}</small>}</span></label>)}</div></fieldset>)}
          </div>
          <div className="modal-action"><button type="button" className="btn btn-ghost" disabled={saving} onClick={onCancel}>Cancel</button><button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : role ? "Save role" : "Create role"}</button></div>
        </form>
      </div>
      <button type="button" className="modal-backdrop" onClick={onCancel}>close</button>
    </div>
  );
}

function pretty(value: string) { return value.replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function Loading() { return <div className="grid min-h-64 place-items-center"><span className="loading loading-spinner loading-lg text-primary" aria-label="Loading roles and permissions" /></div>; }
