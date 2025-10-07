import { Router, Request, Response } from 'express';
import db from '../models/database';

const router = Router();

// Get all customers
router.get('/', (req: Request, res: Response) => {
  db.all('SELECT * FROM customers', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get customer by ID
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.get('SELECT * FROM customers WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json(row);
  });
});

// Create new customer
router.post('/', (req: Request, res: Response) => {
  const { name, contact_person, phone, email } = req.body;
  
  db.run(
    'INSERT INTO customers (name, contact_person, phone, email) VALUES (?, ?, ?, ?)',
    [name, contact_person, phone, email],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID, name, contact_person, phone, email });
    }
  );
});

// Update customer
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, contact_person, phone, email } = req.body;
  
  db.run(
    'UPDATE customers SET name = ?, contact_person = ?, phone = ?, email = ? WHERE id = ?',
    [name, contact_person, phone, email, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }
      res.json({ message: 'Customer updated successfully' });
    }
  );
});

// Delete customer
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  
  db.run('DELETE FROM customers WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json({ message: 'Customer deleted successfully' });
  });
});

export default router;
