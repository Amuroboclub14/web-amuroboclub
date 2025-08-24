"use client";

import Navbar from "../components/Navbar";
import Image from "next/image";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "../components/ui/sheet";
import qrcode from "../../assets/qrcode.jpg";
import Footer from "../components/Footer";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { useState } from "react";
import { v4 } from "uuid";
import { motion } from "framer-motion";

export default function MemberForm() {
  const [fileInputKey, setFileInputKey] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [idproof, setIDproof] = useState("");
  const [paymentproof, setPaymentproof] = useState("");
  const [mobile, setMobile] = useState("");
  const [enrollment, setEnrollment] = useState("");
  const [faculty, setFaculty] = useState("");
  const [discord, setDiscord] = useState("");
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !email ||
      !course ||
      !enrollment ||
      !faculty ||
      !mobile ||
      !idproof ||
      !paymentproof
    ) {
      alert("Please fill out all required fields before submitting.");
      return;
    }
    setIsSubmitting(true);

    try {
      // Upload ID Proof
      const idProofRef = ref(storage, `registeredMembers/${v4()}`);
      await uploadBytes(idProofRef, idproof);
      const idProofURL = await getDownloadURL(idProofRef);

      // Upload Payment Proof
      const paymentProofRef = ref(storage, `paymentproof_2025/${v4()}`);
      await uploadBytes(paymentProofRef, paymentproof);
      const paymentProofURL = await getDownloadURL(paymentProofRef);

      // Add Firestore document
      await addDoc(collection(db, "members_2025"), {
        name: name,
        submittedTimestamp: Date.now(),
        course: course,
        email: email,
        paymentStatus: false,
        enrollmentNumber: enrollment,
        facultyNumber: faculty,
        discordId: discord,
        mobile: mobile,
        idProofURL: idProofURL,
        paymentProofURL: paymentProofURL,
      });

      // ✅ Alert on success
      alert("Your form has been submitted successfully!");

      // ✅ Reset form fields
      setName("");
      setEmail("");
      setCourse("");
      setEnrollment("");
      setFaculty("");
      setDiscord("");
      setMobile("");
      setIDproof(null);
      setPaymentproof(null);
      setYear("");
      setFileInputKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nameHandler = (e) => {
    setName(e.target.value);
  };

  const emailHandler = (e) => {
    setEmail(e.target.value);
  };

  const yearHandler = (e) => {
    setYear(e.target.value);
  };

  const courseHandler = (e) => {
    setCourse(e.target.value);
  };

  const enrollmentHandler = (e) => {
    setEnrollment(e.target.value);
  };

  const mobileHandler = (e) => {
    setMobile(e.target.value);
  };

  const facultyHandler = (e) => {
    setFaculty(e.target.value);
  };
  const discordHandler = (e) => {
    setDiscord(e.target.value);
  };

  const membershipBenefits = [
    {
      icon: "🤖",
      title: "Exclusive Member-Only Sessions",
      description:
        "Free access to premium sessions on Robotics, AI, ML, Web/App Development, and more.",
    },
    {
      icon: "🏆",
      title: "Discounted Entry to Workshops and Sessions",
      description:
        "Members pay significantly less than non-members for all technical workshops and training sessions.",
    },
    {
      icon: "📚",
      title: "Free Component Issuance",
      description:
        "Members can borrow electronic components from the club for academic or personal projects.",
    },
    {
      icon: "🤝",
      title: "Reduced Registration Fees in Vercera Fest",
      description:
        "Enjoy discounted registration for events and competitions during our annual tech fest, Vercera.",
    },
    {
      icon: "💼",
      title: "Personal Guidance and Mentorship",
      description:
        "Access one-on-one help and expert support from experienced club members whenever needed.",
    },
    {
      icon: "🚀",
      title: "Join Club Projects & Competitions",
      description:
        "Collaborate on exciting club-led projects and showcase your skills in inter-club and external competitions.",
    },
  ];

  return (
    <>
      <main className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <section className="w-full px-4 py-12 lg:px-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  Join Our Robotics Community
                </h1>
                <p className="text-lg !font-mono text-gray-300 max-w-2xl mx-auto ">
                  Take your robotics journey to the next level with exclusive
                  access to labs, competitions, and mentorship
                </p>
              </motion.div>
            </section>

            {/* Benefits Section */}
            <section className="w-full px-4 lg:px-10 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8 shadow-2xl"
              >
                <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Membership Benefits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {membershipBenefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 hover:bg-gray-800/70 transition-all duration-300 hover:border-cyan-500/30 group"
                    >
                      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                        {benefit.icon}
                      </div>
                      <h3 className="text-lg !font-mono font-semibold mb-2 text-white">
                        {benefit.title}
                      </h3>
                      <p className="!font-mono text-gray-400 text-sm">
                        {benefit.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* Form and Payment Section */}
            <section className="w-full px-4 lg:px-10 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
              {/* FORM */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <form className="w-full flex flex-col gap-8 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-700/50 p-6 md:p-8 rounded-2xl shadow-2xl">
                  <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold mb-2 text-white">
                      Membership Form
                    </h2>
                    <p className="!font-mono text-gray-400">
                      Fill in your details to join our robotics community
                    </p>
                  </div>

                  {/* Personal Information */}
                  <div className="space-y-6">
                    <div className="border-l-4 border-cyan-400 pl-4">
                      <h3 className="text-2x1 font-semibold mb-4 text-cyan-400">
                        Personal Information
                      </h3>
                    </div>
                    <div className="!font-mono grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="name"
                          className="!font-mono text-[18px] font-medium text-gray-300"
                        >
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={name}
                          onChange={nameHandler}
                          type="text"
                          placeholder="Enter your full name"
                          className="p-3 rounded-lg bg-gray-800/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="email"
                          className="!font-mono text-[18px] font-medium text-gray-300"
                        >
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={email}
                          onChange={emailHandler}
                          type="email"
                          placeholder="Enter your email"
                          className="p-3 rounded-lg bg-gray-800/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="!font-mono flex flex-col gap-2">
                      <label
                        htmlFor="mobile"
                        className="!font-mono text-[18px] font-medium text-gray-300"
                      >
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={mobile}
                        onChange={mobileHandler}
                        type="text"
                        placeholder="Enter your mobile number"
                        className="p-0.9 rounded-lg bg-gray-800/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className=" space-y-6">
                    <div className="border-l-4 border-emerald-400 pl-4">
                      <h3 className="text-1xl font-semibold mb-4 text-emerald-400">
                        Academic Information
                      </h3>
                    </div>
                    <div className="!font-mono grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="course"
                          className="!font-mono text-[18px] font-medium text-gray-300"
                        >
                          Course <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={course}
                          onChange={courseHandler}
                          className="p-3 rounded-lg bg-gray-800/80 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select Course</option>
                          <option>B.Tech</option>
                          <option>B.Sc.</option>
                          <option>BCA</option>
                          <option>M.Sc.</option>
                          <option>M.Tech.</option>
                          <option>Polytechnic</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="year"
                          className="!font-mono text-[18px] font-medium text-gray-300"
                        >
                          Year of Study <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={year}
                          onChange={yearHandler}
                          className="p-3 rounded-lg bg-gray-800/80 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select Year</option>
                          <option>1st</option>
                          <option>2nd</option>
                          <option>3rd</option>
                          <option>4th</option>
                        </select>
                      </div>
                    </div>

                    <div className="!font-mono grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="enrollment"
                          className="!font-mono text-[18px] font-medium text-gray-300"
                        >
                          Enrollment Number{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={enrollment}
                          onChange={enrollmentHandler}
                          type="text"
                          placeholder="Enter enrollment number"
                          className="p-1 rounded-lg bg-gray-800/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="faculty"
                          className="!font-mono text-[18px] font-medium text-gray-300"
                        >
                          Faculty Number <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={faculty}
                          onChange={facultyHandler}
                          type="text"
                          placeholder="Enter faculty number"
                          className="p-1 rounded-lg bg-gray-800/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      <div className="flex flex-col gap-2 lg:col-span-2">
                        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 items-end">
                          <div className="flex flex-col gap-2">
                            <label
                              htmlFor="discordId"
                              className="!font-mono text-[18px] font-medium text-gray-300"
                            >
                              Discord Id (Optional)
                            </label>
                            <Input
                              value={discord}
                              onChange={discordHandler}
                              type="text"
                              placeholder="@abcd"
                              className="p-1 rounded-lg bg-gray-800/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>

                          <a
                            href="https://discord.gg/heR5vGyMQ4"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] transition-colors duration-200 text-white font-medium h-[42px]"
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                            </svg>
                            Join our Discord Server
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Document Upload */}
                  <div className=" space-y-6">
                    <div className="border-l-4 border-teal-400 pl-4">
                      <h3 className="text-2x1 font-semibold mb-4 text-teal-400">
                        Document Upload
                      </h3>
                    </div>
                    <div className="!font-mono grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="idproof"
                          className="!font-mono text-[18px] font-medium text-gray-300"
                        >
                          College ID Card{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          onChange={(e) => setIDproof(e.target.files[0])}
                          key={fileInputKey + "_id"}
                          type="file"
                          className="p-1 rounded-lg bg-gray-800/80 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-600 file:text-white hover:file:bg-teal-700"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="paymentproof"
                          className="!font-mono text-[18px] font-medium text-gray-300"
                        >
                          Membership Fee Payment Proof{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          onChange={(e) => setPaymentproof(e.target.files[0])}
                          key={fileInputKey + "_payment"}
                          type="file"
                          className="p-1 rounded-lg bg-gray-800/80 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-600 file:text-white hover:file:bg-teal-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* MOBILE DRAWER BUTTON */}
                  <div className="lg:hidden">
                    <div className="text-center space-y-4 p-6 bg-gray-800/30 rounded-xl border border-gray-700/50">
                      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                      <p className="text-gray-400 text-sm">
                        Complete your payment to finalize membership
                      </p>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full bg-gradient-to-r from-cyan-600/20 to-emerald-600/20 border-cyan-500/50 text-white hover:from-cyan-600/30 hover:to-emerald-600/30 hover:border-cyan-400 transition-all duration-200 h-12 text-[10px] font-medium"
                          >
                            Show Payment <br />
                            QR Code
                          </Button>
                        </SheetTrigger>
                        <SheetContent
                          side="right"
                          className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 w-full max-h-screen overflow-y-auto p-4 rounded-t-2xl"
                        >
                          <SheetHeader className="text-center mb-3">
                            <SheetTitle className="text-white text-xl font-bold">
                              Payment QR Code
                            </SheetTitle>
                          </SheetHeader>

                          <div className="flex flex-col items-center justify-center space-y-6">
                            <div className="bg-white p-4 rounded-2xl shadow-2xl w-fit max-w-full">
                              <Image
                                src={qrcode}
                                alt="Payment QR Code"
                                width={280}
                                height={280}
                                className="rounded-lg max-w-full h-auto"
                              />
                            </div>

                            <div className="text-center space-y-2 max-w-xs">
                              <p className="text-white font-medium text-lg">
                                Membership Fee: ₹250
                              </p>
                              <p className="text-gray-400 text-sm">
                                After payment, upload the screenshot as payment
                                proof
                              </p>
                            </div>
                          </div>

                          <div className="mt-6 text-center">
                            <SheetClose asChild>
                              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white w-full">
                                Close
                              </Button>
                            </SheetClose>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-4">
                    <button
                      type="button"
                      onClick={handleClick}
                      disabled={isSubmitting}
                      className="px-8 py-4 rounded-xl text-white text-lg font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 transition-all duration-300 ease-in-out hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 hover:shadow-xl hover:shadow-emerald-500/40 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[160px]"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
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
                        "Submit Application"
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>

              {/* DESKTOP QR IMAGE */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="hidden lg:flex justify-center"
              >
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl max-w-md w-full sticky top-8">
                  <div className="text-center space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                        Scan to Pay
                      </h3>
                      <p className="text-gray-400">
                        Complete your membership payment
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-2xl mx-auto w-fit hover:shadow-cyan-500/20 transition-all duration-300">
                      <Image
                        src={qrcode}
                        alt="Payment QR Code"
                        width={280}
                        height={280}
                        className="rounded-lg"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-cyan-600/20 to-emerald-600/20 border border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm">
                        <p className="text-cyan-400 font-semibold text-lg">
                          Membership Fee: ₹250
                        </p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                        <p className="text-gray-400 text-sm">
                          After payment, upload the screenshot as payment proof
                          in the form above
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
