"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Input } from "@heroui/input";
import { db, storage } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { motion } from "framer-motion";
import ReCAPTCHAComponent from "../../components/ReCAPTCHA";
import Link from "next/link";

export default function AlumniRegisterPage() {
  const [fileInputKey, setFileInputKey] = useState(0);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [positionOrRole, setPositionOrRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [activeYears, setActiveYears] = useState("");
  const [degreeProgram, setDegreeProgram] = useState("");
  const [currentOccupation, setCurrentOccupation] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [linkedInOrSocial, setLinkedInOrSocial] = useState("");
  const [professionalGrowth, setProfessionalGrowth] = useState("");
  const [briefSummary, setBriefSummary] = useState("");
  const [inspireNextGen, setInspireNextGen] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const isRequiredFilled = () => {
    if (!fullName?.trim()) return false;
    if (!email?.trim()) return false;
    if (!positionOrRole?.trim()) return false;
    if (!graduationYear?.trim()) return false;
    if (!activeYears?.trim()) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!isRequiredFilled()) {
      setSubmitError("Please fill all required fields (Full Name, Email, Position/Role, Graduation Year, Active Years).");
      return;
    }

    if (!recaptchaToken) {
      setSubmitError("Please complete the reCAPTCHA verification.");
      return;
    }

    setIsSubmitting(true);

    try {
      let photoUrl = "";
      if (photoFile) {
        const ext = photoFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const storageRef = ref(
          storage,
          `alumni_photos/${v4()}.${ext}`
        );
        await uploadBytes(storageRef, photoFile);
        photoUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "alumni"), {
        fullName: fullName.trim(),
        email: email.trim(),
        positionOrRole: positionOrRole.trim(),
        phoneNumber: phoneNumber.trim() || null,
        graduationYear: graduationYear.trim(),
        activeYears: activeYears.trim(),
        degreeProgram: degreeProgram.trim() || null,
        currentOccupation: currentOccupation.trim() || null,
        companyName: companyName.trim() || null,
        photoUrl: photoUrl || null,
        linkedInOrSocial: linkedInOrSocial.trim() || null,
        professionalGrowth: professionalGrowth.trim() || null,
        briefSummary: briefSummary.trim() || null,
        inspireNextGen: inspireNextGen.trim() || null,
        recaptchaToken,
        submittedTimestamp: Date.now(),
      });

      alert("Thank you! Your alumni profile has been submitted successfully.");
      setFullName("");
      setEmail("");
      setPositionOrRole("");
      setPhoneNumber("");
      setGraduationYear("");
      setActiveYears("");
      setDegreeProgram("");
      setCurrentOccupation("");
      setCompanyName("");
      setPhotoFile(null);
      setLinkedInOrSocial("");
      setProfessionalGrowth("");
      setBriefSummary("");
      setInspireNextGen("");
      setRecaptchaToken(null);
      setFileInputKey((k) => k + 1);
    } catch (err) {
      console.error("Error submitting alumni form:", err);
      setSubmitError("Something went wrong. Please try again.");
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
          className="max-w-3xl mx-auto px-4 py-12"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Alumni Registration
            </h1>
            <p className="text-gray-400">
              Share your journey and inspire the next generation of Roboclub
              members.
            </p>
            <Link
              href="/alumni"
              className="inline-block mt-4 text-cyan-400 hover:text-cyan-300 text-sm"
            >
              ← Back to Alumni
            </Link>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-700/50 p-6 md:p-8 rounded-2xl shadow-2xl"
          >
            {submitError && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {submitError}
              </div>
            )}

            <div className="space-y-6">
              <div className="border-l-4 border-cyan-400 pl-4">
                <h2 className="text-lg font-semibold text-cyan-400">
                  Basic Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="fullName" className={labelClass}>
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    type="text"
                    placeholder="Your full name"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className={labelClass}>
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="your@email.com"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="positionOrRole" className={labelClass}>
                  What position or role did you hold during your time in the
                  club? <span className="text-red-500">*</span>
                </label>
                <Input
                  id="positionOrRole"
                  value={positionOrRole}
                  onChange={(e) => setPositionOrRole(e.target.value)}
                  type="text"
                  placeholder="e.g. Member, Joint Coordinator, Coordinator"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="phoneNumber" className={labelClass}>
                  Phone Number
                </label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  type="tel"
                  placeholder="Optional"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-emerald-400 pl-4">
                <h2 className="text-lg font-semibold text-emerald-400">
                  Academic & Club
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="graduationYear" className={labelClass}>
                    Graduation Year <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="graduationYear"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    type="text"
                    placeholder="e.g. 2022"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="activeYears" className={labelClass}>
                    In which year(s) were you an active member?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="activeYears"
                    value={activeYears}
                    onChange={(e) => setActiveYears(e.target.value)}
                    type="text"
                    placeholder="e.g. 2019-2022"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="degreeProgram" className={labelClass}>
                  Degree / Program
                </label>
                <Input
                  id="degreeProgram"
                  value={degreeProgram}
                  onChange={(e) => setDegreeProgram(e.target.value)}
                  type="text"
                  placeholder="e.g. B.Tech CSE"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-teal-400 pl-4">
                <h2 className="text-lg font-semibold text-teal-400">
                  Career
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="currentOccupation" className={labelClass}>
                    Current Occupation
                  </label>
                  <Input
                    id="currentOccupation"
                    value={currentOccupation}
                    onChange={(e) => setCurrentOccupation(e.target.value)}
                    type="text"
                    placeholder="Job title or role"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="companyName" className={labelClass}>
                    Company Name
                  </label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    type="text"
                    placeholder="Optional"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-amber-400 pl-4">
                <h2 className="text-lg font-semibold text-amber-400">
                  Profile & Media
                </h2>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="photo" className={labelClass}>
                  Photo for your alumni profile (JPEG or PNG preferred)
                </label>
                <input
                  id="photo"
                  key={fileInputKey}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="p-2 rounded-lg bg-gray-800/80 border border-gray-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-600 file:text-white hover:file:bg-teal-700"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="linkedInOrSocial" className={labelClass}>
                  LinkedIn or other social profile URL
                </label>
                <Input
                  id="linkedInOrSocial"
                  value={linkedInOrSocial}
                  onChange={(e) => setLinkedInOrSocial(e.target.value)}
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-cyan-400 pl-4">
                <h2 className="text-lg font-semibold text-cyan-400">
                  Your Story
                </h2>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="professionalGrowth" className={labelClass}>
                  How has your experience at AMU Roboclub contributed to your
                  professional growth and career success? (skills, lessons,
                  opportunities)
                </label>
                <textarea
                  id="professionalGrowth"
                  value={professionalGrowth}
                  onChange={(e) => setProfessionalGrowth(e.target.value)}
                  rows={4}
                  placeholder="Share your experience..."
                  className={`${inputClass} resize-y min-h-[100px]`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="briefSummary" className={labelClass}>
                  Brief summary to introduce yourself (profession, interests,
                  achievements, favorite Roboclub memory)
                </label>
                <textarea
                  id="briefSummary"
                  value={briefSummary}
                  onChange={(e) => setBriefSummary(e.target.value)}
                  rows={4}
                  placeholder="A short bio..."
                  className={`${inputClass} resize-y min-h-[100px]`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="inspireNextGen" className={labelClass}>
                  How would you inspire the next generation of Roboclub members
                  in your own words?
                </label>
                <textarea
                  id="inspireNextGen"
                  value={inspireNextGen}
                  onChange={(e) => setInspireNextGen(e.target.value)}
                  rows={4}
                  placeholder="Your message to future members..."
                  className={`${inputClass} resize-y min-h-[100px]`}
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
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 rounded-xl text-white text-lg font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 transition-all duration-300 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 hover:shadow-xl hover:shadow-emerald-500/40 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[180px]"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Profile"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}
