import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  image: {
    type: String,
    default:
      "https://res.cloudinary.com/dw2dqblhs/image/upload/v1684038562/Janseva/employerProfile_gcbm6i.png",
  },
  role: {
    type: String,
    enum: ['worker', 'employer', 'admin'],
    default: 'worker',
  },
  resetOtp: {
    type: String,
  },
  resetOtpExpiry: {
    type: Date,
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);