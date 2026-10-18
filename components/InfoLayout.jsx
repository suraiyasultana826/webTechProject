import React from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

// Shared shell for the static information pages (About, Services, Contact, FAQ)
export default function InfoLayout({ title, subtitle, children }) {
  return (
    <>
      <Head>
        <title>{title.includes("KajKhoj") ? title : `${title} | KajKhoj`}</title>
      </Head>
      <NavBar />
      <div className="w-full min-h-screen bg-gradient-to-r from-white via-indigo-200 to-sky-500">
        <div className="w-full max-w-5xl mx-auto px-4 pt-32 pb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl text-center text-indigo-900 font-bold mb-3"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center text-gray-700 mb-10 max-w-2xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export const cardClass =
  "bg-white bg-opacity-70 backdrop-blur-sm rounded-xl shadow-lg p-6";
