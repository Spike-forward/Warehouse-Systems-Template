import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../warehouse.db');

export const db: Database = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Products table with import/export permit flags
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        model TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        need_import_permit INTEGER DEFAULT 0,
        need_export_permit INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Customers table
    db.run(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        contact_person TEXT,
        phone TEXT,
        email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Suppliers table
    db.run(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        contact_person TEXT,
        phone TEXT,
        email TEXT,
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Vendors table (for shipping)
    db.run(`
      CREATE TABLE IF NOT EXISTS vendors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        contact_person TEXT,
        phone TEXT,
        email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Shipping addresses table
    db.run(`
      CREATE TABLE IF NOT EXISTS shipping_addresses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        address_line1 TEXT NOT NULL,
        address_line2 TEXT,
        city TEXT,
        state TEXT,
        postal_code TEXT,
        country TEXT,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      )
    `);

    // In-stock orders table
    db.run(`
      CREATE TABLE IF NOT EXISTS instock_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT NOT NULL UNIQUE,
        supplier_id INTEGER NOT NULL,
        customer_id INTEGER NOT NULL,
        order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending',
        notes TEXT,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      )
    `);

    // Out-stock orders table
    db.run(`
      CREATE TABLE IF NOT EXISTS outstock_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT NOT NULL UNIQUE,
        customer_id INTEGER NOT NULL,
        vendor_id INTEGER,
        shipping_address_id INTEGER,
        order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending',
        notes TEXT,
        FOREIGN KEY (customer_id) REFERENCES customers(id),
        FOREIGN KEY (vendor_id) REFERENCES vendors(id),
        FOREIGN KEY (shipping_address_id) REFERENCES shipping_addresses(id)
      )
    `);

    // In-stock order items
    db.run(`
      CREATE TABLE IF NOT EXISTS instock_order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        need_import_permit INTEGER DEFAULT 0,
        need_export_permit INTEGER DEFAULT 0,
        FOREIGN KEY (order_id) REFERENCES instock_orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    // Out-stock order items
    db.run(`
      CREATE TABLE IF NOT EXISTS outstock_order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        need_import_permit INTEGER DEFAULT 0,
        need_export_permit INTEGER DEFAULT 0,
        FOREIGN KEY (order_id) REFERENCES outstock_orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    // Order linking table (out-stock to in-stock)
    db.run(`
      CREATE TABLE IF NOT EXISTS order_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        outstock_order_id INTEGER NOT NULL,
        instock_order_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        FOREIGN KEY (outstock_order_id) REFERENCES outstock_orders(id),
        FOREIGN KEY (instock_order_id) REFERENCES instock_orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    // Inventory table
    db.run(`
      CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        customer_id INTEGER NOT NULL,
        quantity INTEGER DEFAULT 0,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (customer_id) REFERENCES customers(id),
        UNIQUE(product_id, customer_id)
      )
    `);

    // File uploads table (for permits and photos)
    db.run(`
      CREATE TABLE IF NOT EXISTS file_uploads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entity_type TEXT NOT NULL,
        entity_id INTEGER NOT NULL,
        file_type TEXT NOT NULL,
        file_path TEXT NOT NULL,
        original_name TEXT NOT NULL,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables initialized');
  });
}

export default db;
