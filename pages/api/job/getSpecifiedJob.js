import ConnectDB from '@/DB/connectDB';
import Job from '@/models/Job';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: `HTTP Method ${req.method} not allowed on /api/job/getSpecifiedJob. Use GET.`,
    });
  }

  await ConnectDB();

  const id = req.query?.id;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Job ID parameter (id) is required.',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Provided Job ID is not a valid identifier.',
    });
  }

  try {
    const job = await Job.findById(id).populate('user', 'name email image role');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found. It may have expired or been removed.',
      });
    }

    return res.status(200).json({
      success: true,
      data: job,
    });
  } catch (err) {
    console.error('Error in getSpecifiedJob (server):', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve job details due to a server error.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
}