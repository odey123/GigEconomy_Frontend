# EcoRoutes Backend API Documentation

Complete API specification based on frontend requirements.

## Base URL

```
Development: http://localhost:5000/api/v1
Production: https://api.ecoroutes.com/api/v1
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## 📋 Table of Contents

1. [Admin Authentication](#admin-authentication-endpoints)
2. [Client Authentication](#client-authentication-endpoints)
3. [Client Portal (Protected)](#client-portal-protected-endpoints)
4. [Rider Authentication](#rider-authentication-endpoints) _(includes KYC self-registration)_
5. [Orders](#orders-endpoints)
6. [Riders (Admin)](#riders-endpoints)
7. [Rider Self-Service](#rider-self-service-endpoints)
8. [Clients](#clients-endpoints)
9. [Team Management](#team-management-endpoints)
10. [Analytics](#analytics-endpoints)
11. [Finance](#finance-endpoints)
12. [Wallets & Payments](#wallets--payments-endpoints)
13. [Data Models](#data-models)

---

## Admin Authentication Endpoints

### POST `/auth/register`

Register a new admin/staff user account.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "role": "super_admin" | "admin" | "logistics_staff"
}
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "role": "string",
      "isActive": true,
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime"
    },
    "token": "string"
  }
}
```

### POST `/auth/login`

Authenticate admin/staff user and get access token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "role": "string",
      "avatar": "string (optional)",
      "isActive": true,
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime"
    },
    "token": "string"
  }
}
```

### GET `/auth/me`

Get current authenticated user's profile.

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "role": "string",
      "avatar": "string (optional)",
      "isActive": true,
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime"
    }
  }
}
```

### POST `/auth/logout`

Logout current user.

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

---

## Client Authentication Endpoints

These endpoints are used by businesses accessing the Client Portal.

### POST `/client-auth/register/pay-as-you-go`

Self-serve registration for small businesses using the prepaid wallet system. Accounts are created with `pending` status and require Admin approval before login is permitted.

**Request Body:**
```json
{
  "company": "string",
  "contactName": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "password": "string"
}
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "message": "Account created and pending admin approval",
  "data": {
    "client": {
      "id": "string",
      "company": "string",
      "email": "string",
      "status": "pending",
      "accountType": "pay_as_you_go"
    }
  }
}
```

### POST `/client-auth/register/corporate`

Application for enterprise post-paid invoicing. Collects deeper business data but does NOT collect a password. Once approved by an Admin, the Admin will send an invitation link to set the password.

**Request Body:**
```json
{
  "company": "string",
  "contactName": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "registrationNumber": "string",
  "estimatedMonthlyVolume": "string"
}
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "message": "Corporate application received and pending review",
  "data": {
    "client": {
      "id": "string",
      "company": "string",
      "email": "string",
      "status": "pending",
      "accountType": "corporate"
    }
  }
}
```

### POST `/client-auth/login`

Authenticate client and get access token. Fails with `403 Forbidden` if account status is `pending` or `suspended`.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "client": {
      "id": "string",
      "company": "string",
      "contactName": "string",
      "email": "string",
      "accountType": "pay_as_you_go" | "corporate",
      "status": "active",
      "walletBalance": number
    },
    "token": "string"
  }
}
```

### POST `/client-auth/logout`

Logout client.

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

---

## Client Portal (Protected) Endpoints

All endpoints below require a valid `client_token` (Bearer token from `/client-auth/login`).

### GET `/client-auth/me`

Get the authenticated client's profile and current wallet balance.

**Auth Required:** Yes (`protectClient`)

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "client": {
      "id": "string",
      "company": "string",
      "contactName": "string",
      "email": "string",
      "phone": "string",
      "address": "string",
      "accountType": "pay_as_you_go" | "corporate",
      "status": "active",
      "totalOrders": number,
      "activeOrders": number
    },
    "walletBalance": number
  }
}
```

### GET `/client-auth/orders`

Get all orders placed by the authenticated client.

**Auth Required:** Yes (`protectClient`)

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter by status (optional) |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 50) |

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "orders": [
      {
        "id": "string",
        "trackingId": "string",
        "customerName": "string",
        "status": "string",
        "deliveryType": "string",
        "totalFee": number,
        "createdAt": "string",
        "driver": "string (optional)"
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "totalPages": number
    }
  }
}
```

### POST `/client-auth/orders`

Place a new delivery order. For `pay_as_you_go` accounts, the delivery fee is deducted from the wallet immediately.

**Auth Required:** Yes (`protectClient`)

**Request Body:**
```json
{
  "pickupLocation": "string",
  "pickupContact": "string",
  "pickupPhone": "string",
  "customerName": "string",
  "customerPhone": "string",
  "customerAddress": "string",
  "landmark": "string (optional)",
  "description": "string",
  "weight": number,
  "value": number,
  "deliveryType": "Standard" | "Express" | "Same Day",
  "deliveryModel": "Standard" | "Premium",
  "specialInstructions": "string (optional)",
  "scheduledFor": "ISO 8601 datetime (optional)"
}
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": "string",
      "trackingId": "string",
      "otp": "string",
      "status": "Pending",
      "totalFee": number
    }
  }
}
```

**Error – Insufficient balance:** `402 Payment Required`

---

## Rider Authentication Endpoints

These endpoints are used by delivery riders accessing the Rider Portal.

### POST `/rider-auth/register`

Self-registration for marketplace/gig riders (premium tier). Collects full KYC data. Account is created with `status: pending` and `riderType: premium`. Admin must approve before the rider can log in.

**Request Body:** `multipart/form-data`
```
name:            string (required)
phone:           string (required)
email:           string (required)
password:        string (required, min 6 chars)
vehicleType:     "Motorcycle" | "Car" | "Van" | "Bicycle" | "Truck" (required)
vehicleNumber:   string (required) — plate number
nin:             string (required) — 11-digit National Identification Number
idType:          "NIN Slip" | "Driver's License" | "Voter's Card" | "International Passport" (required)
idDocument:      File (required) — image of the ID document
passportPhoto:   File (required) — clear face photo / selfie
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "message": "Application submitted. Our team will review your details and notify you.",
  "data": {
    "rider": {
      "id": "string",
      "name": "string",
      "email": "string",
      "status": "pending",
      "riderType": "premium"
    }
  }
}
```

**Notes:**
- Store uploaded images in object storage (S3/Cloudinary). Return permanent URLs saved on the rider record as `idDocumentUrl` and `passportPhotoUrl`.
- Send an internal notification (email or in-app) to the admin team that a new KYC application is waiting for review.
- NIN validation: must be exactly 11 digits, numeric only.

---

### POST `/rider-auth/login`

Authenticate a rider and get access token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "rider": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "status": "active" | "busy",
      "riderType": "standard" | "premium",
      "vehicleType": "string",
      "rating": number,
      "totalDeliveries": number,
      "currentOrders": number
    },
    "token": "string"
  }
}
```

**Error Cases:**
- `404` — No rider account found with this email
- `403 pending` — Application is under review: `"Your application is under review. You will be notified once approved."`
- `403 rejected` — Application was not approved: `"Your application was not approved. Reason: {rejectionReason}"` (include reason in message)
- `403 inactive` — Account deactivated: `"Your account is inactive. Please contact the EcoRoutes team."`
- `401` — Incorrect password

### POST `/rider-auth/logout`

Logout rider.

**Auth Required:** Yes (Rider token)

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

---

## Orders Endpoints

### GET `/orders`

Get all orders with optional filtering. Used by the Admin dashboard.

**Auth Required:** Yes (Admin/Staff token)

**Query Parameters:**
- `status` (optional): Filter by order status (`Pending` | `Accepted` | `In Transit` | `Delivered` | `Cancelled` | `Failed`)
- `clientId` (optional): Filter by business client
- `riderId` (optional): Filter by assigned rider
- `startDate` (optional): Filter from date (ISO 8601)
- `endDate` (optional): Filter to date (ISO 8601)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "orders": [
      {
        "id": "string",
        "trackingId": "string",
        "customer": "string",
        "customerEmail": "string (optional)",
        "customerPhone": "string",
        "customerLocation": "string",
        "businessClient": "string",
        "businessClientId": "string",
        "status": "Pending" | "Accepted" | "In Transit" | "Delivered" | "Cancelled" | "Failed",
        "deliveryType": "Standard" | "Express" | "Same Day",
        "weight": "string",
        "value": "string",
        "description": "string (optional)",
        "specialInstructions": "string (optional)",
        "pickupLocation": "string",
        "deliveryLocation": "string",
        "landmark": "string (optional)",
        "driver": "string (optional)",
        "driverId": "string (optional)",
        "assignedAt": "ISO 8601 datetime (optional)",
        "otp": "string (optional)",
        "deliveryProof": "string (optional)",
        "date": "string",
        "createdAt": "ISO 8601 datetime",
        "updatedAt": "ISO 8601 datetime",
        "scheduledFor": "ISO 8601 datetime (optional)",
        "pickedUpAt": "ISO 8601 datetime (optional)",
        "deliveredAt": "ISO 8601 datetime (optional)",
        "deliveryFee": number,
        "adminFee": number,
        "totalFee": number
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "totalPages": number
    }
  }
}
```

### GET `/orders/:id`

Get a specific order by ID.

**Auth Required:** Yes

**Response:** `200 OK` — full order object (same shape as above)

### POST `/orders`

Create a new delivery order. The delivery fee is automatically calculated based on weight, delivery type, and distance, then deducted from the client's wallet. Returns `402 Payment Required` if the wallet has insufficient funds.

**Auth Required:** Yes (Client or Admin token)

**Request Body:**
```json
{
  "pickupLocation": "string",
  "pickupContact": "string",
  "pickupPhone": "string",
  "customerName": "string",
  "customerPhone": "string",
  "customerAddress": "string",
  "landmark": "string (optional)",
  "description": "string",
  "weight": number,
  "value": number,
  "deliveryType": "Standard" | "Express" | "Same Day",
  "specialInstructions": "string (optional)",
  "scheduledFor": "ISO 8601 datetime (optional)",
  "businessClientId": "string"
}
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": "string",
      "trackingId": "string",
      "otp": "string",
      "status": "Pending",
      "deliveryFee": number,
      "totalFee": number
    }
  }
}
```

### PUT `/orders/:id`

Update an existing order (Admin only).

**Auth Required:** Yes (Admin token)

**Request Body:** Partial order fields

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Order updated successfully",
  "data": {
    "order": { "...": "updated order" }
  }
}
```

### PATCH `/orders/:id/status`

Update order status. Used by Admin or system. For rider-driven status updates, use the dedicated rider endpoints below.

**Auth Required:** Yes (Admin token)

**Request Body:**
```json
{
  "status": "Pending" | "Accepted" | "In Transit" | "Delivered" | "Cancelled" | "Failed",
  "notes": "string (optional)"
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Order status updated",
  "data": {
    "order": { "...": "updated order" }
  }
}
```

### PATCH `/orders/:id/assign`

Assign a rider to an order (Admin action). Sets status to `Accepted` and generates/returns the delivery OTP.

**Auth Required:** Yes (Admin token)

**Request Body:**
```json
{
  "riderId": "string"
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Rider assigned successfully",
  "data": {
    "order": {
      "id": "string",
      "driver": "string",
      "driverId": "string",
      "status": "Accepted",
      "assignedAt": "ISO 8601 datetime",
      "otp": "string"
    }
  }
}
```

### DELETE `/orders/:id`

Delete an order (Admin only).

**Auth Required:** Yes (Admin token)

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Order deleted successfully"
}
```

---

## Riders Endpoints

> These are **admin-facing** endpoints for managing the rider fleet. For rider self-service actions (accepting jobs, updating status, viewing own earnings), see [Rider Self-Service Endpoints](#rider-self-service-endpoints).

### GET `/riders`

Get all riders.

**Auth Required:** Yes (Admin token)

**Query Parameters:**
- `status` (optional): Filter by status (`active` | `inactive` | `busy` | `pending` | `rejected`)
- `riderType` (optional): `standard` | `premium`
- `available` (optional): `true` to return only riders with status `active`

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "riders": [
      {
        "id": "string",
        "name": "string",
        "phone": "string",
        "email": "string",
        "status": "active" | "inactive" | "busy" | "pending" | "rejected",
        "riderType": "standard" | "premium",
        "currentOrders": number,
        "totalDeliveries": number,
        "rating": number,
        "vehicleType": "string",
        "vehicleNumber": "string (optional)",
        "vehicleColor": "string (optional)",
        "nin": "string (optional, KYC — premium riders only)",
        "idType": "string (optional, KYC — premium riders only)",
        "idDocumentUrl": "string (optional) — URL to uploaded ID document image",
        "passportPhotoUrl": "string (optional) — URL to uploaded passport/selfie image",
        "rejectionReason": "string (optional) — set when status is rejected",
        "createdAt": "ISO 8601 datetime",
        "updatedAt": "ISO 8601 datetime"
      }
    ]
  }
}
```

### GET `/riders/:id`

Get a specific rider by ID.

**Auth Required:** Yes (Admin token)

**Response:** `200 OK` — full rider object

### POST `/riders`

Create a new rider account (Admin action). A temporary password is generated and sent to the rider's email.

**Auth Required:** Yes (Admin token)

**Request Body:**
```json
{
  "name": "string",
  "phone": "string",
  "email": "string",
  "vehicleType": "Motorcycle" | "Bicycle" | "Car" | "Van" | "Truck",
  "vehicleNumber": "string (optional)",
  "vehicleColor": "string (optional)"
}
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "message": "Rider created successfully. Login credentials sent to rider's email.",
  "data": {
    "rider": { "...": "created rider" }
  }
}
```

### PUT `/riders/:id`

Update a rider (Admin action).

**Auth Required:** Yes (Admin token)

**Request Body:**
```json
{
  "name": "string (optional)",
  "phone": "string (optional)",
  "status": "active" | "inactive" | "busy (optional)",
  "vehicleType": "string (optional)",
  "vehicleNumber": "string (optional)"
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Rider updated successfully",
  "data": {
    "rider": { "...": "updated rider" }
  }
}
```

### PATCH `/riders/:id/approve`

Approve a pending marketplace rider application. Sets `status` to `active` so the rider can log in.

**Auth Required:** Yes (Admin token)

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Rider approved successfully",
  "data": {
    "rider": { "id": "string", "status": "active" }
  }
}
```

**Error Cases:**
- `422` — Rider is not in `pending` status

### PATCH `/riders/:id/reject`

Reject a pending marketplace rider application. Sets `status` to `rejected` and stores the rejection reason. The rider will see this reason when they attempt to log in.

**Auth Required:** Yes (Admin token)

**Request Body:**
```json
{
  "reason": "string (required)"
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Rider application rejected",
  "data": {
    "rider": {
      "id": "string",
      "status": "rejected",
      "rejectionReason": "string"
    }
  }
}
```

**Error Cases:**
- `422` — Rider is not in `pending` status
- `400` — Rejection reason is required

### DELETE `/riders/:id`

Delete a rider.

**Auth Required:** Yes (Admin token)

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Rider deleted successfully"
}
```

### GET `/riders/:id/orders`

Get all orders assigned to a specific rider (Admin view).

**Auth Required:** Yes (Admin token)

**Query Parameters:**
- `status` (optional): Filter by order status

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "riderId": "string",
    "riderName": "string",
    "orders": [
      { "...": "order objects" }
    ]
  }
}
```

---

## Rider Self-Service Endpoints

> These endpoints are called from the **Rider Portal** using a **rider token**. They allow a rider to manage their own profile, browse and accept available jobs, and update delivery status.

### GET `/rider/me`

Get the currently logged-in rider's profile.

**Auth Required:** Yes (Rider token)

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "rider": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "status": "active" | "busy" | "inactive",
      "vehicleType": "string",
      "vehicleNumber": "string (optional)",
      "rating": number,
      "totalDeliveries": number,
      "currentOrders": number
    }
  }
}
```

### PATCH `/rider/me`

Update the currently logged-in rider's profile (name, phone, vehicle).

**Auth Required:** Yes (Rider token)

**Request Body:**
```json
{
  "name": "string (optional)",
  "phone": "string (optional)",
  "vehicleType": "string (optional)"
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "rider": { "...": "updated rider" }
  }
}
```

### PATCH `/rider/me/status`

Update the rider's availability status (Available / Busy / Offline).

**Auth Required:** Yes (Rider token)

**Request Body:**
```json
{
  "status": "active" | "busy" | "inactive"
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "status": "active" | "busy" | "inactive"
  }
}
```

### GET `/rider/available-jobs`

Get all orders available for a rider to accept — orders with status `Pending` and no assigned rider.

**Auth Required:** Yes (Rider token)

**Query Parameters:**
- `deliveryType` (optional): Filter by type
- `page` (optional): Page number
- `limit` (optional): Items per page (default: 20)

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "jobs": [
      {
        "id": "string",
        "trackingId": "string",
        "pickupLocation": "string",
        "deliveryLocation": "string",
        "description": "string",
        "weight": "string",
        "deliveryType": "string",
        "totalFee": number,
        "estimatedRiderEarnings": number,
        "createdAt": "ISO 8601 datetime"
      }
    ],
    "pagination": { "...": "pagination object" }
  }
}
```

> **Note:** `estimatedRiderEarnings` = `totalFee × 0.75` (Platform retains 25%)

### POST `/rider/jobs/:orderId/accept`

Rider accepts an available job. Sets order status to `Accepted`, assigns rider, and generates delivery OTP.

**Auth Required:** Yes (Rider token)

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Job accepted",
  "data": {
    "order": {
      "id": "string",
      "trackingId": "string",
      "status": "Accepted",
      "otp": "string",
      "pickupLocation": "string",
      "deliveryLocation": "string",
      "customer": "string",
      "customerPhone": "string",
      "assignedAt": "ISO 8601 datetime"
    }
  }
}
```

**Error Cases:**
- `409` — Order already assigned to another rider
- `409` — Order is no longer available (status changed)

### PATCH `/rider/jobs/:orderId/pickup`

Rider marks a job as picked up. Sets order status to `In Transit` and records `pickedUpAt` timestamp.

**Auth Required:** Yes (Rider token)

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Order marked as picked up",
  "data": {
    "order": {
      "id": "string",
      "status": "In Transit",
      "pickedUpAt": "ISO 8601 datetime"
    }
  }
}
```

**Error Cases:**
- `403` — This order is not assigned to the authenticated rider
- `422` — Order must be in `Accepted` status to mark as picked up

### PATCH `/rider/jobs/:orderId/deliver`

Rider marks a job as delivered. Sets order status to `Delivered`, records `deliveredAt`, and saves delivery proof. Triggers the payout transaction creation in the finance system.

**Auth Required:** Yes (Rider token)

**Request Body:** `multipart/form-data`
```
note: "string (optional)"   — delivery note, e.g. "Left with security guard"
proof: File (optional)       — photo or signature image (future: currently text only)
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Delivery confirmed",
  "data": {
    "order": {
      "id": "string",
      "status": "Delivered",
      "deliveredAt": "ISO 8601 datetime",
      "deliveryProof": "string"
    },
    "earnings": {
      "orderId": "string",
      "riderEarnings": number,
      "platformCommission": number,
      "totalFee": number
    }
  }
}
```

**Error Cases:**
- `403` — This order is not assigned to the authenticated rider
- `422` — Order must be in `In Transit` status to mark as delivered

### GET `/rider/me/orders`

Get all orders assigned to the currently logged-in rider, with optional status filtering.

**Auth Required:** Yes (Rider token)

**Query Parameters:**
- `status` (optional): `Accepted` | `In Transit` | `Delivered` | `Cancelled` | `Failed`
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "orders": [
      { "...": "order objects" }
    ],
    "pagination": { "...": "pagination object" }
  }
}
```

### GET `/rider/me/earnings`

Get the currently logged-in rider's earnings summary broken down by time period, plus a detailed payout history.

**Auth Required:** Yes (Rider token)

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "summary": {
      "today": number,
      "thisWeek": number,
      "thisMonth": number,
      "allTime": number
    },
    "commissionRate": 0.75,
    "payouts": [
      {
        "orderId": "string",
        "trackingId": "string",
        "deliveredAt": "ISO 8601 datetime",
        "pickupLocation": "string",
        "deliveryLocation": "string",
        "deliveryType": "string",
        "totalFee": number,
        "riderEarnings": number,
        "status": "Pending" | "Processed"
      }
    ]
  }
}
```

---

## Clients Endpoints

### GET `/clients`

Get all business clients.

**Auth Required:** Yes (Admin token)

**Query Parameters:**
- `status` (optional): Filter by status (`active` | `inactive` | `pending`)
- `accountType` (optional): Filter by type (`pay_as_you_go` | `corporate`)
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "clients": [
      {
        "id": "string",
        "contactName": "string",
        "email": "string",
        "phone": "string",
        "company": "string",
        "address": "string",
        "accountType": "pay_as_you_go" | "corporate",
        "registrationNumber": "string (optional)",
        "estimatedMonthlyVolume": "string (optional)",
        "totalOrders": number,
        "activeOrders": number,
        "status": "active" | "inactive" | "pending" | "suspended",
        "createdAt": "ISO 8601 datetime",
        "updatedAt": "ISO 8601 datetime"
      }
    ]
  }
}
```

### GET `/clients/:id`

Get a specific client by ID.

**Auth Required:** Yes (Admin token)

**Response:** `200 OK` — full client object

### POST `/clients`

Create a new business client (Admin action).

**Auth Required:** Yes (Admin token)

**Request Body:**
```json
{
  "contactName": "string",
  "email": "string",
  "phone": "string",
  "company": "string",
  "address": "string (optional)",
  "accountType": "pay_as_you_go" | "corporate",
  "registrationNumber": "string (optional)",
  "estimatedMonthlyVolume": "string (optional)"
}
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "message": "Client created successfully",
  "data": {
    "client": { "...": "created client" }
  }
}
```

### PUT `/clients/:id`

Update a client.

**Auth Required:** Yes (Admin token)

**Request Body:** Partial client fields

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Client updated successfully",
  "data": {
    "client": { "...": "updated client" }
  }
}
```

### PATCH `/clients/:id/status`

Approve, activate, suspend, or deactivate a client account.

**Auth Required:** Yes (Admin token)

**Request Body:**
```json
{
  "status": "active" | "inactive" | "suspended"
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Client status updated",
  "data": {
    "client": { "id": "string", "status": "string" }
  }
}
```

### DELETE `/clients/:id`

Delete a client.

**Auth Required:** Yes (Admin token)

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Client deleted successfully"
}
```

### GET `/clients/:id/orders`

Get all orders for a specific client.

**Auth Required:** Yes (Admin or Client token)

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "clientId": "string",
    "clientName": "string",
    "orders": [
      { "...": "order objects" }
    ]
  }
}
```

---

## Team Management Endpoints

### GET `/team/users`

Get all team members/staff users.

**Auth Required:** Yes (Admin or Super Admin)

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "phone": "string",
        "role": "super_admin" | "admin" | "logistics_staff",
        "avatar": "string",
        "isActive": boolean,
        "createdAt": "ISO 8601 datetime",
        "updatedAt": "ISO 8601 datetime"
      }
    ]
  }
}
```

### GET `/team/users/:id`

Get a specific team member by ID.

**Auth Required:** Yes (Admin or Super Admin)

### POST `/team/users`

Create a new team member.

**Auth Required:** Yes (Admin or Super Admin)

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "role": "admin" | "logistics_staff"
}
```

**Response:** `201 Created`

### PUT `/team/users/:id`

Update a team member.

**Auth Required:** Yes (Admin or Super Admin)

### PATCH `/team/users/:id/toggle-status`

Activate or deactivate a team member.

**Auth Required:** Yes (Admin or Super Admin)

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "user": { "id": "string", "isActive": boolean }
  }
}
```

### DELETE `/team/users/:id`

Delete a team member.

**Auth Required:** Yes (Super Admin only)

---

## Analytics Endpoints

### GET `/analytics/dashboard`

Get overall dashboard analytics.

**Auth Required:** Yes (Admin token)

**Query Parameters:**
- `period` (optional): `daily` | `weekly` | `monthly` (default: daily)

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "metrics": {
      "totalOrders": number,
      "activeOrders": number,
      "completedOrders": number,
      "totalRevenue": number,
      "averageDeliveryTime": number,
      "successRate": number,
      "onTimeRate": number
    },
    "charts": {
      "volumeByHour": [
        { "hour": "string", "count": number }
      ],
      "deliveryPerformance": [
        { "date": "string", "onTime": number, "late": number }
      ]
    },
    "rankings": {
      "topRiders": [
        { "id": "string", "name": "string", "deliveries": number, "rating": number }
      ],
      "topClients": [
        { "id": "string", "name": "string", "orders": number }
      ]
    }
  }
}
```

### GET `/analytics/orders`

Get order-specific analytics.

**Auth Required:** Yes (Admin token)

**Query Parameters:**
- `startDate` / `endDate` (optional): ISO 8601 date range
- `groupBy` (optional): `hour` | `day` | `week` | `month`

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "statusDistribution": {
      "Pending": number,
      "Accepted": number,
      "In Transit": number,
      "Delivered": number,
      "Cancelled": number,
      "Failed": number
    },
    "deliveryTypeDistribution": {
      "Standard": number,
      "Express": number,
      "Same Day": number
    },
    "volumeTrend": [
      { "period": "string", "count": number }
    ]
  }
}
```

### GET `/analytics/riders`

Get rider performance analytics.

**Auth Required:** Yes (Admin token)

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "totalRiders": number,
    "activeRiders": number,
    "averageRating": number,
    "performanceByRider": [
      {
        "riderId": "string",
        "riderName": "string",
        "totalDeliveries": number,
        "successRate": number,
        "averageDeliveryTime": number,
        "rating": number
      }
    ]
  }
}
```

---

## Finance Endpoints

### GET `/finance/transactions`

Get all financial transactions.

**Auth Required:** Yes (Admin or Super Admin)

**Query Parameters:**
- `status` (optional): `Pending` | `Processed` | `Disputed`
- `startDate` / `endDate` (optional): ISO 8601 date range
- `page` / `limit` (optional): Pagination

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "transactions": [
      {
        "id": "string",
        "orderId": "string",
        "clientId": "string",
        "clientName": "string",
        "riderId": "string",
        "riderName": "string",
        "totalFee": number,
        "platformCommission": number,
        "riderPayout": number,
        "status": "Pending" | "Processed" | "Disputed",
        "date": "ISO 8601 date",
        "processedAt": "ISO 8601 datetime (optional)",
        "createdAt": "ISO 8601 datetime"
      }
    ],
    "pagination": { "...": "pagination object" }
  }
}
```

### GET `/finance/revenue-stats`

Get revenue statistics.

**Auth Required:** Yes (Admin or Super Admin)

**Query Parameters:**
- `period` (optional): `daily` | `weekly` | `monthly` | `yearly`

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "stats": {
      "totalRevenue": number,
      "platformEarnings": number,
      "riderPayouts": number,
      "netProfit": number
    },
    "trend": [
      { "period": "string", "revenue": number, "profit": number }
    ]
  }
}
```

### PATCH `/finance/transactions/:id/process`

Process a rider payout transaction.

**Auth Required:** Yes (Admin or Super Admin)

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Transaction processed successfully",
  "data": {
    "transaction": {
      "id": "string",
      "status": "Processed",
      "processedAt": "ISO 8601 datetime"
    }
  }
}
```

### PATCH `/finance/transactions/:id/dispute`

Mark a transaction as disputed.

**Auth Required:** Yes (Admin or Super Admin)

**Request Body:**
```json
{
  "reason": "string"
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "transaction": { "id": "string", "status": "Disputed" }
  }
}
```

---

## Wallets & Payments Endpoints

### GET `/wallets/me`

Get the authenticated client's wallet balance.

**Auth Required:** Yes (Client token)

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "wallet": {
      "id": "string",
      "clientId": "string",
      "balance": number,
      "currency": "NGN",
      "isActive": true,
      "updatedAt": "ISO 8601 datetime"
    }
  }
}
```

### POST `/wallets/fund/initialize`

Initialize a wallet top-up via Paystack/Flutterwave. Returns a payment authorization URL to redirect the client to.

**Auth Required:** Yes (Client token)

**Request Body:**
```json
{
  "amount": number
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "reference": "string",
    "authorizationUrl": "string"
  }
}
```

### POST `/wallets/fund/webhook`

Webhook endpoint called by the payment gateway to confirm a successful payment and credit the client's wallet.

**Auth Required:** No (Secured via HMAC signature verification)

**Response:** `200 OK`

### GET `/wallets/transactions`

Get the client's wallet transaction ledger.

**Auth Required:** Yes (Client token)

**Query Parameters:**
- `type` (optional): `credit` | `debit`
- `page` / `limit` (optional): Pagination

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "transactions": [
      {
        "id": "string",
        "type": "credit" | "debit",
        "amount": number,
        "balanceBefore": number,
        "balanceAfter": number,
        "reference": "string (optional)",
        "description": "string",
        "createdAt": "ISO 8601 datetime"
      }
    ],
    "pagination": { "...": "pagination object" }
  }
}
```

---

## Data Models

### User Roles (Admin/Staff)

```typescript
type UserRole = "super_admin" | "admin" | "logistics_staff"
```

### Order Status

```typescript
type OrderStatus = "Pending" | "Accepted" | "In Transit" | "Delivered" | "Cancelled" | "Failed"
```

> **Flow:** `Pending` → `Accepted` (rider assigned) → `In Transit` (rider picks up) → `Delivered` (rider confirms)
> Cancelled or Failed can occur at any stage.

### Delivery Type

```typescript
type DeliveryType = "Standard" | "Express" | "Same Day"
```

### Rider Type

```typescript
type RiderType = "standard" | "premium"
// standard = admin-added fleet rider (no KYC flow)
// premium  = marketplace/gig rider, self-registered with KYC, earns 75% commission
```

### Rider Status

```typescript
type RiderStatus = "active" | "busy" | "inactive" | "pending" | "rejected"
// active   = available for new jobs (can log in)
// busy     = currently on a delivery (can log in)
// inactive = offline / deactivated (blocked from login)
// pending  = KYC application submitted, awaiting admin review (blocked from login)
// rejected = KYC application denied by admin (blocked from login, sees rejection reason)
```

### KYC Fields (Premium Riders)

Fields only present on `riderType: "premium"` riders:

| Field | Type | Notes |
|---|---|---|
| `nin` | string | 11-digit National Identification Number |
| `idType` | string | `"NIN Slip"` \| `"Driver's License"` \| `"Voter's Card"` \| `"International Passport"` |
| `idDocumentUrl` | string | Permanent URL to uploaded ID document image |
| `passportPhotoUrl` | string | Permanent URL to uploaded passport/selfie image |
| `rejectionReason` | string | Set when admin rejects; returned in login error message |

### Client Account Type

```typescript
type AccountType = "pay_as_you_go" | "corporate"
```

### Client Status

```typescript
type ClientStatus = "active" | "inactive" | "pending" | "suspended"
// pending = awaiting admin approval (new self-serve signups)
// suspended = blocked by admin
```

### Transaction Status

```typescript
type TransactionStatus = "Pending" | "Processed" | "Disputed"
```

### Commission Structure

| Model | Platform Takes | Rider Gets |
|---|---|---|
| All deliveries (current) | 25% | 75% |

> Future expansion may support per-rider commission tiers.

---

## Error Responses

All error responses follow this format:

```json
{
  "status": "error",
  "message": "Human-readable error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific field error"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning |
|---|---|
| `200` | OK |
| `201` | Created |
| `400` | Bad Request (malformed input) |
| `401` | Unauthorized (missing or invalid token) |
| `402` | Payment Required (insufficient wallet balance) |
| `403` | Forbidden (wrong role, inactive account) |
| `404` | Not Found |
| `409` | Conflict (e.g., order already accepted) |
| `422` | Validation Error (valid format, invalid business logic) |
| `500` | Internal Server Error |

---

## Rate Limiting

- **Limit:** 100 requests per minute per IP
- **Headers:**
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

---

## Pagination

All list endpoints support pagination:

- `page` (default: 1)
- `limit` (default: 50, max: 100)

Standard pagination response:

```json
{
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Notes

- All timestamps are in ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`
- All monetary values are in **Naira (NGN)**, not kobo — return full unit values (e.g., `12500` = ₦12,500)
- File uploads (delivery proof photos) use `multipart/form-data`
- All text fields support UTF-8 encoding
- The `otp` field on orders is the delivery confirmation code shown to the rider and given verbally by the recipient
