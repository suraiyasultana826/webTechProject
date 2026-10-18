import ConnectDB from '@/DB/connectDB';
import User from '@/models/User';
import Joi from 'joi';
import { hash } from 'bcryptjs';

const schema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long.',
    'any.required': 'Password is required.',
  }),
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Name must be at least 2 characters long.',
    'any.required': 'Name is required.',
  }),
  role: Joi.string().valid('worker', 'employer', 'admin').optional(),
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: `HTTP Method ${req.method} not allowed on /api/auth/register. Use POST.`,
    });
  }

  await ConnectDB();

  const { email, password, name, role } = req.body || {};
  const { error } = schema.validate({ email, password, name, role });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message.replace(/['"]+/g, ''),
    });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    const hashedPassword = await hash(password, 12);
    const newUser = await User.create({
      email: normalizedEmail,
      name: name.trim(),
      password: hashedPassword,
      role: role || 'worker',
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! You can now log in.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error('Error during user registration (server):', err);
    return res.status(500).json({
      success: false,
      message: 'Registration failed due to a server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
}
