# Web Portal Documentation

## 1. Project Overview

This document outlines the architecture, features, and technical specifications for the Survey Application's web portal. The portal serves two primary purposes:

1.  A **public-facing, read-only dashboard** to display survey progress and statistics to the general public.
2.  A **secure administrative panel** for `ADMIN` and `SUPERADMIN` users to perform Quality Control (QC), manage system data, and oversee operations.

---

## 2. Key Features & Requirements

### Public Dashboard (Read-Only)

- **Accessibility:** Open to everyone on the internet without requiring a login.
- **Content:** Will display high-level, anonymized statistics and visualizations, similar to a project landing page.
  - Ward-wise survey completion status.
  - Zone-wise property statistics.
  - Daily survey progress charts.
- **Functionality:** The data is for viewing only. There will be no interactive forms, editing capabilities, or access to sensitive data.

### Secure Admin Panel (Authenticated)

- **Access Control:** Strictly limited to users with `ADMIN` and `SUPERADMIN` roles. Requires JWT-based authentication.
- **Core Functionality:**
  1.  **Quality Control (QC) Workflow:** A multi-level process for reviewing and validating survey data submitted by surveyors.
  2.  **Ward Management:** Assigning wards and mohallas to surveyors and supervisors. Managing surveyor access to these wards.
  3.  **User Management:** Creating, updating, and managing system users and their roles. (UI for create/edit user is now implemented and styled; ready for end-to-end testing)
  4.  **Detailed Dashboards:** Access to in-depth, interactive dashboards with filtering, drill-down capabilities, and detailed reports.

### Secure Admin Panel (Authenticated)

- **All assignment management (wards/mohallas to users) is admin-only**
- QC workflow, user management, analytics, and reporting
- **Surveyors and supervisors do NOT have portal access**

---

## 3. Assignment & Dashboard Logic

- **All assignments are managed by admins via the web portal**
- **Surveyor and supervisor dashboards are in the mobile app only**
- **Dashboards are styled for all states (assignments, no assignments, errors)**
- **Supervisors can only view progress, not edit assignments**

---

## 4. Technology Stack

Based on the project requirements and for consistency with the mobile application, the following technology stack is recommended:

- **Framework:** **Next.js** (using the App Router for a modern, robust structure).
- **Language:** **TypeScript**.
- **Styling:** **Tailwind CSS** (for utility-first styling and consistency with the Expo app).
- **UI Components:** **Shadcn/ui** (for a collection of beautiful, accessible, and customizable components like Cards, Tables, and Charts).
- **Charting Library:** **Recharts** (for creating the interactive bar and line charts required for the dashboards).
- **Data Fetching/State Management:** **TanStack Query (React Query)** (for efficiently managing server state, including caching, refetching, and mutations).

---

## 5. Design & Layout

- **Main Layout:** A modern dashboard layout will be implemented, featuring:
  - A **collapsible sidebar** for easy navigation between sections (e.g., Dashboard, Ward Management, User Management, QC Panel).
  - A **top header** with the logged-in user's profile, notifications, a theme (light/dark) toggle, and a logout button.
- **Modularity:** The UI will be built with reusable React components, making the codebase clean, maintainable, and easy to scale. Each dashboard widget (e.g., "Property Wise Statistics") will be its own component.
- **Responsiveness:** The entire portal will be designed to be fully responsive, ensuring a seamless experience on desktops, tablets, and mobile browsers.

---

## 5. Current Development Status & Notes

- **Backend Modularization:** Master data APIs for ULB, Zone, Ward, and Mohalla are now modular, each with their own controller and route. Endpoints:
  - `GET /ulbs` — all ULBs
  - `GET /zones` — all Zones
  - `GET /zones/ulb/:ulbId` — Zones by ULB
  - `GET /wards` — all Wards
  - `GET /wards/zone/:zoneId` — Wards by Zone
  - `GET /wards/statuses` — all Ward Statuses
  - `GET /mohallas` — all Mohallas
  - `GET /mohallas/ward/:wardId` — Mohallas by Ward
- **Frontend Integration:** The admin panel's Ward Management and Assignment tabs use these new endpoints.
- **Assignment & Conflict Logic:** Backend service logic for assignment and conflict resolution exists; endpoint and UI integration are ongoing.
- **User Management:** The create/edit user UI is implemented and styled; ready for end-to-end testing.
- **QC Workflow:** Multi-level QC review and approval endpoints implemented; frontend integration ongoing.
- **Error Handling:** Improved error and loading state handling added.
- **Property Image Support:** Backend and frontend support for property image attachments added.
- **Dependencies:** Ensure all required packages (e.g., @radix-ui/react-slot, class-variance-authority, utils) are installed and available.
- **Known Issues:** Document any current module resolution or build errors and their solutions (e.g., restarting dev server, checking file paths).
- **Next Steps:** Finalize QC workflow frontend, complete assignment management UI, enhance reporting/dashboard features.

This document will be updated continuously as the project evolves.
