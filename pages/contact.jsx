import React, { useState } from "react";
import {
  BsEnvelopeFill,
  BsTelephoneFill,
  BsGeoAltFill,
  BsFacebook,
  BsInstagram,
  BsGithub,
} from "react-icons/bs";
import InfoLayout, { cardClass } from "@/components/InfoLayout";
import { TeamMembers, Institution, toTelLink } from "@/Utils/TeamData";

const inputClass =
  "w-full border border-gray-300 rounded-lg p-3 bg-white bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-indigo-500";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  // There is no mail server behind this demo, so the form opens the visitor's
  // own email app with the message addressed to both team members.
  const handleSubmit = (e) => {
    e.preventDefault();
    const to = TeamMembers.map((member) => member.email).join(",");
    const body = `${form.message}\n\nFrom: ${form.name} (${form.email})`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(
      form.subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <InfoLayout
      title="Contact Us"
      subtitle="Questions, feedback or a password reset code? Reach the KajKhoj team directly."
    >
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {TeamMembers.map((member) => (
          <div key={member.name} className={cardClass}>
            <h2 className="text-xl font-bold text-indigo-900 mb-4">{member.name}</h2>
            <ul className="space-y-3 text-gray-800">
              <li className="flex items-center gap-3 min-w-0">
                <BsEnvelopeFill className="text-indigo-600 shrink-0" />
                <a href={`mailto:${member.email}`} className="hover:underline break-all">
                  {member.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <BsTelephoneFill className="text-indigo-600 shrink-0" />
                <a href={toTelLink(member.phone)} className="hover:underline">
                  {member.phone}
                </a>
              </li>
            </ul>
            <div className="flex gap-4 text-xl text-indigo-700 mt-4">
              <a href={member.facebook} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on Facebook`}>
                <BsFacebook />
              </a>
              <a href={member.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on Instagram`}>
                <BsInstagram />
              </a>
              <a href={member.github} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on GitHub`}>
                <BsGithub />
              </a>
            </div>
          </div>
        ))}
      </section>

      <section className={`${cardClass} mb-10 flex items-start gap-3`}>
        <BsGeoAltFill className="text-2xl text-indigo-600 shrink-0 mt-1" />
        <div>
          <h2 className="text-lg font-bold text-indigo-900">Where to find us</h2>
          <p className="text-gray-700">
            {Institution.department}, {Institution.faculty}
            <br />
            {Institution.university}
            <br />
            {Institution.address}, {Institution.country}
          </p>
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="text-2xl font-bold text-indigo-900 mb-1">Send us a message</h2>
        <p className="text-sm text-gray-600 mb-5">
          This opens your email app with the message addressed to both team members.
        </p>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input id="contact-name" required value={form.name} onChange={update("name")} className={inputClass} placeholder="Enter your name" />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
              Your Email
            </label>
            <input id="contact-email" type="email" required value={form.email} onChange={update("email")} className={inputClass} placeholder="name@example.com" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input id="contact-subject" required value={form.subject} onChange={update("subject")} className={inputClass} placeholder="What is this about?" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea id="contact-message" required rows="5" value={form.message} onChange={update("message")} className={inputClass} placeholder="Write your message" />
          </div>
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition-all"
            >
              Open in Email App
            </button>
          </div>
        </form>
      </section>
    </InfoLayout>
  );
}
