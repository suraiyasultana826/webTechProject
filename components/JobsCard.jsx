import React from "react";
import Image from "next/image";
import { BsDot } from "react-icons/bs";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useRouter } from "next/router";

export default function JobsCard({ job, posted }) {
  const router = useRouter();

  const salaryDisplay = job?.salary_period
    ? `৳${job?.salary} / ${job?.salary_period.replace('per ', '')}`
    : job?.job_type === "week-based" || job?.job_type === "weekly"
    ? `৳${job?.salary} / week`
    : `৳${job?.salary} / month`;

  return (
    <div
      key={job._id}
      className="mx-auto h-full w-full transition-all duration-300 hover:shadow-2xl shadow-md p-4 rounded-xl bg-white bg-opacity-90 flex flex-col justify-between border border-gray-100"
    >
      <div>
        <div className="flex items-center space-x-3 mb-3">
          <Image
            width={60}
            height={60}
            className="rounded-full object-cover border-2 border-indigo-100"
            src={
              job?.user?.image ||
              "https://xsgames.co/randomusers/avatar.php?g=male"
            }
            alt={job?.company || "Company logo"}
          />
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              {job?.title}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-700 font-medium">
              {job?.company}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 capitalize">
            {job?.job_type || "Contract"}
          </span>
          {job?.job_duration && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              📅 {job.job_duration}
            </span>
          )}
          {job?.job_category && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {job.job_category}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="space-y-1 text-sm text-gray-600 mb-4 bg-gray-50 p-2.5 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Compensation:</span>
            <span className="font-bold text-gray-900 text-sm">
              {salaryDisplay}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Deadline:</span>
            <span className="font-medium text-gray-800 text-xs">
              {job?.job_deadline
                ? new Date(job.job_deadline).toLocaleDateString("en-GB")
                : "Open"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2">
        {posted ? (
          <button
            onClick={() => router.push(`/frontend/detailPostedJob/${job?._id}`)}
            className="w-full py-2 px-3 border border-indigo-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-indigo-600 hover:text-white text-indigo-700 font-semibold text-sm shadow-sm"
          >
            Review Applications <AiOutlineArrowRight className="ml-2 text-base" />
          </button>
        ) : (
          <button
            onClick={() => router.push(`/frontend/jobDetails/${job?._id}`)}
            className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center transition-all duration-300 font-semibold text-sm shadow-sm"
          >
            View Opportunity Details <AiOutlineArrowRight className="ml-2 text-base" />
          </button>
        )}
      </div>
    </div>
  );
}
