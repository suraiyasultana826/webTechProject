import ConnectDB from '@/DB/connectDB';
import Job from '@/models/Job';

// Treat user input as literal text so characters like "(" or "+" can't break the query
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: `HTTP Method ${req.method} not allowed on /api/job/getAllJobs. Use GET.`,
    });
  }

  await ConnectDB();

  try {
    const { page, limit, category, type, search } = req.query;

    const query = {};

    if (category) {
      query.job_category = { $regex: new RegExp(escapeRegex(category), 'i') };
    }

    if (type) {
      query.job_type = { $regex: new RegExp(escapeRegex(type), 'i') };
    }

    if (search) {
      query.$or = [
        { title: { $regex: new RegExp(escapeRegex(search), 'i') } },
        { company: { $regex: new RegExp(escapeRegex(search), 'i') } },
        { description: { $regex: new RegExp(escapeRegex(search), 'i') } },
      ];
    }

    // Weak Spot #4 Fix: Check if pagination requested
    if (page || limit) {
      const currentPage = Math.max(1, parseInt(page, 10) || 1);
      const limitPerPage = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
      const skip = (currentPage - 1) * limitPerPage;

      const [jobs, totalJobs] = await Promise.all([
        Job.find(query)
          .populate('user', 'name email image role')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitPerPage),
        Job.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalJobs / limitPerPage);

      return res.status(200).json({
        success: true,
        data: jobs,
        pagination: {
          totalJobs,
          page: currentPage,
          limit: limitPerPage,
          totalPages,
          hasMore: currentPage < totalPages,
        },
      });
    }

    // Default: fetch all jobs sorted by newest first
    const jobs = await Job.find(query)
      .populate('user', 'name email image role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: jobs,
      total: jobs.length,
    });
  } catch (err) {
    console.error('Error fetching jobs in getAllJobs (server):', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve jobs due to a server error. Please try again.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
}