import { Router, Request, Response } from 'express';
import db from '../models/database';

const router = Router();

// Get all in-stock orders with details
router.get('/', (req: Request, res: Response) => {
  const query = `
    SELECT io.*, s.name as supplier_name, c.name as customer_name
    FROM instock_orders io
    LEFT JOIN suppliers s ON io.supplier_id = s.id
    LEFT JOIN customers c ON io.customer_id = c.id
    ORDER BY io.order_date DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get in-stock order by ID with items
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  
  const orderQuery = `
    SELECT io.*, s.name as supplier_name, c.name as customer_name
    FROM instock_orders io
    LEFT JOIN suppliers s ON io.supplier_id = s.id
    LEFT JOIN customers c ON io.customer_id = c.id
    WHERE io.id = ?
  `;
  
  db.get(orderQuery, [id], (err, order) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    
    // Get order items
    const itemsQuery = `
      SELECT ioi.*, p.model, p.name as product_name
      FROM instock_order_items ioi
      LEFT JOIN products p ON ioi.product_id = p.id
      WHERE ioi.order_id = ?
    `;
    
    db.all(itemsQuery, [id], (err, items) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ ...order, items });
    });
  });
});

// Create new in-stock order
router.post('/', (req: Request, res: Response) => {
  const { order_number, supplier_id, customer_id, items, notes } = req.body;
  
  db.run(
    'INSERT INTO instock_orders (order_number, supplier_id, customer_id, notes) VALUES (?, ?, ?, ?)',
    [order_number, supplier_id, customer_id, notes],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      const orderId = this.lastID;
      
      // Insert order items and copy permit flags
      if (items && items.length > 0) {
        const stmt = db.prepare(`
          INSERT INTO instock_order_items 
          (order_id, product_id, quantity, need_import_permit, need_export_permit)
          SELECT ?, ?, ?, need_import_permit, need_export_permit
          FROM products WHERE id = ?
        `);
        
        items.forEach((item: any) => {
          stmt.run([orderId, item.product_id, item.quantity, item.product_id], (err) => {
            if (err) console.error('Error inserting item:', err);
          });
        });
        
        stmt.finalize();
        
        // Update inventory
        items.forEach((item: any) => {
          db.run(
            `INSERT INTO inventory (product_id, customer_id, quantity) 
             VALUES (?, ?, ?)
             ON CONFLICT(product_id, customer_id) 
             DO UPDATE SET quantity = quantity + ?, last_updated = CURRENT_TIMESTAMP`,
            [item.product_id, customer_id, item.quantity, item.quantity]
          );
        });
      }
      
      res.status(201).json({ id: orderId, order_number, supplier_id, customer_id });
    }
  );
});

// Update in-stock order status
router.put('/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  
  db.run(
    'UPDATE instock_orders SET status = ? WHERE id = ?',
    [status, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      res.json({ message: 'Order status updated successfully' });
    }
  );
});

export default router;
