# Stock Management System using Agentic AI

A full-stack stock/inventory management platform with three portals: Customer, Supplier, and Admin.

## Architecture

```
┌─────────────────┐          REST API                    ┌─────────────────┐
│   React Client  │  ──────────────────────▶            │   Node/Express  │
│    (Vite)       │                                      │   Backend      │
│   TypeScript   │                                       │   Prisma ORM   │
└───────┬─────────┘                                      └───────┬─────────┘
        │                                                        │
        │                          PostgreSQL Database           │
        └────────────────────────────────────────────────────────┘

┌─────────────────┐     Placeholder Layer     ┌─────────────────┐
│   n8n Adapter   │  ←→→→→→→→→→→→→→→→→→→→→→→→ │   AI Agents   │
│ (future integration)                        │ (LLMs)        │
└─────────────────┘                           └─────────────────┘
```

## Tech Stack

### Frontend
- React.js with React Router
- Vite for dev server and building
- TypeScript for type safety
- Tailwind CSS for styling
- Axios for API calls
- Zod for validation

### Backend
- Node.js with Express.js
- TypeScript
- PostgreSQL database
- Prisma ORM for database access
- JWT authentication with bcrypt password hashing
- Helmet and CORS security middleware
- Zod request validation

### Infrastructure
- Monorepo structure (client/packages and server/packages)
- npm workspaces for managing client and server
- Environment variables via .env files

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL (v13+)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd stock-management-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   This will install dependencies for both the client and server workspaces.

3. **Set up environment variables:**
   ```bash
   cp server/.env.example server/.env
   ```
   Edit `server/.env` with your configuration:
   ```
   DATABASE_URL=postgresql://postgres@localhost:5432/stock_management
   JWT_SECRET=your-jwt-secret-key
   BCRYPT_SALT_ROUNDS=10
   PORT=3001
   N8N_BASE_URL=http://localhost:5678
   N8N_API_KEY=
   ```

4. **Create the database:**
   ```bash
   createdb stock_management
   ```

5. **Run Prisma migrations:**
   ```bash
   cd server
   npx prisma migrate dev --name init
   ```

6. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

7. **Run the seed script:**
   ```bash
   cd server
   npx tsx src/seeds/index.ts
   ```

8. **Start the development servers:**
   ```bash
   npm run dev
   ```
   This will start both the frontend (Vite on port 5173) and backend (Express on port 3001).

### Test Login Credentials

**Admin Account:**
- Email: admin@example.com
- Password: admin123
- Role: ADMIN

**Supplier Account:**
- Email: (auto-created during seed)
- Password: supplier123 (example)
- Role: SUPPLIER

**Customer Account:**
- Email: customer@example.com
- Password: customer123
- Role: CUSTOMER

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user profile

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (admin/supplier)
- `PUT /api/products/:id` - Update product (admin/supplier)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create new order (customer)
- `GET /api/orders` - Get orders (filtered by role)
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/status` - Update order status (admin)

### Stock
- `GET /api/stock/low-stock` - Get low-stock products
- `GET /api/stock/transactions` - Get stock transaction history
- `PATCH /api/stock/adjust` - Manual stock adjustment

### AI Placeholders
- `POST /api/ai/low-stock-analysis` - Low stock analysis (not implemented)
- `POST /api/ai/demand-prediction` - Demand prediction (not implemented)
- `POST /api/ai/supplier-recommendation` - Supplier recommendation (not implemented)
- `POST /api/ai/inventory-report` - Inventory report (not implemented)

## Role-Based Access Control

### Customer (CUSTOMER)
- View products and product details
- Add products to cart
- Place orders
- View order history
- View profile

### Supplier (SUPPLIER)
- Dashboard showing products and stock
- Add/edit products (own products only)
- View relevant orders
- Update stock levels
- View order-related information

### Admin (ADMIN)
- Full dashboard statistics
- Manage all products, suppliers, customers
- View all orders and update status
- Adjust stock levels
- View stock transaction history
- Low-stock detection

## n8n Integration (Future)

The application includes placeholder interfaces for future n8n workflow integration:

### Configuration
- `N8N_BASE_URL=` - n8n instance URL
- `N8N_API_KEY=` - n8n API key

### Placeholder Functions (server/src/integrations/n8n/)
- `triggerLowStockWorkflow()` - Trigger low-stock detection workflow
- `triggerDemandPredictionWorkflow()` - Trigger demand prediction workflow
- `triggerSupplierRecommendationWorkflow()` - Trigger supplier recommendation workflow
- `triggerInventoryReportWorkflow()` - Trigger inventory report workflow

### Webhook Endpoints (placeholders)
- `/api/ai/low-stock-analysis` - Receive low stock analysis from n8n
- `/api/ai/demand-prediction` - Receive demand prediction results
- `/api/ai/supplier-recommendation` - Receive supplier recommendations
- `/api/ai/inventory-report` - Generate inventory reports

When n8n is integrated, the application backend should NOT directly access the database. All business logic should flow through the n8n workflows.

## Project Structure

```
stock-management-system/
├── package.json          # Root workspace config
├── client/              # Frontend (React + Vite)
│   ├── package.json
│   ├── vite.config.ts
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── index.html
│   │   ├── index.css
│   │   ├── components/
│   │   │   └── Form.tsx
│   │   ├── layouts/
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── CustomerLayout.tsx
│   │   │   ├── SupplierLayout.tsx
│   │   │   └── AdminLayout.tsx
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── RegisterPage.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── Cart.tsx
│   │   │   └── Orders.tsx
│   │   └── styles/
├── server/              # Backend (Node/Express + Prisma)
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── product.routes.ts
│   │   │   ├── order.routes.ts
│   │   │   ├── stock.routes.ts
│   │   │   ├── ai/ai.routes.ts
│   │   │   └── seeds/
│   │   │   │   └── index.ts
│   │   │   └── integrations/
│   │   │       └── n8n/
│   │   │           ├── n8n.client.ts
│   │   │           └── n8n.webhooks.ts
│   │   ├── services/
│   │   ├── middleware/
│   │   └── seeds/
├── prisma/
│   └── schema.prisma
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

## Known Limitations

1. **No payment integration** - The "Place Order" flow does not include online payment processing for the MVP.

2. **Basic authentication** - JWT tokens are stored in localStorage; a production system should use secure HTTP-only cookies or token refresh strategies.

3. **Limited validation** - Request validation exists but may not cover all edge cases.

4. **Frontend-only routing protection** - Route guards are implemented in the frontend but should also be enforced on the backend.

5. **No real n8n integration** - The n8n placeholder functions log messages but don't make actual API calls. These should be connected when n8n is set up.

6. **Seed data is development-only** - The seed script uses example credentials that should NOT be used in production.

7. **Prisma schema evolutions** - The schema has been iteratively developed; running `prisma migrate deploy --reset` may be needed to reset the database.

8. **Browser navigation** - The React Router uses hash-based routing (`/#/path`) for compatibility; consider switching to browser history for production.

## Development Experience

### npm Scripts

**Root level:**
- `npm install` - Install all dependencies
- `npm run dev` - Start both frontend and backend development servers
- `npm run build` - Build both frontend and backend

**Backend:**
- `npm run dev` - Start backend with tsx (hot-reload)
- `npm run build` - TypeScript compile
- `npm run start` - Start production server
- `npm run prisma:migrate` - Run Prisma migrations
- `npm run prisma:seed` - Run seed data

**Frontend:**
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production

## Future Roadmap

### Phase 4 (n8n Integration)
- Connect n8n placeholder functions to actual n8n instance
- Implement low-stock auto-detection workflows
- Implement demand prediction using historical data
- Implement automatic supplier recommendations
- Implement inventory report generation

### Phase 5 (UI Polish)
- Improve dashboard visualizations
- Add product search and filtering
- Add responsive design improvements
- Add loading and error states
- Add unit tests

### Phase 6 (Production)
- Add payment integration (Stripe/PayPal)
- Implement refresh token strategy
- Add comprehensive test coverage
- Deploy to production environment
- Add domain and SSL configuration
harisankar branch init