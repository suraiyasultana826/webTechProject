import ConnectDB from '@/DB/connectDB';
import validateToken from '@/middleware/tokenValidation';
import AppliedJob from '@/models/ApplyJob';
import Job from '@/models/Job';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: `HTTP Method ${req.method} not allowed on /api/job/getAllApplicationsOfSpecifiedJob. Use GET.`,
    });
  }

  await ConnectDB();

  return validateToken(req, res, async () => {
    await getAllApplicationsOfSpecifiedJob(req, res);
  });
}

const getAllApplicationsOfSpecifiedJob = async (req, res) => {
  const jobId = req.query?.id;

  if (!jobId) {
    return res.status(400).json({
      success: false,
      message: 'Job ID parameter (id) is required to view candidate applications.',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Job ID format.',
    });
  }

  try {
    const job = await Job.findById(jobId).select('user');
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found.',
      });
    }

    if (job.user?.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the employer who posted this job can view its applications.',
      });
    }

    const applications = await AppliedJob.find({ job: jobId })
      .populate('user', 'name email image role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Applications for specified job retrieved successfully.',
      data: applications,
      total: applications.length,
    });
  } catch (err) {
    console.error('Error fetching applications for job (server):', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve applications for this job.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};