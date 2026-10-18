import ConnectDB from '@/DB/connectDB';
import User from '@/models/User';
import Joi from 'joi';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECREAT || 'kajkhoj_super_secret_jwt_key_2026_wt_project_semester_security';

const schema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address.',
    'any.required': 'Email is required to log in.',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required to log in.',
  }),
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: `HTTP Method ${req.method} not allowed on /api/auth/login. Use POST.`,
    });
  }

  await ConnectDB();

  const { email, password } = req.body || {};
  const { error } = schema.validate({ email, password });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message.replace(/['"]+/g, ''),
    });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account registered with this email address.',
      });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please verify and try again.',
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      createdAt: user.createdAt,
    };

    return res.status(200).json({
      success: true,
      message: 'Login successful! Welcome back.',
      finalData: { token, user: safeUser },
    });
  } catch (err) {
    console.error('Error during user login (server):', err);
    return res.status(500).json({
      success: false,
      message: 'Login failed due to a server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
}
