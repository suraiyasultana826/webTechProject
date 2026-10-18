import NavBar from "@/components/NavBar";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setJobData } from "@/Utils/JobSlice";
import JobsCard from "@/components/JobsCard";
import useSWR from "swr";
import { toast } from "react-toastify";
import { BiSearch } from "react-icons/bi";
import { motion } from "framer-motion";
import { get_job } from "@/Services/job";
import styles from "../../styles/Homepage.module.css";

export default function DisplayJobs() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [filteredData, setFilteredData] = useState([]);
  const JobData = useSelector((state) => state?.Job?.JobData);

  const { data, error, isLoading } = useSWR("/getAllJobs", () => get_job());

  useEffect(() => {
    if (data?.data) {
      dispatch(setJobData(data.data));
    }
  }, [data, dispatch]);

  if (error) toast.error("Failed to load jobs");

  useEffect(() => {
    let list = Array.isArray(JobData) ? JobData : [];

    // Filter by type
    if (selectedType !== "all") {
      list = list.filter((job) =>
        job?.job_type?.toLowerCase().includes(selectedType.toLowerCase())
      );
    }

    // Filter by search query
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      list = list.filter(
        (job) =>
          job?.title?.toLowerCase().includes(q) ||
          job?.company?.toLowerCase().includes(q) ||
          job?.job_category?.toLowerCase().includes(q) ||
          job?.job_duration?.toLowerCase().includes(q) ||
          job?.description?.toLowerCase().includes(q)
      );
    }

    setFilteredData(list);
  }, [search, selectedType, JobData]);

  const filterTabs = [
    { id: "all", label: "All Opportunities" },
    { id: "week-based", label: "📅 Week-Based" },
    { id: "daily", label: "⚡ Daily Wage" },
    { id: "fulltime", label: "💼 Full Time" },
    { id: "contract", label: "📝 Contract" },
  ];

  return (
    <>
      <NavBar />
      <div className="w-full min-h-screen bg-gradient-to-r from-white via-indigo-200 to-sky-500">
        <div className="w-full py-20 flex items-center md:px-8 px-2 justify-center flex-col">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl mt-20 text-center text-indigo-800 leading-snug font-semibold mb-2 md:text-2xl lg:text-4xl"
          >
            Available Opportunities
          </motion.h1>
          <p className="text-gray-600 text-sm mb-6 text-center">
            Explore week-based contracts, daily wage, and skilled positions
          </p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center items-center w-full max-w-md border-b-2 border-sky-700 mb-6 bg-white bg-opacity-70 rounded-t-lg px-3 py-1 shadow-sm"
          >
            <BiSearch className="text-2xl text-sky-700 mr-2" />
            <input
              className="py-2 px-2 outline-none flex-1 bg-transparent text-gray-800"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, category, company, or duration..."
            />
          </motion.div>

          {/* Week-based filter tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 mb-8 max-w-2xl px-4"
          >
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-200 ${
                  selectedType === tab.id
                    ? "bg-indigo-600 text-white shadow-md scale-105"
                    : "bg-white bg-opacity-80 text-gray-700 hover:bg-indigo-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Jobs grid */}
          <motion.div
            className={styles.jobsGrid}
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
          >
            {Array.isArray(filteredData) && filteredData.length > 0 ? (
              filteredData.map((job, index) => (
                <motion.div
                  key={job?._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1],
                      },
                    },
                  }}
                  className={styles.jobCardWrapper}
                  style={{ "--animation-order": index }}
                >
                  <JobsCard job={job} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="col-span-full text-center py-12 bg-white bg-opacity-60 rounded-xl p-8"
              >
                <p className="text-gray-700 font-semibold mb-1">
                  No opportunities found matching your criteria.
                </p>
                <p className="text-gray-500 text-sm">
                  Try adjusting your search terms or selecting &quot;All Opportunities&quot;.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
