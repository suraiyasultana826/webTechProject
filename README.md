# KajKhoj — Week-Based Job Portal for Local & Agricultural Workers

KajKhoj ("work search") connects local skilled workers (farmhands, plumbers, electricians, carpenters, daily-wage workers) with employers. This project is structured across a **5-week modular delivery** for the Web Technologies (WT) Project curriculum, fully connected to MongoDB and implementing all 13 API routes and weak spots from `kajkhoj_api_routes.xlsx`.

**Stack:** Next.js · Tailwind CSS · Redux Toolkit · MongoDB · JWT Authentication

**Course:** Web Technology · Department of ICT, Faculty of Science & Technology, Bangladesh University of Professionals (BUP), Dhaka, Bangladesh

---

## 📅 5-Weekly Modules Structure

The project deliverables are organized into 5 progressive weekly modules:

- **[Module 1 (Week 1)](./modules/week-1/README.md)**: Database Architecture, Connection Caching & Config Setup.
- **[Module 2 (Week 2)](./modules/week-2/README.md)**: Authentication, JWT Token Validation & OTP Password Recovery (Weak Spot #1 Fix).
- **[Module 3 (Week 3)](./modules/week-3/README.md)**: Week-Based Job Management, Wage Frequencies & Paginated Directory (Weak Spot #4 Fix).
- **[Module 4 (Week 4)](./modules/week-4/README.md)**: Worker Application Lifecycle, Awaited Save & Resume Processing (Weak Spot #2 Fix).
- **[Module 5 (Week 5)](./modules/week-5/README.md)**: Bookmark System (DELETE Handler), Error Standardization & E2E API Test Suite (Weak Spots #3 & #5 Fixes).

For a complete project summary, see [PROJECT_5_WEEK_REPORT.md](../PROJECT_5_WEEK_REPORT.md).

---

## 🚀 Quick Start

### 1. Installation & Environment
```bash
npm install
# Environment variables are pre-configured in .env
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> **MongoDB Note:** If an external MongoDB server is running on `mongodb://127.0.0.1:27017/kajkhoj`, the app connects to it automatically. If no external instance is running, the app automatically starts and connects to an embedded fallback MongoDB instance (`mongodb-memory-server`) with zero extra configuration.

### 3. Run Automated API Tests
```bash
npm run test:api
```
Executes the live HTTP test suite covering all 13 API endpoints and 5 weak spot fixes (27 / 27 Passed).

---

## 📋 Features

### For Workers
- Browse week-based opportunities, daily wage jobs, and full-time contracts.
- Filter opportunities by contract type, wage frequency, and keywords.
- Submit job applications with PDF/DOC resume uploads.
- Track application status (`pending`, `accepted`, `rejected`) in the dashboard.
- Save and un-bookmark opportunities with one-click toggles.

### For Employers
- Post opportunities specifying duration in weeks, salary frequency (`৳ / week`, `৳ / day`, `৳ / month`), and requirements.
- Review submitted applications and candidate CVs.
- Update application decisions (`accept` or `reject`).
- Manage all posted jobs from a centralized dashboard.

---

## 👥 Project Team

| Member | Student ID | Facebook | Instagram | GitHub |
|--------|------------|----------|-----------|--------|
| **Mutasim Billah** | 23549009057 | [okmutasim.billah](https://www.facebook.com/okmutasim.billah/) | [@okmutasim.billah](https://www.instagram.com/okmutasim.billah/?hl=en) | [1467mutasim-ctrl](https://github.com/1467mutasim-ctrl) |
| **Suraiya Sultana** | 24549010107 | [suraiya.sultana.tanu](https://www.facebook.com/suraiya.sultana.tanu) | [@suraiya_tanu](https://www.instagram.com/suraiya_tanu/?hl=en) | [suraiyasultana826](https://github.com/suraiyasultana826) |

- **Program:** BICE-2024, Section A
- **Department:** Department of ICT, Faculty of Science & Technology (FST)
- **University:** Bangladesh University of Professionals (BUP), Dhaka, Bangladesh
- **Supervisors:** Md. Istakiak Adnan Palash & Sharmeen Jahan Seema, Lecturers, Department of ICT



