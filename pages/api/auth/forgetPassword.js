import ConnectDB from '@/DB/connectDB';
import User from '@/models/User';
import Joi from 'joi';
import { hash } from 'bcryptjs';
import crypto from 'crypto';

const requestOtpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address.',
    'any.required': 'Email is required to request a password reset code.',
  }),
  action: Joi.string().valid('request_otp').required(),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address.',
    'any.required': 'Email is required.',
  }),
  otp: Joi.string().required().messages({
    'any.required': 'Verification code (OTP) is required to reset your password.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'New password must be at least 8 characters long.',
    'any.required': 'New password is required.',
  }),
  action: Joi.string().valid('reset_password').optional(),
});

// The demo OTP is only revealed to requests made directly on the host machine
// (e.g. http://localhost:3000). Requests arriving through a Cloudflare tunnel
// always carry cf-connecting-ip, so public visitors never receive the code.
const LOCAL_HOSTS = ['localhost', '127.0.0.1', '[::1]'];

const isLocalRequest = (req) => {
  if (req.headers['cf-connecting-ip'] || req.headers['cf-ray']) return false;
  const host = (req.headers['x-forwarded-host'] || req.headers.host || '').replace(/:\d+$/, '');
  return LOCAL_HOSTS.includes(host);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: `HTTP Method ${req.method} not allowed on /api/auth/forgetPassword. Use POST.`,
    });
  }

  await ConnectDB();

  const body = req.body || {};
  const action = body.action || (body.otp ? 'reset_password' : (body.password ? 'reset_password_compat' : 'request_otp'));
  const normalizedEmail = body.email ? body.email.toLowerCase().trim() : '';

  // Branch 1: Request OTP / Verification Code
  if (action === 'request_otp') {
    const { error } = requestOtpSchema.validate({ email: normalizedEmail, action: 'request_otp' });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message.replace(/['"]+/g, ''),
      });
    }

    try {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'No account found with this email address.',
        });
      }

      // Generate a secure 6-digit numeric OTP
      const otpCode = Math.floor(100000 + crypto.randomInt(900000)).toString();
      const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity

      user.resetOtp = otpCode;
      user.resetOtpExpiry = expiry;
      await user.save();

      console.log(`[Security / Auth] Password reset OTP generated for ${normalizedEmail}: [${otpCode}] (valid 15 mins)`);

      if (isLocalRequest(req)) {
        return res.status(200).json({
          success: true,
          message: `Verification code generated for ${normalizedEmail}. (Valid for 15 minutes)`,
          devOtp: otpCode, // Provided for local testing & development demonstration
        });
      }

      return res.status(200).json({
        success: true,
        message: `Verification code generated for ${normalizedEmail} (valid for 15 minutes). This demo does not send emails, so please contact the KajKhoj team (see the Contact page) for your code.`,
      });
    } catch (err) {
      console.error('Error generating password reset OTP (server):', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to generate verification code. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    }
  }

  // Branch 2: Reset Password with Verified OTP
  if (action === 'reset_password' || body.otp) {
    const { error } = resetPasswordSchema.validate({
      email: normalizedEmail,
      otp: body.otp,
      password: body.password,
      action: 'reset_password',
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message.replace(/['"]+/g, ''),
      });
    }

    try {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'No account found with this email address.',
        });
      }

      if (!user.resetOtp || !user.resetOtpExpiry) {
        return res.status(400).json({
          success: false,
          message: 'No reset code requested. Please request a verification code first.',
        });
      }

      if (new Date() > new Date(user.resetOtpExpiry)) {
        return res.status(400).json({
          success: false,
          message: 'Verification code has expired. Please request a new code.',
        });
      }

      if (user.resetOtp !== body.otp.trim()) {
        return res.status(401).json({
          success: false,
          message: 'Invalid verification code. Please check and try again.',
        });
      }

      const hashedPassword = await hash(body.password, 12);
      user.password = hashedPassword;
      user.resetOtp = undefined;
      user.resetOtpExpiry = undefined;
      await user.save();

      console.log(`[Security / Auth] Password successfully updated with OTP for ${normalizedEmail}`);

      return res.status(200).json({
        success: true,
        message: 'Password updated successfully! You can now log in with your new password.',
      });
    } catch (err) {
      console.error('Error resetting password with OTP (server):', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to update password due to a server error. Please try again.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    }
  }

  // Branch 3: Fallback warning if called without OTP
  return res.status(400).json({
    success: false,
    message: 'A verification code (OTP) is required to reset your password. Please request a code first.',
    requireOtp: true,
  });
}
