"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import pic from "../../assets/nopicture.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { setDarkModeActivation,Text,Heading } from "nes-ui-react";

// Skeleton component
const MemberSkeleton = () => (
  <div className="animate-pulse flex flex-col gap-5 mt-10 w-[40vw] md:w-[18rem]">
    <div className="h-[70vh] w-full bg-gray-300 md:rounded-xl rounded-md"></div>
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

  useEffect(() => setDarkModeActivation(true), []);

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
        const querySnapshot = await getDocs(collection(db, "teams"));
        const latestYear = querySnapshot.docs.length - (2026 - year); //-1 for 2024-2025
        const allMembers =
          querySnapshot.docs[latestYear]?._document.data.value.mapValue.fields
            .members.arrayValue.values || [];
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
        const position = member.mapValue.fields.position.stringValue;
        if (teamType === "pr") return !excludedPositions.includes(position);
        return position === teamType;
      });
    };
    setFilteredMembers(filterByTeamType());
  }, [members, teamType]);

  const handleLinkClick = (link) => () => window.open(link, "_blank");

  return (
    <main className="w-full min-h-screen">
      <Navbar />
      <section className="flex flex-col items-center px-5 md:px-[6.2rem] pt-7 font-mont">
        
        
         <h1 className="!text-[2.6rem] md:!leading-[5rem] md:!text-[4.9rem] font-bold text-justify md:pt-[12vh] !leading-tight bg-gradient-to-br from-white to-sky-300 bg-clip-text text-transparent pb-10">
          AMURoboclub Team <br />
          {year}-{parseInt(year) + 1}
        </h1>
        
        <div className="hidden md:flex gap-5 font-medium text-[0.5rem] md:text-xl pt-10">
          {[
            "Coordinator",
            "Joint Coordinator",
            "Web Developer",
            "App Developer",
            "Volunteer",
            "pr",
          ].map((type) => (
            <h1
              key={type}
              className={`nes-cursor py-5 px-1 md:!text-[1.8rem] gap-8 ${
                teamType === type
                  ? "border-b-2 border-blue-800 text-gradient !text-[inherit] !font-[inherit] !text-[2.6rem] md:!text-[3.5rem] leading-[2.5rem] md:!leading-[4rem]"
                  : "text-white"
              }`}
              onClick={() => setTeamType(type)}
            >
              {type.toUpperCase().replace("_", " ")}
            </h1>
          ))}
        </div>

        <div className="flex md:flex-row flex-col flex-wrap justify-center md:gap-[6rem] pb-20">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <MemberSkeleton key={index} />
              ))
            : (isSmallScreen ? members : filteredMembers).map(
                (member, index) => {
                  const { name, position, profileImageUrl } =
                    member.mapValue.fields;
                  return (
                    <div
                      key={index}
                      className="flex flex-col gap-5 mt-10 w-[40vw] md:w-[32rem]  border-blue-400 bg-gray-800 shadow-lg lg:bg-gray-900 border lg:border-gray-700 rounded-xl p-6 transition-all duration-300 overflow-hidden group hover:-translate-y-2 lg:hover:border-blue-400 lg:hover:bg-gray-800 lg:hover:shadow-lg lg:hover:shadow-blue-400/15"
                    >
                      <Image
                        src={profileImageUrl?.stringValue || pic}
                        alt={name?.stringValue}
                        width={300}
                        height={600}
                        className="md:h-[384px] h-full md:w-[576px] md:rounded-xl rounded-md"
                      />
                      <div className="flex flex-col gap-3 pb-5">
                        <h1 className="text-[2.6rem] md:!text-[1.7rem] font-medium pl-5">
                          {name?.stringValue}
                        </h1>
                        <h1 className="block md:hidden text-[1.15rem] font-normal pl-5">
                          {position?.stringValue}
                        </h1>

                        <div className="flex gap-3 pl-5">
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
                            onClick={handleLinkClick(
                              `mailto:${member.mapValue.fields.email?.stringValue}`
                            )}
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
                }
              )}
        </div>
        <div className="flex justify-start items-center gap-5 py-10">
          <p className="font-medium md:!text-[1.5rem]">View Past Teams:</p>
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
