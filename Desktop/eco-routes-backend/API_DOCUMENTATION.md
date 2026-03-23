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

1. [Authentication](#authentication-endpoints)
2. [Orders](#orders-endpoints)
3. [Riders](#riders-endpoints)
4. [Clients](#clients-endpoints)
5. [Team Management](#team-management-endpoints)
6. [Analytics](#analytics-endpoints)
7. [Finance](#finance-endpoints)
8. [Wallets & Payments](#wallets--payments-endpoints)
9. [Data Models](#data-models)

---

## Authentication Endpoints

### POST `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "role": "super_admin" | "admin" | "logistics_staff" | "rider"
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

Authenticate user and get access token.

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

Authenticate client and get access token. Fails with `403 Forbidden` if the account status is `pending`.

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
      "email": "string",
      "accountType": "pay_as_you_go" | "corporate",
      "status": "active"
    },
    "token": "string"
  }
}
```

---

## Orders Endpoints

### GET `/orders`

Get all orders with optional filtering.

**Auth Required:** Yes

**Query Parameters:**
- `status` (optional): Filter by order status
- `clientId` (optional): Filter by business client
- `riderId` (optional): Filter by rider
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
        "status": "pending" | "assigned" | "picked_up" | "in_transit" | "delivered" | "cancelled",
        "deliveryType": "standard" | "express" | "same_day",
        "deliveryModel": "Standard" | "Premium",
        "weight": "string",
        "value": "string",
        "description": "string (optional)",
        "pickupLocation": "string",
        "deliveryLocation": "string",
        "driver": "string (optional)",
        "driverId": "string (optional)",
        "date": "ISO 8601 datetime",
        "createdAt": "ISO 8601 datetime",
        "updatedAt": "ISO 8601 datetime",
        "deliveryFee": number,
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

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "order": {
      "id": "string",
      "trackingId": "string",
      "customer": "string",
      "customerEmail": "string (optional)",
      "customerPhone": "string",
      "customerLocation": "string",
      "businessClient": "string",
      "businessClientId": "string",
      "status": "string",
      "deliveryType": "string",
      "deliveryModel": "Standard" | "Premium",
      "weight": "string",
      "value": "string",
      "description": "string",
      "specialInstructions": "string",
      "pickupLocation": "string",
      "deliveryLocation": "string",
      "landmark": "string",
      "driver": "string",
      "driverId": "string",
      "assignedAt": "ISO 8601 datetime",
      "otp": "string",
      "date": "ISO 8601 datetime",
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime",
      "scheduledFor": "ISO 8601 datetime",
      "pickedUpAt": "ISO 8601 datetime",
      "deliveredAt": "ISO 8601 datetime",
      "deliveryFee": number,
      "adminFee": number,
      "totalFee": number
    }
  }
}
```

### POST `/orders`

Create a new order. The client will pass `deliveryModel` to choose between the **Standard Fleet** (normal rates) or the **Premium Market Model** (higher rates, priority dispatch). 
The `deliveryFee` is automatically calculated based on the selected `deliveryModel`, weight, and distance, and then deducted from the client's wallet. The request will fail (`402 Payment Required`) if the wallet has insufficient funds.

**Auth Required:** Yes

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
  "deliveryType": "standard" | "express" | "same_day",
  "deliveryModel": "Standard" | "Premium",
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
      "...": "...all order fields"
    }
  }
}
```

### PUT `/orders/:id`

Update an existing order.

**Auth Required:** Yes

**Request Body:** (Partial Order object)
```json
{
  "customerName": "string (optional)",
  "customerPhone": "string (optional)",
  "deliveryLocation": "string (optional)",
  "specialInstructions": "string (optional)",
  "weight": "string (optional)",
  "value": "string (optional)"
}
```

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

Update order status.

**Auth Required:** Yes

**Request Body:**
```json
{
  "status": "pending" | "assigned" | "picked_up" | "in_transit" | "delivered" | "cancelled",
  "notes": "string (optional)",
  "location": {
    "lat": number,
    "lng": number
  }
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Order status updated successfully",
  "data": {
    "order": { "...": "updated order" }
  }
}
```

### PATCH `/orders/:id/assign`

Assign a rider to an order.

**Auth Required:** Yes

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
      "assignedAt": "ISO 8601 datetime"
    }
  }
}
```

### DELETE `/orders/:id`

Delete an order.

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Order deleted successfully"
}
```

---

## Riders Endpoints

### GET `/riders`

Get all riders.

**Auth Required:** Yes

**Query Parameters:**
- `status` (optional): Filter by rider status (active | inactive | busy)
- `available` (optional): Get only available riders (boolean)

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "riders": [
      {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "phone": "string",
        "email": "string",
        "status": "active" | "inactive" | "busy",
        "currentOrders": number,
        "completedOrders": number,
        "totalDeliveries": number,
        "rating": number,
        "vehicleType": "string",
        "vehicleNumber": "string",
        "licenseNumber": "string",
        "createdAt": "ISO 8601 datetime",
        "updatedAt": "ISO 8601 datetime"
      }
    ]
  }
}
```

### GET `/riders/:id`

Get a specific rider by ID.

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "rider": {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "phone": "string",
      "email": "string",
      "status": "string",
      "currentOrders": number,
      "completedOrders": number,
      "totalDeliveries": number,
      "rating": number,
      "vehicleType": "string",
      "vehicleNumber": "string",
      "licenseNumber": "string",
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime"
    }
  }
}
```

### POST `/riders`

Create a new rider.

**Auth Required:** Yes

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "email": "string",
  "vehicleType": "string",
  "vehicleNumber": "string",
  "licenseNumber": "string"
}
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "message": "Rider created successfully",
  "data": {
    "rider": { "...": "created rider" }
  }
}
```

### PUT `/riders/:id`

Update a rider.

**Auth Required:** Yes

**Request Body:** (Partial Rider object)
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "phone": "string (optional)",
  "email": "string (optional)",
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

### DELETE `/riders/:id`

Delete a rider.

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Rider deleted successfully"
}
```

### GET `/riders/:id/orders`

Get all orders assigned to a specific rider.

**Auth Required:** Yes

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

## Clients Endpoints

### GET `/clients`

Get all business clients.

**Auth Required:** Yes

**Query Parameters:**
- `status` (optional): Filter by client status
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
        "status": "active" | "inactive" | "pending",
        "createdAt": "ISO 8601 datetime",
        "updatedAt": "ISO 8601 datetime"
      }
    ]
  }
}
```

### GET `/clients/:id`

Get a specific client by ID.

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "client": {
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
      "status": "string",
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime"
    }
  }
}
```

### POST `/clients`

Create a new business client.

**Auth Required:** Yes

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

**Auth Required:** Yes

**Request Body:** (Partial Client object)
```json
{
  "contactName": "string (optional)",
  "email": "string (optional)",
  "phone": "string (optional)",
  "company": "string (optional)",
  "address": "string (optional)",
  "status": "active" | "inactive" | "pending (optional)",
  "accountType": "pay_as_you_go" | "corporate (optional)"
}
```

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

### DELETE `/clients/:id`

Delete a client.

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Client deleted successfully"
}
```

### GET `/clients/:id/orders`

Get all orders for a specific client.

**Auth Required:** Yes

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

**Auth Required:** Yes  
**Required Role:** Admin or Super Admin

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
        "role": "super_admin" | "admin" | "logistics_staff" | "rider",
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

**Auth Required:** Yes  
**Required Role:** Admin or Super Admin

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
      "avatar": "string",
      "isActive": boolean,
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime"
    }
  }
}
```

### POST `/team/users`

Create a new team member.

**Auth Required:** Yes  
**Required Role:** Admin or Super Admin

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "role": "admin" | "logistics_staff" | "rider"
}
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "message": "Team member created successfully",
  "data": {
    "user": { "...": "created user" }
  }
}
```

### PUT `/team/users/:id`

Update a team member.

**Auth Required:** Yes  
**Required Role:** Admin or Super Admin

**Request Body:** (Partial User object)
```json
{
  "name": "string (optional)",
  "email": "string (optional)",
  "phone": "string (optional)",
  "role": "string (optional)",
  "isActive": boolean (optional)
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Team member updated successfully",
  "data": {
    "user": { "...": "updated user" }
  }
}
```

### PATCH `/team/users/:id/toggle-status`

Activate or deactivate a team member.

**Auth Required:** Yes  
**Required Role:** Admin or Super Admin

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "User status updated successfully",
  "data": {
    "user": {
      "id": "string",
      "isActive": boolean
    }
  }
}
```

### DELETE `/team/users/:id`

Delete a team member.

**Auth Required:** Yes  
**Required Role:** Super Admin only

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Team member deleted successfully"
}
```

---

## Analytics Endpoints

### GET `/analytics/dashboard`

Get overall dashboard analytics.

**Auth Required:** Yes

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
      "volumeByTime": [
        { "hour": "string", "count": number }
      ],
      "volumeByDay": [
        { "day": "string", "count": number }
      ],
      "deliveryPerformance": [
        { "date": "string", "onTime": number, "late": number }
      ]
    },
    "rankings": {
      "topRiders": [
        { "id": "string", "name": "string", "orders": number, "rating": number }
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

**Auth Required:** Yes

**Query Parameters:**
- `startDate` (optional): Start date (ISO 8601)
- `endDate` (optional): End date (ISO 8601)
- `groupBy` (optional): `hour` | `day` | `week` | `month`

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "statusDistribution": {
      "pending": number,
      "assigned": number,
      "picked_up": number,
      "in_transit": number,
      "delivered": number,
      "cancelled": number
    },
    "deliveryTypeDistribution": {
      "standard": number,
      "express": number,
      "same_day": number
    },
    "volumeTrend": [
      { "period": "string", "count": number }
    ]
  }
}
```

### GET `/analytics/riders`

Get rider performance analytics.

**Auth Required:** Yes

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
        "completedOrders": number,
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

**Auth Required:** Yes  
**Required Role:** Admin or Super Admin

**Query Parameters:**
- `status` (optional): `pending` | `processed` | `disputed`
- `deliveryModel` (optional): `Standard` | `Premium`
- `startDate` (optional): ISO 8601 datetime
- `endDate` (optional): ISO 8601 datetime
- `page` (optional): Page number
- `limit` (optional): Items per page

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
        "deliveryModel": "Standard" | "Premium",
        "totalFee": number,
        "platformCommission": number,
        "riderPayout": number,
        "status": "Pending" | "Processed" | "Disputed",
        "date": "ISO 8601 date",
        "processedAt": "ISO 8601 datetime (optional)",
        "createdAt": "ISO 8601 datetime"
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number
    }
  }
}
```

### GET `/finance/revenue-stats`

Get revenue statistics.

**Auth Required:** Yes  
**Required Role:** Admin or Super Admin

**Query Parameters:**
- `period` (optional): `daily` | `weekly` | `monthly` | `yearly`

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "stats": {
      "totalRevenue": number,
      "standardRevenue": number,
      "premiumRevenue": number,
      "platformEarnings": number,
      "riderPayouts": number,
      "operationalExpenses": number,
      "netProfit": number
    },
    "trend": [
      {
        "period": "string",
        "revenue": number,
        "profit": number
      }
    ]
  }
}
```

### PATCH `/finance/transactions/:id/process`

Process a transaction payout.

**Auth Required:** Yes  
**Required Role:** Admin or Super Admin

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

**Auth Required:** Yes  
**Required Role:** Admin or Super Admin

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
  "message": "Transaction marked as disputed",
  "data": {
    "transaction": {
      "id": "string",
      "status": "Disputed"
    }
  }
}
```

---

## Wallets & Payments Endpoints

### GET `/wallets/me`

Get current client's wallet balance and status.

**Auth Required:** Yes

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
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime"
    }
  }
}
```

### POST `/wallets/fund/initialize`

Initialize a wallet top-up transaction via Payment Gateway (e.g., Paystack/Flutterwave).

**Auth Required:** Yes

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
  "message": "Payment initialized successfully",
  "data": {
    "reference": "string",
    "authorizationUrl": "string"
  }
}
```

### POST `/wallets/fund/webhook`

Webhook endpoint for the payment gateway to confirm successful payment.

**Auth Required:** No (Secured via signature verification)

**Response:** `200 OK`

### GET `/wallets/transactions`

Get wallet transaction ledger (credits and debits).

**Auth Required:** Yes

**Query Parameters:**
- `type` (optional): `credit` | `debit`
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "transactions": [
      {
        "id": "string",
        "walletId": "string",
        "type": "credit" | "debit",
        "amount": number,
        "balanceBefore": number,
        "balanceAfter": number,
        "reference": "string (optional)",
        "description": "string",
        "createdAt": "ISO 8601 datetime"
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number
    }
  }
}
```

---

## Data Models

### User Roles

```typescript
type UserRole = "super_admin" | "admin" | "logistics_staff" | "rider"
```

### Order Status

```typescript
type OrderStatus = "pending" | "assigned" | "picked_up" | "in_transit" | "delivered" | "cancelled"
```

### Delivery Type

```typescript
type DeliveryType = "standard" | "express" | "same_day"
```

### Rider Status

```typescript
type RiderStatus = "active" | "inactive" | "busy"
```

### Transaction Status

```typescript
type TransactionStatus = "Pending" | "Processed" | "Disputed"
```

### Delivery Model

```typescript
type DeliveryModel = "Standard" | "Premium"
```

**Standard Model:** Company-owned vehicles. Regular delivery rates.
**Premium Model:** Independent top-rated riders (Market Model). More expensive delivery rates, priority dispatch. Platform takes 25% commission, rider gets 75%.

### Wallet Transaction Type

```typescript
type WalletTxType = "credit" | "debit"
```

---

## Error Responses

All error responses follow this format:

```json
{
  "status": "error",
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific error message"
    }
  ]
}
```

### HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

---

## Rate Limiting

- **Limit:** 100 requests per minute per IP
- **Headers:**
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

---

## Pagination

All list endpoints support pagination with the following query parameters:

- `page` (default: 1)
- `limit` (default: 50, max: 100)

Response includes pagination metadata:

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
- All monetary values are in the smallest currency unit (kobo/cents)
- File uploads (delivery proof, documents) should use `multipart/form-data`
- All text fields support UTF-8 encoding
