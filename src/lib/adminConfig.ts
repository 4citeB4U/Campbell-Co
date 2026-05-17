/*
LEEWAY HEADER - DO NOT REMOVE

COLOR_ONION_HEX:
NEON=#FFD700
FLUO=#FFEA00
PASTEL=#FFF9C4

ICON_ASCII:
family=lucide
glyph=wrench

AGENTS:
ASSESS
ALIGN
AUDIT

REGION: CORE
TAG: CORE.SRC.LIB.ADMIN_CONFIG.MAIN
DESCRIPTION: Shared local admin configuration and owner controls
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice -> Intent -> Location -> Vertical -> Ranking -> Render

5WH:
WHAT = adminConfig.ts - local admin settings helpers
WHY = Keep owner profile, passcode gate, and employee roster consistent across the admin portal
WHO = Leeway Innovations
WHERE = src/lib/adminConfig.ts
WHEN = 2026-05-13
HOW = Typed localStorage helpers with safe defaults

CHAIN: Standards -> Integrated -> Runtime -> Projections
LICENSE: PROPRIETARY
*/

export type OwnerProfile = {
  name: string;
  title: string;
  email: string;
  phone: string;
};

export type EmployeeRecord = {
  id: string;
  name: string;
  title: string;
  department: string;
  access: 'owner' | 'admin' | 'manager' | 'staff';
  status: 'active' | 'invited' | 'paused';
};

export const OWNER_PROFILE_KEY = 'campbell-owner-profile';
export const OWNER_PASSCODE_KEY = 'campbell-owner-passcode';
export const EMPLOYEE_ROSTER_KEY = 'campbell-employee-roster';

export const DEFAULT_OWNER_PROFILE: OwnerProfile = {
  name: 'Avion Campbell-Lee',
  title: 'Owner & Creative Director',
  email: 'owner@campbellco.local',
  phone: '(000) 000-0000',
};

export const DEFAULT_EMPLOYEE_ROSTER: EmployeeRecord[] = [
  {
    id: 'employee-owner',
    name: 'Avion Campbell-Lee',
    title: 'Owner & Creative Director',
    department: 'Executive',
    access: 'owner',
    status: 'active',
  },
  {
    id: 'employee-operations',
    name: 'House Operations Lead',
    title: 'Operations Manager',
    department: 'Operations',
    access: 'manager',
    status: 'invited',
  },
];

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback;
  } catch {
    return fallback;
  }
}

export function loadOwnerProfile() {
  return readJson<OwnerProfile>(OWNER_PROFILE_KEY, DEFAULT_OWNER_PROFILE);
}

export function saveOwnerProfile(profile: OwnerProfile) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(OWNER_PROFILE_KEY, JSON.stringify(profile));
}

export function loadOwnerPasscode() {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(OWNER_PASSCODE_KEY) || '';
}

export function saveOwnerPasscode(passcode: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(OWNER_PASSCODE_KEY, passcode);
}

export function loadEmployeeRoster() {
  if (typeof window === 'undefined') return DEFAULT_EMPLOYEE_ROSTER;

  try {
    const raw = window.localStorage.getItem(EMPLOYEE_ROSTER_KEY);
    return raw ? (JSON.parse(raw) as EmployeeRecord[]) : DEFAULT_EMPLOYEE_ROSTER;
  } catch {
    return DEFAULT_EMPLOYEE_ROSTER;
  }
}

export function saveEmployeeRoster(roster: EmployeeRecord[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(EMPLOYEE_ROSTER_KEY, JSON.stringify(roster));
}
