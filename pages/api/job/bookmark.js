import ConnectDB from '@/DB/connectDB';
import validateToken from '@/middleware/tokenValidation';
import bookMarkJob from '@/models/Bookmark';
import mongoose from 'mongoose';
import Joi from 'joi';

const bookmarkSchema = Joi.object({
  user: Joi.string().required().messages({ 'any.required': 'User ID is required to bookmark a job.' }),
  job: Joi.string().required().messages({ 'any.required': 'Job ID is required to bookmark.' }),
});

export default async function handler(req, res) {
  await ConnectDB();

  switch (req.method) {
    case 'POST':
      return validateToken(req, res, async () => {
        await bookmarkMyJob(req, res);
      });
    case 'GET':
      return validateToken(req, res, async () => {
        await getBookmarkJobs(req, res);
      });
    case 'DELETE':
      return validateToken(req, res, async () => {
        await deleteBookmarkJob(req, res);
      });
    default:
      return res.status(405).json({
        success: false,
        message: `HTTP Method ${req.method} not allowed on /api/job/bookmark. Use GET, POST, or DELETE.`,
      });
  }
}

// POST: Save a job to bookmarks
export const bookmarkMyJob = async (req, res) => {
  const body = req.body || {};
  const user = body.user || req.user?.id;
  const job = body.job;

  const { error } = bookmarkSchema.validate({ user, job });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message.replace(/['"]+/g, ''),
    });
  }

  if (user !== req.user?.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only bookmark jobs for your own account.',
    });
  }

  try {
    const existingBookmark = await bookMarkJob.findOne({ job, user });
    if (existingBookmark) {
      return res.status(409).json({
        success: false,
        message: 'This job is already saved in your bookmarks.',
      });
    }

    const newBookmark = await bookMarkJob.create({ job, user });
    return res.status(201).json({
      success: true,
      message: 'Job bookmarked successfully!',
      data: newBookmark,
    });
  } catch (err) {
    console.error('Error bookmarking job (server):', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to bookmark job due to a server error.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

// GET: Retrieve bookmarks for a user, or check specific bookmark status
export const getBookmarkJobs = async (req, res) => {
  const userId = req.query?.id || req.query?.user || req.user?.id;
  const jobId = req.query?.job;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required to retrieve saved bookmarks.',
    });
  }

  if (userId !== req.user?.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only view your own saved bookmarks.',
    });
  }

  try {
    // If checking a specific job
    if (jobId) {
      const isSaved = await bookMarkJob.findOne({ user: userId, job: jobId });
      return res.status(200).json({
        success: true,
        bookmarked: !!isSaved,
        data: isSaved,
      });
    }

    const bookmarks = await bookMarkJob
      .find({ user: userId })
      .populate({
        path: 'job',
        populate: { path: 'user', select: 'name email company' },
      })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Saved bookmarks retrieved successfully.',
      data: bookmarks,
      total: bookmarks.length,
    });
  } catch (err) {
    console.error('Error fetching bookmarked jobs (server):', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch bookmarks due to a server error.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

// DELETE: Weak Spot #3 - Full DELETE Handler supporting ID, query, and user+job un-bookmark
export const deleteBookmarkJob = async (req, res) => {
  const body = req.body;
  const rawId = typeof body === 'string' ? body : body?.id;
  const bookmarkId = req.query?.id || rawId;
  const jobId = req.query?.job || body?.job;
  const userId = req.query?.user || body?.user || req.user?.id;

  if (userId !== req.user?.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only remove your own bookmarks.',
    });
  }

  try {
    let deletedDoc = null;

    if (bookmarkId && mongoose.Types.ObjectId.isValid(bookmarkId)) {
      deletedDoc = await bookMarkJob.findOneAndDelete({ _id: bookmarkId, user: userId });
    } else if (jobId && userId) {
      deletedDoc = await bookMarkJob.findOneAndDelete({ job: jobId, user: userId });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide either a bookmark id or both job and user IDs to remove a bookmark.',
      });
    }

    if (!deletedDoc) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found or already removed.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Job removed from bookmarks successfully!',
      data: deletedDoc,
    });
  } catch (err) {
    console.error('Error removing bookmark (server):', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove bookmark due to a server error.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};
