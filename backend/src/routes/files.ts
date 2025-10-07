import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import db from '../models/database';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, PNG) and PDF files are allowed'));
    }
  }
});

// Upload file
router.post('/', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }
  
  const { entity_type, entity_id, file_type } = req.body;
  
  db.run(
    'INSERT INTO file_uploads (entity_type, entity_id, file_type, file_path, original_name) VALUES (?, ?, ?, ?, ?)',
    [entity_type, entity_id, file_type, req.file.filename, req.file.originalname],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ 
        id: this.lastID, 
        file_path: req.file!.filename,
        original_name: req.file!.originalname
      });
    }
  );
});

// Get files for entity
router.get('/:entity_type/:entity_id', (req: Request, res: Response) => {
  const { entity_type, entity_id } = req.params;
  
  db.all(
    'SELECT * FROM file_uploads WHERE entity_type = ? AND entity_id = ?',
    [entity_type, entity_id],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

export default router;
