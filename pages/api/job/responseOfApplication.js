import ConnectDB from '@/DB/connectDB';
import validateToken from '@/middleware/tokenValidation';
import AppliedJob from '@/models/ApplyJob';
import mongoose from 'mongoose';
import Joi from 'joi';

const schema = Joi.object({
  id: Joi.string().required().messages({ 'any.required': 'Application ID is required.' }),
  status: Joi.string().valid('pending', 'accepted', 'rejected').required().messages({
    'any.only': 'Status must be one of: pending, accepted, or rejected.',
    'any.required': 'Application decision status is required.',
  }),
});

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({
      success: false,
      message: `HTTP Method ${req.method} not allowed on /api/job/responseOfApplication. Use PUT.`,
    });
  }

  await ConnectDB();

  return validateToken(req, res, async () => {
    await changeApplicationStatus(req, res);
  });
}

const changeApplicationStatus = async (req, res) => {
  const { status, id } = req.body || {};

  const { error } = schema.validate({ status, id });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message.replace(/['"]+/g, ''),
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Application ID format.',
    });
  }

  try {
    const existingApplication = await AppliedJob.findById(id).populate('job', 'user');
    if (!existingApplication) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found.',
      });
    }

    if (existingApplication.job?.user?.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the employer who posted this job can respond to its applications.',
      });
    }

    const updatedApplication = await AppliedJob.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate('user', 'name email image')
      .populate('job', 'title company');

    if (!updatedApplication) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Application status updated to "${status}" successfully!`,
      data: updatedApplication,
    });
  } catch (err) {
    console.error('Error updating application status (server):', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update application status due to a server error.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};