import axios from 'axios';
import { 
  Product, 
  Customer, 
  Supplier, 
  Vendor, 
  ShippingAddress,
  InStockOrder, 
  OutStockOrder, 
  Inventory 
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products
export const getProducts = () => api.get<Product[]>('/products');
export const getProduct = (id: number) => api.get<Product>(`/products/${id}`);
export const createProduct = (product: Product) => api.post<Product>('/products', product);
export const updateProduct = (id: number, product: Product) => api.put(`/products/${id}`, product);
export const deleteProduct = (id: number) => api.delete(`/products/${id}`);

// Customers
export const getCustomers = () => api.get<Customer[]>('/customers');
export const getCustomer = (id: number) => api.get<Customer>(`/customers/${id}`);
export const createCustomer = (customer: Customer) => api.post<Customer>('/customers', customer);
export const updateCustomer = (id: number, customer: Customer) => api.put(`/customers/${id}`, customer);

// Suppliers
export const getSuppliers = () => api.get<Supplier[]>('/suppliers');
export const getSupplier = (id: number) => api.get<Supplier>(`/suppliers/${id}`);
export const createSupplier = (supplier: Supplier) => api.post<Supplier>('/suppliers', supplier);

// Vendors
export const getVendors = () => api.get<Vendor[]>('/vendors');
export const createVendor = (vendor: Vendor) => api.post<Vendor>('/vendors', vendor);

// Shipping Addresses
export const getShippingAddresses = () => api.get<ShippingAddress[]>('/shipping-addresses');
export const getCustomerShippingAddresses = (customerId: number) => 
  api.get<ShippingAddress[]>(`/shipping-addresses/customer/${customerId}`);
export const createShippingAddress = (address: ShippingAddress) => 
  api.post<ShippingAddress>('/shipping-addresses', address);

// In-Stock Orders
export const getInStockOrders = () => api.get<InStockOrder[]>('/instock-orders');
export const getInStockOrder = (id: number) => api.get<InStockOrder>(`/instock-orders/${id}`);
export const createInStockOrder = (order: InStockOrder) => api.post<InStockOrder>('/instock-orders', order);
export const updateInStockOrderStatus = (id: number, status: string) => 
  api.put(`/instock-orders/${id}/status`, { status });

// Out-Stock Orders
export const getOutStockOrders = () => api.get<OutStockOrder[]>('/outstock-orders');
export const getOutStockOrder = (id: number) => api.get<OutStockOrder>(`/outstock-orders/${id}`);
export const createOutStockOrder = (order: OutStockOrder) => api.post<OutStockOrder>('/outstock-orders', order);
export const updateOutStockOrderStatus = (id: number, status: string) => 
  api.put(`/outstock-orders/${id}/status`, { status });

// Inventory
export const getInventory = () => api.get<Inventory[]>('/inventory');
export const getCustomerInventory = (customerId: number) => 
  api.get<Inventory[]>(`/inventory/customer/${customerId}`);
export const getProductInventory = (productId: number) => 
  api.get<Inventory[]>(`/inventory/product/${productId}`);

// Files
export const uploadFile = (formData: FormData) => 
  api.post('/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const getEntityFiles = (entityType: string, entityId: number) => 
  api.get(`/files/${entityType}/${entityId}`);

export default api;
