"use client";

import Navbar from "../components/Navbar";
import Image from "next/image";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleClick = async (e) => {
    e.preventDefault();

     if (!name || !email || !course || !enrollment || !faculty || !mobile || !idproof || !paymentproof) {
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
      setMobile("");
      setIDproof(null);
      setPaymentproof(null);
      setYear("");
      setFileInputKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    } finally {
    setIsSubmitting(false);  // 🟢 hide loading
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
  


          <section className="w-full px-4 py-8 lg:px-10 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
            {/* FORM */}

            <form className="w-full flex flex-col gap-6 bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg gap-y-12">
              <h2 className="text-2xl font-bold text-center">
                Membership Form
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <label htmlFor="name" className="w-32">
                    Name
                  </label>
                  <Input
                    value={name}
                    onChange={nameHandler}
                    type="text"
                    placeholder="Name"
                    className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="w-32">
                    Email
                  </label>
                  <Input
                    value={email}
                    onChange={emailHandler}
                    type="email"
                    placeholder="Email"
                    className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <label htmlFor="course" className="w-32">
                    Course
                  </label>
                  <select
                    value={course}
                    onChange={courseHandler}
                    className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 text-white"
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

                <div className="flex flex-col gap-1">
                  <label htmlFor="year" className="w-32">
                    Year of Study
                  </label>
                  <select
                    value={year}
                    onChange={yearHandler}
                    className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 text-white"
                  >
                    <option value="">Select Year</option>
                    <option>1st</option>
                    <option>2nd</option>
                    <option>3rd</option>
                    <option>4th</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT */}
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1">
                    <label htmlFor={enrollment} className="w-32 capitalize">
                      enrollment
                    </label>
                    <Input
                      value={enrollment}
                      onChange={enrollmentHandler}
                      type="text"
                      placeholder="enrollment"
                      className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor={mobile} className="w-32 capitalize">
                      mobile
                    </label>
                    <Input
                      value={mobile}
                      onChange={mobileHandler}
                      type="text"
                      placeholder="mobile"
                      className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor={faculty} className="w-32 capitalize">
                      faculty
                    </label>
                    <Input
                      value={faculty}
                      onChange={facultyHandler}
                      type="text"
                      placeholder="faculty"
                      className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1">
                    <label htmlFor={idproof} className="w-32">
                      ID Proof
                    </label>
                    <Input
                      onChange={(e) => setIDproof(e.target.files[0])}
                      key={fileInputKey + "_id"}
                      type="file"
                      className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor={paymentproof} className="w-32">
                      Payment Proof
                    </label>
                    <Input
                      onChange={(e) => setPaymentproof(e.target.files[0])}
                      key={fileInputKey + "_payment"}
                      type="file"
                      className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* MOBILE DRAWER BUTTON */}
              <div className="lg:hidden pt-4">
                <div className="text-center space-y-4">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
                  <p className="text-gray-400 text-sm">
                    Complete your payment to finalize membership
                  </p>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50 hover:border-blue-500 transition-all duration-200 h-12 text-[0.75rem]"
                      >
                        Show Payment QR Code
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
                            Membership Fee: ₹200
                          </p>
                          <p className="text-gray-400 text-sm">
                            After payment, upload the screenshot as payment
                            proof
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 text-center">
                        <SheetClose asChild>
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                            Close
                          </Button>
                        </SheetClose>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              <div className="flex justify-center sm:justify-end sm:mr-5 mb-3">
                <button
                  type="button"
                  onClick={handleClick}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-lg text-white text-lg font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 transition duration-300 ease-in-out hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 hover:shadow-xl hover:shadow-emerald-500/40 transform hover:scale-105"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>

            {/* DESKTOP QR IMAGE */}
            <div className="hidden lg:flex justify-center">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 shadow-2xl max-w-md w-full">
                <div className="text-center space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold pb-3">Scan to Pay</h3>
                    <p className="text-gray-400">
                      Complete your membership payment
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-2xl mx-auto w-fit">
                    <Image
                      src={qrcode}
                      alt="Payment QR Code"
                      width={280}
                      height={280}
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
                      <p className="text-blue-400 font-semibold text-lg">
                        Membership Fee: ₹200
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">
                      After payment, upload the screenshot as payment proof in
                      the form
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
