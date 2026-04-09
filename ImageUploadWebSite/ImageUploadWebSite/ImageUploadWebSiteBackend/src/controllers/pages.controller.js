import { pool } from '../config/db.js';

// Get all static pages (public access)
export const getPages = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT slug, title, content, updated_at FROM static_pages ORDER BY slug'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching pages:', err);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
};

// Get single page by slug (public access)
export const getPageBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT slug, title, content, updated_at FROM static_pages WHERE slug = $1',
      [slug]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching page:', err);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
};

// Update page (admin only)
export const updatePage = async (req, res) => {
  const { slug } = req.params;
  const { title, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  
  try {
    const { rows } = await pool.query(
      `UPDATE static_pages 
       SET title = $1, content = $2, updated_at = NOW() 
       WHERE slug = $3 
       RETURNING slug, title, content, updated_at`,
      [title, content, slug]
    );
    
    if (rows.length === 0) {
      // If page doesn't exist, create it
      const { rows: newRows } = await pool.query(
        `INSERT INTO static_pages (slug, title, content, updated_at) 
         VALUES ($1, $2, $3, NOW()) 
         RETURNING slug, title, content, updated_at`,
        [slug, title, content]
      );
      return res.json(newRows[0]);
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating page:', err);
    res.status(500).json({ error: 'Failed to update page' });
  }
};
