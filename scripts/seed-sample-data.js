// Adds sample employers and job posts to a running KajKhoj server so the demo isn't empty.
// Usage: npm run seed   (BASE_URL defaults to http://localhost:3000)
// Employer logins are saved to sample-accounts.local.json (git-ignored). Re-running skips jobs that already exist.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const ACCOUNTS_FILE = path.join(__dirname, '..', 'sample-accounts.local.json');

const daysFromNow = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

// Fictional employers; example.com addresses are reserved and never deliver mail.
const SAMPLE_EMPLOYERS = [
  {
    name: 'Abdul Karim',
    email: 'karim.agro@example.com',
    company: 'Karim Agro Farm, Bogura',
    jobs: [
      {
        title: 'Farmhand for Paddy Harvest',
        description:
          'Karim Agro Farm needs farmhands for the Aman paddy harvest in Shibganj, Bogura. Work includes cutting, bundling and carrying paddy and helping at the threshing yard. Hours are 7am to 4pm with a lunch break. Lunch and drinking water are provided on site, and wages are paid every Thursday.',
        salary: 4200,
        salary_period: 'per week',
        job_category: 'Agriculture',
        job_type: 'week-based',
        job_duration: '2 Weeks',
        job_experience: 'Beginner',
        job_vacancy: 8,
        deadlineDays: 12,
      },
      {
        title: 'Vegetable Farm Worker',
        description:
          'Daily-wage workers needed for winter vegetable planting (cauliflower, cabbage and tomato seedlings). Tasks include bed preparation, planting, watering and weeding. Wages are paid in cash at the end of each day.',
        salary: 650,
        salary_period: 'per day',
        job_category: 'Agriculture',
        job_type: 'daily',
        job_duration: '1 Week',
        job_experience: 'Beginner',
        job_vacancy: 5,
        deadlineDays: 9,
      },
      {
        title: 'Dairy Farm Helper',
        description:
          'Help care for a herd of 40 dairy cows: feeding, cleaning the sheds, and assisting with morning and evening milking. Shared accommodation and meals are provided on the farm.',
        salary: 13000,
        salary_period: 'per month',
        job_category: 'Livestock',
        job_type: 'fulltime',
        job_duration: 'Full Term',
        job_experience: '6 Months',
        job_vacancy: 2,
        deadlineDays: 25,
      },
    ],
  },
  {
    name: 'Nasir Uddin',
    email: 'shapla.construction@example.com',
    company: 'Shapla Construction Works',
    jobs: [
      {
        title: 'Construction Labourer',
        description:
          'Labourers needed for a six-storey residential building in Mirpur, Dhaka. Work includes carrying bricks, sand and cement, mixing concrete and keeping the site clean. Safety helmets and gloves are provided. Wages are paid daily.',
        salary: 750,
        salary_period: 'per day',
        job_category: 'Construction',
        job_type: 'daily',
        job_duration: 'Ongoing Weekly',
        job_experience: 'Beginner',
        job_vacancy: 15,
        deadlineDays: 10,
      },
      {
        title: 'Mason (Rajmistri)',
        description:
          'Experienced masons needed for brickwork and plastering on a residential project in Mirpur, Dhaka. You should be able to read basic measurements and work with a helper. The contract runs for about one month.',
        salary: 1100,
        salary_period: 'per day',
        job_category: 'Construction',
        job_type: 'contract',
        job_duration: '4 Weeks (1 Month)',
        job_experience: '3+ Years',
        job_vacancy: 4,
        deadlineDays: 14,
      },
      {
        title: 'House Painter',
        description:
          'Painters needed for interior and exterior painting of finished flats in Uttara, Dhaka. Experience with putty, primer and emulsion paint is required. Paint and tools are supplied.',
        salary: 6000,
        salary_period: 'per week',
        job_category: 'Painting',
        job_type: 'week-based',
        job_duration: '3 Weeks',
        job_experience: '1 Year',
        job_vacancy: 3,
        deadlineDays: 18,
      },
    ],
  },
  {
    name: 'Rafiq Hasan',
    email: 'alo.services@example.com',
    company: 'Alo Electric & Plumbing Services',
    jobs: [
      {
        title: 'Electrician for Residential Wiring',
        description:
          'We are hiring electricians for house wiring, fitting switchboards, fans and lights, and finding faults in apartments around Chattogram city. A BTEB or other trade certificate is preferred. A transport allowance is paid for site visits.',
        salary: 25000,
        salary_period: 'per month',
        job_category: 'Electrical',
        job_type: 'fulltime',
        job_duration: 'Full Term',
        job_experience: '2+ Years',
        job_vacancy: 2,
        deadlineDays: 30,
      },
      {
        title: 'Plumber',
        description:
          'Plumbers needed to install water lines, bathroom fittings and water tanks in a new apartment building in Agrabad, Chattogram. Bring your own basic hand tools; pipes and fittings are supplied.',
        salary: 1000,
        salary_period: 'per day',
        job_category: 'Plumbing',
        job_type: 'contract',
        job_duration: '2 Weeks',
        job_experience: '2 Years',
        job_vacancy: 2,
        deadlineDays: 15,
      },
      {
        title: 'Electrician Helper (Part Time)',
        description:
          'Part-time helper to assist our electricians on evening and weekend jobs, about 4 hours a day. A good chance to learn wiring on the job, and suitable for students of technical training centres.',
        salary: 8000,
        salary_period: 'per month',
        job_category: 'Electrical',
        job_type: 'parttime',
        job_duration: 'Ongoing Weekly',
        job_experience: 'Beginner',
        job_vacancy: 1,
        deadlineDays: 20,
      },
    ],
  },
  {
    name: 'Jahangir Alam',
    email: 'nodi.transport@example.com',
    company: 'Nodi Transport & Logistics',
    jobs: [
      {
        title: 'Covered Van Driver',
        description:
          'Drivers needed for covered vans carrying goods between Narayanganj, Dhaka and Chattogram. A valid BRTA medium or heavy driving licence is required. A meal allowance is paid on long trips.',
        salary: 22000,
        salary_period: 'per month',
        job_category: 'Driving',
        job_type: 'fulltime',
        job_duration: 'Full Term',
        job_experience: '3+ Years',
        job_vacancy: 3,
        deadlineDays: 28,
      },
      {
        title: 'Delivery Rider (Motorbike)',
        description:
          'Riders needed to deliver parcels within Narayanganj and Dhaka. You must have your own motorbike and a valid BRTA licence. Fuel costs are paid on top of the daily wage.',
        salary: 800,
        salary_period: 'per day',
        job_category: 'Delivery',
        job_type: 'daily',
        job_duration: 'Ongoing Weekly',
        job_experience: '1 Year',
        job_vacancy: 6,
        deadlineDays: 11,
      },
      {
        title: 'Warehouse Loader / Labourer',
        description:
          'Loaders needed to load and unload goods at our warehouse in Narayanganj during the busy season. Work is in 9-hour day shifts, and wages are paid weekly.',
        salary: 4500,
        salary_period: 'per week',
        job_category: 'Logistics',
        job_type: 'week-based',
        job_duration: '4 Weeks (1 Month)',
        job_experience: 'Beginner',
        job_vacancy: 10,
        deadlineDays: 16,
      },
    ],
  },
];

async function api(pathname, { token, body } = {}) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  if (body) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${BASE_URL}${pathname}`, {
    method: body ? 'POST' : 'GET',
    headers,
    body: body && JSON.stringify(body),
  });
  return { status: res.status, data: await res.json() };
}

function loadAccounts() {
  try {
    return JSON.parse(fs.readFileSync(ACCOUNTS_FILE, 'utf8'));
  } catch {
    return {};
  }
}

async function seedEmployer(employer, accounts) {
  if (!accounts[employer.email]) {
    const password = crypto.randomBytes(9).toString('base64url');
    const reg = await api('/api/auth/register', {
      body: { name: employer.name, email: employer.email, password, role: 'employer' },
    });
    if (reg.status === 409) {
      throw new Error(`${employer.email} already exists but its password is not in ${path.basename(ACCOUNTS_FILE)}`);
    }
    if (!reg.data.success) throw new Error(`register ${employer.email}: ${reg.data.message}`);
    accounts[employer.email] = { name: employer.name, company: employer.company, password };
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));
  }

  const login = await api('/api/auth/login', {
    body: { email: employer.email, password: accounts[employer.email].password },
  });
  if (!login.data.success) throw new Error(`login ${employer.email}: ${login.data.message}`);
  const { token, user } = login.data.finalData;

  const posted = await api(`/api/job/getPostedJobs?id=${user._id}`, { token });
  const existingTitles = new Set((posted.data.data || []).map((job) => job.title));

  let added = 0;
  for (const { deadlineDays, ...job } of employer.jobs) {
    if (existingTitles.has(job.title)) continue;
    const res = await api('/api/job/postAJob', {
      token,
      body: {
        ...job,
        user: user._id,
        company: employer.company,
        email: employer.email,
        job_deadline: daysFromNow(deadlineDays),
      },
    });
    if (!res.data.success) throw new Error(`post "${job.title}": ${res.data.message}`);
    added++;
  }
  console.log(`  ${employer.company}: ${added} added, ${employer.jobs.length - added} already there`);
}

async function main() {
  console.log(`Seeding sample jobs into ${BASE_URL}`);
  const accounts = loadAccounts();
  for (const employer of SAMPLE_EMPLOYERS) {
    await seedEmployer(employer, accounts);
  }
  console.log(`Done. Sample employer logins are in ${path.basename(ACCOUNTS_FILE)}`);
}

main().catch((err) => {
  console.error(`Seeding failed: ${err.message}`);
  process.exit(1);
});
