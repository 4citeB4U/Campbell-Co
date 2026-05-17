/*
LEEWAY HEADER - DO NOT REMOVE

COLOR_ONION_HEX:
NEON=#FF3131
FLUO=#FF5757
PASTEL=#FF9191

ICON_ASCII:
family=lucide
glyph=layout

AGENTS:
ASSESS
ALIGN
AUDIT

REGION: UI
TAG: UI.COMPONENTS.ADMIN.ADMIN_MEMBERS.MAIN
DESCRIPTION: Owner-friendly CRM and staff roster controls
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice -> Intent -> Location -> Vertical -> Ranking -> Render

5WH:
WHAT = AdminMembers.tsx - members and employee roster management
WHY = Let the owner review clients and maintain store access roles without touching code
WHO = Leeway Innovations
WHERE = src/components/admin/AdminMembers.tsx
WHEN = 2026-05-13
HOW = React + local staff roster storage

CHAIN: Standards -> Integrated -> Runtime -> Projections
LICENSE: PROPRIETARY
*/
import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, ShieldCheck, UserPlus, Users } from 'lucide-react';
import { Member } from '../../types';
import { EmployeeRecord, loadEmployeeRoster, saveEmployeeRoster } from '../../lib/adminConfig';

interface MembersProps {
  members: Member[];
}

const EMPTY_EMPLOYEE: Omit<EmployeeRecord, 'id'> = {
  name: '',
  title: '',
  department: '',
  access: 'staff',
  status: 'invited',
};

export function AdminMembers({ members }: MembersProps) {
  const [query, setQuery] = useState('');
  const [roster, setRoster] = useState<EmployeeRecord[]>([]);
  const [draftEmployee, setDraftEmployee] = useState(EMPTY_EMPLOYEE);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setRoster(loadEmployeeRoster());
  }, []);

  const filteredMembers = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return members;

    return members.filter((member) =>
      [member.name, member.email, member.customerTier].join(' ').toLowerCase().includes(value)
    );
  }, [members, query]);

  const addEmployee = () => {
    if (!draftEmployee.name.trim() || !draftEmployee.title.trim()) {
      setMessage('Enter at least a name and title before adding a team member.');
      return;
    }

    const nextRoster = [
      {
        id: `employee-${Date.now()}`,
        ...draftEmployee,
      },
      ...roster,
    ];

    setRoster(nextRoster);
    saveEmployeeRoster(nextRoster);
    setDraftEmployee(EMPTY_EMPLOYEE);
    setMessage('Employee added to the administrative roster.');
    window.setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <span className="text-[10px] uppercase tracking-[0.8em] text-amber-700 font-black">People</span>
          <h2 className="text-4xl font-serif tracking-[0.16em] uppercase text-stone-900">Members & Staff</h2>
          <p className="max-w-3xl text-sm leading-7 text-stone-600">
            This page now serves two purposes: client visibility for Campbell &amp; Co. members, and a simple roster
            for employees or administrators that Avion wants to invite into the system.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <section className="rounded-[2rem] border border-stone-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                <UserPlus size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.22em] text-stone-900">Add Employee</h3>
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Create access for staff and managers</p>
              </div>
            </div>

            {message && (
              <div className="mt-5 rounded-[1.25rem] border border-amber-200 bg-amber-50 px-4 py-3 text-xs uppercase tracking-[0.18em] text-amber-700">
                {message}
              </div>
            )}

            <div className="mt-6 space-y-4">
              <Field label="Full Name" value={draftEmployee.name} onChange={(value) => setDraftEmployee((current) => ({ ...current, name: value }))} />
              <Field label="Title" value={draftEmployee.title} onChange={(value) => setDraftEmployee((current) => ({ ...current, title: value }))} />
              <Field label="Department" value={draftEmployee.department} onChange={(value) => setDraftEmployee((current) => ({ ...current, department: value }))} />
              <SelectField
                label="Access"
                value={draftEmployee.access}
                options={['owner', 'admin', 'manager', 'staff']}
                onChange={(value) => setDraftEmployee((current) => ({ ...current, access: value as EmployeeRecord['access'] }))}
              />
              <SelectField
                label="Status"
                value={draftEmployee.status}
                options={['active', 'invited', 'paused']}
                onChange={(value) => setDraftEmployee((current) => ({ ...current, status: value as EmployeeRecord['status'] }))}
              />
              <button
                onClick={addEmployee}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-amber-600 px-5 py-4 text-[10px] font-black uppercase tracking-[0.24em] text-white transition hover:bg-stone-900"
              >
                <Plus size={14} />
                Add Employee
              </button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-stone-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-700">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.22em] text-stone-900">Access Summary</h3>
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Who can operate the back office</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {roster.map((employee) => (
                <div key={employee.id} className="rounded-[1.25rem] border border-stone-200 bg-stone-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.16em] text-stone-900">{employee.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-500">{employee.title}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-stone-600">
                      {employee.access}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-stone-500">
                      {employee.department || 'General'}
                    </span>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-amber-700">
                      {employee.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <section className="rounded-[2rem] border border-stone-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-stone-200 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-md">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search members by name, email, or tier"
                className="w-full rounded-full border border-stone-200 bg-stone-50 py-3 pl-11 pr-4 text-sm text-stone-700 outline-none transition focus:border-amber-300 focus:bg-white"
              />
            </div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-stone-500">
              <Users size={15} />
              {filteredMembers.length} visible members
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">Client</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">Tier</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">Lifetime Value</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">Points</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">Consent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="bg-white">
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-sm font-black uppercase tracking-[0.14em] text-stone-900">{member.name}</p>
                        <p className="mt-1 text-xs text-stone-500">{member.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">
                        {member.customerTier}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-stone-700">${member.lifetimeValue.toLocaleString()}</td>
                    <td className="px-6 py-5 text-sm text-stone-700">{member.rewardsBalance.toLocaleString()}</td>
                    <td className="px-6 py-5">
                      <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-stone-600">
                        {member.consentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-sm text-stone-500">
                      No members match the current search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-amber-300 focus:bg-white"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-amber-300 focus:bg-white"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
