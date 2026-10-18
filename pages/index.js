import Intro from "@/components/Intro";
import NavBar from "@/components/NavBar";
import Head from "next/head";
import { useDispatch } from "react-redux";
import { setUserToken, setUserData } from "@/Utils/UserSlice";
import { useEffect } from "react";
import Cookies from "js-cookie";
import useSWR from "swr";
import { get_job } from "@/Services/job";
import { setJobData } from "@/Utils/JobSlice";
import { InfinitySpin } from "react-loader-spinner";

export default function Home() {
  const dispatch = useDispatch();
  const token = Cookies.get("token");

  // Call get_job() without arguments: SWR would otherwise pass the key string as
  // `params`, and "/getAllJobs".search (String.prototype.search) becomes a filter.
  const { data, error, isLoading } = useSWR("/getAllJobs", () => get_job());

  useEffect(() => {
    if (data) dispatch(setJobData(data?.data));
  }, [data, dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(setUserToken(token));
    } else {
      localStorage.removeItem("user");
      dispatch(setUserData(null));
    }
  }, [token, dispatch]);

  return (
    <>
      <Head>
        <title>KajKhoj</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Search and apply for week-based, daily-wage and local jobs across Bangladesh. KajKhoj connects farmhands, electricians, plumbers and other skilled workers with employers."
        />
        <meta
          name="keywords"
          content="job portal, job search, Bangladesh jobs, week-based jobs, daily wage, agricultural jobs, local workers, employment, hiring, recruitment"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Mutasim Billah, Suraiya Sultana" />
        <meta
          property="og:title"
          content="KajKhoj | Find Local & Week-Based Jobs in Bangladesh"
        />
        <meta
          name="twitter:title"
          content="KajKhoj | Find Local & Week-Based Jobs in Bangladesh"
        />
        <meta name="language" content="en-BD" />
      </Head>

      {isLoading ? (
        <div className="bg-gray w-full h-screen flex items-center flex-col justify-center">
          <InfinitySpin width="200" color="#2f7d4f" />
          <p className="text-xs uppercase">Loading Resources Hold Tight...</p>
        </div>
      ) : (
        <>
          <NavBar />
          <div className="w-full min-h-screen bg-gradient-to-r from-white via-indigo-200 to-sky-500 text-black">
            <Intro />
          </div>
        </>
      )}
    </>
  );
}
