"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Input } from "@heroui/input";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useState } from "react";
import { motion } from "framer-motion";
import ReCAPTCHAComponent from "../../components/ReCAPTCHA";
import Image from "next/image";
import verceraLogoFull from "../../../assets/vercera_full_logo.png";

const TEAMS = [
  {
    id: "management",
    name: "Management",
    description:
      "Coordinate events, logistics, and team operations for Vercera 5.0.",
  },
  {
    id: "video_editing",
    name: "Video Editing",
    description:
      "Create and edit promotional videos, reels, and event coverage.",
  },
  {
    id: "sponsorship",
    name: "Sponsorship",
    description: "Reach out to sponsors and manage partnerships for the fest.",
  },
  {
    id: "graphic_design",
    name: "Graphic Design",
    description: "Design posters, social media creatives, and branding assets.",
  },
  {
    id: "hospitality",
    name: "Hospitality",
    description:
      "Manage guest relations, accommodation, and on-ground support.",
  },
  {
    id: "decor",
    name: "Decor Team",
    description: "Plan and execute venue decoration and stage setup.",
  },
  {
    id: "outreach",
    name: "Outreach",
    description: "Connect with communities, colleges, and participants to expand Vercera 5.0's reach.",
  },
];

const YEARS = ["1st", "2nd", "3rd", "4th", "5th", "Other"];

export default function VerceraApplyPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [preference1, setPreference1] = useState("");
  const [preference2, setPreference2] = useState("");
  const [whyApplying, setWhyApplying] = useState("");
  const [previousExperience, setPreviousExperience] = useState("");
  const [cvLink, setCvLink] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [facultyNumber, setFacultyNumber] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !email ||
      !contact ||
      !preference1 ||
      !preference2 ||
      !whyApplying ||
      !departmentName ||
      !facultyName ||
      !facultyNumber ||
      !enrollmentNumber ||
      !yearOfStudy
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    if (preference1 === preference2) {
      alert("Please choose two different team preferences.");
      return;
    }

    if (!recaptchaToken) {
      alert("Please complete the reCAPTCHA verification.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "vercera_5_team_registrations"), {
        name,
        email,
        contactNumber: contact,
        teamPreference1: preference1,
        teamPreference2: preference2,
        whyApplying,
        previousExperience: previousExperience || null,
        cvResumeLink: cvLink || null,
        departmentName,
        facultyName,
        facultyNumber,
        enrollmentNumber,
        yearOfStudy,
        submittedTimestamp: Date.now(),
        recaptchaToken,
        status: "pending",
      });

      alert("Your application has been submitted successfully!");
      setName("");
      setEmail("");
      setContact("");
      setPreference1("");
      setPreference2("");
      setWhyApplying("");
      setPreviousExperience("");
      setCvLink("");
      setDepartmentName("");
      setFacultyName("");
      setFacultyNumber("");
      setEnrollmentNumber("");
      setYearOfStudy("");
      setRecaptchaToken(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="bg-black min-h-screen text-white">
        <Navbar />

        {/* Banner with logo */}
        <section className="w-full px-4 pt-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full rounded-2xl overflow-hidden bg-black border border-white/10"
          >
            <div className="relative w-full aspect-[3/1] min-h-[120px] md:min-h-[160px]">
              <Image
                src={verceraLogoFull}
                alt="Vercera 5.0 - AMU Roboclub"
                fill
                className="object-contain object-center"
                priority
              />
            </div>
          </motion.div>
        </section>

        {/* Positions and descriptions */}
        <section className="w-full px-4 lg:px-10 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Open Positions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEAMS.map((team) => (
                <div
                  key={team.id}
                  className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 hover:border-violet-500/30 transition-colors"
                >
                  <h3 className="font-semibold text-white mb-2">{team.name}</h3>
                  <p className="text-gray-400 text-sm">{team.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Form */}
        <section className="w-full px-4 lg:px-10 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form
              onSubmit={handleSubmit}
              className="max-w-3xl mx-auto flex flex-col gap-8 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-700/50 p-6 md:p-8 rounded-2xl shadow-2xl"
            >
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-white">
                  Application Form
                </h2>
                <p className="text-gray-400 mt-1">
                  Apply for Vercera 5.0 team (2 preferences)
                </p>
              </div>

              {/* Personal */}
              <div className="space-y-6">
                <div className="border-l-4 border-violet-400 pl-4">
                  <h3 className="text-lg font-semibold text-violet-400">
                    Personal Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      placeholder="Your full name"
                      className="bg-gray-800/80 border border-gray-600 text-white placeholder-gray-400 rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="your@email.com"
                      className="bg-gray-800/80 border border-gray-600 text-white placeholder-gray-400 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">
                    Contact Number (preferably WhatsApp){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    type="tel"
                    placeholder="e.g. 9876543210"
                    className="bg-gray-800/80 border border-gray-600 text-white placeholder-gray-400 rounded-lg"
                  />
                </div>
              </div>

              {/* Team preferences */}
              <div className="space-y-6">
                <div className="border-l-4 border-fuchsia-400 pl-4">
                  <h3 className="text-lg font-semibold text-fuchsia-400">
                    Team Preferences
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Select your first and second preference (must be different)
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-gray-300">
                      Preference 1 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {TEAMS.map((team) => (
                        <label
                          key={team.id}
                          className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border transition-colors ${
                            preference1 === team.id
                              ? "border-fuchsia-500 bg-fuchsia-500/20"
                              : "border-gray-600 bg-gray-800/50 hover:border-gray-500"
                          }`}
                        >
                          <input
                            type="radio"
                            name="preference1"
                            value={team.id}
                            checked={preference1 === team.id}
                            onChange={(e) => setPreference1(e.target.value)}
                            className="sr-only"
                          />
                          <span className="text-sm text-white">
                            {team.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-gray-300">
                      Preference 2 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {TEAMS.map((team) => (
                        <label
                          key={team.id}
                          className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border transition-colors ${
                            preference2 === team.id
                              ? "border-cyan-500 bg-cyan-500/20"
                              : "border-gray-600 bg-gray-800/50 hover:border-gray-500"
                          }`}
                        >
                          <input
                            type="radio"
                            name="preference2"
                            value={team.id}
                            checked={preference2 === team.id}
                            onChange={(e) => setPreference2(e.target.value)}
                            className="sr-only"
                          />
                          <span className="text-sm text-white">
                            {team.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Why applying & experience */}
              <div className="space-y-6">
                <div className="border-l-4 border-cyan-400 pl-4">
                  <h3 className="text-lg font-semibold text-cyan-400">
                    Application Details
                  </h3>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">
                    Why do you want to join this team?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={whyApplying}
                    onChange={(e) => setWhyApplying(e.target.value)}
                    placeholder="Write about your motivation and how you can contribute..."
                    rows={4}
                    required
                    className="w-full p-3 rounded-lg bg-gray-800/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-y min-h-[100px]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">
                    Previous experience (if any)
                  </label>
                  <textarea
                    value={previousExperience}
                    onChange={(e) => setPreviousExperience(e.target.value)}
                    placeholder="Clubs, fests, projects, roles..."
                    rows={3}
                    className="w-full p-3 rounded-lg bg-gray-800/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-y min-h-[80px]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">
                    CV / Resume link
                  </label>
                  <Input
                    value={cvLink}
                    onChange={(e) => setCvLink(e.target.value)}
                    type="url"
                    placeholder="https://drive.google.com/... or portfolio link"
                    className="bg-gray-800/80 border border-gray-600 text-white placeholder-gray-400 rounded-lg"
                  />
                </div>
              </div>

              {/* Academic */}
              <div className="space-y-6">
                <div className="border-l-4 border-emerald-400 pl-4">
                  <h3 className="text-lg font-semibold text-emerald-400">
                    Academic Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">
                      Department name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={departmentName}
                      onChange={(e) => setDepartmentName(e.target.value)}
                      type="text"
                      placeholder="e.g. Computer Engineering"
                      className="bg-gray-800/80 border border-gray-600 text-white placeholder-gray-400 rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">
                      Faculty name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={facultyName}
                      onChange={(e) => setFacultyName(e.target.value)}
                      type="text"
                      placeholder="Your faculty name"
                      className="bg-gray-800/80 border border-gray-600 text-white placeholder-gray-400 rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">
                      Faculty number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={facultyNumber}
                      onChange={(e) => setFacultyNumber(e.target.value)}
                      type="text"
                      placeholder="Faculty number"
                      className="bg-gray-800/80 border border-gray-600 text-white placeholder-gray-400 rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">
                      Enrollment number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={enrollmentNumber}
                      onChange={(e) => setEnrollmentNumber(e.target.value)}
                      type="text"
                      placeholder="Enrollment number"
                      className="bg-gray-800/80 border border-gray-600 text-white placeholder-gray-400 rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">
                      Year of study <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(e.target.value)}
                      required
                      className="p-3 rounded-lg bg-gray-800/80 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Select year</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* reCAPTCHA */}
              <div className="space-y-4">
                <div className="border-l-4 border-amber-400 pl-4">
                  <h3 className="text-lg font-semibold text-amber-400">
                    Security Verification
                  </h3>
                </div>
                <div className="flex justify-center bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                  <ReCAPTCHAComponent
                    onVerify={setRecaptchaToken}
                    onError={(err) => console.error("reCAPTCHA Error:", err)}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 rounded-xl text-white text-lg font-bold bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 hover:from-cyan-500 hover:via-fuchsia-500 hover:to-violet-500 transition-all duration-300 hover:shadow-lg hover:shadow-fuchsia-500/30 disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                    "Submit Application"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
