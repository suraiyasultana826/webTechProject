import ConnectDB from '@/DB/connectDB';
import validateToken from '@/middleware/tokenValidation';
import AppliedJob from '@/models/ApplyJob';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: `HTTP Method ${req.method} not allowed on /api/job/getApplicationDetail. Use GET.`,
    });
  }

  await ConnectDB();

  return validateToken(req, res, async () => {
    await getApplicationDetail(req, res);
  });
}

const getApplicationDetail = async (req, res) => {
  const applicationId = req.query?.id;

  if (!applicationId) {
    return res.status(400).json({
      success: false,
      message: 'Application ID parameter (id) is required.',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Application ID format.',
    });
  }

  try {
    const application = await AppliedJob.findById(applicationId)
      .populate('job')
      .populate('user', 'name email image role');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found.',
      });
    }

    const isApplicant = application.user?._id?.toString() === req.user?.id;
    const isEmployer = application.job?.user?.toString() === req.user?.id;
    if (!isApplicant && !isEmployer) {
      return res.status(403).json({
        success: false,
        message: 'Only the employer of this job or the applicant can view this application.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Application details retrieved successfully.',
      data: application,
    });
  } catch (err) {
    console.error('Error fetching application detail (server):', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve application details due to a server error.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};