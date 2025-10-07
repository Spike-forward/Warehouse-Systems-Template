import express from 'express';
import cors from 'cors';
import path from 'path';
import productsRouter from './routes/products';
import customersRouter from './routes/customers';
import suppliersRouter from './routes/suppliers';
import vendorsRouter from './routes/vendors';
import shippingAddressesRouter from './routes/shipping-addresses';
import instockOrdersRouter from './routes/instock-orders';
import outstockOrdersRouter from './routes/outstock-orders';
import inventoryRouter from './routes/inventory';
import filesRouter from './routes/files';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/products', productsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/suppliers', suppliersRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api/shipping-addresses', shippingAddressesRouter);
app.use('/api/instock-orders', instockOrdersRouter);
app.use('/api/outstock-orders', outstockOrdersRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/files', filesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Warehouse API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
