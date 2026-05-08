/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.CORE.SRC.ADMIN_MAIN.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = admin-main.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/admin-main.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminPortal from './apps/AdminPortal';
import './index.css';

const rootElement = document.getElementById('admin-root');

if (!rootElement) {
  throw new Error('Admin root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AdminPortal />
  </React.StrictMode>
);
