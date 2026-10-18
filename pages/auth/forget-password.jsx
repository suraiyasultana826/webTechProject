import NavBar from "@/components/NavBar";
import { forget_password, request_reset_otp } from "@/Services/auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgetPassword() {
  const Router = useRouter();

  const [step, setStep] = useState(1); // 1: Enter email & request OTP, 2: Enter OTP & new password
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError({ ...error, email: "Email field is required" });
      return;
    }

    setLoading(true);
    const res = await request_reset_otp(formData.email);
    setLoading(false);

    if (res.success) {
      toast.success(res.message);
      if (res.devOtp) {
        toast.info(`Development Demo Code: ${res.devOtp}`, { autoClose: 10000 });
        setFormData((prev) => ({ ...prev, otp: res.devOtp }));
      }
      setStep(2);
    } else {
      toast.error(res.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      setError({ ...error, otp: "Verification code is required" });
      return;
    }
    if (!formData.password) {
      setError({ ...error, password: "New password is required" });
      return;
    }
    if (formData.password.length < 8) {
      setError({ ...error, password: "Password must be at least 8 characters" });
      return;
    }
    if (!formData.confirmPassword) {
      setError({
        ...error,
        confirmPassword: "Confirm password is required",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password and Confirm Password do not match");
      return;
    }

    setLoading(true);
    const res = await forget_password(formData);
    setLoading(false);

    if (res.success) {
      toast.success(res.message);
      setTimeout(() => {
        Router.push("/auth/login");
      }, 1500);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <NavBar />
      <section className="bg-indigo-600 min-h-screen text-center flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-2xl">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            {step === 1 ? "Reset Password" : "Enter Verification Code"}
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {step === 1
              ? "Enter your registered email address and we'll send you a secure verification code."
              : `Enter the 6-digit code sent to ${formData.email} and your new password.`}
          </p>

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4 text-left">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Your Email
                </label>
                <input
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  value={formData.email}
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-sky-700 block w-full p-2.5"
                  placeholder="name@company.com"
                  required
                />
                {error.email && (
                  <p className="text-sm text-red-500 mt-1">{error.email}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all disabled:opacity-50"
              >
                {loading ? "Sending Code..." : "Send Verification Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4 text-left">
              <div>
                <label
                  htmlFor="otp"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  6-Digit Verification Code (OTP)
                </label>
                <input
                  onChange={(e) =>
                    setFormData({ ...formData, otp: e.target.value })
                  }
                  value={formData.otp}
                  type="text"
                  name="otp"
                  id="otp"
                  maxLength={6}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-sky-700 block w-full p-2.5 font-mono tracking-widest text-center text-lg"
                  placeholder="123456"
                  required
                />
                {error.otp && (
                  <p className="text-sm text-red-500 mt-1">{error.otp}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  New Password
                </label>
                <input
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-sky-700 block w-full p-2.5"
                  required
                />
                {error.password && (
                  <p className="text-sm text-red-500 mt-1">{error.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Confirm New Password
                </label>
                <input
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-sky-700 block w-full p-2.5"
                  required
                />
                {error.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {error.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Reset Password"}
                </button>
              </div>
            </form>
          )}
        </div>
        <ToastContainer />
      </section>
    </>
  );
}
