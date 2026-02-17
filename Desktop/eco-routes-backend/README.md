# EcoRoutes Backend API

Backend API for the EcoRoutes Logistics Management System built with Node.js, Express, and TypeScript.

## 🔗 Related Repositories

- **Frontend**: [eco-routes-frontend](https://github.com/eco-routes-logistics/eco-routes-frontend)
- **Main Docs**: [eco-routes](https://github.com/eco-routes-logistics/eco-routes)
- **Organization**: [eco-routes-logistics](https://github.com/eco-routes-logistics)

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Security**: Helmet, CORS
- **Logging**: Morgan

## 📁 Project Structure

```
src/
├── controllers/      # Route controllers
│   ├── auth.controller.ts
│   ├── order.controller.ts
│   ├── rider.controller.ts
│   └── client.controller.ts
├── routes/          # API routes
│   ├── index.ts
│   ├── auth.routes.ts
│   ├── order.routes.ts
│   ├── rider.routes.ts
│   └── client.routes.ts
├── middleware/      # Express middleware
│   └── errorHandler.ts
└── server.ts        # Application entry point
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/eco-routes-logistics/eco-routes-backend.git
cd eco-routes-backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Development

Start the development server with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Build

Compile TypeScript to JavaScript:
```bash
npm run build
```

### Production

Run the compiled code:
```bash
npm start
```

## 📍 API Endpoints

### Health Check
- `GET /health` - Server health status

### API Info
- `GET /api/v1` - API version and available endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

### Orders
- `GET /api/v1/orders` - Get all orders
- `GET /api/v1/orders/:id` - Get order by ID
- `POST /api/v1/orders` - Create new order
- `PUT /api/v1/orders/:id` - Update order
- `DELETE /api/v1/orders/:id` - Delete order
- `PATCH /api/v1/orders/:id/status` - Update order status

### Riders
- `GET /api/v1/riders` - Get all riders
- `GET /api/v1/riders/:id` - Get rider by ID
- `POST /api/v1/riders` - Create new rider
- `PUT /api/v1/riders/:id` - Update rider
- `DELETE /api/v1/riders/:id` - Delete rider
- `GET /api/v1/riders/:id/orders` - Get rider's orders

### Clients
- `GET /api/v1/clients` - Get all clients
- `GET /api/v1/clients/:id` - Get client by ID
- `POST /api/v1/clients` - Create new client
- `PUT /api/v1/clients/:id` - Update client
- `DELETE /api/v1/clients/:id` - Delete client

## 🔧 Environment Variables

See `.env.example` for all available configuration options:

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (development/production)
- `FRONTEND_URL` - Frontend URL for CORS
- `API_PREFIX` - API route prefix

## 🚧 Next Steps

This is the initial backend structure. Next implementations:

1. **Database Integration** - Set up PostgreSQL with Prisma/TypeORM
2. **Authentication** - Implement JWT-based authentication
3. **Validation** - Add request validation middleware
4. **Database Models** - Create models for orders, riders, clients, etc.
5. **Business Logic** - Implement actual controller logic
6. **Testing** - Add unit and integration tests
7. **API Documentation** - Set up Swagger/OpenAPI docs

## 📄 License

Proprietary - All rights reserved

## 👥 Team

Built with ❤️ by the EcoRoutes team
