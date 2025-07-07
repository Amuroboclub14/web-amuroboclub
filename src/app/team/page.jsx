"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import pic from "../../assets/nopicture.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@heroui/drawer";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/use-disclosure";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

// Skeleton component
const MemberSkeleton = () => (
  <div className="animate-pulse flex flex-col gap-5 mt-10 w-[40vw] md:w-[18rem]">
    <div className="h-[45vh] md:h-[384px] w-full bg-gray-300 md:rounded-xl rounded-md"></div>
    <div className="flex flex-col gap-3 pb-5">
      <div className="h-8 bg-gray-300 rounded-md w-3/4 ml-5"></div>
      <div className="h-6 bg-gray-300 rounded-md w-1/2 ml-5"></div>
    </div>
  </div>
);

export default function Team() {
  const [teamType, setTeamType] = useState("Coordinator");
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [year, setYear] = useState(2025); // State for selected year
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const nextYear = new Date().getFullYear() + 1;
        const querySnapshot = await getDocs(collection(db, "teams"));
        const latestYear = querySnapshot.docs.length - (nextYear - year); //-1 for 2024-2025
        const allMembers =
          querySnapshot.docs.map((doc) => ({
            id: doc.id, // document ID if needed
            ...doc.data(),
          }))[latestYear].members || [];
        setMembers(allMembers);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };
    fetchMembers();
  }, [year]);

  useEffect(() => {
    const excludedPositions = [
      "Coordinator",
      "Joint Coordinator",
      "Web Developer",
      "App Developer",
      "Volunteer",
    ];
    const filterByTeamType = () => {
      return members.filter((member) => {
        const position = member.position;
        if (teamType === "PR") return !excludedPositions.includes(position);
        return position === teamType;
      });
    };
    setFilteredMembers(filterByTeamType());
  }, [members, teamType]);

  const handleLinkClick = (link) => () => window.open(link, "_blank");

  return (
    <main className="w-full min-h-screen bg-black">
      <Navbar />
      <section className="flex flex-col items-center px-5 md:px-[6.2rem]">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9 }}
          className=" flex flex-col px-5"
        >
          <h1 className="text-[1.5rem] leading-[2.7rem] md:leading-[5rem] md:text-[2rem] font-bold text-center pt-[8vh] leading-tight bg-gradient-to-br from-white to-sky-300 bg-clip-text text-transparent pb-5 md:pb-10">
            AMURoboclub Team {year}-{parseInt(year) + 1}
          </h1>
        </motion.div>

        {isSmallScreen ? (
          <>
            <Button
              onPress={onOpen}
              className="mt-4 !font-mono mb-8 text-[16px] rounded-[5px] bg-white bg-opacity-10 p-4 text-white"
            >
              Select Team Role -&nbsp;
              <span className="text-white !font-mono">{teamType}</span>
              <ChevronRight className="w-5 h-5 text-white" />
            </Button>

            <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
              {isOpen && (
                <div className="fixed inset-0 bg-black/3 backdrop-blur-sm z-40 transition-opacity duration-300"></div>
              )}

              <DrawerContent className="fixed right-0 top-0 h-full w-[60vw] sm:w-[24rem] bg-[#151516] z-50 shadow-lg rounded-none !font-mono">
                {(onClose) => (
                  <>
                    <DrawerHeader className="text-[1.75rem] font-bold text-white">
                      Team
                    </DrawerHeader>

                    <DrawerBody className="flex flex-col gap-4 text-[14px] sm:text-[1.5rem]">
                      {[
                        "Coordinator",
                        "Joint Coordinator",
                        "Web Developer",
                        "App Developer",
                        "Volunteer",
                        "PR",
                      ].map((type) => (
                        <Button
                          key={type}
                          onPress={() => {
                            setTeamType(type);
                            onClose();
                          }}
                          className={`w-full justify-start text-left rounded-[8px] ${
                            teamType === type
                              ? "bg-blue-500 text-black"
                              : "bg-white bg-opacity-10 text-white"
                          }`}
                        >
                          {type.toUpperCase().replace("_", " ")}
                        </Button>
                      ))}
                    </DrawerBody>

                    <DrawerFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Cancel
                      </Button>
                    </DrawerFooter>
                  </>
                )}
              </DrawerContent>
            </Drawer>
          </>
        ) : (
          <div className="md:flex justify-center sticky top-0 w-full bg-black !font-mono gap-5 font-medium text-[18px] mb-[32px] pt-10">
            {[
              "Coordinator",
              "Joint Coordinator",
              "Web Developer",
              "App Developer",
              "Volunteer",
              "PR",
            ].map((type) => (
              <h1
                key={type}
                className={`bg-white bg-opacity-10 rounded-[5px] flex items-center justify-center cursor-pointer px-4 py-2  gap-8 ${
                  teamType === type
                    ? "border-b-2 border-blue-800 text-gradient text-[24px] leading-[2rem]"
                    : "text-white"
                }`}
                onClick={() => setTeamType(type)}
              >
                {type.replace("_", " ")}
              </h1>
            ))}
          </div>
        )}

        <div
          className={`grid md:grid-cols-2 ${
            filteredMembers.length >= 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
          } gap-[2rem] pb-20`}
        >
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <MemberSkeleton key={index} />
              ))
            : filteredMembers.map((member, index) => {
                const { name, position, profileImageUrl } = member;
                return (
                  <div
                    key={index}
                    className="flex flex-col gap-3 !font-mono text-white w-[320px]  border-blue-400 bg-gray-800 shadow-lg lg:bg-gray-900 border lg:border-gray-700 rounded-xl p-6 transition-all duration-300 overflow-hidden group lg:hover:border-blue-400 lg:hover:bg-gray-800 lg:hover:shadow-lg lg:hover:shadow-blue-400/15"
                  >
                    <Image
                      src={profileImageUrl || pic}
                      alt={name}
                      width={576}
                      height={384}
                      className="w-full h-[45vh] md:h-[384px] object-cover rounded-md md:rounded-xl"
                    />

                    <div className="flex flex-col gap-3 pb-5">
                      <h1 className="text-[20px] font-medium ">{name}</h1>
                      <h1 className="block md:hidden text-[18px] font-normal">
                        {position}
                      </h1>

                      <div className="flex gap-3">
                        {/* <Image
                            src={linkedin}
                            alt="LinkedIn"
                            width={24}
                            height={24}
                            className="cursor-pointer"
                            onClick={handleLinkClick(member.mapValue.fields.linkedinUrl?.stringValue)}
                          /> */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 cursor-pointer"
                          onClick={handleLinkClick(`mailto:${member.email}`)}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21.75 4.5v15a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 19.5v-15A2.25 2.25 0 014.5 2.25h15A2.25 2.25 0 0121.75 4.5z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75l8.25 6.75 8.25-6.75"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
        <div className="flex justify-start items-center !font-mono text-white gap-5 py-10">
          <p className=" text-lg md:text-[28px]">View Past Teams:</p>
          <select
            className="border text-black border-gray-300 rounded-md p-2 md:!text-[1.3rem]"
            onChange={(e) => setYear(e.target.value)}
          >
            {Array.from({ length: 7 }, (_, i) => 2025 - i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </section>
      <Footer />
    </main>
  );
}
