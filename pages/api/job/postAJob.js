import ConnectDB from '@/DB/connectDB';
import validateToken from '@/middleware/tokenValidation';
import Job from '@/models/Job';
import Joi from 'joi';

const schema = Joi.object({
  title: Joi.string().min(3).max(120).required().messages({
    'string.min': 'Job title must be at least 3 characters.',
    'any.required': 'Job title is required.',
  }),
  description: Joi.string().min(10).required().messages({
    'string.min': 'Job description must be at least 10 characters.',
    'any.required': 'Job description is required.',
  }),
  user: Joi.required().messages({
    'any.required': 'User ID is required to post a job.',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'A valid contact email is required.',
  }),
  company: Joi.string().required().messages({
    'any.required': 'Company / Organization name is required.',
  }),
  job_category: Joi.string().required().messages({
    'any.required': 'Job category is required.',
  }),
  job_type: Joi.string().required().messages({
    'any.required': 'Job type is required.',
  }),
  job_duration: Joi.string().optional().default('1 Week'),
  salary: Joi.number().positive().required().messages({
    'number.positive': 'Salary must be a positive number.',
    'any.required': 'Salary is required.',
  }),
  salary_period: Joi.string()
    .valid('per week', 'per day', 'per month', 'total project')
    .optional()
    .default('per week'),
  job_experience: Joi.string().required().messages({
    'any.required': 'Job experience requirement is required.',
  }),
  job_vacancy: Joi.number().integer().min(1).required().messages({
    'number.min': 'Job vacancy must be at least 1.',
    'any.required': 'Number of vacancies is required.',
  }),
  job_deadline: Joi.date().required().messages({
    'any.required': 'Application deadline date is required.',
  }),
});

export default async function handler(req, res) {
  await ConnectDB();

  switch (req.method) {
    case 'POST':
      return validateToken(req, res, async () => {
        await postAJob(req, res);
      });
    default:
      return res.status(405).json({
        success: false,
        message: `HTTP Method ${req.method} not allowed on /api/job/postAJob. Use POST.`,
      });
  }
}

const postAJob = async (req, res) => {
  const data = req.body || {};
  const {
    user,
    title,
    description,
    salary,
    salary_period,
    company,
    email,
    job_category,
    job_type,
    job_duration,
    job_experience,
    job_vacancy,
    job_deadline,
  } = data;

  const { error } = schema.validate({
    user,
    title,
    description,
    salary,
    salary_period,
    company,
    email,
    job_category,
    job_type,
    job_duration,
    job_experience,
    job_vacancy,
    job_deadline,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message.replace(/['"]+/g, ''),
    });
  }

  if (String(user) !== req.user?.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only post jobs from your own account.',
    });
  }

  try {
    const createdJob = await Job.create({
      user,
      title: title.trim(),
      description: description.trim(),
      salary: Number(salary),
      salary_period: salary_period || 'per week',
      company: company.trim(),
      email: email.toLowerCase().trim(),
      job_category: job_category.trim(),
      job_type: job_type.trim(),
      job_duration: job_duration || '1 Week',
      job_experience: job_experience.trim(),
      job_vacancy: Number(job_vacancy),
      job_deadline: new Date(job_deadline),
    });

    return res.status(201).json({
      success: true,
      message: 'Job opportunity posted successfully!',
      data: createdJob,
    });
  } catch (err) {
    console.error('Error posting job (server):', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to post job due to a database error. Please try again.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};
