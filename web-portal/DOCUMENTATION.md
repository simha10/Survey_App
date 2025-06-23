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
  3.  **User Management:** Creating, updating, and managing system users and their roles.
  4.  **Detailed Dashboards:** Access to in-depth, interactive dashboards with filtering, drill-down capabilities, and detailed reports.

---

## 3. Technology Stack

Based on the project requirements and for consistency with the mobile application, the following technology stack is recommended:

- **Framework:** **Next.js** (using the App Router for a modern, robust structure).
- **Language:** **TypeScript**.
- **Styling:** **Tailwind CSS** (for utility-first styling and consistency with the Expo app).
- **UI Components:** **Shadcn/ui** (for a collection of beautiful, accessible, and customizable components like Cards, Tables, and Charts).
- **Charting Library:** **Recharts** (for creating the interactive bar and line charts required for the dashboards).
- **Data Fetching/State Management:** **TanStack Query (React Query)** (for efficiently managing server state, including caching, refetching, and mutations).

---

## 4. Design & Layout

- **Main Layout:** A modern dashboard layout will be implemented, featuring:
  - A **collapsible sidebar** for easy navigation between sections (e.g., Dashboard, Ward Management, User Management, QC Panel).
  - A **top header** with the logged-in user's profile, notifications, a theme (light/dark) toggle, and a logout button.
- **Modularity:** The UI will be built with reusable React components, making the codebase clean, maintainable, and easy to scale. Each dashboard widget (e.g., "Property Wise Statistics") will be its own component.
- **Responsiveness:** The entire portal will be designed to be fully responsive, ensuring a seamless experience on desktops, tablets, and mobile browsers.

---

This document will be updated continuously as the project evolves.
