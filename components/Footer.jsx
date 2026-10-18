import React from "react";
import Link from "next/link";
import { BsFacebook, BsInstagram, BsGithub, BsEnvelopeFill } from "react-icons/bs";
import styles from "../styles/Homepage.module.css";
import { TeamMembers, Institution } from "@/Utils/TeamData";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerSection}>
          <h3>KajKhoj</h3>
          <img
            src="/kajkhoj_logo.svg"
            alt="KajKhoj Logo"
            className={styles.logo}
          />
          <p className={styles.footerTagline}>
            Web Technology Project
            <br />
            {Institution.department}, {Institution.university}
            <br />
            {Institution.country}
          </p>
        </div>

        <div className={styles.footerSection}>
          <h3>Quick Links</h3>
          <ul className={styles.quickLinks}>
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>Developed By</h3>
          {TeamMembers.map((member) => (
            <div key={member.name} className={styles.teamMember}>
              <p className={styles.memberName}>{member.name}</p>
              <div className={styles.socialLinks}>
                <a
                  href={member.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on Facebook`}
                  className={styles.iconLink}
                >
                  <BsFacebook size={20} />
                </a>
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on Instagram`}
                  className={styles.iconLink}
                >
                  <BsInstagram size={20} />
                </a>
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on GitHub`}
                  className={styles.iconLink}
                >
                  <BsGithub size={20} />
                </a>
                <a
                  href={`mailto:${member.email}`}
                  aria-label={`Email ${member.name}`}
                  className={styles.iconLink}
                >
                  <BsEnvelopeFill size={20} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bottomFooter}>
        <p>
          &copy; {new Date().getFullYear()} KajKhoj &middot; Built by{" "}
          {TeamMembers.map((member) => member.name).join(" & ")} &middot;{" "}
          {Institution.department}, BUP, {Institution.country}
        </p>
      </div>
    </footer>
  );
}
