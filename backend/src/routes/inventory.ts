import { Router, Request, Response } from 'express';
import db from '../models/database';

const router = Router();

// Get inventory for all customers
router.get('/', (req: Request, res: Response) => {
  const query = `
    SELECT i.*, p.model, p.name as product_name, c.name as customer_name
    FROM inventory i
    LEFT JOIN products p ON i.product_id = p.id
    LEFT JOIN customers c ON i.customer_id = c.id
    WHERE i.quantity > 0
    ORDER BY c.name, p.model
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get inventory for specific customer
router.get('/customer/:customerId', (req: Request, res: Response) => {
  const { customerId } = req.params;
  
  const query = `
    SELECT i.*, p.model, p.name as product_name
    FROM inventory i
    LEFT JOIN products p ON i.product_id = p.id
    WHERE i.customer_id = ? AND i.quantity > 0
    ORDER BY p.model
  `;
  
  db.all(query, [customerId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get inventory for specific product
router.get('/product/:productId', (req: Request, res: Response) => {
  const { productId } = req.params;
  
  const query = `
    SELECT i.*, c.name as customer_name
    FROM inventory i
    LEFT JOIN customers c ON i.customer_id = c.id
    WHERE i.product_id = ? AND i.quantity > 0
    ORDER BY c.name
  `;
  
  db.all(query, [productId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

export default router;
