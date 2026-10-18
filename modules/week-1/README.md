# Module 1 (Week 1): Foundation, MongoDB Architecture & Environment Setup

## 🎯 Objectives
- Establish a resilient, production-ready MongoDB connection with connection caching.
- Configure environment variables and fallback mechanisms.
- Define normalized Mongoose schemas for collections: `User`, `Job`, `ApplyJob`, and `Bookmark`.

---

## 🛠️ Key Components & Changes

### 1. Database Connection (`DB/connectDB.js`)
- **Connection Caching**: Implemented `global.mongoose` caching to prevent leaking connection pools across Next.js API requests.
- **Embedded Fallback**: Automatically connects to `mongodb-memory-server` if `DB_URI` is missing or local service is temporarily offline.
- **Asynchronous Execution**: Guaranteed `await mongoose.connect(...)` completion before any query is dispatched.

### 2. Environment Configuration (`.env`)
```env
DB_URI=mongodb://127.0.0.1:27017/kajkhoj
JWT_SECREAT=kajkhoj_super_secret_jwt_key_2026_wt_project_semester_security
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### 3. Collections & Mongoose Schemas
- **`models/User.js`**: `name`, `email` (unique, lowercase), `password` (hashed), `role` (`worker` | `employer`), `resetOtp`, `resetOtpExpiry`, `image`.
- **`models/Job.js`**: `title`, `description`, `salary`, `salary_period` (`per week` | `per day` | `per month`), `company`, `email`, `job_category`, `job_type`, `job_duration`, `job_vacancy`, `job_deadline`, `user` ref.
- **`models/ApplyJob.js`**: `user` ref, `job` ref, `name`, `email`, `about`, `cv`, `status` (`pending` | `accepted` | `rejected`).
- **`models/Bookmark.js`**: `user` ref, `job` ref, with compound unique index `{ user: 1, job: 1 }`.

---

## 🧪 Verification
```bash
npm run test:api
# Output:
# 🔹 MODULE 1 (WEEK 1): Database Architecture & Environment Initialization
#   ✅ PASS: Database Connected & Initialized (/api/job/getAllJobs responded 200)
```
