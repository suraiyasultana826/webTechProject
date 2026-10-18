import ConnectDB from '@/DB/connectDB';
import validateToken from '@/middleware/tokenValidation';
import ApplyJob from '@/models/ApplyJob';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: `HTTP Method ${req.method} not allowed on /api/job/getAppliedJobs. Use GET.`,
    });
  }

  await ConnectDB();

  return validateToken(req, res, async () => {
    await getAppliedJobs(req, res);
  });
}

const getAppliedJobs = async (req, res) => {
  const userId = req.query?.id || req.user?.id;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'Worker user ID is required to fetch applications.',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid worker user ID format.',
    });
  }

  if (userId !== req.user?.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only view your own applications.',
    });
  }

  try {
    const appliedJobs = await ApplyJob.find({ user: userId })
      .populate('user', 'name email image role')
      .populate({
        path: 'job',
        populate: { path: 'user', select: 'name email company' },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Applied jobs list retrieved successfully.',
      data: appliedJobs,
      total: appliedJobs.length,
    });
  } catch (err) {
    console.error('Error fetching applied jobs (server):', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve applied jobs due to a server error.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};