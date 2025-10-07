import { Router, Request, Response } from 'express';
import db from '../models/database';
import { Product } from '../models/types';

const router = Router();

// Get all products
router.get('/', (req: Request, res: Response) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get product by ID
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(row);
  });
});

// Create new product
router.post('/', (req: Request, res: Response) => {
  const { model, name, need_import_permit, need_export_permit } = req.body;
  
  db.run(
    'INSERT INTO products (model, name, need_import_permit, need_export_permit) VALUES (?, ?, ?, ?)',
    [model, name, need_import_permit || 0, need_export_permit || 0],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID, model, name, need_import_permit, need_export_permit });
    }
  );
});

// Update product
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { model, name, need_import_permit, need_export_permit } = req.body;
  
  db.run(
    'UPDATE products SET model = ?, name = ?, need_import_permit = ?, need_export_permit = ? WHERE id = ?',
    [model, name, need_import_permit, need_export_permit, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json({ message: 'Product updated successfully' });
    }
  );
});

// Delete product
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  
  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted successfully' });
  });
});

export default router;
