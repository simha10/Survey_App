# Next Steps: Floor-wise Property Assessment Integration

## 1. Business Requirement

- Floor-wise property assessment is required for both residential and non-residential properties (see PRD.md and Essentials/Form Structure.txt).
- The backend schema now supports this via `ResidentialPropertyAssessment` and `NonResidentialPropertyAssessment`, with a foreign key to `FloorMaster` (`floornumberId`).

## 2. Current State

- **DTOs:** No DTOs for floor-wise assessment data exist.
- **Service:** No handling of floor-wise assessment data.
- **Controller:** No validation or passing of floor-wise assessment data.
- **Mobile Form:** No UI for entering floor-wise assessment data.

## 3. Required Changes

### A. DTOs (backend/src/dtos/surveyDto.ts)

- Add DTO schemas for:
  - `ResidentialPropertyAssessment`
  - `NonResidentialPropertyAssessment`
- Add these as arrays in the main `CreateSurveyDtoSchema`.
- Use `floornumberId: number` (not string) in these schemas.

### B. Service (backend/src/services/surveyService.ts)

- Accept and create floor-wise assessment records as part of the survey transaction.
- Insert into `ResidentialPropertyAssessment` and/or `NonResidentialPropertyAssessment` as appropriate.

### C. Controller (backend/src/controllers/surveyController.ts)

- Validate and pass floor-wise assessment data to the service.
- Ensure errors are handled if floor-wise data is missing or malformed.

### D. Mobile Form (my-expo-app/src/screens/AddSurveyForm.tsx)

- Add UI to allow users to add multiple floor-wise entries (with fields for `floornumberId`, and other required fields).
- Collect and send this data as part of the survey payload.
- Ensure the form supports both residential and non-residential property types.

## 4. Reference

- See `Essentials/Form Structure.txt` and `PRD.md` for business requirements and field details.
- See `backend/prisma/schema.prisma` for the latest DB schema.

---

**Proceed with DB migration first. Then follow the above steps to complete floor-wise assessment integration.**
