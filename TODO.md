# QC Workflow Implementation Plan (Up to Level 2)

## Overview
This TODO outlines the phased implementation for QC Workflow enhancements up to Level 2 (Survey QC by Supervisor and In-Office QC by Admin). Subsequent levels (RI QC and Final QC) will be implemented in future phases.

## Phase 1: RBAC and Schema Enhancements
- [ ] Review and update role structure for SUPERVISOR and ADMIN roles
- [ ] Enable SUPERVISOR web portal access with limited routes (/qc/level/1)
- [ ] Extend QCStatusEnum with level-specific statuses (SURVEY_QC_PENDING, SURVEY_QC_DONE, IN_OFFICE_QC_PENDING, IN_OFFICE_QC_DONE, REVERTED_TO_SURVEY)
- [ ] Enhance QCRecord model with fields: revertedFromLevel, revertedReason, lastViewedAt
- [ ] Implement QCLevelMaster table for levels 1 (Survey QC) and 2 (In-Office QC)
- [ ] Add BulkActionLog table for logging bulk actions at Level 2

## Phase 2: Backend Workflow Logic
- [ ] Update property list query for QC visibility (filter by qcLevel and role)
- [ ] Implement submit logic for Level 1 to Level 2 transition
- [ ] Implement revert logic from Level 2 to Level 1 with reason
- [ ] Enforce mandatory edit check for Level 1 (require lastViewedAt before submission)
- [ ] Implement bulk actions for Level 2 (up to 10 records, approve/reject/mark error)
- [ ] Add audit logging for all actions (submit, revert, edit, bulk) in QCRecord and BulkActionLog

## Phase 3: Frontend Enhancements (Levels 1 and 2)
- [ ] Create level-specific pages (/qc/level/1 for Supervisor, /qc/level/2 for Admin)
- [ ] Build record table with filters and edit buttons (no bulk checkboxes for Level 1)
- [ ] Develop edit modal with full survey form, remark fields, and status options
- [ ] Implement bulk action bar for Level 2 (approve/reject/mark error, max 10 records)
- [ ] Add revert UI in edit modal for Level 2 (revert to Level 1 with reason)
- [ ] Show progress indicators for levels 1 and 2 completion stats

## Phase 4: Integration, Testing, and Deployment
- [ ] Integrate backend and frontend for levels 1 and 2 workflow
- [ ] Run unit tests for backend logic (transitions, visibility, bulk limits)
- [ ] Run integration tests for submit/revert flows between levels 1 and 2
- [ ] Run E2E tests for user journeys (Supervisor edit → Admin bulk/revert)
- [ ] Validate security (RBAC for SUPERVISOR and ADMIN roles)
- [ ] Optimize performance for bulk actions at Level 2
- [ ] Deploy to staging and production with migrations
- [ ] Update documentation (QC_REMARKS_IMPLEMENTATION.md, QCPLAN.md) for levels 1 and 2
