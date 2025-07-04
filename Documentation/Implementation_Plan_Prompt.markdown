# Implementation Plan Prompt for LRM Property Survey System Schema Enhancements

## Objective

Implement the proposed additions to the `schema.prisma` file for the LRM Property Survey System to optimize data access, support planned QC workflows, enhance file attachment management, and improve status flexibility. The implementation must maintain the integrity of existing backend (Node.js/Express/Prisma), frontend (Next.js), and mobile app (React Native/Expo) functionalities, ensuring no changes to existing routes, controllers, DTOs, services, or UI components unless explicitly required for new features. The changes should enhance performance, scalability, and ease of use while aligning with the project's modular architecture.

## Background

The proposed schema additions include:
1. **Additional Indexes** on `SurveyDetails.zoneId`, `SurveyorAssignment.assignedById`, and a composite index on `QCRecord.reviewedAt, qcStatus` for faster queries.
2. **New Tables** for QC workflows (`QCLevelMaster`, `BulkActionLog`, `QCErrorTypeMaster`) with optional fields in `QCRecord`.
3. **SurveyStats Cache Table** for precomputed survey analytics.
4. **Attachment Table** for flexible file management.
5. **StatusMaster Table** for dynamic status management.

These changes are designed to be additive, ensuring compatibility with existing functionality as described in PRD.md, BACKEND_DOCUMENTATION.md, QCPLAN.md, and PROJECT_STATUS.md.

## Implementation Requirements

- **Maintain Integrity:** Do not modify existing schema fields, relationships, or enums unless explicitly specified. Ensure existing routes, controllers, DTOs, services, and UI components remain unchanged and functional.
- **Performance Focus:** Optimize for minimal data access time using indexes and caching.
- **Scalability:** Support large datasets and future enhancements (e.g., multi-level QC, analytics).
- **Ease of Use:** Simplify query logic and future configuration (e.g., dynamic statuses).
- **Compatibility:** Use optional fields and new endpoints to avoid breaking existing functionality.
- **Testing:** Validate all changes to ensure no regressions in existing features.
- **Documentation:** Update relevant documentation to reflect new tables and endpoints.

## Implementation Steps

### 1. Database Schema Updates

**Objective:** Add new tables and indexes to `schema.prisma` without altering existing models or fields.

**Steps:**

1. **Backup Database:**
   - Create a full backup of the production and staging databases to prevent data loss.

2. **Update `schema.prisma`:**
   - Add the following to `backend/prisma/schema.prisma`:

     ```prisma
     // Additional Indexes
     model SurveyDetails {
       // Existing fields...
       @@index([zoneId])
     }

     model SurveyorAssignment {
       // Existing fields...
       @@index([assignedById])
     }

     model QCRecord {
       // Existing fields...
       qcLevelId       Int?               // FK to QCLevelMaster
       errorTypeId     Int?               // FK to QCErrorTypeMaster
       bulkActionId    String?            // FK to BulkActionLog
       qcLevel         QCLevelMaster?     @relation(fields: [qcLevelId], references: [qcLevelId])
       errorType       QCErrorTypeMaster? @relation(fields: [errorTypeId], references: [errorTypeId])
       bulkAction      BulkActionLog?     @relation(fields: [bulkActionId], references: [bulkActionId])

       @@index([reviewedAt, qcStatus])
       @@index([qcLevelId])
       @@index([errorTypeId])
       @@index([bulkActionId])
     }

     // New Tables
     model QCLevelMaster {
       qcLevelId    Int      @id @default(autoincrement())
       levelName    String   @unique @db.VarChar(50)
       description  String?  @db.VarChar(200)
       isActive     Boolean  @default(true)
       createdAt    DateTime @default(now())
       updatedAt    DateTime @updatedAt
       qcRecords    QCRecord[]

       @@index([levelName])
       @@index([isActive])
     }

     model BulkActionLog {
       bulkActionId      String    @id @default(uuid())
       actionType        String    @db.VarChar(20)
       performedById     String
       performedAt       DateTime  @default(now())
       remarks           String?   @db.VarChar(500)
       affectedSurveyCodes String[] @db.VarChar(36)
       qcRecords         QCRecord[]
       performedBy       UsersMaster @relation(fields: [performedById], references: [userId])

       @@index([performedById])
       @@index([performedAt])
       @@index([actionType])
       @@index([affectedSurveyCodes], type: Gin)
     }

     model QCErrorTypeMaster {
       errorTypeId   Int      @id @default(autoincrement())
       errorTypeCode String   @unique @db.VarChar(10)
       description   String?  @db.VarChar(200)
       isActive      Boolean  @default(true)
       createdAt     DateTime @default(now())
       updatedAt     DateTime @updatedAt
       qcRecords     QCRecord[]

       @@index([errorTypeCode])
       @@index([isActive])
     }

     model SurveyStats {
       id            Int      @id @default(autoincrement())
       ulbId         String
       wardId        String
       mohallaId     String?
       statusId      Int
       surveyCount   Int
       lastRefreshed DateTime @default(now())
       ulb           UlbMaster?        @relation(fields: [ulbId], references: [ulbId])
       ward          WardMaster?       @relation(fields: [wardId], references: [wardId])
       mohalla       MohallaMaster?    @relation(fields: [mohallaId], references: [mohallaId])
       status        SurveyStatusMaster @relation(fields: [statusId], references: [surveyStatusId])

       @@index([ulbId, wardId, statusId])
       @@index([mohallaId])
       @@index([lastRefreshed])
     }

     model Attachment {
       attachmentId     String        @id @default(uuid())
       surveyUniqueCode String        @db.Uuid
       fileUrl          String        @db.VarChar(200)
       fileType         String        @db.VarChar(20)
       fileSize         Int
       uploadedById     String
       uploadedAt       DateTime      @default(now())
       survey           SurveyDetails @relation(fields: [surveyUniqueCode], references: [surveyUniqueCode])
       uploadedBy       UsersMaster   @relation(fields: [uploadedById], references: [userId])

       @@index([surveyUniqueCode])
       @@index([uploadedById])
       @@index([uploadedAt])
       @@index([fileType])
     }

     model StatusMaster {
       statusId      Int      @id @default(autoincrement())
       statusCode    String   @unique @db.VarChar(20)
       entityType    String   @db.VarChar(50)
       description   String?  @db.VarChar(200)
       isActive      Boolean  @default(true)
       createdAt     DateTime @default(now())
       updatedAt     DateTime @updatedAt

       @@index([statusCode])
       @@index([entityType])
       @@index([isActive])
     }
     ```

3. **Run Prisma Migrations:**
   - Execute `npx prisma migrate dev --name add_new_tables_and_indexes` to create the new tables and indexes.
   - Test migrations on a staging database to ensure no disruptions.

4. **Populate Initial Data:**
   - Seed `QCLevelMaster` with initial QC levels (e.g., 'Field QC', 'Supervisor QC') via `prisma/seed.ts`.
   - Seed `QCErrorTypeMaster` with initial error types (e.g., 'MISS', 'DUP', 'OTH').
   - Seed `StatusMaster` with existing enum values (e.g., `QCStatusEnum`, `SyncStatusEnum`) for future migration.

5. **Set Up Cache Refresh for `SurveyStats`:**
   - Create a cron job (e.g., using `node-cron`) to refresh `SurveyStats` nightly:
     ```javascript
     // backend/src/utils/cronJobs.ts
     import { PrismaClient } from '@prisma/client';
     import cron from 'node-cron';

     const prisma = new PrismaClient();

     cron.schedule('0 0 * * *', async () => {
       await prisma.$executeRaw`
         INSERT INTO "SurveyStats" ("ulbId", "wardId", "mohallaId", "statusId", "surveyCount", "lastRefreshed")
         SELECT 
           ulbId,
           wardId,
           mohallaId,
           surveyStatusId,
           COUNT(*) as surveyCount,
           NOW() as lastRefreshed
         FROM "SurveyDetails"
         JOIN "SurveyStatusMapping" ON "SurveyDetails"."surveyUniqueCode" = "SurveyStatusMapping"."surveyUniqueCode"
         WHERE "SurveyStatusMapping"."isActive" = true
         GROUP BY ulbId, wardId, mohallaId, surveyStatusId
         ON CONFLICT (ulbId, wardId, mohallaId, statusId) 
         DO UPDATE SET surveyCount = EXCLUDED.surveyCount, lastRefreshed = NOW();
       `;
     });
     ```
   - Add this job to `app.ts` initialization.

**Compatibility Notes:**
- New tables and optional fields in `QCRecord` do not affect existing queries or logic.
- Indexes are transparent to Prisma and existing services.
- Use nullable fields (`qcLevelId`, `errorTypeId`, `bulkActionId`) to ensure existing `QCRecord` logic (using `qcLevel`, `qcStatus`) remains functional.

### 2. Backend Updates

**Objective:** Add new controllers, services, and routes for new tables without modifying existing ones.

**Steps:**

1. **Create New Controllers:**
   - Add `qcLevelController.ts`, `qcErrorTypeController.ts`, `attachmentController.ts`, and `statusController.ts` in `backend/src/controllers/`:
     ```typescript
     // backend/src/controllers/qcLevelController.ts
     import { Request, Response } from 'express';
     import { qcLevelService } from '../services/qcLevelService';
     import { createQCLevelSchema, updateQCLevelSchema } from '../dtos/qcLevelDTO';

     export const createQCLevel = async (req: Request, res: Response) => {
       const data = createQCLevelSchema.parse(req.body);
       const qcLevel = await qcLevelService.createQCLevel(data);
       res.status(201).json(qcLevel);
     };

     export const getQCLevels = async (req: Request, res: Response) => {
       const qcLevels = await qcLevelService.getQCLevels({ isActive: true });
       res.json(qcLevels);
     };
     // Add other CRUD methods...
     ```
   - Similarly, create controllers for `QCErrorTypeMaster`, `Attachment`, and `StatusMaster`.

2. **Create New Services:**
   - Add `qcLevelService.ts`, `qcErrorTypeService.ts`, `attachmentService.ts`, and `statusService.ts` in `backend/src/services/`:
     ```typescript
     // backend/src/services/qcLevelService.ts
     import { PrismaClient } from '@prisma/client';

     const prisma = new PrismaClient();

     export const qcLevelService = {
       createQCLevel: async (data: { levelName: string; description?: string }) => {
         return prisma.qCLevelMaster.create({ data });
       },
       getQCLevels: async (filters: { isActive?: boolean }) => {
         return prisma.qCLevelMaster.findMany({ where: filters });
       },
       // Add other CRUD methods...
     };
     ```
   - Similarly, create services for other new tables.

3. **Create New DTOs:**
   - Add DTOs in `backend/src/dtos/`:
     ```typescript
     // backend/src/dtos/qcLevelDTO.ts
     import { z } from 'zod';

     export const createQCLevelSchema = z.object({
       levelName: z.string().min(2).max(50),
       description: z.string().max(200).optional(),
     });

     export const updateQCLevelSchema = z.object({
       levelName: z.string().min(2).max(50).optional(),
       description: z.string().max(200).optional(),
       isActive: z.boolean().optional(),
     });
     ```
   - Create similar DTOs for `QCErrorTypeMaster`, `Attachment`, and `StatusMaster`.

4. **Update Routes:**
   - Add new routes in `backend/src/routes/` without modifying existing ones:
     ```typescript
     // backend/src/routes/qcRoutes.ts
     import express from 'express';
     import { createQCLevel, getQCLevels } from '../controllers/qcLevelController';
     import { authenticateJWT, requireRole } from '../middleware/authMiddleware';

     const router = express.Router();

     router.post('/level', authenticateJWT, requireRole(['ADMIN']), createQCLevel);
     router.get('/levels', authenticateJWT, requireRole(['ADMIN', 'QC']), getQCLevels);
     // Add routes for QCErrorTypeMaster, Attachment, StatusMaster...
     export default router;
     ```
   - Mount in `app.ts`:
     ```typescript
     app.use('/api/qc', qcRoutes);
     ```

5. **Enhance QC Service for New Fields:**
   - Update `qcService.ts` to support new `QCRecord` fields (`qcLevelId`, `errorTypeId`, `bulkActionId`) in new methods, leaving existing methods unchanged:
     ```typescript
     // backend/src/services/qcService.ts
     export const qcService = {
       // Existing methods...
       createBulkQCAction: async (data: {
         surveyCodes: string[];
         actionType: string;
         remarks?: string;
         qcLevelId?: number;
         errorTypeId?: number;
         performedById: string;
       }) => {
         const bulkAction = await prisma.bulkActionLog.create({
           data: {
             actionType: data.actionType,
             performedById: data.performedById,
             remarks: data.remarks,
             affectedSurveyCodes: data.surveyCodes,
           },
         });
         const qcRecords = await prisma.qCRecord.createMany({
           data: data.surveyCodes.map((code) => ({
             surveyUniqueCode: code,
             qcLevelId: data.qcLevelId,
             errorTypeId: data.errorTypeId,
             bulkActionId: bulkAction.bulkActionId,
             qcStatus: data.actionType as any,
             reviewedById: data.performedById,
             remarks: data.remarks,
           })),
         });
         return { bulkAction, qcRecords };
       },
     };
     ```

6. **Add Attachment Upload Logic:**
   - Integrate with cloud storage (e.g., AWS S3) in `attachmentService.ts`:
     ```typescript
     // backend/src/services/attachmentService.ts
     import { PrismaClient } from '@prisma/client';
     import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

     const prisma = new PrismaClient();
     const s3 = new S3Client({ region: process.env.AWS_REGION });

     export const attachmentService = {
       uploadAttachment: async (surveyUniqueCode: string, file: Express.Multer.File, uploadedById: string) => {
         const uploadResult = await s3.send(new PutObjectCommand({
           Bucket: process.env.S3_BUCKET,
           Key: `surveys/${surveyUniqueCode}/${file.originalname}`,
           Body: file.buffer,
         }));
         return prisma.attachment.create({
           data: {
             surveyUniqueCode,
             fileUrl: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/surveys/${surveyUniqueCode}/${file.originalname}`,
             fileType: file.mimetype,
             fileSize: file.size,
             uploadedById,
           },
         });
       },
     };
     ```

**Compatibility Notes:**
- New controllers, services, and routes are isolated from existing ones, ensuring no impact on current functionality.
- Optional `QCRecord` fields allow existing QC logic to continue using `qcLevel` and `qcStatus`.
- `SurveyStats` and `Attachment` are queried via new endpoints, leaving existing survey routes unchanged.

### 3. Frontend (Web Portal) Updates

**Objective:** Add UI components for new QC and attachment features without modifying existing screens.

**Steps:**

1. **QC Level Management UI:**
   - Add a new page in `web-portal/src/app/admin/qc-levels/` for managing `QCLevelMaster`:
     ```jsx
     // web-portal/src/app/admin/qc-levels/index.tsx
     import React, { useEffect, useState } from 'react';
     import axios from 'axios';

     const QCLevelsPage = () => {
       const [qcLevels, setQCLevels] = useState([]);

       useEffect(() => {
         axios.get('/api/qc/levels', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
           .then(response => setQCLevels(response.data));
       }, []);

       return (
         <div className="p-4">
           <h1 className="text-2xl">QC Levels</h1>
           <table className="w-full">
             <thead>
               <tr>
                 <th>Name</th>
                 <th>Description</th>
                 <th>Actions</th>
               </tr>
             </thead>
             <tbody>
               {qcLevels.map(level => (
                 <tr key={level.qcLevelId}>
                   <td>{level.levelName}</td>
                   <td>{level.description}</td>
                   <td>Edit | Delete</td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       );
     };
     export default QCLevelsPage;
     ```
   - Add navigation link in admin dashboard.

2. **QC Bulk Actions UI:**
   - Enhance `web-portal/src/app/mis-reports/property-list/results.tsx` with bulk action support, using existing table structure:
     ```jsx
     // web-portal/src/app/mis-reports/property-list/results.tsx
     import React, { useState } from 'react';
     import axios from 'axios';

     const ResultsTable = ({ properties }) => {
       const [selectedRows, setSelectedRows] = useState([]);

       const handleBulkAction = async (actionType) => {
         await axios.post('/api/qc/bulk-qc', {
           surveyCodes: selectedRows,
           actionType,
           remarks: 'Bulk action',
           qcLevelId: 1, // Example
           errorTypeId: actionType === 'MARK_ERROR' ? 1 : undefined,
         }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
         // Refresh table
       };

       return (
         <div>
           <div className="bulk-actions">
             <button onClick={() => handleBulkAction('APPROVE')}>Approve Selected</button>
             <button onClick={() => handleBulkAction('REJECT')}>Reject Selected</button>
             <button onClick={() => handleBulkAction('MARK_ERROR')}>Mark Error</button>
           </div>
           <table>
             <thead>
               <tr>
                 <th><input type="checkbox" onChange={(e) => setSelectedRows(e.target.checked ? properties.map(p => p.surveyUniqueCode) : [])} /></th>
                 {/* Existing columns */}
               </tr>
             </thead>
             <tbody>
               {properties.map(property => (
                 <tr key={property.surveyUniqueCode}>
                   <td><input type="checkbox" checked={selectedRows.includes(property.surveyUniqueCode)} onChange={() => toggleRow(property.surveyUniqueCode)} /></td>
                   {/* Existing columns */}
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       );
     };
     export default ResultsTable;
     ```

3. **Attachment UI:**
   - Add an attachment upload/view component in `web-portal/src/app/surveys/[id]/attachments.tsx`:
     ```jsx
     // web-portal/src/app/surveys/[id]/attachments.tsx
     import React, { useEffect, useState } from 'react';
     import axios from 'axios';

     const SurveyAttachments = ({ surveyUniqueCode }) => {
       const [attachments, setAttachments] = useState([]);

       useEffect(() => {
         axios.get(`/api/surveys/${surveyUniqueCode}/attachments`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
           .then(response => setAttachments(response.data));
       }, [surveyUniqueCode]);

       const handleUpload = async (e) => {
         const formData = new FormData();
         formData.append('file', e.target.files[0]);
         await axios.post(`/api/surveys/${surveyUniqueCode}/attachments`, formData, {
           headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' },
         });
         // Refresh attachments
       };

       return (
         <div>
           <h2>Attachments</h2>
           <input type="file" onChange={handleUpload} />
           <ul>
             {attachments.map(attachment => (
               <li key={attachment.attachmentId}>
                 <a href={attachment.fileUrl}>{attachment.fileUrl}</a> ({attachment.fileType}, {attachment.fileSize} bytes)
               </li>
             ))}
           </ul>
         </div>
       );
     };
     export default SurveyAttachments;
     ```

**Compatibility Notes:**
- New UI components are added as separate pages or enhancements, preserving existing screens (e.g., `results.tsx`).
- Use existing auth headers and role checks to ensure consistency.
- Bulk action UI extends existing table without altering its structure.

### 4. Mobile App Updates

**Objective:** Add attachment upload and QC level selection in the mobile app without modifying existing survey or dashboard flows.

**Steps:**

1. **Attachment Upload Screen:**
   - Add a new screen in `mobile-app/src/screens/SurveyAttachmentsScreen.tsx`:
     ```jsx
     // mobile-app/src/screens/SurveyAttachmentsScreen.tsx
     import React, { useEffect, useState } from 'react';
     import { View, Text, FlatList, Button } from 'react-native';
     import * as DocumentPicker from 'expo-document-picker';
     import axios from 'axios';

     const SurveyAttachmentsScreen = ({ route }) => {
       const { surveyUniqueCode } = route.params;
       const [attachments, setAttachments] = useState([]);

       useEffect(() => {
         axios.get(`http://api-endpoint/api/surveys/${surveyUniqueCode}/attachments`, {
           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
         }).then(response => setAttachments(response.data));
       }, [surveyUniqueCode]);

       const handleUpload = async () => {
         const result = await DocumentPicker.getDocumentAsync();
         if (result.type === 'success') {
           const formData = new FormData();
           formData.append('file', {
             uri: result.uri,
             name: result.name,
             type: result.mimeType,
           });
           await axios.post(`http://api-endpoint/api/surveys/${surveyUniqueCode}/attachments`, formData, {
             headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' },
           });
           // Refresh attachments
         }
       };

       return (
         <View>
           <Text>Attachments for Survey {surveyUniqueCode}</Text>
           <Button title="Upload Attachment" onPress={handleUpload} />
           <FlatList
             data={attachments}
             renderItem={({ item }) => (
               <Text>{item.fileUrl} ({item.fileType}, {item.fileSize} bytes)</Text>
             )}
             keyExtractor={item => item.attachmentId}
           />
         </View>
       );
     };
     export default SurveyAttachmentsScreen;
     ```
   - Add navigation to this screen from `SurveyIntermediate`.

2. **QC Level Selection (Supervisor Dashboard):**
   - Enhance supervisor dashboard in `mobile-app/src/screens/SupervisorDashboard.tsx` to select QC levels:
     ```jsx
     // mobile-app/src/screens/SupervisorDashboard.tsx
     import React, { useEffect, useState } from 'react';
     import { View, Text, Picker } from 'react-native';
     import axios from 'axios';

     const SupervisorDashboard = () => {
       const [qcLevels, setQCLevels] = useState([]);
       const [selectedQCLevel, setSelectedQCLevel] = useState(null);

       useEffect(() => {
         axios.get('http://api-endpoint/api/qc/levels', {
           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
         }).then(response => setQCLevels(response.data));
       }, []);

       return (
         <View>
           <Text>Supervisor Dashboard</Text>
           <Picker
             selectedValue={selectedQCLevel}
             onValueChange={(value) => setSelectedQCLevel(value)}
           >
             {qcLevels.map(level => (
               <Picker.Item key={level.qcLevelId} label={level.levelName} value={level.qcLevelId} />
             ))}
           </Picker>
           {/* Existing dashboard content */}
         </View>
       );
     };
     export default SupervisorDashboard;
     ```

**Compatibility Notes:**
- New screens and components are added without modifying existing survey flows or dashboards.
- Use existing auth tokens and API endpoints for consistency.
- Offline support for attachments can be added later using AsyncStorage.

### 5. Testing and Validation

**Objective:** Ensure new additions do not break existing functionality and perform as expected.

**Steps:**

1. **Unit Tests:**
   - Add tests for new services in `backend/src/services/__tests__/`:
     ```typescript
     // backend/src/services/__tests__/qcLevelService.test.ts
     import { qcLevelService } from '../qcLevelService';
     import { PrismaClient } from '@prisma/client';

     const prisma = new PrismaClient();

     describe('QCLevelService', () => {
       it('creates a QC level', async () => {
         const qcLevel = await qcLevelService.createQCLevel({ levelName: 'Test QC', description: 'Test' });
         expect(qcLevel.levelName).toBe('Test QC');
       });
     });
     ```

2. **Integration Tests:**
   - Test new endpoints with Postman or Jest:
     ```typescript
     // backend/src/routes/__tests__/qcRoutes.test.ts
     import supertest from 'supertest';
     import app from '../../app';

     describe('QC Routes', () => {
       it('GET /api/qc/levels returns QC levels', async () => {
         const response = await supertest(app)
           .get('/api/qc/levels')
           .set('Authorization', 'Bearer valid-token');
         expect(response.status).toBe(200);
         expect(response.body).toBeInstanceOf(Array);
       });
     });
     ```

3. **End-to-End Testing:**
   - Test new UI components and APIs in staging:
     - Verify QC level creation in admin UI.
     - Test bulk QC actions in `results.tsx`.
     - Test attachment upload/view in web portal and mobile app.

4. **Database Performance:**
   - Run `EXPLAIN ANALYZE` on queries involving new indexes:
     ```sql
     EXPLAIN ANALYZE SELECT * FROM "SurveyDetails" WHERE "zoneId" = 'some-zone-id';
     ```
   - Check index usage with `pg_stat_user_indexes`.

5. **Regression Testing:**
   - Test existing endpoints (`/api/qc/review`, `/api/surveys`, etc.) to ensure no regressions.
   - Verify existing UI components (survey forms, dashboards) function as before.

### 6. Documentation Updates

**Objective:** Update project documentation to reflect new tables and endpoints.

**Steps:**

1. **Update BACKEND_DOCUMENTATION.md:**
   - Add sections for new tables (`QCLevelMaster`, `BulkActionLog`, `QCErrorTypeMaster`, `SurveyStats`, `Attachment`, `StatusMaster`).
   - Document new endpoints (e.g., `/api/qc/levels`, `/api/surveys/:id/attachments`).

2. **Update QCPLAN.md:**
   - Add details of implemented `QCLevelMaster`, `BulkActionLog`, and `QCErrorTypeMaster` tables.
   - Note integration with `QCRecord` via optional fields.

3. **Update PROJECT_STATUS.md:**
   - Mark new tables and indexes as completed under “Backend Status.”
   - Add “SurveyStats refresh cron job” under “Deployment & Infrastructure.”

4. **Add User Guides:**
   - Document QC level management and attachment upload in user guides.

### 7. Deployment and Monitoring

**Objective:** Deploy changes safely and monitor performance.

**Steps:**

1. **Staging Deployment:**
   - Deploy schema changes and new code to staging environment.
   - Run migrations and test all functionality.

2. **Production Deployment:**
   - Schedule downtime for migration if required.
   - Apply migrations and deploy new backend/frontend/mobile app code.

3. **Monitoring:**
   - Monitor query performance with `pg_stat_statements`.
   - Track cron job execution for `SurveyStats` refresh.
   - Set up alerts for API errors or high latency.

4. **Backup:**
   - Schedule regular backups of new tables.

## Success Criteria

- **Existing Functionality:** All existing routes, controllers, DTOs, services, and UI components remain fully functional.
- **Performance:** New indexes reduce query times for `SurveyDetails`, `QCRecord`, and `SurveyorAssignment` (verify with `EXPLAIN ANALYZE`).
- **New Features:** QC level management, bulk action logging, attachment upload, and survey stats are accessible via new endpoints and UI.
- **Scalability:** New tables handle large datasets with appropriate indexes.
- **Documentation:** All changes are documented in BACKEND_DOCUMENTATION.md, QCPLAN.md, and PROJECT_STATUS.md.

## Risks and Mitigation

- **Risk:** Migration errors disrupt existing data.
  - **Mitigation:** Test migrations in staging and maintain backups.
- **Risk:** New tables increase storage or write overhead.
  - **Mitigation:** Monitor index usage and optimize refresh frequency for `SurveyStats`.
- **Risk:** New endpoints introduce security vulnerabilities.
  - **Mitigation:** Apply `authenticateJWT` and `requireRole` middleware to new routes.
- **Risk:** Frontend/mobile app integration fails.
  - **Mitigation:** Test new UI components in isolation and ensure backward compatibility.

## Timeline

- **Week 1:** Database migrations, new controllers/services, initial testing.
- **Week 2:** Frontend/mobile app UI development, integration testing.
- **Week 3:** Documentation updates, staging deployment, end-to-end testing.
- **Week 4:** Production deployment, monitoring setup.

## Team Responsibilities

- **Backend Team:** Implement schema changes, new controllers/services, cron job.
- **Frontend Team:** Develop QC level and attachment UI components.
- **Mobile App Team:** Implement attachment upload and QC level selection screens.
- **QA Team:** Run unit, integration, and end-to-end tests.
- **DevOps Team:** Manage migrations, deployment, and monitoring setup.

## Conclusion

This implementation plan ensures that the proposed schema additions enhance the LRM Property Survey System’s performance and functionality while preserving the integrity of existing features. By focusing on additive changes, the plan minimizes disruption and supports seamless integration of new QC workflows, analytics, and attachment management. Regular testing and documentation updates will ensure a smooth rollout and long-term maintainability.