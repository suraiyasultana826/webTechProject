# KajKhoj — 5-Weekly Modules Architecture & Curriculum

This document outlines the **5-week modular implementation** of the **KajKhoj Web Technology (WT) Project**, connecting to MongoDB and covering all 13 API endpoints and weak spot resolutions specified in `kajkhoj_api_routes.xlsx`.

---

## 📅 5-Week Module Roadmap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       KAJKHOJ 5-WEEK ARCHITECTURE                           │
├──────────────┬──────────────────────────────────────────────┬───────────────┤
│ Module       │ Focus Area                                   │ Excel APIs    │
├──────────────┼──────────────────────────────────────────────┼───────────────┤
│ Week 1       │ DB Architecture, Connection Caching & Config │ DB, Models    │
│ Week 2       │ Authentication, JWT & Security (Weak Spot 1) │ Routes 1–3    │
│ Week 3       │ Week-Based Jobs & Pagination (Weak Spot 4)   │ Routes 4–7    │
│ Week 4       │ Applications & Resume Upload (Weak Spot 2)   │ Routes 8–12   │
│ Week 5       │ Bookmarks & Error Handling (Weak Spots 3, 5) │ Route 13, Test│
└──────────────┴──────────────────────────────────────────────┴───────────────┘
```

---

## Module Summaries

### [Module 1 (Week 1): Foundation, MongoDB Architecture & Environment Setup](./week-1/README.md)
- **Database Connection**: Upgraded `DB/connectDB.js` with serverless connection pooling, connection caching, and automatic embedded fallback instance (`MongoMemoryServer`).
- **Data Models**: Defined strict schemas for `User`, `Job`, `ApplyJob`, and `Bookmark` with compound indexes and model caching.
- **Environment**: Configuration via `.env` with `DB_URI`, `JWT_SECREAT`, and `NEXT_PUBLIC_API_BASE_URL`.

### [Module 2 (Week 2): Authentication, JWT Security & Verification Flow](./week-2/README.md)
- **Token Validation**: Fixed `middleware/tokenValidation.js` to guard against missing/malformed `Authorization` headers.
- **Registration**: `POST /api/auth/register` with Joi validation, email normalization, bcrypt hashing (12 salt rounds), and duplicate account rejection (409 Conflict).
- **Login**: `POST /api/auth/login` with JWT generation (7-day validity) and sanitized user response (omitting hashed password).
- **Weak Spot #1 Fix**: `POST /api/auth/forgetPassword` replaced unauthenticated overwrite with a secure 2-step OTP verification flow with 15-minute expiry.

### [Module 3 (Week 3): Week-Based Job Management & Paginated Directory](./week-3/README.md)
- **Week-Based Job Structure**: Added `salary_period` (per week, per day, per month) and `job_duration` (1 Week, 2 Weeks, etc.) to `models/Job.js`.
- **Job Creation**: `POST /api/job/postAJob` supporting week-based contracts and daily wages with HTTP 201 response.
- **Weak Spot #4 Fix**: `GET /api/job/getAllJobs` added `page` and `limit` query parameters with pagination metadata (`totalJobs`, `totalPages`, `hasMore`).
- **Job Details & Employer Roster**: `GET /api/job/getSpecifiedJob` (with 400/404 validation) and `GET /api/job/getPostedJobs` (listing employer jobs).

### [Module 4 (Week 4): Worker Applications & Async Lifecycle Management](./week-4/README.md)
- **Weak Spot #2 Fix**: `POST /api/job/applyJob` added `await` on `AppliedJob.create` to guarantee persistence, duplicate application rejection (409 Conflict), and robust multipart CV uploads.
- **Application Tracking**: `GET /api/job/getAppliedJobs` for worker dashboards and `GET /api/job/getAllApplicationsOfSpecifiedJob` for employers.
- **Application Review & Decision**: `GET /api/job/getApplicationDetail` (token-protected) and `PUT /api/job/responseOfApplication` (employer accepts/rejects status).

### [Module 5 (Week 5): Bookmarks, Error Standardization & Integration Test Suite](./week-5/README.md)
- **Weak Spot #3 Fix**: `DELETE /api/job/bookmark` added full deletion/un-bookmark support by bookmark ID or job-user pair.
- **Bookmark Operations**: `POST /api/job/bookmark` (saving with 409 duplicate check) and `GET /api/job/bookmark` (listing saved jobs).
- **Weak Spot #5 Fix**: Replaced generic "Something went wrong" messages with semantic status codes (400, 401, 403, 404, 409, 500) and informative errors across all 13 routes.
- **Verification**: Complete automated integration test suite (`scripts/test-all-apis.js`) verifying all 27 test assertions with 100% pass rate.
