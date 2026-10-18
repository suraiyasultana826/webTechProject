import NavBar from "@/components/NavBar";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { GoLocation } from "react-icons/go";
import { MdCategory, MdEmail } from "react-icons/md";
import { BsBriefcaseFill, BsFillBookmarkCheckFill } from "react-icons/bs";
import { AiOutlineArrowRight, AiOutlineDollarCircle } from "react-icons/ai";
import { RiUserSearchFill } from "react-icons/ri";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import { HiOutlineStar } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { get_job, get_specified_job } from "@/Services/job";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InfinitySpin } from "react-loader-spinner";
import useSWR from "swr";
import { book_mark_job, delete_book_mark_job, check_job_bookmarked } from "@/Services/job/bookmark";
import { BsBookmark, BsBookmarkCheckFill } from "react-icons/bs";

export default function JobDetails() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const user = useSelector((state) => state?.User?.userData);
  const [JobDetails, setJobDetails] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { data, error, isLoading } = useSWR(id ? `/get-specified-job-${id}` : null, () =>
    get_specified_job(id)
  );

  useEffect(() => {
    if (data?.data) {
      setJobDetails(data.data);
    }
  }, [data]);

  const category = JobDetails?.job_category;
  const { data: relatedData } = useSWR(category ? `/related-jobs-${category}` : null, () =>
    get_job({ category })
  );
  const relatedJobs = (relatedData?.data || []).filter((item) => item?._id !== id);

  useEffect(() => {
    if (user?._id && id) {
      check_job_bookmarked(user._id, id).then((res) => {
        if (res?.bookmarked) setIsBookmarked(true);
      });
    }
  }, [user, id]);

  const handleApply = () => {
    if (!user) return toast.error("Please Login First");
    router.push(`/frontend/applyJob/${id}`);
  };

  const handleBookMarkToggle = async () => {
    if (!user) return toast.error("Please Login First");

    if (isBookmarked) {
      const res = await delete_book_mark_job({ user: user._id, job: JobDetails?._id });
      if (res?.success) {
        setIsBookmarked(false);
        toast.info("Removed from saved bookmarks");
      } else {
        toast.error(res?.message || "Failed to remove bookmark");
      }
    } else {
      const data = { user: user?._id, job: JobDetails?._id };
      const res = await book_mark_job(data);
      if (res?.success) {
        setIsBookmarked(true);
        toast.success(res.message);
      } else {
        toast.error(res?.message || "Failed to bookmark job");
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="bg-gray w-full h-screen flex items-center flex-col justify-center">
          <InfinitySpin width="200" color="#2f7d4f" />
          <p className="text-xs uppercase">Loading Resources Hold Tight...</p>
        </div>
      ) : (
        <>
          <ToastContainer />
          <NavBar />
          <div className="w-full  py-20 flex items-center md:px-8 px-2  justify-center flex-col  ">
            <div className="w-full h-40 bg-gray-50 text-sky-700 font-bold flex items-center justify-center flex-col">
              <h1 className="text-3xl">Job Details</h1>
            </div>
            <div className="flex items-center  justify-center w-full py-10">
              <div className="flex w-full px-8 md:px-20 items-start md:flex-row flex-col md:justify-between justify-center">
                <div className="flex mb-1 items-center justify-center">
                  <Image
                    src={
                      JobDetails?.user?.image ||
                      "https://xsgames.co/randomusers/avatar.php?g=male"
                    }
                    alt="no-image"
                    className="rounded-full mb-2"
                    width={100}
                    height={100}
                  />
                  <div className="px-4 mx-2 flex flex-col items-start justify-center">
                    <p className="font-semibold text-base mb-1">
                      {JobDetails?.title}{" "}
                    </p>
                    <p className=" text-sm text-gray-800 mb-1">
                      {JobDetails?.company}
                    </p>
                  </div>
                </div>
                <div className="md:px-4 mb-1 px-2 md:mx-2 flex flex-col items-start justify-center">
                  <div className="flex items-center justify-center mb-1">
                    <FaUserAstronaut className="text-xs font-semibold text-sky-700" />
                    <p className="font-semibold text-base mx-1 w-24 shrink-0">
                      Job Poster{" "}
                    </p>
                    <p className=" text-sm text-gray-800 mx-1 min-w-0 [overflow-wrap:anywhere]">
                      {JobDetails?.user?.name}
                    </p>
                  </div>
                  <div className="flex items-center justify-center mb-1">
                    <MdEmail className="text-xs font-semibold text-sky-700" />
                    <p className="font-semibold text-base mx-1 w-24 shrink-0">Email </p>
                    <p className=" text-sm text-gray-800 mx-1 min-w-0 [overflow-wrap:anywhere]">
                      {JobDetails?.user?.email}
                    </p>
                  </div>
                </div>
                <div className="md:px-4 mb-1 px-2 md:mx-2 flex flex-col items-start justify-center">
                  <div className="flex items-center justify-center mb-1">
                    <GoLocation className="text-xs font-semibold text-sky-700" />
                    <p className="font-semibold text-base mx-1 w-24 shrink-0">
                      Location{" "}
                    </p>
                    <p className=" text-sm text-gray-800 mx-1">Bangladesh</p>
                  </div>
                  <div className="flex items-center justify-center mb-1">
                    <MdCategory className="text-xs font-semibold text-sky-700" />
                    <p className="font-semibold text-base mx-1 w-24 shrink-0">
                      Category{" "}
                    </p>
                    <p className=" text-sm text-gray-800 mx-1 ">
                      {JobDetails?.job_category}
                    </p>
                  </div>
                </div>
                <div className="md:px-4 mb-1 px-2 md:mx-2 flex flex-col items-start justify-center">
                  <div className="flex items-center justify-center mb-1">
                    <BsBriefcaseFill className="text-xs font-semibold text-sky-700" />
                    <p className="font-semibold text-base mx-1 w-24 shrink-0">
                      Job Type{" "}
                    </p>
                    <p className="text-sm text-gray-800 mx-1 capitalize">
                      {JobDetails?.job_type}
                    </p>
                  </div>
                  <div className="flex items-center justify-center mb-1">
                    <AiOutlineDollarCircle className="text-xs font-semibold text-sky-700" />
                    <p className="font-semibold text-base mx-1 w-24 shrink-0">
                      Salary{" "}
                    </p>
                    <p className="text-sm text-gray-800 mx-1">
                      ৳ {JobDetails?.salary} {JobDetails?.salary_period ? `(${JobDetails.salary_period})` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  {JobDetails?.user?.email === user?.email ? (
                    <p className="text-xs text-red-500">
                      Unable to apply to your own job posting
                    </p>
                  ) : (
                    <div className="flex items-center justify-center">
                      <button
                        onClick={handleBookMarkToggle}
                        title={isBookmarked ? "Remove Bookmark" : "Save Job to Bookmarks"}
                        className="p-2 text-2xl mx-2 rounded-full border border-sky-700 text-sky-700 hover:bg-sky-50 transition-all"
                      >
                        {isBookmarked ? (
                          <BsBookmarkCheckFill className="text-indigo-600" />
                        ) : (
                          <BsBookmark className="text-gray-600" />
                        )}
                      </button>
                      <button
                        onClick={handleApply}
                        className="md:px-6 md:py-3 px-3 py-2 mt-2 md:mt-0 bg-indigo-500 rounded text-base tracking-widest uppercase transition-all duration-700 hover:bg-indigo-900 text-white font-medium"
                      >
                        Apply Position
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full md:px-4 py-2 flex items-center md:items-start md:flex-row flex-col justify-start md:justify-center">
              <div className="md:w-8/12 w-full md:px-4 py-8 flex flex-col items-center content-start justify-center ">
                <h1 className="text-center lg:text-2xl font-semibold text-xl mb-4 uppercase border-b-2 border-sky-700 py-2">
                  Job Description
                </h1>
                <p className="px-4">{JobDetails?.description}</p>
              </div>
              <div className="md:w-4/12 w-full py-8 px-4 md:px-10">
                <h1 className=" text-2xl font-semibold mb-2">Job Summary</h1>
                <div className="flex items-center justify-start mb-3">
                  <RiUserSearchFill className="text-base font-semibold text-sky-700" />
                  <p className="font-semibold text-base mx-1  w-40">
                    Total Vacancies{" "}
                  </p>
                  <p className=" text-sm text-gray-800 mx-1">
                    {JobDetails?.job_vacancy}
                  </p>
                </div>
                <div className="flex items-center justify-start mb-3">
                  <BsBriefcaseFill className="text-base font-semibold text-sky-700" />
                  <p className="font-semibold text-base mx-1 w-40">Contract Duration</p>
                  <p className="text-sm font-semibold text-indigo-700 mx-1">
                    {JobDetails?.job_duration || "1 Week"}
                  </p>
                </div>
                <div className="flex items-center justify-start mb-3">
                  <BsFillCalendar2DateFill className="text-base font-semibold text-sky-700" />
                  <p className="font-semibold text-base mx-1 w-40">Dead Line</p>
                  <p className=" text-sm text-gray-800 mx-1">
                    {new Date(`${JobDetails?.job_deadline}`).toLocaleDateString(
                      "en-GB"
                    )}
                  </p>
                </div>
                <div className="flex items-center justify-start mb-3">
                  <HiOutlineStar className="text-base font-semibold text-sky-700" />
                  <p className="font-semibold text-base mx-1 w-40">
                    Experience Required
                  </p>
                  <p className=" text-sm text-gray-800 mx-1">
                    {JobDetails?.job_experience}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full px-2 md:px-8 mb-2 flex flex-col">
              <h1 className="text-xl font-semibold lg:text-2xl w-36">
                Related Jobs
              </h1>
              <div className="md:px-8 px-2 md:mx-4 flex flex-wrap items-center justify-center">
                {/* card */}

                {relatedJobs.length === 0 ? (
                  <>
                    <div className="md:w-96 w-full py-3 mx-4 my-2 flex items-center md:items-start px-6 justify-start md:justify-center flex-col rounded bg-gray-50">
                      <p className="text-xs font-semibold text-red-600 uppercase">
                        No Other similar Jobs Available ...
                      </p>
                    </div>
                  </>
                ) : (
                  relatedJobs.map((item) => {
                    return (
                      <div
                        key={item?._id}
                        className="md:w-96 w-full py-3 mx-4 my-2 flex items-center md:items-start px-6 justify-start md:justify-center flex-col rounded bg-gray-50"
                      >
                        <div className="mb-4 flex px-4 flex-col md:flex-row items-center justify-start py-2 ">
                          <Image
                            width={70}
                            height={70}
                            className="flex rounded-full mb-4 md:mb-0"
                            src={
                              item?.user?.image ||
                              "https://xsgames.co/randomusers/avatar.php?g=male"
                            }
                            alt="no image"
                          />
                          <div className="flex flex-col w-full mx-2 px-2">
                            <h1 className="text-base md:text-left text-center  md:text-2xl font-semibold">
                              {item?.title}
                            </h1>
                            <p className="text-xs md:text-left text-center sm:text-sm md:text-base text-gray-800">
                              {item?.company}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col px-1 md:px-4 py-6 items-start justify-center">
                          <div className="flex px-1 md:px-4 items-center justify-start mb-2">
                            <BsBriefcaseFill className="text-base font-semibold text-sky-700" />
                            <p className="font-semibold text-xs md:text-base mx-1 w-28">
                              Job Type{" "}
                            </p>
                            <p className="text-sm text-gray-800 mx-1 capitalize">
                              {item?.job_type}
                            </p>
                          </div>
                          <div className="flex px-1 md:px-4 items-center justify-center mb-2">
                            <AiOutlineDollarCircle className="text-base font-semibold text-sky-700" />
                            <p className="font-semibold text-xs md:text-base mx-1 w-28">
                              Salary{" "}
                            </p>
                            <p className=" text-sm text-gray-800 mx-1">
                              ৳ {item?.salary}
                            </p>
                          </div>
                          <div className="flex px-1 md:px-4 items-center justify-center mb-2">
                            <RiUserSearchFill className="text-base font-semibold text-sky-700" />
                            <p className="font-semibold text-xs md:text-base mx-1 w-28">
                              Total Vacancies{" "}
                            </p>
                            <p className=" text-sm text-gray-800 mx-1">
                              {item?.job_vacancy}
                            </p>
                          </div>
                          <div className="flex px-1 md:px-4 items-center justify-center mb-2">
                            <BsFillCalendar2DateFill className="text-base font-semibold text-sky-700" />
                            <p className="font-semibold text-xs md:text-base mx-1 w-28">
                              Dead Line
                            </p>
                            <p className=" text-xs text-gray-800 mx-1">
                              {new Date(
                                `${item?.job_deadline}`
                              ).toLocaleDateString("en-GB")}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            router.push(`/frontend/jobDetails/${item?._id}`)
                          }
                          className="mx-6 my-2 py-2 px-4  border border-sky-700 uppercase  rounded flex items-center justify-center transition-all duration-700 hover:bg-indigo-600 hover:text-white text-sky-700 font-semibold"
                        >
                          View Detail
                          <AiOutlineArrowRight className="mx-2 text-xl" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
