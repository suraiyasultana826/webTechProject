import ConnectDB from '@/DB/connectDB';
import validateToken from '@/middleware/tokenValidation';
import Job from '@/models/Job';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: `HTTP Method ${req.method} not allowed on /api/job/getPostedJobs. Use GET.`,
    });
  }

  await ConnectDB();

  return validateToken(req, res, async () => {
    await getPostedJobs(req, res);
  });
}

const getPostedJobs = async (req, res) => {
  const userId = req.query?.id || req.user?.id;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'Employer user ID is required to fetch posted jobs.',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid employer user ID format.',
    });
  }

  if (userId !== req.user?.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only view the jobs you have posted.',
    });
  }

  try {
    const jobs = await Job.find({ user: userId })
      .populate('user', 'name email image role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Posted jobs retrieved successfully.',
      data: jobs,
      total: jobs.length,
    });
  } catch (err) {
    console.error('Error fetching posted jobs (server):', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve posted jobs due to a server error.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};