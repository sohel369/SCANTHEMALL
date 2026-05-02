import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token provided' });

  const token = header.split(' ')[1];
  try {
    console.log(`Verifying token: ${token.substring(0, 10)}..., Secret: ${process.env.JWT_SECRET}`);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(`Token verification failed: ${err.message}`);
    const errorMessage = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    res.status(401).json({ error: errorMessage });
  }
};

export const auth = (allowedRoles = []) => {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: 'No token provided' });

    const token = header.split(' ')[1];
    try {
      console.log(`Verifying token (auth): ${token.substring(0, 10)}..., Secret: ${process.env.JWT_SECRET}`);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Check if user's role is in the allowed roles array
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        console.warn(`Insufficient permissions: user role ${decoded.role} not in ${allowedRoles}`);
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    } catch (err) {
      console.error(`Token verification failed (auth): ${err.message}`);
      const errorMessage = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
      res.status(401).json({ error: errorMessage });
    }
  };
};