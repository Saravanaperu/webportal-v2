import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

// POST /auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // MOCK IMPLEMENTATION:
  // In a real application, you would:
  // 1. Find the user in the database by email.
  // 2. Compare the provided password with the hashed password in the database.
  // 3. If they match, create a JWT.

  console.log(`Login attempt for email: ${email}`);

  // Create a dummy user object
  const user = { id: 'cuid_for_user', email: email };

  // Create a JWT
  // In a real app, use a strong, secret key stored in environment variables
  const token = jwt.sign(user, process.env.JWT_SECRET || 'a-default-secret-key', {
    expiresIn: '1h', // Token expires in 1 hour
  });

  res.json({ token });
});

export default router;
