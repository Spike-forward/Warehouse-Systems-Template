import { Router, Request, Response } from 'express';
import db from '../models/database';

const router = Router();

// Get all vendors
router.get('/', (req: Request, res: Response) => {
  db.all('SELECT * FROM vendors', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new vendor
router.post('/', (req: Request, res: Response) => {
  const { name, contact_person, phone, email } = req.body;
  
  db.run(
    'INSERT INTO vendors (name, contact_person, phone, email) VALUES (?, ?, ?, ?)',
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

export default router;
