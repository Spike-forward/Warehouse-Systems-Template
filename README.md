# Warehouse-Systems-Template

A comprehensive warehouse management system with frontend & backend server to record in-stock/out-stock orders, actual records, and check inventory. The records are per customer. Inventory with model and quantity. Each product model has a flag for import/export permit requirements, and each in/out record can attach multiple photos.

## Features

### Core Functionality
- **Product Management**: Track products with model numbers and permit requirements
- **Customer & Supplier Management**: Maintain customer and supplier information
- **In-Stock Orders**: Record incoming inventory with supplier information
- **Out-Stock Orders**: Track outgoing shipments with vendor and shipping addresses
- **Inventory Tracking**: Real-time inventory levels per customer
- **Order Linking**: Link out-stock orders to one or more in-stock orders
- **Permit Flags**: Import/export permit flags are captured at order creation and remain unchanged even if product settings change
- **File Uploads**: Support for permits and photos (PDF, JPEG, PNG)

### Technical Stack
- **Frontend**: React 18 + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite3
- **File Upload**: Multer

## Project Structure

```
warehouse-systems-template/
├── backend/                    # Backend server
│   ├── src/
│   │   ├── models/            # Database schema and types
│   │   ├── routes/            # API route handlers
│   │   ├── uploads/           # File upload directory
│   │   └── index.ts           # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API service layer
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (v8 or higher)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Build the TypeScript code:
```bash
npm run build
```

4. Start the development server:
```bash
npm run dev
```

The backend API will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/:id` - Get supplier by ID
- `POST /api/suppliers` - Create new supplier

### Vendors
- `GET /api/vendors` - Get all vendors
- `POST /api/vendors` - Create new vendor

### Shipping Addresses
- `GET /api/shipping-addresses` - Get all shipping addresses
- `GET /api/shipping-addresses/customer/:customerId` - Get addresses for customer
- `POST /api/shipping-addresses` - Create new shipping address

### In-Stock Orders
- `GET /api/instock-orders` - Get all in-stock orders
- `GET /api/instock-orders/:id` - Get in-stock order by ID with items
- `POST /api/instock-orders` - Create new in-stock order
- `PUT /api/instock-orders/:id/status` - Update order status

### Out-Stock Orders
- `GET /api/outstock-orders` - Get all out-stock orders
- `GET /api/outstock-orders/:id` - Get out-stock order by ID with items and links
- `POST /api/outstock-orders` - Create new out-stock order
- `PUT /api/outstock-orders/:id/status` - Update order status

### Inventory
- `GET /api/inventory` - Get all inventory
- `GET /api/inventory/customer/:customerId` - Get inventory for specific customer
- `GET /api/inventory/product/:productId` - Get inventory for specific product

### File Uploads
- `POST /api/files` - Upload file (permit or photo)
- `GET /api/files/:entity_type/:entity_id` - Get files for entity

## Database Schema

### Key Tables
- **products**: Product catalog with permit flags
- **customers**: Customer information
- **suppliers**: Supplier information
- **vendors**: Vendor information for shipping
- **shipping_addresses**: Customer shipping addresses
- **instock_orders**: Incoming inventory orders
- **outstock_orders**: Outgoing shipment orders
- **instock_order_items**: Items in in-stock orders (with permit flags)
- **outstock_order_items**: Items in out-stock orders (with permit flags)
- **order_links**: Links between out-stock and in-stock orders
- **inventory**: Current inventory levels per customer
- **file_uploads**: Uploaded permits and photos

## Key Features Implementation

### Permit Flag Persistence
When creating orders (in-stock or out-stock), the system copies the current `need_import_permit` and `need_export_permit` flags from the product table to the order items. This ensures that even if the product's permit requirements change later, the historical orders retain their original permit requirements.

### Order Linking
Out-stock orders can be linked to one or more in-stock orders through the `order_links` table. This allows tracking of which incoming inventory is being used for which outgoing shipments.

### Inventory Management
- In-stock orders automatically increase inventory for the specified customer
- Out-stock orders automatically decrease inventory for the specified customer
- Inventory is tracked per product per customer

## Usage

1. **Add Products**: Navigate to the Products tab and add products with their permit requirements
2. **Add Customers & Suppliers**: Set up your customer and supplier database
3. **Create In-Stock Orders**: Record incoming inventory with supplier information
4. **Create Out-Stock Orders**: Record outgoing shipments and link them to in-stock orders
5. **Check Inventory**: View current inventory levels per customer

## Development

### Running Tests
```bash
# Backend tests (if implemented)
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production

Backend:
```bash
cd backend
npm run build
npm start
```

Frontend:
```bash
cd frontend
npm run build
# Serve the build directory with a static file server
```

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
