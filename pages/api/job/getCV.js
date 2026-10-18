import ConnectDB from '@/DB/connectDB';
import validateToken from '@/middleware/tokenValidation';
import AppliedJob from '@/models/ApplyJob';
import fs from 'fs';
import path from 'path';

// Must match the directory used by /api/job/applyJob
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

const CONTENT_TYPES = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: `HTTP Method ${req.method} not allowed on /api/job/getCV. Use GET.`,
    });
  }

  await ConnectDB();

  return validateToken(req, res, async () => {
    await getCV(req, res);
  });
}

const getCV = async (req, res) => {
  const fileName = typeof req.query?.file === 'string' ? path.basename(req.query.file) : '';

  if (!fileName) {
    return res.status(400).json({
      success: false,
      message: 'CV file name parameter (file) is required.',
    });
  }

  try {
    const application = await AppliedJob.findOne({ cv: fileName }).populate('job', 'user');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'CV not found.',
      });
    }

    const isApplicant = application.user?.toString() === req.user?.id;
    const isEmployer = application.job?.user?.toString() === req.user?.id;
    if (!isApplicant && !isEmployer) {
      return res.status(403).json({
        success: false,
        message: 'Only the employer of this job or the applicant can download this CV.',
      });
    }

    const filePath = path.join(UPLOAD_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'CV file is missing from the server.',
      });
    }

    const ext = path.extname(fileName).toLowerCase();
    res.setHeader('Content-Type', CONTENT_TYPES[ext] || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(200).send(fs.readFileSync(filePath));
  } catch (err) {
    console.error('Error downloading CV (server):', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to download CV due to a server error.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};
