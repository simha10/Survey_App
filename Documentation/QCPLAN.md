# QCPLAN: Quality Control Workflow & Architecture Enhancement

## 1. **Current State Overview**

- **QC APIs exist** for property list, single QC update, bulk QC actions, and QC history.
- **QC logic** is handled in `qcService.ts` and `qcController.ts`.
- **SurveyDetails** is the main table for property data; QC actions are tracked in `QCRecord`.
- **Bulk actions** and inline editing are not yet implemented in the frontend.

---

## 2. **Recommended Improvements & Future-Proofing**

### **A. Database & Models**

#### 1. **QCLevelMaster Table**

- **Purpose:** Define and manage multiple QC levels (e.g., Field QC, Supervisor QC, Admin QC).
- **Fields:**
  - `qcLevelId` (PK, int, auto-increment)
  - `levelName` (string, e.g., 'Field QC', 'Supervisor QC')
  - `description` (string, optional)
  - `isActive` (boolean)
  - `createdAt`, `updatedAt`
- **Benefits:**
  - Easily add/remove QC levels without code changes.
  - Supports future workflows with more/less QC steps.

#### 2. **QCRecord Table (Enhancement)**

- **Add fields:**
  - `errorType` (enum/string: 'MISS', 'DUP', 'OTH', etc.)
  - `bulkActionId` (nullable, FK to a new BulkActionLog table)
- **Purpose:**
  - Track error types and bulk actions for better auditability.

#### 3. **BulkActionLog Table (New)**

- **Purpose:** Log all bulk QC actions for traceability.
- **Fields:**
  - `bulkActionId` (PK, uuid)
  - `actionType` (string: 'APPROVE', 'REJECT', 'MARK_ERROR', etc.)
  - `performedById` (FK to UsersMaster)
  - `performedAt` (datetime)
  - `remarks` (string, optional)
  - `affectedSurveyCodes` (array of uuid or join table)

#### 4. **QCErrorTypeMaster Table (Optional)**

- **Purpose:** Manage error types centrally for flexibility.
- **Fields:**
  - `errorTypeId` (PK, int)
  - `errorTypeCode` (string: 'MISS', 'DUP', 'OTH')
  - `description` (string)
  - `isActive` (boolean)

---

### **B. API & Service Layer**

#### 1. **Property List API**

- Extend to return all columns needed for QC, including latest QC status, error type, remarks, etc.
- Support advanced filtering (by QC status, error type, date range, user, etc.).
- Add pagination and search.

#### 2. **Bulk QC Action API**

- Accepts array of survey codes, action, remarks, error type, and QC level.
- Logs each bulk action in BulkActionLog.
- Returns per-record success/failure for robust UI feedback.

#### 3. **QC Edit API**

- Fetches all property details, attachments, and full QC history.
- Allows updating QC status, error type, remarks, and triggers audit log.

#### 4. **QC Level Management APIs**

- CRUD endpoints for QCLevelMaster (admin only).
- Enables dynamic QC workflow configuration.

#### 5. **Error Type Management APIs**

- CRUD endpoints for QCErrorTypeMaster (admin only).

---

### **C. Frontend Architecture**

#### 1. **Results Table**

- Show all columns as per requirements.
- Add checkboxes for row selection and bulk actions bar.
- Inline editing for error type and remarks.
- Pagination, search, and filter chips.

#### 2. **Bulk Actions**

- Approve, Reject, Mark Error, Add Remark for selected rows.
- Confirmation dialog and feedback toasts.

#### 3. **QC Edit Page**

- Full property details, attachments, and QC history.
- Editable QC fields and audit trail.

#### 4. **QC Level & Error Type Management UI**

- Admin screens for managing QC levels and error types.

---

### **D. Best Practices & Extensibility**

- Use enums and master tables for all status/error types.
- Log all QC actions (single and bulk) for auditability.
- Use transactions for bulk updates to ensure atomicity.
- Design APIs to be stateless and filterable for easy integration with analytics and reporting.
- Document all endpoints and workflows for future onboarding.

---

## 3. **Future Integrations & Analytics**

- **QC Analytics Dashboard:**
  - Show stats by QC level, status, user, error type, etc.
- **Role-Based Access:**
  - Fine-grained permissions for QC actions and management.
- **Notification System:**
  - Notify users of QC status changes, errors, or required actions.
- **Export/Import:**
  - Allow export of QC data for offline review or regulatory compliance.

---

## 4. **References**

- See `backend/prisma/schema.prisma` for current models.
- See `backend/src/services/qcService.ts` and `backend/src/controllers/qcController.ts` for current logic.
- See `/web-portal/src/app/mis-reports/property-list/results.tsx` for frontend table implementation.

---

**This plan is designed for robust, scalable, and auditable QC workflows, supporting both current needs and future enhancements.**
