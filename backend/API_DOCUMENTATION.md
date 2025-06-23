# Survey Application API Documentation

## Base URL

```
http://localhost:4000
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Routes

### POST /auth/login

Login with username, password, and role.

**Request Body:**

```json
{
  "username": "string",
  "password": "string",
  "role": "SUPERADMIN|ADMIN|SUPERVISOR|SURVEYOR"
}
```

**Response:**

```json
{
  "token": "jwt-token",
  "user": {
    "userId": "uuid",
    "username": "string",
    "role": "string"
  }
}
```

### POST /auth/register

Register a new user (SUPERADMIN/ADMIN only).

**Request Body:**

```json
{
  "name": "string",
  "username": "string",
  "password": "string",
  "role": "SUPERADMIN|ADMIN|SUPERVISOR|SURVEYOR",
  "mobileNumber": "string"
}
```

---

## User Management Routes

### PUT /user/profile

Update own profile (all authenticated users).

**Request Body:**

```json
{
  "name": "string", // optional - stored in description field
  "mobileNumber": "string", // optional, 10 digits
  "email": "string" // optional, valid email (not stored in DB)
}
```

**Response:**

```json
{
  "userId": "uuid",
  "username": "string",
  "name": "string", // from description field
  "mobileNumber": "string",
  "status": "Profile updated successfully"
}
```

### PUT /user/change-password

Change own password (all authenticated users).

**Request Body:**

```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

**Response:**

```json
{
  "userId": "uuid",
  "status": "Password changed successfully"
}
```

### GET /user/profile

Get own profile (all authenticated users).

**Response:**

```json
{
  "userId": "uuid",
  "username": "string",
  "name": "string", // from description field
  "mobileNumber": "string",
  "email": null, // not stored in DB
  "isActive": true,
  "role": "string",
  "createdAt": "date" // isCreatedAt field
}
```

### GET /user

Get all users with pagination and filtering (ADMIN/SUPERADMIN only).

**Query Parameters:**

- `role` (optional): Filter by role (SUPERADMIN|ADMIN|SUPERVISOR|SURVEYOR)
- `isActive` (optional): Filter by active status (true|false)
- `search` (optional): Search by username, description (name), or mobile
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response:**

```json
{
  "users": [
    {
      "userId": "uuid",
      "username": "string",
      "description": "string", // name field
      "mobileNumber": "string",
      "isActive": true,
      "isCreatedAt": "date",
      "userRoleMaps": [
        {
          "role": {
            "roleName": "string"
          }
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### GET /user/:userId

Get user by ID (ADMIN/SUPERADMIN only).

### PUT /user/status

Update user status (ADMIN/SUPERADMIN only).

**Request Body:**

```json
{
  "userId": "uuid",
  "isActive": true,
  "reason": "string" // optional
}
```

### DELETE /user

Delete user (soft delete) (ADMIN/SUPERADMIN only).

**Request Body:**

```json
{
  "userId": "uuid",
  "reason": "string" // optional
}
```

### POST /user/assign-role

Assign role to user (ADMIN/SUPERADMIN only).

**Request Body:**

```json
{
  "userId": "uuid",
  "role": "SUPERADMIN|ADMIN|SUPERVISOR|SURVEYOR",
  "reason": "string" // optional
}
```

### DELETE /user/remove-role

Remove role from user (ADMIN/SUPERADMIN only).

**Request Body:**

```json
{
  "userId": "uuid",
  "reason": "string" // optional
}
```

### GET /user/search

Search users (all authenticated users).

**Query Parameters:**

- `query`: Search term (required)
- `role` (optional): Filter by role
- `isActive` (optional): Filter by active status
- `limit` (optional): Max results (default: 10, max: 50)

### GET /user/stats

Get user statistics (ADMIN/SUPERADMIN only).

**Query Parameters:**

- `role` (optional): Filter by role
- `wardId` (optional): Filter by ward
- `dateFrom` (optional): Start date
- `dateTo` (optional): End date

**Response:**

```json
{
  "totalUsers": 100,
  "activeUsers": 85,
  "inactiveUsers": 15,
  "roleStats": [
    {
      "role": "SURVEYOR",
      "count": 50
    },
    {
      "role": "SUPERVISOR",
      "count": 20
    }
  ]
}
```

### GET /user/roles

Get available roles for dropdowns (all authenticated users).

### GET /user/by-role/:role

Get users by specific role (ADMIN/SUPERADMIN only).

### GET /user/count/active

Get active users count (ADMIN/SUPERADMIN only).

---

## Ward Management Routes

### POST /ward/assign-surveyor

Assign a ward to a surveyor (ADMIN/SUPERADMIN only).

**Request Body:**

```json
{
  "surveyorId": "uuid",
  "wardId": "uuid",
  "mohallaId": "uuid",
  "wardMohallaMapId": "uuid",
  "zoneWardMapId": "uuid",
  "ulbZoneMapId": "uuid",
  "assignmentType": "PRIMARY|SECONDARY",
  "supervisorId": "uuid" // optional
}
```

**Response:**

```json
{
  "assignmentId": "uuid",
  "surveyorId": "uuid",
  "wardId": "uuid",
  "mohallaId": "uuid",
  "assignmentType": "PRIMARY",
  "supervisorId": "uuid",
  "status": "Assigned successfully"
}
```

### POST /ward/assign-supervisor

Assign wards to a supervisor (ADMIN/SUPERADMIN only).

**Request Body:**

```json
{
  "supervisorId": "uuid",
  "wardIds": ["uuid", "uuid"],
  "isActive": true
}
```

### POST /ward/bulk-assign

Bulk assign multiple wards to a surveyor (ADMIN/SUPERADMIN only).

**Request Body:**

```json
{
  "surveyorId": "uuid",
  "assignments": [
    {
      "wardId": "uuid",
      "mohallaId": "uuid",
      "wardMohallaMapId": "uuid",
      "zoneWardMapId": "uuid",
      "ulbZoneMapId": "uuid",
      "assignmentType": "PRIMARY|SECONDARY"
    }
  ],
  "supervisorId": "uuid" // optional
}
```

### PUT /ward/update-assignment

Update ward assignment status (ADMIN/SUPERADMIN/SUPERVISOR).

**Request Body:**

```json
{
  "assignmentId": "uuid",
  "isActive": true,
  "reason": "string" // optional
}
```

### PUT /ward/toggle-access

Toggle surveyor access to wards (SUPERVISOR/ADMIN/SUPERADMIN).

**Request Body:**

```json
{
  "surveyorId": "uuid",
  "wardId": "uuid", // optional - if not provided, affects all wards
  "isActive": true,
  "reason": "string", // optional
  "actionBy": "SUPERVISOR|ADMIN|SUPERADMIN"
}
```

### POST /ward/assign-supervisor-to-ward

Assign supervisor to a specific ward (ADMIN/SUPERADMIN only).

**Request Body:**

```json
{
  "supervisorId": "uuid",
  "wardId": "uuid",
  "isActive": true
}
```

### DELETE /ward/remove-supervisor-from-ward

Remove supervisor from a ward (ADMIN/SUPERADMIN only).

**Request Body:**

```json
{
  "supervisorId": "uuid",
  "wardId": "uuid",
  "reason": "string" // optional
}
```

### PUT /ward/update-status

Update ward status (ADMIN/SUPERADMIN only).

**Request Body:**

```json
{
  "wardId": "uuid",
  "statusId": "uuid",
  "reason": "string" // optional
}
```

### GET /ward/assignments

Get ward assignments with filtering.

**Query Parameters:**

- `wardId` (optional): Filter by ward ID
- `surveyorId` (optional): Filter by surveyor ID
- `supervisorId` (optional): Filter by supervisor ID
- `isActive` (optional): Filter by active status

**Response:**

```json
{
  "assignments": [
    {
      "assignmentId": "uuid",
      "userId": "uuid",
      "assignmentType": "PRIMARY",
      "wardId": "uuid",
      "mohallaId": "uuid",
      "isActive": true,
      "user": {
        "userId": "uuid",
        "username": "string",
        "userRoleMaps": [
          {
            "role": {
              "roleName": "SURVEYOR"
            }
          }
        ]
      },
      "ward": {
        "wardId": "uuid",
        "wardNumber": "string",
        "wardName": "string"
      },
      "mohalla": {
        "mohallaId": "uuid",
        "mohallaName": "string"
      },
      "assignedBy": {
        "userId": "uuid",
        "username": "string",
        "userRoleMaps": [
          {
            "role": {
              "roleName": "ADMIN"
            }
          }
        ]
      }
    }
  ],
  "total": 10
}
```

### GET /ward/available-wards

Get all available wards for dropdowns.

### GET /ward/available-mohallas

Get all available mohallas for dropdowns.

### GET /ward/ward-mohalla-mappings

Get ward-mohalla mappings.

### GET /ward/surveyors/:wardId

Get all surveyors assigned to a specific ward.

### GET /ward/supervisors/:wardId

Get all supervisors assigned to a specific ward.

---

## Surveyor Management Routes

### POST /surveyor/assign-ward

Assign ward to surveyor (ADMIN/SUPERADMIN only).

**Request Body:**

```json
{
  "userId": "uuid",
  "wardId": "uuid",
  "mohallaId": "uuid",
  "wardMohallaMapId": "uuid",
  "zoneWardMapId": "uuid",
  "ulbZoneMapId": "uuid",
  "assignmentType": "PRIMARY|SECONDARY" // optional, default: PRIMARY
}
```

**Response:**

```json
{
  "assignmentId": "uuid",
  "userId": "uuid",
  "wardId": "uuid",
  "mohallaId": "uuid",
  "assignmentType": "PRIMARY",
  "status": "Ward assigned successfully"
}
```

### POST /surveyor/toggle-login

Toggle surveyor login status (ADMIN/SUPERADMIN/SUPERVISOR).

**Request Body:**

```json
{
  "userId": "uuid",
  "isActive": true
}
```

**Response:**

```json
{
  "userId": "uuid",
  "isActive": true,
  "status": "Surveyor activated" // or "Surveyor deactivated - no active assignments"
}
```

### GET /surveyor/assignments/:userId

Get surveyor assignments (ADMIN/SUPERADMIN/SUPERVISOR).

**Response:**

```json
{
  "userId": "uuid",
  "assignments": [
    {
      "assignmentId": "uuid",
      "assignmentType": "PRIMARY",
      "wardId": "uuid",
      "mohallaId": "uuid",
      "isActive": true,
      "ward": {
        "wardId": "uuid",
        "wardNumber": "string",
        "wardName": "string"
      },
      "mohalla": {
        "mohallaId": "uuid",
        "mohallaName": "string"
      },
      "assignedBy": {
        "userId": "uuid",
        "username": "string",
        "userRoleMaps": [
          {
            "role": {
              "roleName": "ADMIN"
            }
          }
        ]
      }
    }
  ],
  "total": 5
}
```

### DELETE /surveyor/remove-assignment

Remove ward assignment (ADMIN/SUPERADMIN only).

**Request Body:**

```json
{
  "assignmentId": "uuid"
}
```

**Response:**

```json
{
  "assignmentId": "uuid",
  "userId": "uuid",
  "wardId": "uuid",
  "status": "Ward assignment removed successfully"
}
```

### GET /surveyor/profile/:userId

Get surveyor profile (ADMIN/SUPERADMIN/SUPERVISOR).

**Response:**

```json
{
  "userId": "uuid",
  "surveyorName": "string",
  "username": "string",
  "wardNumber": "string",
  "isActive": true,
  "ward": {
    "wardId": "uuid",
    "wardNumber": "string",
    "wardName": "string"
  },
  "mohalla": {
    "mohallaId": "uuid",
    "mohallaName": "string"
  },
  "zone": {
    "zoneId": "uuid",
    "zoneNumber": "string"
  },
  "ulb": {
    "ulbId": "uuid",
    "ulbName": "string"
  },
  "role": "SURVEYOR"
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP Status Codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `500`: Internal Server Error

### Common Error Messages

- `"Invalid input data"` - DTO validation failed
- `"User not found"` - User doesn't exist
- `"Invalid surveyor"` - User is not a surveyor
- `"Invalid supervisor"` - User is not a supervisor
- `"Invalid ward/mohalla/zone/ulb mapping"` - Invalid entity relationships
- `"Surveyor already assigned to this ward-mohalla combination"` - Duplicate assignment
- `"Cannot deactivate your own account"` - Self-deactivation prevention
- `"Current password is incorrect"` - Password change validation
- `"Passwords don't match"` - Password confirmation mismatch

---

## Role-Based Access Control

### SUPERADMIN

- Full access to all endpoints
- Can manage all users, wards, and assignments
- Can assign any role to users
- Can register new users

### ADMIN

- Can manage users, wards, and assignments
- Cannot manage SUPERADMIN users
- Can assign ADMIN, SUPERVISOR, and SURVEYOR roles
- Can register new users

### SUPERVISOR

- Can view and manage surveyors in their assigned wards
- Can toggle surveyor access for their wards
- Can update ward assignments for their wards
- Can view their own profile and assignments

### SURVEYOR

- Can view their own profile and assignments
- Can update their own profile
- Can change their own password
- Limited access to other endpoints

---

## Data Validation

### Field Mappings

Due to schema design, some fields are mapped differently:

- **Name Field**: User names are stored in the `description` field of `UsersMaster` table
- **Email Field**: Email is not stored in the database but can be passed in requests
- **Created Date**: Uses `isCreatedAt` field instead of `createdAt`
- **Role Relationships**: Uses `userRoleMaps` instead of `userRoleMappings`

### Validation Rules

- **Mobile Numbers**: Must be exactly 10 digits
- **Passwords**: Minimum 8 characters
- **UUIDs**: All IDs must be valid UUID format
- **Assignment Types**: Must be either "PRIMARY" or "SECONDARY"
- **Roles**: Must be one of SUPERADMIN, ADMIN, SUPERVISOR, SURVEYOR

---

## Transaction Support

All critical operations use database transactions to ensure data integrity:

- User profile updates (updates both UsersMaster and role-specific tables)
- Password changes (updates all relevant tables)
- Ward assignments (updates multiple tables atomically)
- Role assignments (updates role mappings and role-specific tables)
- Bulk operations (all-or-nothing execution)

---

## Performance Considerations

- Pagination is implemented for all list endpoints
- Search functionality uses database indexes
- Role-based filtering reduces data transfer
- Transaction usage prevents partial updates
- Proper error handling prevents unnecessary database calls

---

## Recent Updates (Latest Version)

1. **Schema Alignment**: Fixed all Prisma schema compatibility issues
2. **Enhanced Validation**: Added comprehensive DTO validation
3. **Transaction Support**: All critical operations now use transactions
4. **Error Handling**: Improved error messages and status codes
5. **Type Safety**: Added response interfaces for better type safety
6. **Field Mapping**: Proper handling of schema field differences
7. **Helper Functions**: Added reusable validation functions
8. **Surveyor Management**: Enhanced with new endpoints and features

---

**This documentation reflects the current state of the API as of the latest update. For any questions or clarifications, refer to the source code or contact the development team.**
