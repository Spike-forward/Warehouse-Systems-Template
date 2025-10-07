# Quick Start Guide

This guide will help you get the Warehouse Management System up and running quickly.

## Prerequisites

- Node.js v18 or higher
- npm v8 or higher

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Spike-forward/Warehouse-Systems-Template.git
cd Warehouse-Systems-Template
```

### 2. Setup Backend

```bash
cd backend
npm install
npm run build
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

## Running the Application

### Start Backend Server (Terminal 1)

```bash
cd backend
npm run dev
```

The backend API will be available at `http://localhost:3001`

### Start Frontend Server (Terminal 2)

```bash
cd frontend
npm start
```

The frontend will be available at `http://localhost:3000`

## First Steps

1. **Add Products**: Navigate to the Products tab and create products with their permit requirements
2. **Add Customers**: Set up your customer database in the Customers tab
3. **Add Suppliers**: Add supplier information in the Suppliers tab
4. **Create In-Stock Orders**: Record incoming inventory with supplier info
5. **Create Out-Stock Orders**: Record outgoing shipments and link to in-stock orders
6. **Check Inventory**: View real-time inventory levels per customer

## API Testing

You can test the API using curl:

```bash
# Health check
curl http://localhost:3001/api/health

# Get all products
curl http://localhost:3001/api/products

# Create a product
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{"model":"ABC-123","name":"Sample Product","need_import_permit":1,"need_export_permit":0}'
```

## Database

The SQLite database (`warehouse.db`) will be automatically created in the backend directory when you first start the server. All tables are initialized automatically.

## Troubleshooting

### Port Already in Use

If port 3001 or 3000 is already in use:

- Backend: Set `PORT` environment variable: `PORT=3002 npm run dev`
- Frontend: It will prompt you to use a different port

### Database Issues

If you encounter database issues, delete `backend/warehouse.db` and restart the backend server to recreate the database.

### Build Errors

Make sure all dependencies are installed:
```bash
cd backend && npm install
cd ../frontend && npm install
```

## Production Build

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
# Serve the build directory with a static file server
npx serve -s build
```

## Support

For issues or questions, please open an issue on the GitHub repository.
