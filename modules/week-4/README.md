# Module 4 (Week 4): Worker Applications & Async Lifecycle Management

## 🎯 Objectives
- Resolve **Weak Spot #2** from the Excel sheet by awaiting `AppliedJob.create` and adding error handling.
- Build the full application lifecycle: worker submission, employer review, and decision updates.
- Support safe multipart resume/CV file uploads.

---

## 🛠️ Key Components & Changes

### 1. Job Application Submission & Weak Spot #2 Fix (`pages/api/job/applyJob.js`)
- **Issue in Excel**: "`AppliedJob.create(...)` appears to be called without `await`, so a failed save goes unnoticed. Priority: High."
- **Resolution**:
  - Ensured `const newApplication = await AppliedJob.create(jobApplication);` is strictly awaited.
  - Wrapped file handling with directory creation (private `uploads/` folder outside `public/`) and safe file copying to eliminate unhandled stream crashes.
  - CV uploads are restricted to PDF, DOC, DOCX, PNG and JPG, and are downloaded only through the authenticated `GET /api/job/getCV` route (employer of the job or the applicant).
  - Added self-application prevention: employers cannot apply to their own job postings.
  - Added duplicate application rejection: workers cannot submit multiple applications for the same job (`409 Conflict`).

### 2. Worker Application History (`pages/api/job/getAppliedJobs.js`)
- **Route**: `GET /api/job/getAppliedJobs?id=<UserId>` (Requires Token)
- Returns applications submitted by the worker, populated with job details, company, and current status.

### 3. Employer Candidate Review (`pages/api/job/getAllApplicationsOfSpecifiedJob.js`)
- **Route**: `GET /api/job/getAllApplicationsOfSpecifiedJob?id=<JobId>` (Requires Token)
- Lists all applicant profiles and CV links for an employer's posted job.

### 4. Single Application Inspection (`pages/api/job/getApplicationDetail.js`)
- **Route**: `GET /api/job/getApplicationDetail?id=<AppId>` (Requires Token)
- Enforces token authentication (matching the Excel sheet specification).
- Returns 404 if the application cannot be found.

### 5. Application Decision Status (`pages/api/job/responseOfApplication.js`)
- **Route**: `PUT /api/job/responseOfApplication` (Requires Token)
- Validates status enum (`['pending', 'accepted', 'rejected']`).
- Updates candidate status and returns the populated record.

---

## 🧪 Verification
```bash
# Output:
# 🔹 MODULE 4 (WEEK 4): Worker Applications & Async Lifecycle (Weak Spot #2 Fix)
#   ✅ PASS: Route 8 & Weak Spot #2 Fix: POST /api/job/applyJob (Multipart CV upload & awaited save)
#   ✅ PASS: Route 8: POST /api/job/applyJob (Prevents duplicate applications - 409 Conflict)
#   ✅ PASS: Route 9: GET /api/job/getAppliedJobs (Worker's applied jobs listed)
#   ✅ PASS: Route 10: GET /api/job/getAllApplicationsOfSpecifiedJob (Candidate roster fetched)
#   ✅ PASS: Route 11: GET /api/job/getApplicationDetail (Application detail fetched with token)
#   ✅ PASS: Route 12: PUT /api/job/responseOfApplication (Employer accepted application)
```
