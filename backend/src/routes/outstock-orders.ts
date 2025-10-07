import { Router, Request, Response } from 'express';
import db from '../models/database';

const router = Router();

// Get all out-stock orders with details
router.get('/', (req: Request, res: Response) => {
  const query = `
    SELECT oo.*, c.name as customer_name, v.name as vendor_name,
           sa.address_line1, sa.city, sa.country
    FROM outstock_orders oo
    LEFT JOIN customers c ON oo.customer_id = c.id
    LEFT JOIN vendors v ON oo.vendor_id = v.id
    LEFT JOIN shipping_addresses sa ON oo.shipping_address_id = sa.id
    ORDER BY oo.order_date DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get out-stock order by ID with items and links
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  
  const orderQuery = `
    SELECT oo.*, c.name as customer_name, v.name as vendor_name,
           sa.address_line1, sa.address_line2, sa.city, sa.state, sa.postal_code, sa.country
    FROM outstock_orders oo
    LEFT JOIN customers c ON oo.customer_id = c.id
    LEFT JOIN vendors v ON oo.vendor_id = v.id
    LEFT JOIN shipping_addresses sa ON oo.shipping_address_id = sa.id
    WHERE oo.id = ?
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
      SELECT ooi.*, p.model, p.name as product_name
      FROM outstock_order_items ooi
      LEFT JOIN products p ON ooi.product_id = p.id
      WHERE ooi.order_id = ?
    `;
    
    // Get order links
    const linksQuery = `
      SELECT ol.*, io.order_number as instock_order_number, p.model
      FROM order_links ol
      LEFT JOIN instock_orders io ON ol.instock_order_id = io.id
      LEFT JOIN products p ON ol.product_id = p.id
      WHERE ol.outstock_order_id = ?
    `;
    
    db.all(itemsQuery, [id], (err, items) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      db.all(linksQuery, [id], (err, links) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ ...order, items, links });
      });
    });
  });
});

// Create new out-stock order
router.post('/', (req: Request, res: Response) => {
  const { order_number, customer_id, vendor_id, shipping_address_id, items, links, notes } = req.body;
  
  db.run(
    'INSERT INTO outstock_orders (order_number, customer_id, vendor_id, shipping_address_id, notes) VALUES (?, ?, ?, ?, ?)',
    [order_number, customer_id, vendor_id, shipping_address_id, notes],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      const orderId = this.lastID;
      
      // Insert order items and copy permit flags
      if (items && items.length > 0) {
        const stmt = db.prepare(`
          INSERT INTO outstock_order_items 
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
        
        // Update inventory (reduce quantity)
        items.forEach((item: any) => {
          db.run(
            `UPDATE inventory SET quantity = quantity - ?, last_updated = CURRENT_TIMESTAMP
             WHERE product_id = ? AND customer_id = ?`,
            [item.quantity, item.product_id, customer_id]
          );
        });
      }
      
      // Insert order links
      if (links && links.length > 0) {
        const linkStmt = db.prepare(
          'INSERT INTO order_links (outstock_order_id, instock_order_id, quantity, product_id) VALUES (?, ?, ?, ?)'
        );
        
        links.forEach((link: any) => {
          linkStmt.run([orderId, link.instock_order_id, link.quantity, link.product_id], (err) => {
            if (err) console.error('Error inserting link:', err);
          });
        });
        
        linkStmt.finalize();
      }
      
      res.status(201).json({ id: orderId, order_number, customer_id });
    }
  );
});

// Update out-stock order status
router.put('/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  
  db.run(
    'UPDATE outstock_orders SET status = ? WHERE id = ?',
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
