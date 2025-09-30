# Backend Documentation

## Overview

The Survey Application backend is built with Node.js, Express.js, and Prisma ORM, providing a robust API for the mobile app and web portal. The architecture follows a clean separation of concerns with dedicated controllers, services, and DTOs for each module.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Main Application (app.ts)](#main-application-appts)
3. [Database Schema](#database-schema)
4. [Authentication & Authorization](#authentication--authorization)
5. [Routes](#routes)
6. [Controllers](#controllers)
7. [Services](#services)
8. [DTOs (Data Transfer Objects)](#dtos-data-transfer-objects)
9. [Middleware](#middleware)
10. [Error Handling](#error-handling)
11. [API Endpoints Reference](#api-endpoints-reference)

---

## Architecture Overview

### Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **ORM**: Prisma with PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod schema validation
- **CORS**: Cross-Origin Resource Sharing enabled

### Project Structure

```
backend/
├── src/
│   ├── app.ts                 # Main application entry point
│   ├── controllers/           # Request handlers
│   ├── services/             # Business logic
│   ├── routes/               # Route definitions
│   ├── dtos/                 # Data validation schemas
│   └── middleware/           # Custom middleware
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Database migrations
│   └── seed.ts              # Database seeding
└── package.json
```

### Design Patterns

- **MVC Pattern**: Controllers handle requests, Services contain business logic
- **Repository Pattern**: Prisma provides data access abstraction
- **DTO Pattern**: Input validation and data transformation
- **Middleware Pattern**: Authentication, CORS, and error handling

---

## Main Application (app.ts)

### Configuration

The main application file sets up the Express server with comprehensive configuration:

```typescript
// CORS Configuration
const corsOptions = {
  origin: [
    "http://localhost:3000", // Web portal
    "http://127.0.0.1:3000", // Alternative localhost
    "http://localhost:8081", // Expo development server
    "http://127.0.0.1:8081", // Expo development server
  ],
  credentials: true, // Allow cookies and authorization headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};
```

### Route Organization

Routes are organized by access level and functionality:

1. **Public Routes**: Authentication and master data
2. **Web Portal Only**: Admin-specific routes (ward, user management)
3. **Authenticated Routes**: All other protected endpoints

### Middleware Stack

1. CORS handling
2. JSON body parsing
3. Custom headers middleware
4. Route-specific authentication middleware

---

## Database Schema

### Core Models

#### UsersMaster

- Primary user model with role-based access
- Supports multiple user types (Admin, Supervisor, Surveyor)
- Includes audit logging and session management

#### SurveyorAssignment

- Manages ward and mohalla assignments to users
- Uses `mohallaIds` array for multiple mohalla assignments
- Tracks assignment type (PRIMARY/SECONDARY) and assignment history

#### SurveyDetails

- Central survey model with comprehensive property assessment
- Supports both residential and non-residential properties
- Includes floor-wise assessment details

#### Master Data Models

- **UlbMaster**: Urban Local Bodies
- **ZoneMaster**: Administrative zones
- **WardMaster**: Municipal wards
- **MohallaMaster**: Neighborhood areas
- **Property Categories**: Residential and non-residential classifications

### Key Relationships

- Hierarchical: ULB → Zone → Ward → Mohalla
- Assignment: User ↔ Ward ↔ Mohalla (many-to-many)
- Survey: User → Survey → Property Details → Floor Details

---

## Authentication & Authorization

### JWT Implementation

- **Token Structure**: User ID, role, and permissions
- **Expiration**: Configurable token lifetime
- **Refresh**: Automatic token refresh mechanism

### Role-Based Access Control

- **SUPER_ADMIN**: Full system access
- **ADMIN**: ULB-level administration
- **SUPERVISOR**: Ward-level supervision
- **SURVEYOR**: Survey data collection

### Middleware Functions

- `authenticateJWT`: Validates JWT tokens
- `restrictToWebPortal`: Limits access to web portal only
- `requireRole`: Role-specific access control

---

## Routes

### 1. Authentication Routes (`/api/auth`)

```typescript
POST /login          # User login
POST /register       # User registration
POST /logout         # User logout
GET  /profile        # Get user profile
PUT  /profile        # Update user profile
```

### 2. User Management Routes (`/api/user`)

```typescript
GET    /              # Get all users (admin only)
POST   /              # Create new user
GET    /:id           # Get user by ID
PUT    /:id           # Update user
DELETE /:id           # Delete user
PUT    /:id/status    # Update user status
POST   /:id/role      # Assign role to user
```

### 3. Assignment Routes (`/api/assignments`)

```typescript
POST   /bulk          # Bulk assign wards/mohallas
GET    /user/:userId  # Get assignments by user
GET    /ward/:wardId  # Get assignments by ward
DELETE /:assignmentId # Remove assignment
```

### 4. Survey Routes (`/api/surveys`)

```typescript
POST   /              # Create new survey
GET    /              # Get surveys (with filters)
GET    /:id           # Get survey by ID
PUT    /:id           # Update survey
DELETE /:id           # Delete survey
POST   /:id/floors    # Add floor details
```

### 5. Master Data Routes

#### ULB Routes (`/api/ulbs`)

```typescript
GET /                 # Get all ULBs
GET /:id              # Get ULB by ID
POST /                # Create ULB
PUT  /:id             # Update ULB
DELETE /:id           # Delete ULB
```

#### Zone Routes (`/api/zones`)

```typescript
GET /                 # Get all zones
GET /ulb/:ulbId       # Get zones by ULB
GET /:id              # Get zone by ID
POST /                # Create zone
PUT  /:id             # Update zone
DELETE /:id           # Delete zone
```

#### Ward Routes (`/api/wards`)

```typescript
GET /                 # Get all wards
GET /zone/:zoneId     # Get wards by zone
GET /:id              # Get ward by ID
GET /statuses         # Get ward statuses
POST /                # Create ward
PUT  /:id             # Update ward
DELETE /:id           # Delete ward
```

#### Mohalla Routes (`/api/mohallas`)

```typescript
GET /                 # Get all mohallas
GET /ward/:wardId     # Get mohallas by ward
GET /:id              # Get mohalla by ID
POST /                # Create mohalla
PUT  /:id             # Update mohalla
DELETE /:id           # Delete mohalla
```

### 6. Surveyor Routes (`/api/surveyors`)

```typescript
GET /my-assignments   # Get current user assignments
GET /dashboard        # Get surveyor dashboard data
POST /surveys         # Create survey
GET /surveys          # Get user's surveys
```

### 7. QC Routes (`/api/qc`)

```typescript
POST /review          # Submit QC review
GET /pending          # Get pending QC items
GET /history          # Get QC history
PUT /:id/status       # Update QC status
```

### 8. Reports Routes (`/api/reports`)

```typescript
GET /surveys          # Survey reports
GET /assignments      # Assignment reports
GET /performance      # Performance metrics
GET /analytics        # Analytics data
```

---

## Controllers

### 1. AuthController

**Purpose**: Handles user authentication and profile management

**Key Methods**:

- `login()`: Authenticates user and returns JWT token
- `register()`: Creates new user account
- `getProfile()`: Retrieves user profile information
- `updateProfile()`: Updates user profile data

**Features**:

- Password hashing with bcrypt
- JWT token generation and validation
- Role-based access control
- Session management

### 2. UserController

**Purpose**: Manages user CRUD operations and role assignments

**Key Methods**:

- `getAllUsers()`: Retrieves all users with pagination
- `createUser()`: Creates new user with role assignment
- `updateUser()`: Updates user information
- `deleteUser()`: Soft deletes user account
- `updateUserStatus()`: Activates/deactivates user
- `assignRole()`: Assigns roles to users

**Features**:

- Comprehensive user management
- Role assignment and validation
- Status management
- Audit logging

### 3. AssignmentController

**Purpose**: Manages ward and mohalla assignments to users

**Key Methods**:

- `bulkAssign()`: Assigns multiple wards/mohallas to users
- `getAssignmentsByUser()`: Retrieves user assignments
- `getAssignmentsByWard()`: Retrieves ward assignments
- `removeAssignment()`: Removes specific assignments

**Features**:

- Bulk assignment operations
- Conflict detection and resolution
- Assignment tracking
- Performance optimization

### 4. SurveyController

**Purpose**: Handles survey creation and management

**Key Methods**:

- `createSurvey()`: Creates new survey with property details
- `getSurveys()`: Retrieves surveys with filtering
- `getSurveyById()`: Gets specific survey details
- `updateSurvey()`: Updates survey information
- `deleteSurvey()`: Soft deletes survey

**Features**:

- Comprehensive survey data handling
- Floor-wise property assessment
- File attachment support
- Validation and error handling

### 5. WardController

**Purpose**: Manages ward master data and operations

**Key Methods**:

- `getAllWards()`: Retrieves all wards
- `getWardsByZone()`: Gets wards by zone
- `createWard()`: Creates new ward
- `updateWard()`: Updates ward information
- `getWardStatuses()`: Gets available ward statuses

**Features**:

- Hierarchical data management
- Status tracking
- Validation and constraints
- Performance optimization

### 6. MasterDataController

**Purpose**: Provides access to all master data

**Key Methods**:

- `getPropertyTypes()`: Property type master data
- `getConstructionTypes()`: Construction type data
- `getCategories()`: Property categories
- `getSubCategories()`: Property sub-categories
- `getFloorNumbers()`: Floor number options

**Features**:

- Centralized master data access
- Caching for performance
- Validation and error handling
- Mobile app optimization

---

## Services

### 1. AuthService

**Purpose**: Business logic for authentication and user management

**Key Methods**:

- `validateCredentials()`: Validates user credentials
- `generateToken()`: Creates JWT tokens
- `hashPassword()`: Securely hashes passwords
- `verifyPassword()`: Verifies password against hash

**Features**:

- Secure password handling
- Token management
- Session tracking
- Security best practices

### 2. UserService

**Purpose**: Business logic for user operations

**Key Methods**:

- `createUserWithRole()`: Creates user with role assignment
- `updateUserData()`: Updates user information
- `manageUserStatus()`: Handles user activation/deactivation
- `assignUserRole()`: Manages role assignments

**Features**:

- Transaction management
- Role validation
- Audit logging
- Data integrity checks

### 3. AssignmentService

**Purpose**: Business logic for assignment management

**Key Methods**:

- `processBulkAssignment()`: Handles bulk assignment operations
- `checkAssignmentConflicts()`: Detects assignment conflicts
- `getUserAssignments()`: Retrieves user assignments
- `removeAssignment()`: Removes assignments

**Features**:

- Conflict detection and resolution
- Performance optimization
- Data consistency
- Assignment tracking

### 4. SurveyService

**Purpose**: Business logic for survey operations

**Key Methods**:

- `createSurveyWithDetails()`: Creates complete survey
- `validateSurveyData()`: Validates survey information
- `processFloorDetails()`: Handles floor-wise assessments
- `generateSurveyCode()`: Creates unique survey codes

**Features**:

- Complex data validation
- Transaction management
- File handling
- Error recovery

### 5. WardService

**Purpose**: Business logic for ward management

**Key Methods**:

- `createWardWithValidation()`: Creates ward with validation
- `updateWardData()`: Updates ward information
- `getWardHierarchy()`: Retrieves ward hierarchy
- `manageWardStatus()`: Handles ward status changes

**Features**:

- Hierarchical data management
- Status tracking
- Validation rules
- Performance optimization

---

## DTOs (Data Transfer Objects)

### 1. AuthDTO

**Purpose**: Validates authentication requests

```typescript
// Login DTO
const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
});

// Register DTO
const registerSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  name: z.string().min(2).max(100),
  mobileNumber: z.string().optional(),
  role: z.enum(["ADMIN", "SUPERVISOR", "SURVEYOR"]),
});
```

### 2. UserDTO

**Purpose**: Validates user management requests

```typescript
// Create User DTO
const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  name: z.string().min(2).max(100),
  mobileNumber: z.string().optional(),
  role: z.enum(["ADMIN", "SUPERVISOR", "SURVEYOR"]),
  ulbId: z.string().uuid().optional(),
});

// Update User DTO
const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  mobileNumber: z.string().optional(),
  isActive: z.boolean().optional(),
});
```

### 3. AssignmentDTO

**Purpose**: Validates assignment requests

```typescript
// Bulk Assignment DTO
const bulkAssignmentSchema = z.object({
  userId: z.string().uuid(),
  assignments: z.array(
    z.object({
      wardId: z.string().uuid(),
      mohallaIds: z.array(z.string().uuid()),
      assignmentType: z.enum(["PRIMARY", "SECONDARY"]),
    })
  ),
});
```

### 4. SurveyDTO

**Purpose**: Validates survey data

```typescript
// Create Survey DTO
const createSurveySchema = z.object({
  ulbId: z.string().uuid(),
  zoneId: z.string().uuid(),
  wardId: z.string().uuid(),
  mohallaId: z.string().uuid(),
  surveyTypeId: z.number().int().positive(),
  propertyDetails: z.object({
    // Property details validation
  }),
  locationDetails: z.object({
    // Location details validation
  }),
  floorDetails: z
    .array(
      z.object({
        // Floor details validation
      })
    )
    .optional(),
});
```

### 5. WardDTO

**Purpose**: Validates ward management requests

```typescript
// Create Ward DTO
const createWardSchema = z.object({
  wardName: z.string().min(2).max(100),
  newWardNumber: z.string().min(1).max(20),
  oldWardNumber: z.string().optional(),
  description: z.string().optional(),
  zoneId: z.string().uuid(),
});
```

---

## Middleware

### 1. AuthMiddleware

**Purpose**: Handles authentication and authorization

**Functions**:

- `authenticateJWT`: Validates JWT tokens
- `restrictToWebPortal`: Limits access to web portal
- `requireRole`: Role-based access control

**Features**:

- Token validation
- Role checking
- Error handling
- Security enforcement

### 2. Error Handling Middleware

**Purpose**: Centralized error handling

**Features**:

- Consistent error responses
- Logging and monitoring
- Security error handling
- Client-friendly error messages

---

## Error Handling

### Error Types

1. **Validation Errors**: Input validation failures
2. **Authentication Errors**: JWT and permission issues
3. **Database Errors**: Prisma and connection issues
4. **Business Logic Errors**: Application-specific errors

### Error Response Format

```typescript
{
  error: string,
  message: string,
  details?: any,
  timestamp: string,
  path: string
}
```

### Error Handling Strategy

- Centralized error handling middleware
- Consistent error response format
- Proper HTTP status codes
- Detailed logging for debugging
- Client-friendly error messages

---

## API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint             | Description         | Access        |
| ------ | -------------------- | ------------------- | ------------- |
| POST   | `/api/auth/login`    | User login          | Public        |
| POST   | `/api/auth/register` | User registration   | Public        |
| POST   | `/api/auth/logout`   | User logout         | Authenticated |
| GET    | `/api/auth/profile`  | Get user profile    | Authenticated |
| PUT    | `/api/auth/profile`  | Update user profile | Authenticated |

### User Management Endpoints

| Method | Endpoint               | Description        | Access |
| ------ | ---------------------- | ------------------ | ------ |
| GET    | `/api/user`            | Get all users      | Admin  |
| POST   | `/api/user`            | Create user        | Admin  |
| GET    | `/api/user/:id`        | Get user by ID     | Admin  |
| PUT    | `/api/user/:id`        | Update user        | Admin  |
| DELETE | `/api/user/:id`        | Delete user        | Admin  |
| PUT    | `/api/user/:id/status` | Update user status | Admin  |
| POST   | `/api/user/:id/role`   | Assign role        | Admin  |

### Assignment Endpoints

| Method | Endpoint                        | Description          | Access |
| ------ | ------------------------------- | -------------------- | ------ |
| POST   | `/api/assignments/bulk`         | Bulk assign          | Admin  |
| GET    | `/api/assignments/user/:userId` | Get user assignments | Admin  |
| GET    | `/api/assignments/ward/:wardId` | Get ward assignments | Admin  |
| DELETE | `/api/assignments/:id`          | Remove assignment    | Admin  |

### Survey Endpoints

| Method | Endpoint                  | Description       | Access        |
| ------ | ------------------------- | ----------------- | ------------- |
| POST   | `/api/surveys`            | Create survey     | Surveyor      |
| GET    | `/api/surveys`            | Get surveys       | Authenticated |
| GET    | `/api/surveys/:id`        | Get survey by ID  | Authenticated |
| PUT    | `/api/surveys/:id`        | Update survey     | Surveyor      |
| DELETE | `/api/surveys/:id`        | Delete survey     | Surveyor      |
| POST   | `/api/surveys/:id/floors` | Add floor details | Surveyor      |

### Master Data Endpoints

| Method | Endpoint                     | Description          | Access        |
| ------ | ---------------------------- | -------------------- | ------------- |
| GET    | `/api/ulbs`                  | Get all ULBs         | Authenticated |
| GET    | `/api/zones`                 | Get all zones        | Authenticated |
| GET    | `/api/zones/ulb/:ulbId`      | Get zones by ULB     | Authenticated |
| GET    | `/api/wards`                 | Get all wards        | Authenticated |
| GET    | `/api/wards/zone/:zoneId`    | Get wards by zone    | Authenticated |
| GET    | `/api/mohallas`              | Get all mohallas     | Authenticated |
| GET    | `/api/mohallas/ward/:wardId` | Get mohallas by ward | Authenticated |
| GET    | `/api/master-data`           | Get all master data  | Authenticated |

### Surveyor Endpoints

| Method | Endpoint                        | Description        | Access   |
| ------ | ------------------------------- | ------------------ | -------- |
| GET    | `/api/surveyors/my-assignments` | Get assignments    | Surveyor |
| GET    | `/api/surveyors/dashboard`      | Get dashboard data | Surveyor |

### QC Endpoints

| Method | Endpoint          | Description      | Access |
| ------ | ----------------- | ---------------- | ------ |
| POST   | `/api/qc/review`  | Submit QC review | QC     |
| GET    | `/api/qc/pending` | Get pending QC   | QC     |
| GET    | `/api/qc/history` | Get QC history   | QC     |

### Reports Endpoints

| Method | Endpoint                   | Description         | Access |
| ------ | -------------------------- | ------------------- | ------ |
| GET    | `/api/reports/surveys`     | Survey reports      | Admin  |
| GET    | `/api/reports/assignments` | Assignment reports  | Admin  |
| GET    | `/api/reports/performance` | Performance metrics | Admin  |

---

## Performance Considerations

### Database Optimization

- Proper indexing on frequently queried fields
- Efficient query patterns with Prisma
- Connection pooling and management
- Query result caching where appropriate

### API Optimization

- Pagination for large datasets
- Selective field loading
- Efficient error handling
- Response compression

### Security Measures

- Input validation and sanitization
- Rate limiting (planned)
- CORS configuration
- JWT token security
- SQL injection prevention (Prisma)

---

## Deployment & Environment

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/survey_app
JWT_SECRET=your-secret-key
PORT=4000
NODE_ENV=development
```

### Network Configuration

The backend supports flexible CORS configuration for development and production environments:

- **Development**: Allows connections from localhost and local network IPs
- **Production**: Restricted to specific allowed origins
- **Mobile App**: Configured to work with Expo development server
- **Web Portal**: Supports both localhost and production domains

### API Base URL Configuration

The mobile app uses dynamic IP detection for API connectivity:

```typescript
// Mobile app API configuration
const getApiUrl = () => {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }
  // For development, use current IP address
  return "http://192.168.18.210:4000/api";
};
```

### Production Considerations

- Environment-specific configurations
- Database connection pooling
- Logging and monitoring
- Error tracking and alerting
- Backup and recovery procedures

---

## Conclusion

The Survey Application backend provides a robust, scalable, and secure API foundation for both the mobile app and web portal. The modular architecture, comprehensive validation, and proper error handling ensure reliable operation and maintainable code.

Key strengths include:

- Clean separation of concerns
- Comprehensive data validation
- Robust error handling
- Scalable architecture
- Security best practices
- Performance optimization

The backend is production-ready and provides a solid foundation for future enhancements and scaling.

# Backend Documentation (QC Workflow)

## QC API Endpoints

- `GET /api/qc/property-list` — Fetch property list for QC with filters and pagination.
- `PUT /api/qc/survey/:surveyUniqueCode` — Update QC status, remarks, etc. for a single property.
- `POST /api/qc/bulk-qc` — Bulk approve/reject/mark error for multiple properties.
- `GET /api/qc/history/:surveyUniqueCode` — Fetch QC history for a property.
- `GET /api/qc/stats` — Get QC statistics (counts by status/level).
- `GET /api/qc/section-records/:surveyUniqueCode` — Fetch section-level QC records.
- `POST /api/property-images` — Upload property images.
- `GET /api/property-images/:surveyUniqueCode` — Get property images for a survey.

## Planned/Proposed Endpoints

- `POST /api/qc/level` — Create new QC level (admin only).
- `GET /api/qc/levels` — List all QC levels.
- `POST /api/qc/error-type` — Create new error type (admin only).
- `GET /api/qc/error-types` — List all error types.
- `GET /api/qc/bulk-action-log` — List all bulk QC actions.

## Models/Tables (Current & Planned)

- **SurveyDetails** — Main property data.
- **QCRecord** — Tracks QC actions per property and level.
- **QCSectionRecord** — Tracks section-level QC outcomes.
- **PropertyImage** — Stores property image metadata and URLs.
- **QCLevelMaster** — Master table for QC levels.
- **BulkActionLog** — Logs all bulk QC actions.
- **QCErrorTypeMaster** — Master table for error types.

## Bulk Actions

- Supported via `/api/qc/bulk-qc` endpoint.
- Each action is logged for auditability via BulkActionLog.

## Audit Trail

- All QC actions (single and bulk) are tracked in QCRecord and BulkActionLog.
- Full history available via `/api/qc/history/:surveyUniqueCode`.

## See also: QCPLAN.md for architecture and future-proofing details.
