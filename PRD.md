Absolutely, bro. Here's a **clean, simple and complete PRD (Product Requirement Document)** written in plain terms — so that anyone, from a non-tech client to a developer, can easily understand what this project is about, what needs to be done, and why.

---

# 📘 **Product Requirement Document (PRD)**

**Project Name:** LRM Property Survey System

---

## 1. 📌 **What Is This Project?**

This project is designed to **digitize the manual property survey process** carried out in municipalities. It aims to collect detailed information about every property (residential, commercial, or mixed) in a city or ward through a mobile app and verify it through multiple levels using a web portal.

This system ensures that the **correct data about properties** — including their usage, construction status, ownership, and tax relevance — is collected, verified, and stored in one centralized system.

---

## 2. 🎯 **What Needs to Be Developed?**

### ✅ A Mobile App (used by surveyors & field staff)

* To conduct property surveys
* To work even in **offline mode**
* To **store, review, and sync** collected data

### ✅ A Web Portal (used by admin and QC staff)

* To **review and verify** the submitted survey data
* To identify **duplicate or invalid submissions**
* To **approve**, **edit**, or **reject** survey data
* To **manage surveyors and users**
* To **analyze reports**, track survey progress, and download data

### ✅ A Secure, Role-Based Backend System

* That controls **who can access what** depending on their role
* Stores data in a central database
* Validates and processes information coming from both app and web

---

## 3. 👥 **Who Will Use This System?**

1. **Super Admin (Top-level control)**
   Can add admins and oversee everything

2. **Admin (Office Team)**
   Can add/remove surveyors and supervisors, monitor progress, and manage zones

3. **Supervisor (Field QC)**
   Manages the surveyors on field, helps in identifying GIS IDs, and reviews submissions

4. **Surveyor (Field Staff)**
   Conducts property surveys through the mobile app in assigned wards only

5. **QC Team (Office Web Portal)**
   Verifies collected data and performs multi-level approval

---

## 4. 📲 **Role of the Mobile App**

The app is the **primary tool for field data collection**. It will:

* Allow surveyors to login securely
* Show them **only the areas (wards) they are assigned to**
* Allow data collection for each property:

  * Owner details
  * Property usage
  * Floor-wise details
  * Utilities (sewer, water, etc.)
* Store data **offline** if there's no internet
* Sync data to the server once online
* Fetch old property data if available, for reference
* Allow surveyors to track their own progress

---

## 5. 💻 **Role of the Web Portal**

The website is **essential for office-based management and final decisions**. It is used to:

* View and analyze collected data from all surveyors
* Perform **multi-level QC checks** before confirming a property
* Detect and resolve **duplicate surveys** using GIS IDs
* Allow searching, editing, and verifying of records
* Export data into Excel for auditing
* Track who surveyed which property and when
* Manage user permissions and roles

---

## 6. ✅ **What Functionalities Are Required?**

### 🔐 User Management (Based on Roles)

* Login with credentials (username/password)
* Role-based access: only see features allowed by your role

### 📍 Area Assignment

* Admins assign surveyors to specific zones and wards
* Surveyors **cannot survey outside their assigned area**

### 🏠 Property Survey

* Property Type selection (residential, commercial, mixed, others)
* Detailed step-by-step form with:

  * Survey details
  * Property details
  * Owner details
  * Location details
  * Other property conditions (utilities, water, etc.)
  * Floor-wise usage and data

### 📡 Offline Survey Support

* Save data locally when offline
* Show previous data for reference when possible
* Sync data with the server when online

### 🧹 Review, Update & Deletion

* Before syncing, surveyor can:

  * Edit surveys
  * Delete incorrect ones
  * Add another property

### 👀 QC and Duplicate Handling (Web Portal)

* Detect same GIS ID in multiple surveys
* Compare and confirm the correct survey
* Mark duplicates and remove unnecessary entries
* Perform multiple levels of QC
* Add missing office-level info (if needed)

---

## 7. ⚠️ **Project Constraints & Rules**

* **Only Admins** can assign wards and create users
* **Surveyors can’t work outside their assigned wards**
* **GIS ID** is used to uniquely identify a property (added manually on field)
* Data should be editable until it passes final QC
* If a property is surveyed twice, only one should survive QC
* The system must be able to scale to thousands of records
* Security is critical — no unauthorized access allowed
* Should support local languages (if needed in future)

---

## 8. 🔚 **Why Website Is a Must**

The app is only for **data collection**. But the data is **useless without review and validation**.

The web portal enables:

* Office staff to clean and finalize data
* Multi-level quality checks
* Reports and analytics
* Administration and role management
* Data corrections which cannot be done from mobile

**Without the website, no survey can be trusted or finalized.**
So it’s not optional — it’s a **core component** of this system.

---

