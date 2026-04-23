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

const postOptions = [
  "Coordinator",
  "PG Representative",
  "Joint Coordinator",
  "App Developer",
  "Web Developer",
  "PR Team",
  "Volunteer",
];

export default function CoreTeamRecruitment2026Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    facultyNumber: "",
    enrollmentNumber: "",
    course: "",
    courseOther: "",
    branch: "",
    branchOther: "",
    yearOfStudy: "",
    mobileNumber: "",
    postApplied: "",
    wasRegisteredMember: "",
    residencyStatus: "",
    wasCoreTeamMember: "",
    contributionStatement: "",
    involvedInOtherClub: "",
    otherClubDetails: "",
    priorExperience: "",
    idProofShareableLink: "",
    resumeShareableLink: "",
  });

  const updateField = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validateUrl = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const getPostEligibilityError = () => {
    if (formData.postApplied === "Coordinator" && formData.yearOfStudy !== "Fourth Year") {
      return "Coordinator post is only for students who will be in Final Year in session 2026-27.";
    }

    if (
      formData.postApplied === "Joint Coordinator" &&
      (formData.yearOfStudy === "First Year" || formData.yearOfStudy === "Second Year")
    ) {
      return "Joint Coordinator post is only for students in Third Year or above.";
    }

    if (formData.postApplied === "PG Representative" && formData.course !== "M.Tech") {
      return "PG Representative post is only for M.Tech students.";
    }

    return "";
  };

  const isRequiredFilled = () => {
    const requiredFields = [
      "name",
      "email",
      "facultyNumber",
      "enrollmentNumber",
      "course",
      "branch",
      "yearOfStudy",
      "mobileNumber",
      "postApplied",
      "wasRegisteredMember",
      "residencyStatus",
      "wasCoreTeamMember",
      "contributionStatement",
      "involvedInOtherClub",
      "priorExperience",
      "idProofShareableLink",
      "resumeShareableLink",
    ];

    for (const key of requiredFields) {
      if (!formData[key]?.trim()) return false;
    }

    if (formData.course === "Other" && !formData.courseOther.trim()) return false;
    if (formData.branch === "Other" && !formData.branchOther.trim()) return false;
    if (formData.involvedInOtherClub === "Yes" && !formData.otherClubDetails.trim()) return false;

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!isRequiredFilled()) {
      setSubmitError("Please fill all required fields before submitting.");
      return;
    }

    if (formData.contributionStatement.trim().split(/\s+/).length > 250) {
      setSubmitError("Contribution statement must be within 250 words.");
      return;
    }

    const eligibilityError = getPostEligibilityError();
    if (eligibilityError) {
      setSubmitError(eligibilityError);
      return;
    }

    if (!validateUrl(formData.idProofShareableLink) || !validateUrl(formData.resumeShareableLink)) {
      setSubmitError("Please enter valid shareable links (http/https) for both documents.");
      return;
    }

    if (!recaptchaToken) {
      setSubmitError("Please complete the reCAPTCHA verification.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "core_team_recruitment_2026_27"), {
        ...formData,
        courseOther: formData.course === "Other" ? formData.courseOther.trim() : null,
        branchOther: formData.branch === "Other" ? formData.branchOther.trim() : null,
        otherClubDetails:
          formData.involvedInOtherClub === "Yes" ? formData.otherClubDetails.trim() : null,
        contributionStatement: formData.contributionStatement.trim(),
        recaptchaToken,
        submittedTimestamp: Date.now(),
      });

      alert("Application submitted successfully for AMURoboclub Core Team Recruitment 2026-27.");
      setFormData({
        name: "",
        email: "",
        facultyNumber: "",
        enrollmentNumber: "",
        course: "",
        courseOther: "",
        branch: "",
        branchOther: "",
        yearOfStudy: "",
        mobileNumber: "",
        postApplied: "",
        wasRegisteredMember: "",
        residencyStatus: "",
        wasCoreTeamMember: "",
        contributionStatement: "",
        involvedInOtherClub: "",
        otherClubDetails: "",
        priorExperience: "",
        idProofShareableLink: "",
        resumeShareableLink: "",
      });
      setRecaptchaToken(null);
    } catch (error) {
      console.error("Error submitting recruitment form:", error);
      setSubmitError("Something went wrong while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "p-3 rounded-lg bg-gray-800/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200";
  const labelClass = "!font-mono text-[16px] font-medium text-gray-300";

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto px-4 py-12"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Core Team Recruitment 2026-27
            </h1>
            <p className="text-gray-400">
              AMURoboclub core-team application form for session 2026-27.
            </p>
            <Link href="/team" className="inline-block mt-4 text-cyan-400 hover:text-cyan-300 text-sm">
              ← Back to Team
            </Link>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-700/50 p-6 md:p-8 rounded-2xl shadow-2xl"
          >
            <div className="space-y-6">
              <div className="border-l-4 border-cyan-400 pl-4">
                <h2 className="text-lg font-semibold text-cyan-400">Basic Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Name <span className="text-red-500">*</span></label>
                  <Input value={formData.name} onChange={updateField("name")} type="text" className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                  <Input value={formData.email} onChange={updateField("email")} type="email" className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Faculty Number <span className="text-red-500">*</span></label>
                  <Input value={formData.facultyNumber} onChange={updateField("facultyNumber")} type="text" className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Enrollment Number <span className="text-red-500">*</span></label>
                  <Input value={formData.enrollmentNumber} onChange={updateField("enrollmentNumber")} type="text" className={inputClass} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-emerald-400 pl-4">
                <h2 className="text-lg font-semibold text-emerald-400">Academic Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Course <span className="text-red-500">*</span></label>
                  <select value={formData.course} onChange={updateField("course")} className={inputClass}>
                    <option value="">Select Course</option>
                    {courseOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Branch of Study <span className="text-red-500">*</span></label>
                  <select value={formData.branch} onChange={updateField("branch")} className={inputClass}>
                    <option value="">Select Branch</option>
                    {branchOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                {formData.course === "Other" && (
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Specify Course <span className="text-red-500">*</span></label>
                    <Input value={formData.courseOther} onChange={updateField("courseOther")} type="text" className={inputClass} />
                  </div>
                )}
                {formData.branch === "Other" && (
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Specify Branch <span className="text-red-500">*</span></label>
                    <Input value={formData.branchOther} onChange={updateField("branchOther")} type="text" className={inputClass} />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Year of Study for Session 2026-27 <span className="text-red-500">*</span></label>
                  <select value={formData.yearOfStudy} onChange={updateField("yearOfStudy")} className={inputClass}>
                    <option value="">Select Year</option>
                    {yearOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Mobile Number <span className="text-red-500">*</span></label>
                  <Input value={formData.mobileNumber} onChange={updateField("mobileNumber")} type="text" className={inputClass} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-teal-400 pl-4">
                <h2 className="text-lg font-semibold text-teal-400">Application Details</h2>
              </div>
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm">
                Note: For session 2026-27, only Final Year students are eligible for Coordinator, only Third Year or above are eligible for Joint Coordinator, and only M.Tech students are eligible for PG Representative.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Post Applied <span className="text-red-500">*</span></label>
                  <select value={formData.postApplied} onChange={updateField("postApplied")} className={inputClass}>
                    <option value="">Select Post</option>
                    {postOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Were you a registered member in session 2025-26? <span className="text-red-500">*</span></label>
                  <select value={formData.wasRegisteredMember} onChange={updateField("wasRegisteredMember")} className={inputClass}>
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Hosteler or Day Scholar? <span className="text-red-500">*</span></label>
                  <select value={formData.residencyStatus} onChange={updateField("residencyStatus")} className={inputClass}>
                    <option value="">Select</option>
                    <option value="Hosteler">Hosteler</option>
                    <option value="Day Scholar">Day Scholar</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Were you a core-team member in session 2025-26? <span className="text-red-500">*</span></label>
                  <select value={formData.wasCoreTeamMember} onChange={updateField("wasCoreTeamMember")} className={inputClass}>
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass}>How can you contribute to the team? (Max 250 words) <span className="text-red-500">*</span></label>
                <textarea
                  value={formData.contributionStatement}
                  onChange={updateField("contributionStatement")}
                  rows={5}
                  className={`${inputClass} resize-y min-h-[120px]`}
                  placeholder="Describe your contribution..."
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Are you involved with any other club currently? <span className="text-red-500">*</span></label>
                <select value={formData.involvedInOtherClub} onChange={updateField("involvedInOtherClub")} className={inputClass}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              {formData.involvedInOtherClub === "Yes" && (
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Mention the club name and explain your role <span className="text-red-500">*</span></label>
                  <textarea
                    value={formData.otherClubDetails}
                    onChange={updateField("otherClubDetails")}
                    rows={4}
                    className={`${inputClass} resize-y min-h-[100px]`}
                    placeholder="Club name and your role..."
                  />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Do you have prior team/post experience in any organization? <span className="text-red-500">*</span></label>
                <textarea
                  value={formData.priorExperience}
                  onChange={updateField("priorExperience")}
                  rows={4}
                  className={`${inputClass} resize-y min-h-[100px]`}
                  placeholder="Share your prior experience..."
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-amber-400 pl-4">
                <h2 className="text-lg font-semibold text-amber-400">Document Links</h2>
              </div>
              <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 text-sm">
                Upload your documents to Google Drive (or similar), set access to "Anyone with the link can view", and paste the shareable links below.
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>ID Proof Shareable Link <span className="text-red-500">*</span></label>
                  <Input
                    value={formData.idProofShareableLink}
                    onChange={updateField("idProofShareableLink")}
                    type="url"
                    placeholder="https://drive.google.com/..."
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Resume/CV Shareable Link <span className="text-red-500">*</span></label>
                  <Input
                    value={formData.resumeShareableLink}
                    onChange={updateField("resumeShareableLink")}
                    type="url"
                    placeholder="https://drive.google.com/..."
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-amber-400 pl-4">
                <h3 className="text-base font-semibold text-amber-400">Security Verification</h3>
              </div>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-4 text-center">Please verify you are not a robot</p>
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
                    className="px-8 py-4 rounded-xl text-white text-lg font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 transition-all duration-300 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 hover:shadow-xl hover:shadow-emerald-500/40 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[180px]"
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
