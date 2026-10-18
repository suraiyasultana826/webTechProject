# Module 3 (Week 3): Week-Based Job Management & Paginated Directory

## 🎯 Objectives
- Transform KajKhoj into a week-based job platform for local & agricultural workers.
- Add week-based job attributes: contract duration in weeks (`job_duration`) and wage frequency (`salary_period`).
- Resolve **Weak Spot #4** from the Excel sheet by implementing page and limit pagination in `getAllJobs.js`.
- Provide employer-specific posted jobs retrieval and detailed single-job inspection.

---

## 🛠️ Key Components & Changes

### 1. Week-Based Opportunity Posting (`pages/api/job/postAJob.js`)
- **Route**: `POST /api/job/postAJob` (Requires Token)
- **New Fields Supported**:
  - `job_type`: Supports `"week-based"` and `"daily"` contract types.
  - `salary_period`: `"per week"` (default), `"per day"`, `"per month"`, or `"total project"`.
  - `job_duration`: `"1 Week"`, `"2 Weeks"`, `"3 Weeks"`, `"4 Weeks"`, `"Ongoing Weekly"`.
- **Validation**: Joi schema requiring positive vacancy count, valid deadline date, and sanitization.

### 2. Paginated Jobs Directory & Weak Spot #4 Fix (`pages/api/job/getAllJobs.js`)
- **Issue in Excel**: "Returns every job at once, with no pagination. Priority: Medium."
- **Resolution**:
  - Query parameters: `?page=1&limit=10&category=...&type=...&search=...`
  - When `page` or `limit` is provided, returns:
    ```json
    {
      "success": true,
      "data": [ ... ],
      "pagination": {
        "totalJobs": 24,
        "page": 1,
        "limit": 10,
        "totalPages": 3,
        "hasMore": true
      }
    }
    ```
  - Full backwards compatibility: when called without pagination parameters, returns the full array under `data` so legacy consumers do not break.

### 3. Detailed Job Inspection (`pages/api/job/getSpecifiedJob.js`)
- **Route**: `GET /api/job/getSpecifiedJob?id=<JobId>`
- Validates MongoDB ObjectId format, returns 404 if not found, and populates employer profile data.

### 4. Employer Roster Management (`pages/api/job/getPostedJobs.js`)
- **Route**: `GET /api/job/getPostedJobs?id=<UserId>` (Requires Token)
- Returns opportunities posted by the authenticated employer sorted newest first.

### 5. Frontend Enhancements
- **`pages/frontend/postAJob.jsx`**: Selectors for Contract Type ("Week-based Contract"), Wage Frequency ("৳ / Week"), and Duration in Weeks.
- **`pages/frontend/displayJobs.jsx`**: Fixed missing `get_job` import and added interactive filter pills for "📅 Week-Based", "⚡ Daily Wage", and "💼 Full Time".
- **`components/JobsCard.jsx`**: Displays compensation with period (`৳3500 / week`) and duration badges.

---

## 🧪 Verification
```bash
# Output:
# 🔹 MODULE 3 (WEEK 3): Week-Based Job Management & Paginated Directory (Weak Spot #4 Fix)
#   ✅ PASS: Route 4: POST /api/job/postAJob (Created Week-Based Job #1)
#   ✅ PASS: Route 4: POST /api/job/postAJob (Created Week-Based Job #2)
#   ✅ PASS: Route 5: GET /api/job/getAllJobs (All Jobs directory)
#   ✅ PASS: Weak Spot #4 Fix: GET /api/job/getAllJobs?page=1&limit=1 (Verified page and limit pagination metadata)
#   ✅ PASS: Route 6: GET /api/job/getSpecifiedJob (Job details retrieved)
#   ✅ PASS: Route 7: GET /api/job/getPostedJobs (Employer posted jobs retrieved)
```
