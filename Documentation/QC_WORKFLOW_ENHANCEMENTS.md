# QC Workflow Enhancements

## Overview

This document details the complete Quality Control (QC) workflow enhancements for the Survey Application, specifying every minor functionality to be implemented, including the multi-level QC process (Survey QC, In-Office QC, RI QC, Final QC), role-based access control (RBAC) updates, revert mechanisms, visibility rules, and bulk operations. It outlines how the workflow operates and provides step-by-step implementation guidance, aligning with the existing architecture (Node.js/Express/Prisma backend, Next.js web portal, PostgreSQL database) as described in the provided project documents.

## 🎯 QC Workflow Overview

The QC workflow is a hierarchical, multi-level process ensuring data accuracy for property surveys. Each level has distinct users, responsibilities, and rules:

1. **Level 1: Survey QC (Supervisor)**:

   - Performed by SUPERVISOR users in the web portal.
   - Involves reviewing and editing every survey record individually; no bulk actions.
   - Mandatory visit to the edit page before submission to ensure thorough review.
   - Submits to Level 2 (In-Office QC) or marks as completed if no issues.
   - Records are hidden post-submission unless reverted from a higher level.

2. **Level 2: In-Office QC (Admin)**:

   - Performed by ADMIN users.
   - Supports bulk actions (up to 10 records) for efficiency, with checkboxes for selection.
   - Can revert to Level 1 if issues are found; otherwise, submits to Level 3 (RI QC).
   - Records are hidden post-submission unless reverted from Level 3 or 4.

3. **Level 3: RI QC (Revenue Inspector)**:

   - Performed by RI users (new sub-role or mapped to ADMIN with specific permissions).
   - Supports bulk actions for zones/wards, with advanced filtering.
   - Can revert to Level 2 if issues are found; otherwise, submits to Level 4 (Final QC).
   - Records are hidden post-submission unless reverted from Level 4.

4. **Level 4: Final QC**:

   - Performed by FINAL users (new sub-role or mapped to ADMIN/SUPERADMIN).
   - Supports bulk actions for zones/wards.
   - Can revert to Level 3 or lower if issues persist; final approval finalizes the survey data (sets GIS ID uniqueness).
   - Records are hidden post-approval or revert.

### Key Workflow Rules

- **Visibility**: Records are only visible to the current level’s user in PENDING or REVERTED states; once submitted (DONE), they disappear until reverted.
- **Reverts**: Higher levels can send records back to lower levels with a reason; reverted records reappear in the target level’s queue.
- **Bulk Actions**: Disabled at Level 1; limited to 10 records at Level 2; zone/ward-based at Levels 3-4.
- **Mandatory Edit**: Level 1 requires visiting the edit page before submission.
- **Auditability**: All actions (submit, revert, edit) are logged with timestamps, user IDs, and remarks in QCRecord and BulkActionLog.

## 🛠️ Functionalities to Implement

### 1. RBAC Enhancements

- **Add SUPERVISOR to Web Portal**:
  - Extend RBAC to allow SUPERVISOR role limited web portal access for Level 1 QC tasks.
- **Create RI and FINAL Sub-Roles**:
  - Define RI and FINAL as sub-roles (or permissions within ADMIN) for Levels 3 and 4.
- **Role Hierarchy**:
  - Enforce hierarchy: SUPERVISOR (L1), ADMIN (L2), RI (L3), FINAL (L4) with role-based route restrictions.
- **User Management UI**:
  - Add UI to assign RI/FINAL sub-roles or permissions to users.
- **Authentication Checks**:
  - Validate user role against QC level for all actions (view, edit, submit, revert).

### 2. Database Schema Updates

- **Extend QCStatusEnum**:
  - Add level-specific statuses (e.g., SURVEY_QC_PENDING, SURVEY_QC_DONE, IN_OFFICE_QC_PENDING, REVERTED_TO_SURVEY).
- **Enhance QCRecord Model**:
  - Add fields for revert tracking (revertedFromLevel, revertedReason) and edit tracking (lastViewedAt).
- **Implement QCLevelMaster**:
  - Create a table for dynamic QC level definitions (e.g., name: 'Survey QC', level: 1).
- **Implement BulkActionLog**:
  - Log bulk actions (approve/reject/mark error) with affected survey IDs, user, and remarks.
- **Optional QCErrorTypeMaster**:
  - Define error types (e.g., MISS, DUP) for consistent error classification.

### 3. Backend Workflow Logic

- **Visibility Rules**:
  - Filter records by qcStatus and qcLevel; show only PENDING or REVERTED records for the user’s level.
- **Submit Workflow**:
  - On submission, update current QCRecord to DONE_LX and create next-level record (PENDING_LX+1).
- **Revert Workflow**:
  - Allow higher levels to revert to lower levels with a reason; update qcStatus to REVERTED_TO_LX and create/reopen prior level record.
- **Mandatory Edit Check (Level 1)**:
  - Require lastViewedAt timestamp before allowing submission at Level 1.
- **Bulk Actions**:
  - Disable for Level 1; limit to 10 records at Level 2; allow zone/ward filtering at Levels 3-4.
- **Audit Logging**:
  - Log all actions (submit, revert, edit) in QCRecord and BulkActionLog with user, timestamp, and remarks.

### 4. Frontend (Web Portal) Features

- **Level-Specific Dashboards**:
  - Create pages (/qc/level/\[level\]) for each QC level with role-gated access.
- **Record Table**:
  - Display records with filters (status, zone, ward, mohalla) and edit buttons; include checkboxes for bulk at Levels 2-4.
- **Edit Modal**:
  - Full survey edit form with remark fields (RI, GIS, Survey Team, general) and status/revert options.
- **Bulk Action Bar**:
  - Enable approve/reject/mark error for selected records at Levels 2-4, with limit enforcement.
- **Revert UI**:
  - Add revert button with reason input in edit modal for Levels 2-4.
- **Progress Indicators**:
  - Show level-wise completion stats and status badges (e.g., “Pending RI QC”).

### 5. Testing and Validation

- **Unit Tests**:
  - Test backend services for transitions, visibility, and bulk limits.
- **Integration Tests**:
  - Simulate full workflows (submit, revert, bulk) across levels.
- **E2E Tests**:
  - Test user journeys (e.g., Supervisor edits → Admin bulk → RI revert).
- **Security Tests**:
  - Validate RBAC (e.g., SUPERVISOR can’t access Level 2).
- **Performance Tests**:
  - Ensure bulk actions at Levels 3-4 handle large datasets efficiently.

### 6. Deployment and Monitoring

- **Database Migrations**:
  - Apply schema changes and seed new statuses/levels.
- **API Deployment**:
  - Deploy new endpoints with CORS and auth configured.
- **Frontend Deployment**:
  - Deploy level pages and components, ensuring responsiveness.
- **Monitoring Setup**:
  - Log QC actions and monitor API performance.
- **Documentation Update**:
  - Update QC_REMARKS_IMPLEMENTATION.md and QCPLAN.md with new workflow details.
- **Backup Procedures**:
  - Ensure data recovery for QC records and logs.

## 🚀 Step-by-Step Implementation Plan

### Phase 1: RBAC and Schema Enhancements

1. **Review Role Structure**:
   - Analyze UsersMaster and auth middleware to confirm SUPERVISOR, ADMIN, RI, FINAL roles/sub-roles; define RI/FINAL as ADMIN permissions if not separate.
   - Coordinate with team to map roles to QC levels without breaking existing access.
2. **Enable SUPERVISOR Web Access**:
   - Update authentication middleware to allow SUPERVISOR for /qc/level/1 routes; test with mock users.
   - Add hasWebAccess flag to UsersMaster; set true for SUPERVISOR/ADMIN+.
3. **Extend QCStatusEnum**:
   - Add statuses (e.g., SURVEY_QC_PENDING, IN_OFFICE_QC_DONE, REVERTED_TO_SURVEY); verify with Prisma schema validation.
   - Seed new statuses in seed.ts; run in dev environment.
4. **Enhance QCRecord Model**:
   - Add revertedFromLevel (Int?), revertedReason (String?), lastViewedAt (DateTime?) fields; ensure migrations preserve data.
   - Test unique constraint (surveyUniqueCode, qcLevel) with sample records.
5. **Implement QCLevelMaster**:
   - Create table with fields (qcLevelId, levelName, description, isActive); seed with levels (Survey QC, In-Office QC, RI QC, Final QC).
   - Review with team to confirm level names and future flexibility.
6. **Add BulkActionLog**:
   - Create table (bulkActionId, actionType, performedById, performedAt, remarks, affectedSurveyCodes); test with dummy bulk actions.

### Phase 2: Backend Workflow Enhancements

1. **Update Property List Query**:
   - Modify getPropertyListForQC to filter by qcLevel and role; show only PENDING_LX or REVERTED_TO_LX records.
   - Test visibility with staged data (e.g., hide DONE_L1 for SUPERVISOR unless reverted).
2. **Implement Submit Logic**:
   - In updateSurveyAndQC, validate role-to-level match; update current record to DONE_LX and create PENDING_LX+1 record.
   - Test transitions (e.g., L1 → L2) with mock users and surveys.
3. **Implement Revert Logic**:
   - Add revert endpoint (/api/qc/revert/:surveyUniqueCode) to set qcStatus = REVERTED_TO_LX, update revertedFromLevel/revertedReason, and reopen prior level.
   - Simulate reverts (e.g., L3 → L2) to ensure records reappear correctly.
4. **Enforce Mandatory Edit (Level 1)**:
   - Add /api/qc/mark-viewed/:surveyUniqueCode to set lastViewedAt; require it for L1 submits.
   - Test enforcement by attempting L1 submit without viewing.
5. **Implement Bulk Actions**:
   - Update bulkQCAction to disable for L1, limit to 10 records for L2, allow zone/ward filters for L3-4; log in BulkActionLog.
   - Test bulk limits and zone/ward filtering with large datasets.
6. **Audit Logging**:
   - Ensure all actions (submit, revert, edit, bulk) update QCRecord/BulkActionLog with user, timestamp, remarks; verify with SQL queries.

### Phase 3: Frontend (Web Portal) Enhancements

1. **Create Level-Specific Pages**:
   - Build /qc/level/\[level\] pages using QCWorkflowDashboard template; gate by role (e.g., SUPERVISOR for /qc/level/1).
   - Test access redirects for unauthorized roles.
2. **Build Record Table**:
   - Display records with columns (survey ID, status, zone, ward, edit button); add checkboxes for L2-4; test filtering by status/zone.
   - Use TanStack Query for data fetching; verify visibility rules.
3. **Develop Edit Modal**:
   - Extend QCRemarksPanel with full survey edit form, remark fields, status dropdown, and revert option (L2+); test form validation.
   - Call markAsViewed on modal open for L1; disable submit if not viewed.
4. **Implement Bulk Action Bar**:
   - Add approve/reject/mark error buttons for selected records (L2: max 10; L3-4: zone/ward selectors); test limit enforcement.
   - Show toast notifications for success/errors; verify bulk updates.
5. **Add Revert UI**:
   - Include revert button in modal (L2-4) with reason input; test revert flow (e.g., L3 → L2 reappears in L2 queue).
   - Ensure revert reasons display in history tab of QCRemarksPanel.
6. **Show Progress Indicators**:
   - Add level-wise stats (e.g., % complete) and status badges to dashboard; test with mock API responses.

### Phase 4: Integration, Testing, and Deployment

1. **Integrate Backend and Frontend**:
   - Deploy APIs and pages in staging; test full workflow (L1 edit → L2 bulk → L3 revert → L4 approve).
   - Resolve integration issues (e.g., API response mismatches) in team syncs.
2. **Run Comprehensive Tests**:
   - Unit: Test service logic (transitions, bulk limits) with Jest.
   - Integration: Simulate submits/reverts across levels with mock data.
   - E2E: Use Cypress to test user journeys (e.g., SUPERVISOR edit → ADMIN bulk).
3. **Validate Security**:
   - Test RBAC (e.g., SUPERVISOR can’t access L2); simulate unauthorized API calls.
   - Verify GIS ID uniqueness only on FINAL_QC_DONE.
4. **Optimize Performance**:
   - Test bulk actions with 1000+ records; add pagination if needed.
   - Monitor API response times; optimize queries with indexing.
5. **Deploy to Production**:
   - Apply migrations, deploy APIs/pages, configure CORS/auth; test in prod-like environment.
   - Set up monitoring (e.g., Sentry) for QC actions and errors.
6. **Update Documentation**:
   - Revise QC_REMARKS_IMPLEMENTATION.md and QCPLAN.md with workflow details; share with team for review.

## 🔧 How the QC Workflow Works

1. **Survey Submission**:
   - Surveyors submit surveys via mobile app, creating SurveyDetails records with surveyUniqueCode; QCRecord created with SURVEY_QC_PENDING for Level 1.
2. **Level 1 (Survey QC)**:
   - Supervisor logs into web portal (/qc/level/1), sees PENDING_L1 records, opens edit modal, reviews/edits data, marks viewed, submits to IN_OFFICE_QC_PENDING (L2).
   - Records disappear from L1 unless reverted.
3. **Level 2 (In-Office QC)**:
   - Admin sees PENDING_L2/REVERTED_TO_L2 records, selects up to 10 for bulk approve/reject or edits individually; submits to RI_QC_PENDING (L3) or reverts to L1 with reason.
   - Records hide post-submit unless reverted.
4. **Level 3 (RI QC)**:
   - RI user sees PENDING_L3/REVERTED_TO_L3 records, uses zone/ward filters for bulk actions, submits to FINAL_QC_PENDING (L4) or reverts to L2.
   - Records hide post-submit unless reverted.
5. **Level 4 (Final QC)**:
   - FINAL user sees PENDING_L4/REVERTED_TO_L4 records, performs bulk actions, approves (FINAL_QC_DONE, sets GIS ID) or reverts to L3/L2.
   - Approved records are finalized; no further QC unless reopened.
6. **Reverts**:
   - Higher levels revert with reason; records reappear in target level’s queue (e.g., REVERTED_TO_SURVEY for L1).
7. **Audit Trail**:
   - All actions logged in QCRecord/BulkActionLog with user, timestamp, remarks; visible in QCRemarksPanel history tab.