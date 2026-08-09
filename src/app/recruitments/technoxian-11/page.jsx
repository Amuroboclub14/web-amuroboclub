"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Input } from "@heroui/input";
import { motion } from "framer-motion";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import ReCAPTCHAComponent from "../../components/ReCAPTCHA";
import Link from "next/link";

const courseOptions = ["B.Tech", "B.E", "M.Tech", "Other"];

const branchOptions = [
  "Computer Engineering",
  "Electronics Engineering",
  "Artificial Intelligence",
  "Chemical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Petrochemical Engineering",
  "Food Technology",
  "Other",
];

const yearOptions = ["First Year", "Second Year", "Third Year", "Fourth Year"];

/** Set to `false` when applications should close. */
const IS_TECHNOXIAN_RECRUITMENT_PORTAL_OPEN = true;

function formatSubmitFailureMessage(error) {
  const code = typeof error?.code === "string" ? error.code : "";
  const message = typeof error?.message === "string" ? error.message : "";

  let detail =
    "Something went wrong while submitting. Please try again in a moment.";
  if (code === "permission-denied") {
    detail =
      "The server rejected this submission (access rules). If you are an applicant, contact the team with the error code below—this is usually a configuration issue on our side.";
  } else if (code === "unavailable" || code === "deadline-exceeded") {
    detail =
      "We could not reach the database (network hiccup or service busy). Check your internet connection and try again.";
  } else if (code === "resource-exhausted") {
    detail =
      "The service is temporarily overloaded. Wait a short time and try again.";
  } else if (
    message &&
    /network|fetch|Failed to fetch|load failed/i.test(message)
  ) {
    detail =
      "A network error occurred. Try switching Wi‑Fi/mobile data, disable VPN, or try again when the connection is stable.";
  }

  const ref =
    code || (message ? message.split("\n")[0].slice(0, 120) : "unknown");
  return `${detail} If it keeps happening, share this code with the team: ${ref}`;
}

function TechnoxianPortalClosed() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto px-4 py-16 md:py-24"
        >
          <div className="text-center space-y-6 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-700/50 p-8 md:p-10 rounded-2xl shadow-2xl">
            <p className="text-sm font-mono uppercase tracking-widest text-orange-400">
              Applications closed
            </p>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
              Technoxian 11.0 Project Recruitment
            </h1>
            <p className="text-gray-300 font-mono text-base leading-relaxed">
              The application portal is now closed. Thank you to everyone who
              applied—your submissions are being reviewed.
            </p>
            <Link
              href="/projects"
              className="inline-block mt-2 text-orange-400 hover:text-orange-300 text-sm font-mono"
            >
              ← Back to Projects
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}

function TechnoxianRecruitmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    facultyNumber: "",
    enrollmentNumber: "",
    branch: "",
    branchOther: "",
    yearOfStudy: "",
    course: "",
    courseOther: "",
    contribution: "",
  });

  const updateField = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const isRequiredFilled = () => {
    const required = [
      "name",
      "email",
      "phone",
      "facultyNumber",
      "enrollmentNumber",
      "branch",
      "yearOfStudy",
      "course",
      "contribution",
    ];
    for (const key of required) {
      if (!formData[key]?.trim()) return false;
    }
    if (formData.course === "Other" && !formData.courseOther.trim()) return false;
    if (formData.branch === "Other" && !formData.branchOther.trim()) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!isRequiredFilled()) {
      setSubmitError("Please fill all required fields before submitting.");
      return;
    }

    if (!recaptchaToken) {
      setSubmitError("Please complete the reCAPTCHA verification.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "technoxian_11_project_recruitment"), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        facultyNumber: formData.facultyNumber.trim(),
        enrollmentNumber: formData.enrollmentNumber.trim(),
        branch: formData.branch,
        branchOther:
          formData.branch === "Other" ? formData.branchOther.trim() : null,
        yearOfStudy: formData.yearOfStudy,
        course: formData.course,
        courseOther:
          formData.course === "Other" ? formData.courseOther.trim() : null,
        contribution: formData.contribution.trim(),
        status: "pending",
        recaptchaToken,
        submittedTimestamp: Date.now(),
      });

      alert(
        "Application submitted successfully for Technoxian 11.0 Project Recruitment.",
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        facultyNumber: "",
        enrollmentNumber: "",
        branch: "",
        branchOther: "",
        yearOfStudy: "",
        course: "",
        courseOther: "",
        contribution: "",
      });
      setRecaptchaToken(null);
    } catch (error) {
      console.error("Error submitting Technoxian form:", error);
      setSubmitError(formatSubmitFailureMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "p-3 rounded-lg bg-gray-800/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200";
  const labelClass = "!font-mono text-[16px] font-medium text-gray-300";

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto px-4 py-12"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
              Technoxian 11.0 Project Recruitment
            </h1>
            <p className="text-gray-400">
              Apply to join AMURoboclub projects for Technoxian 11.0.
            </p>
            <Link
              href="/projects"
              className="inline-block mt-4 text-orange-400 hover:text-orange-300 text-sm"
            >
              ← Back to Projects
            </Link>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-700/50 p-6 md:p-8 rounded-2xl shadow-2xl"
          >
            <div className="space-y-6">
              <div className="border-l-4 border-orange-400 pl-4">
                <h2 className="text-lg font-semibold text-orange-400">
                  Basic Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>
                    Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={updateField("name")}
                    type="text"
                    placeholder="Your full name"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.email}
                    onChange={updateField("email")}
                    type="email"
                    placeholder="your@email.com"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={updateField("phone")}
                    type="tel"
                    placeholder="Mobile number"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>
                    Faculty Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.facultyNumber}
                    onChange={updateField("facultyNumber")}
                    type="text"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className={labelClass}>
                    Enrollment Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.enrollmentNumber}
                    onChange={updateField("enrollmentNumber")}
                    type="text"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-amber-400 pl-4">
                <h2 className="text-lg font-semibold text-amber-400">
                  Academic Details
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>
                    Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.course}
                    onChange={updateField("course")}
                    className={inputClass}
                  >
                    <option value="">Select Course</option>
                    {courseOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>
                    Branch of Study <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.branch}
                    onChange={updateField("branch")}
                    className={inputClass}
                  >
                    <option value="">Select Branch</option>
                    {branchOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                {formData.course === "Other" && (
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>
                      Specify Course <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.courseOther}
                      onChange={updateField("courseOther")}
                      type="text"
                      className={inputClass}
                    />
                  </div>
                )}
                {formData.branch === "Other" && (
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>
                      Specify Branch <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.branchOther}
                      onChange={updateField("branchOther")}
                      type="text"
                      className={inputClass}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className={labelClass}>
                    Year of Study <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.yearOfStudy}
                    onChange={updateField("yearOfStudy")}
                    className={inputClass}
                  >
                    <option value="">Select Year</option>
                    {yearOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-yellow-400 pl-4">
                <h2 className="text-lg font-semibold text-yellow-400">
                  Contribution
                </h2>
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass}>
                  How can you contribute to the team/projects? (one liner){" "}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.contribution}
                  onChange={updateField("contribution")}
                  type="text"
                  placeholder="e.g. Embedded systems and PCB design for robotics projects"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-amber-400 pl-4">
                <h3 className="text-base font-semibold text-amber-400">
                  Security Verification
                </h3>
              </div>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-4 text-center">
                  Please verify you are not a robot
                </p>
                <ReCAPTCHAComponent
                  onVerify={setRecaptchaToken}
                  onError={() => setRecaptchaToken(null)}
                />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <div className="w-full max-w-xl space-y-4">
                {submitError && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                    {submitError}
                  </div>
                )}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 rounded-xl text-white text-lg font-bold bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 transition-all duration-300 hover:from-yellow-400 hover:via-amber-400 hover:to-orange-400 hover:shadow-xl hover:shadow-orange-500/40 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[180px]"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}

export default function Technoxian11RecruitmentPage() {
  if (!IS_TECHNOXIAN_RECRUITMENT_PORTAL_OPEN) {
    return <TechnoxianPortalClosed />;
  }
  return <TechnoxianRecruitmentForm />;
}
