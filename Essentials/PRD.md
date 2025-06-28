Absolutely, bro. Here's a **clean, simple and complete PRD (Product Requirement Document)** written in plain terms — so that anyone, from a non-tech client to a developer, can easily understand what this project is about, what needs to be done, and why.

---

# 📘 **Product Requirement Document (PRD)**

**Project Name:** LRM Property Survey System

---

## 1. 📌 **What Is This Project?**

This project digitizes the manual property survey process for municipalities. It collects detailed property data via a mobile app and verifies it through a web portal. The system ensures correct, centralized property data collection, verification, and storage.

---

## 2. 🎯 **What Needs to Be Developed?**

### ✅ Mobile App (Surveyors & Supervisors)

- Surveyors conduct property surveys, view assignments, and sync data.
- Supervisors view assigned wards/mohallas and monitor surveyor progress via a dashboard.
- All assignment and dashboard features are implemented in the app.
- **Surveyors and supervisors do NOT have web portal access.**

### ✅ Web Portal (Admins & QC)

- Admins assign wards/mohallas to surveyors and supervisors.
- QC staff review, approve, or reject survey data.
- User management, analytics, and reporting.
- **Only admins and QC have portal access.**

### ✅ Secure, Role-Based Backend

- Centralized data storage and validation.
- Assignment logic supports multiple wards/mohallas per user, cross-ULB assignments, and robust enforcement.

---

## 3. 👥 **Who Will Use This System?**

- **Super Admin/Admin:** Assigns users, manages data, reviews progress (web portal only).
- **Supervisor:** Monitors surveyor progress in assigned areas (mobile app only).
- **Surveyor:** Conducts surveys in assigned areas (mobile app only).
- **QC Team:** Reviews and approves survey data (web portal only).

---

## 4. 📲 **Mobile App Features**

- Secure login for surveyors and supervisors.
- Surveyors see only their assigned wards/mohallas and can only survey in those areas.
- Supervisors see a dashboard of all their assigned wards/mohallas, with surveyor lists and progress.
- Friendly, styled UI for all assignment and dashboard states (including errors/no assignments).
- Offline support and data sync.

---

## 5. 💻 **Web Portal Features**

- Admins assign/unassign wards/mohallas to users.
- QC workflow for multi-level review and approval.
- Analytics and reporting dashboards.
- User management (create/edit/deactivate users).
- **No access for surveyors/supervisors.**

---

## 6. ✅ **Assignment & Dashboard Logic**

- All assignments are managed by admins via the web portal.
- Surveyors and supervisors cannot change their own assignments.
- Surveyor dashboard shows all assignments and a message if none exist.
- Supervisor dashboard shows all assigned wards/mohallas, surveyors, and survey progress, or a message if none exist.
- All dashboards are styled and user-friendly, even in error/no-data states.

---

## 7. ⚠️ **Project Constraints & Rules**

- Only admins can manage assignments and users.
- Surveyors can only survey in assigned areas.
- Supervisors can only view progress in assigned areas.
- All assignment and dashboard logic is robust and production-ready.

---

## 8. **Current Status**

- Assignment logic, dashboards, and all major flows are implemented and tested.
- Mobile app and web portal are ready for end-to-end testing.
- Further enhancements (e.g., supervisor analytics, messaging) can be added as needed.
