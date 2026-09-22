import { get, query } from '../database/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bhoomidrishti-sih2026-secure-key';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await get(`SELECT * FROM users WHERE email = ?`, [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPass } = user;
    return res.json({
      message: 'Login successful',
      token,
      user: userWithoutPass
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error during authentication' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await get(`SELECT id, name, email, role, designation, department, phone, avatar FROM users WHERE id = ?`, [userId]);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const switchRoleDemo = async (req, res) => {
  try {
    const { role } = req.params;
    const user = await get(`SELECT id, name, email, role, designation, department, phone, avatar FROM users WHERE role = ? LIMIT 1`, [role]);
    if (!user) return res.status(404).json({ error: 'Role user not found' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      message: `Switched demo role to ${role}`,
      token,
      user
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to switch role' });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, designation, department } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }

    const existingUser = await get(`SELECT id FROM users WHERE email = ?`, [email.toLowerCase().trim()]);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `USR-${Date.now().toString().slice(-4)}`;
    
    await query(
      `INSERT INTO users (id, name, email, password, role, designation, department) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        name,
        email.toLowerCase().trim(),
        hashedPassword,
        role,
        designation || 'Authorized Official',
        department || 'Government of India Nodal'
      ]
    );

    const newUser = {
      id: userId,
      name,
      email: email.toLowerCase().trim(),
      role,
      designation: designation || 'Authorized Official',
      department: department || 'Government of India Nodal'
    };

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: newUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Failed to register account' });
  }
};

