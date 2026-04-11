import { pool } from '../config/db.js';

// Get audit logs (admin only)
export const getAuditLogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const { rows } = await pool.query(
      `SELECT 
        al.id,
        al.user_id,
        al.user_email,
        al.action,
        al.details,
        al.ip_address,
        al.created_at
       FROM audit_logs al
       ORDER BY al.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    res.json(rows);
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};

// Create audit log entry
export const createAuditLog = async (req, res) => {
  const { action, details } = req.body;
  const userId = req.user?.id;
  const userEmail = req.user?.email;
  const ipAddress = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];
  
  if (!action) {
    return res.status(400).json({ error: 'Action is required' });
  }
  
  try {
    const { rows } = await pool.query(
      `INSERT INTO audit_logs (user_id, user_email, action, details, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, action, details, created_at`,
      [userId, userEmail, action, details, ipAddress, userAgent]
    );
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error creating audit log:', err);
    res.status(500).json({ error: 'Failed to create audit log' });
  }
};

// Helper function to log audit events (can be called from other controllers)
export const logAudit = async (userId, userEmail, action, details, ipAddress = null, userAgent = null) => {
  try {
    await pool.query(
      `INSERT INTO audit_logs (user_id, user_email, action, details, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, userEmail, action, details, ipAddress, userAgent]
    );
  } catch (err) {
    console.error('Error logging audit:', err);
  }
};
