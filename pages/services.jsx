import React from "react";
import Link from "next/link";
import {
  BsPersonPlusFill,
  BsSearch,
  BsCheckCircleFill,
  BsBriefcaseFill,
  BsBuilding,
  BsPersonWorkspace,
} from "react-icons/bs";
import InfoLayout, { cardClass } from "@/components/InfoLayout";

const steps = [
  { icon: BsPersonPlusFill, title: "1. Create an account", text: "Sign up for free with your name and email." },
  { icon: BsSearch, title: "2. Find or post work", text: "Browse week-based jobs, or post an opportunity for your farm or business." },
  { icon: BsCheckCircleFill, title: "3. Apply & hire", text: "Workers apply with a CV; employers accept the right candidates." },
];

const services = [
  {
    icon: BsPersonWorkspace,
    title: "For Workers",
    points: [
      "Browse week-based, daily-wage, full-time and contract jobs",
      "Search and filter by title, category, company or duration",
      "Apply in minutes with your CV and a short cover letter",
      "Save interesting jobs to your bookmarks",
      "Track every application (pending, accepted or rejected) in your dashboard",
    ],
    cta: { href: "/frontend/displayJobs", label: "Browse Jobs" },
  },
  {
    icon: BsBriefcaseFill,
    title: "For Employers",
    points: [
      "Post jobs with weekly, daily or monthly wages in Taka (৳)",
      "Set the contract duration, vacancies and application deadline",
      "Review every applicant and download their CV securely",
      "Accept or reject applications with one click",
      "Manage all of your posted jobs from one page",
    ],
    cta: { href: "/frontend/postAJob", label: "Post a Job" },
  },
  {
    icon: BsBuilding,
    title: "Partner Organisations",
    points: [
      "Directory of Bangladeshi government departments and NGOs",
      "Skills training, youth development and agricultural support",
      "Direct links to each organisation's official website",
    ],
    cta: { href: "/frontend/organizations", label: "View Organisations" },
  },
];

export default function Services() {
  return (
    <InfoLayout
      title="Our Services"
      subtitle="Everything KajKhoj offers to workers, employers and the organisations that support them."
    >
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {steps.map(({ icon: Icon, title, text }) => (
          <div key={title} className={`${cardClass} text-center`}>
            <Icon className="text-3xl text-indigo-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-700">{text}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {services.map(({ icon: Icon, title, points, cta }) => (
          <div key={title} className={`${cardClass} flex flex-col`}>
            <div className="flex items-center gap-3 mb-4">
              <Icon className="text-3xl text-indigo-600 shrink-0" />
              <h2 className="text-xl font-bold text-indigo-900">{title}</h2>
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-gray-700">
                  <BsCheckCircleFill className="text-green-600 mt-1 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <Link
              href={cta.href}
              className="text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg transition-all"
            >
              {cta.label}
            </Link>
          </div>
        ))}
      </section>
    </InfoLayout>
  );
}
