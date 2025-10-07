import { Router, Request, Response } from 'express';
import db from '../models/database';

const router = Router();

// Get all suppliers
router.get('/', (req: Request, res: Response) => {
  db.all('SELECT * FROM suppliers', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get supplier by ID
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.get('SELECT * FROM suppliers WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Supplier not found' });
      return;
    }
    res.json(row);
  });
});

// Create new supplier
router.post('/', (req: Request, res: Response) => {
  const { name, contact_person, phone, email, address } = req.body;
  
  db.run(
    'INSERT INTO suppliers (name, contact_person, phone, email, address) VALUES (?, ?, ?, ?, ?)',
    [name, contact_person, phone, email, address],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID, name, contact_person, phone, email, address });
    }
  );
});

// Update supplier
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, contact_person, phone, email, address } = req.body;
  
  db.run(
    'UPDATE suppliers SET name = ?, contact_person = ?, phone = ?, email = ?, address = ? WHERE id = ?',
    [name, contact_person, phone, email, address, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Supplier not found' });
        return;
      }
      res.json({ message: 'Supplier updated successfully' });
    }
  );
});

// Delete supplier
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  
  db.run('DELETE FROM suppliers WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Supplier not found' });
      return;
    }
    res.json({ message: 'Supplier deleted successfully' });
  });
});

export default router;
