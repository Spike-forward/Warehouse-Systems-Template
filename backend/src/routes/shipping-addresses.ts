import { Router, Request, Response } from 'express';
import db from '../models/database';

const router = Router();

// Get all shipping addresses
router.get('/', (req: Request, res: Response) => {
  const query = `
    SELECT sa.*, c.name as customer_name
    FROM shipping_addresses sa
    LEFT JOIN customers c ON sa.customer_id = c.id
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get shipping addresses for customer
router.get('/customer/:customerId', (req: Request, res: Response) => {
  const { customerId } = req.params;
  
  db.all('SELECT * FROM shipping_addresses WHERE customer_id = ?', [customerId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new shipping address
router.post('/', (req: Request, res: Response) => {
  const { customer_id, address_line1, address_line2, city, state, postal_code, country } = req.body;
  
  db.run(
    'INSERT INTO shipping_addresses (customer_id, address_line1, address_line2, city, state, postal_code, country) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [customer_id, address_line1, address_line2, city, state, postal_code, country],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ 
        id: this.lastID, 
        customer_id, 
        address_line1, 
        address_line2, 
        city, 
        state, 
        postal_code, 
        country 
      });
    }
  );
});

export default router;
