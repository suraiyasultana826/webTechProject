import React from "react";
import Link from "next/link";
import {
  BsCalendarWeek,
  BsGeoAltFill,
  BsPeopleFill,
  BsFacebook,
  BsInstagram,
  BsGithub,
  BsEnvelopeFill,
} from "react-icons/bs";
import InfoLayout, { cardClass } from "@/components/InfoLayout";
import { TeamMembers, Institution } from "@/Utils/TeamData";

const highlights = [
  {
    icon: BsCalendarWeek,
    title: "Week-Based Work",
    text: "Short contracts of one to four weeks with weekly or daily wages, so workers can find steady income season by season.",
  },
  {
    icon: BsGeoAltFill,
    title: "Built for Bangladesh",
    text: "Wages in Taka (৳), local job categories like farming, construction and electrical work, and a directory of Bangladeshi support organisations.",
  },
  {
    icon: BsPeopleFill,
    title: "Simple for Everyone",
    text: "Workers apply with a CV in a few steps and track every decision; employers post jobs and review applicants from one dashboard.",
  },
];

const initials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("");

export default function About() {
  return (
    <InfoLayout
      title="About KajKhoj"
      subtitle="KajKhoj (“work search”) is a job portal that connects local skilled and agricultural workers in Bangladesh with employers who need them."
    >
      <section className={`${cardClass} mb-10`}>
        <h2 className="text-2xl font-bold text-indigo-900 mb-3">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed">
          Farmhands, electricians, plumbers, carpenters and daily-wage labourers
          often find work only through word of mouth. KajKhoj gives them one
          place to discover nearby opportunities, apply with a CV, and hear back
          from employers, while giving farms, workshops and small businesses an
          easy way to hire reliable people for short, week-based contracts.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {highlights.map(({ icon: Icon, title, text }) => (
          <div key={title} className={cardClass}>
            <Icon className="text-3xl text-indigo-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{text}</p>
          </div>
        ))}
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-indigo-900 mb-6 text-center">
          Meet the Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TeamMembers.map((member) => (
            <div key={member.name} className={`${cardClass} flex flex-col items-center text-center`}>
              <div className="h-20 w-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold mb-3">
                {initials(member.name)}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
              <p className="text-sm text-gray-600">Student ID: {member.studentId}</p>
              <p className="text-sm text-gray-600 mb-3">
                {Institution.program} · {Institution.department}
              </p>
              <div className="flex gap-4 text-xl text-indigo-700">
                <a href={member.facebook} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on Facebook`}>
                  <BsFacebook />
                </a>
                <a href={member.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on Instagram`}>
                  <BsInstagram />
                </a>
                <a href={member.github} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on GitHub`}>
                  <BsGithub />
                </a>
                <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`}>
                  <BsEnvelopeFill />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="text-2xl font-bold text-indigo-900 mb-3">Academic Project</h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          KajKhoj was developed for the {Institution.course} course at the{" "}
          {Institution.department}, {Institution.faculty},{" "}
          {Institution.university}, {Institution.country}, under the
          supervision of {Institution.supervisors.join(" and ")}.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          It is a redesigned derivative of the open-source{" "}
          <a
            href="https://github.com/Devmangrani/JobSewa"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-700 underline"
          >
            JobSewa
          </a>{" "}
          project by Dev Mangrani, used under the Apache License 2.0.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg transition-all"
        >
          Get in Touch
        </Link>
      </section>
    </InfoLayout>
  );
}
