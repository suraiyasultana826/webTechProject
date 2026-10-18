import React, { useState } from "react";
import Link from "next/link";
import { BsChevronDown } from "react-icons/bs";
import InfoLayout, { cardClass } from "@/components/InfoLayout";

const faqs = [
  {
    q: "What is KajKhoj?",
    a: "KajKhoj is a job portal for local skilled and agricultural workers in Bangladesh. Employers post short, week-based or regular jobs, and workers apply with their CV.",
  },
  {
    q: "What is a week-based job?",
    a: "A short contract that lasts from one to a few weeks, usually paid weekly or daily, such as a two-week paddy harvest or a one-week wiring job.",
  },
  {
    q: "Is KajKhoj free to use?",
    a: "Yes. KajKhoj is a student project and is free for both workers and employers.",
  },
  {
    q: "How do I apply for a job?",
    a: "Sign up and log in, open View Jobs, choose a job and click Apply Position. Enter your name and a short cover letter, attach your CV as a PDF, and submit.",
  },
  {
    q: "How do I post a job?",
    a: "Log in and open Post Jobs. Fill in the title, wage in Taka (৳), wage frequency, contract duration, vacancies and deadline, then click Post Opportunity.",
  },
  {
    q: "How will I know if my application is accepted?",
    a: "Open your Dashboard. Under Applied Jobs, each application shows its status: pending, accepted or rejected.",
  },
  {
    q: "Who can see my CV?",
    a: "Only the employer who posted the job you applied for, and you. CVs are not publicly accessible.",
  },
  {
    q: "Can I save a job to look at later?",
    a: "Yes. Click the bookmark icon on a job's details page. Your saved jobs appear under Dashboard → Saved Jobs, where you can also remove them.",
  },
  {
    q: "I forgot my password. What should I do?",
    a: "Click “Forgot password?” on the login page and request a verification code. This demo cannot send emails, so contact the team and we will give you your code.",
    link: { href: "/contact", label: "Contact the team" },
  },
  {
    q: "Who built KajKhoj?",
    a: "Mutasim Billah and Suraiya Sultana, students of the Department of ICT, Bangladesh University of Professionals (BUP), as their Web Technology course project.",
    link: { href: "/about", label: "Meet the team" },
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <InfoLayout
      title="Frequently Asked Questions"
      subtitle="Quick answers about finding work, hiring and using KajKhoj."
    >
      <div className="space-y-3">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.q} className={`${cardClass} !p-0 overflow-hidden`}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 text-left px-6 py-4 font-semibold text-gray-900"
              >
                <span>{item.q}</span>
                <BsChevronDown
                  className={`shrink-0 text-indigo-600 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                  <p>{item.a}</p>
                  {item.link && (
                    <Link href={item.link.href} className="inline-block mt-2 text-indigo-700 font-medium underline">
                      {item.link.label}
                    </Link>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </InfoLayout>
  );
}
