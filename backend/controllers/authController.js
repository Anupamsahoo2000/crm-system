const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Hardcoded Admin User
// Password: password123
const ADMIN_USER = {
  id: 'admin-uuid-12345',
  email: 'admin@crm.com',
  name: 'System Admin',
  passwordHash: '$2b$10$bEBHumA3N5pBvm8F0qUg0ekyud8/jgcPAmG6qR0XwdzMc7txtEzPe'
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const trimmedEmail = email.trim();
    // Check for user
    if (trimmedEmail.toLowerCase() !== ADMIN_USER.email.toLowerCase()) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, ADMIN_USER.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT Payload
    const payload = {
      user: {
        id: ADMIN_USER.id,
        email: ADMIN_USER.email,
        name: ADMIN_USER.name
      }
    };

    // Sign JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'super_secret_jwt_key_12345',
      { expiresIn: process.env.JWT_EXPIRE || '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: ADMIN_USER.id,
            name: ADMIN_USER.name,
            email: ADMIN_USER.email
          }
        });
      }
    );
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
