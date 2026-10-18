
const TeamMembers = [
  {
    name: "Mutasim Billah",
    studentId: "23549009057",
    email: "1467mutasim@gmail.com",
    phone: "01774452374",
    facebook: "https://www.facebook.com/okmutasim.billah/",
    instagram: "https://www.instagram.com/okmutasim.billah/?hl=en",
    github: "https://github.com/1467mutasim-ctrl",
  },
  {
    name: "Suraiya Sultana",
    studentId: "24549010107",
    email: "suraiyasultana826@gmail.com",
    phone: "01993949204",
    facebook: "https://www.facebook.com/suraiya.sultana.tanu",
    instagram: "https://www.instagram.com/suraiya_tanu/?hl=en",
    github: "https://github.com/suraiyasultana826",
  },
];

const Institution = {
  department: "Department of ICT",
  faculty: "Faculty of Science & Technology",
  university: "Bangladesh University of Professionals (BUP)",
  program: "BICE-2024, Section A",
  course: "Web Technology",
  supervisors: ["Md. Istakiak Adnan Palash", "Sharmeen Jahan Seema"],
  address: "Mirpur Cantonment, Dhaka-1216",
  country: "Bangladesh",
};

// Bangladeshi mobile numbers (01XXXXXXXXX) dialled internationally as +8801XXXXXXXXX
const toTelLink = (phone) => `tel:+880${phone.replace(/^0/, "")}`;

module.exports = { TeamMembers, Institution, toTelLink };
