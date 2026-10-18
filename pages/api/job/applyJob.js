import ConnectDB from '@/DB/connectDB';
import Joi from 'joi';
import AppliedJob from '@/models/ApplyJob';
import Job from '@/models/Job';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import validateToken from '@/middleware/tokenValidation';

const schema = Joi.object({
  name: Joi.string().required().messages({ 'any.required': 'Full name is required.' }),
  email: Joi.string().email().required().messages({ 'any.required': 'Contact email is required.' }),
  about: Joi.string().min(10).required().messages({ 'any.required': 'Cover note/about text is required.' }),
  job: Joi.string().required().messages({ 'any.required': 'Target Job ID is required.' }),
  user: Joi.string().required().messages({ 'any.required': 'Applicant User ID is required.' }),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

// CVs are stored outside /public so they are only reachable through the
// authenticated /api/job/getCV route, never as open static files.
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const ALLOWED_CV_EXTENSIONS = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: `HTTP Method ${req.method} not allowed on /api/job/applyJob. Use POST.`,
    });
  }

  await ConnectDB();

  return new Promise((resolve) => {
    validateToken(req, res, async () => {
      try {
        await applyToJob(req, res);
      } finally {
        resolve();
      }
    });
  });
}

const applyToJob = (req, res) => {
  return new Promise((resolve) => {
    try {
      const uploadDir = UPLOAD_DIR;
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const form = new formidable.IncomingForm({
        uploadDir,
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB limit
      });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Formidable parse error:', err);
          res.status(400).json({
            success: false,
            message: 'Failed to process file upload. Please ensure file is under 10MB.',
          });
          return resolve();
        }

        const extractField = (val) => (Array.isArray(val) ? val[0] : val);

        const name = extractField(fields.name);
        const email = extractField(fields.email);
        const about = extractField(fields.about);
        const job = extractField(fields.job);
        const user = extractField(fields.user) || req.user?.id;
        const cvFile = Array.isArray(files.cv) ? files.cv[0] : files.cv;
        const tempFilePath = cvFile?.filepath || cvFile?.path;
        const discardUpload = () => {
          if (tempFilePath && fs.existsSync(tempFilePath)) {
            try {
              fs.unlinkSync(tempFilePath);
            } catch (e) {
              // non-fatal cleanup error
            }
          }
        };

        const { error } = schema.validate({ name, email, about, job, user });
        if (error) {
          discardUpload();
          res.status(400).json({
            success: false,
            message: error.details[0].message.replace(/['"]+/g, ''),
          });
          return resolve();
        }

        if (user !== req.user?.id) {
          discardUpload();
          res.status(403).json({
            success: false,
            message: 'You can only submit applications from your own account.',
          });
          return resolve();
        }

        try {
          const targetJob = await Job.findById(job);
          if (!targetJob) {
            discardUpload();
            res.status(404).json({
              success: false,
              message: 'Target job opportunity does not exist or has been removed.',
            });
            return resolve();
          }

          if (targetJob.user.toString() === user) {
            discardUpload();
            res.status(400).json({
              success: false,
              message: 'You cannot apply to a job posted by your own account.',
            });
            return resolve();
          }

          const alreadyApplied = await AppliedJob.findOne({ user, job });
          if (alreadyApplied) {
            discardUpload();
            res.status(409).json({
              success: false,
              message: 'You have already submitted an application for this position.',
            });
            return resolve();
          }

          if (!cvFile) {
            res.status(400).json({
              success: false,
              message: 'Please attach your CV/Resume file (PDF, DOC, or image).',
            });
            return resolve();
          }

          const originalName = cvFile.originalFilename || 'resume.pdf';
          const ext = (path.extname(originalName) || '.pdf').toLowerCase();
          if (!ALLOWED_CV_EXTENSIONS.includes(ext)) {
            discardUpload();
            res.status(400).json({
              success: false,
              message: 'Unsupported CV file type. Please upload a PDF, DOC, DOCX, PNG, or JPG file.',
            });
            return resolve();
          }

          const randomHex = crypto.randomBytes(6).toString('hex');
          const cleanBase = path.basename(originalName, path.extname(originalName)).replace(/[^a-zA-Z0-9_-]/g, '_');
          const finalFileName = `${cleanBase}_${randomHex}${ext}`;
          const destinationPath = path.join(uploadDir, finalFileName);

          if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.copyFileSync(tempFilePath, destinationPath);
            try {
              fs.unlinkSync(tempFilePath);
            } catch (e) {
              // non-fatal cleanup error
            }
          }

          const jobApplication = {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            about: about.trim(),
            job,
            user,
            cv: finalFileName,
            status: 'pending',
          };

          // Weak Spot #2 Fix: strictly await creation
          const newApplication = await AppliedJob.create(jobApplication);

          res.status(201).json({
            success: true,
            message: 'Job application submitted successfully!',
            data: newApplication,
          });
          return resolve();
        } catch (dbErr) {
          console.error('Error saving job application to database:', dbErr);
          res.status(500).json({
            success: false,
            message: 'Failed to record application. Please try again.',
            error: process.env.NODE_ENV === 'development' ? dbErr.message : undefined,
          });
          return resolve();
        }
      });
    } catch (err) {
      console.error('Server error in applyJob:', err);
      res.status(500).json({
        success: false,
        message: 'Internal server error while submitting job application.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
      return resolve();
    }
  });
};
