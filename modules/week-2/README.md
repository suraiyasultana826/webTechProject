# Module 2 (Week 2): Authentication, JWT Security & Verification Flow

## 🎯 Objectives
- Secure user registration and login workflows using bcrypt hashing and signed JWT tokens.
- Fix null pointer exception in `middleware/tokenValidation.js`.
- Resolve **Weak Spot #1** from the Excel sheet by eliminating unauthenticated password resets and introducing a 2-step OTP verification flow.

---

## 🛠️ Key Components & Changes

### 1. Token Validation Middleware (`middleware/tokenValidation.js`)
- Fixed crash caused by undefined `req.headers.authorization`.
- Validates `Bearer <token>` format and handles token expiration gracefully with clear 401 response messages.

### 2. User Registration (`pages/api/auth/register.js`)
- **Route**: `POST /api/auth/register`
- **Security**: 12 bcrypt salt rounds, lowercase email normalization.
- **Status Codes**:
  - `400`: Validation error (missing fields or short password).
  - `409`: Conflict (email already registered).
  - `201`: Account created successfully.

### 3. User Login (`pages/api/auth/login.js`)
- **Route**: `POST /api/auth/login`
- Generates a signed JWT with 7-day expiration.
- Returns sanitized user record omitting hashed password.

### 4. Password Recovery & Weak Spot #1 Fix (`pages/api/auth/forgetPassword.js`)
- **Issue in Excel**: "Unauthenticated: anyone who knows an email can change that account's password. Priority: High."
- **Resolution**:
  - Direct password overwriting without OTP is blocked (`400 Bad Request`).
  - **Step 1 (`action: 'request_otp'`)**: Generates a cryptographically random 6-digit numeric OTP with a 15-minute expiration timestamp.
  - **Step 2 (`action: 'reset_password'`)**: Verifies matching OTP and active timestamp before hashing and storing the new password.
- **Frontend**: Updated `pages/auth/forget-password.jsx` with an interactive 2-step UI.

---

## 🧪 Verification
```bash
# Output:
# 🔹 MODULE 2 (WEEK 2): Authentication, Security & Password Recovery Flow
#   ✅ PASS: Route 1: POST /api/auth/register (Employer Account Created)
#   ✅ PASS: Route 1: POST /api/auth/register (Duplicate Email Prevention - 409 Conflict)
#   ✅ PASS: Route 1: POST /api/auth/register (Worker Account Created)
#   ✅ PASS: Route 2: POST /api/auth/login (Employer JWT Token Issued)
#   ✅ PASS: Route 2: POST /api/auth/login (Worker Authenticated)
#   ✅ PASS: Weak Spot #1 Fix: POST /api/auth/forgetPassword blocks unauthorized password overwrite without OTP
#   ✅ PASS: Weak Spot #1 Fix: Generated secure OTP verification code
#   ✅ PASS: Route 3: POST /api/auth/forgetPassword (Verified OTP Password Reset)
#   ✅ PASS: Route 2: Verified Login with newly updated password
```
