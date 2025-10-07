export interface Product {
  id?: number;
  model: string;
  name: string;
  need_import_permit: number;
  need_export_permit: number;
  created_at?: string;
}

export interface Customer {
  id?: number;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  created_at?: string;
}

export interface Supplier {
  id?: number;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  created_at?: string;
}

export interface Vendor {
  id?: number;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  created_at?: string;
}

export interface ShippingAddress {
  id?: number;
  customer_id: number;
  address_line1: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface InStockOrder {
  id?: number;
  order_number: string;
  supplier_id: number;
  customer_id: number;
  order_date?: string;
  status?: string;
  notes?: string;
}

export interface OutStockOrder {
  id?: number;
  order_number: string;
  customer_id: number;
  vendor_id?: number;
  shipping_address_id?: number;
  order_date?: string;
  status?: string;
  notes?: string;
}

export interface OrderItem {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
  need_import_permit: number;
  need_export_permit: number;
}

export interface OrderLink {
  id?: number;
  outstock_order_id: number;
  instock_order_id: number;
  quantity: number;
  product_id: number;
}

export interface Inventory {
  id?: number;
  product_id: number;
  customer_id: number;
  quantity: number;
  last_updated?: string;
}

export interface FileUpload {
  id?: number;
  entity_type: string;
  entity_id: number;
  file_type: string;
  file_path: string;
  original_name: string;
  uploaded_at?: string;
}
