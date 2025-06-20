"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import pic from "../../assets/nopicture.png";
import linkedin from "../../assets/linkedin.png";
import x from "../../assets/x.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

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
        const latestYear = querySnapshot.docs.length - (2026 - year); //-1 for latest year, as latest team last item of collection teams
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
        if (teamType === "PR") return !excludedPositions.includes(position);
        return position === teamType;
      });
    };
    setFilteredMembers(filterByTeamType());
  }, [members, teamType]);

  const handleLinkClick = (link) => () => window.open(link, "_blank");

  return (
    <main className="w-full min-h-screen text-[#0b2059]">
      <Navbar bgColor={"white"} />
      <section className="flex flex-col items-center px-5 md:px-[6.2rem] pt-20 font-mont">
        <h1 className="text-3xl md:text-5xl font-medium text-center">
          AMURoboclub Team <br />
          {year}-{parseInt(year) + 1}
        </h1>

        <div className="flex flex-row gap-x-20">
          <div className="hidden md:flex flex-col gap-5 font-medium text-[0.5rem] md:text-xl pt-10">
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
              className={`cursor-pointer py-5 px-1 ${
                teamType === type
                  ? "border-2 border-blue-800"
                  : "text-[#0b2059]/80"
              }`}
              onClick={() => setTeamType(type)}
            >
              {type.toUpperCase().replace("_", " ")}
            </h1>
          ))}
        </div>

        <div className="flex md:flex-row flex-col flex-wrap justify-center md:gap-[5rem] pb-20">
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
                      className="flex flex-col gap-5 mt-10 w-[40vw] md:w-[18rem]"
                    >
                      <Image
                        src={profileImageUrl?.stringValue || pic}
                        alt={name?.stringValue}
                        width={300}
                        height={600}
                        className="md:h-[384px] h-full md:w-[576px] md:rounded-xl rounded-md"
                      />
                      <div className="flex flex-col gap-2">
                        <h1 className="text-[1.6rem] font-medium pl-5">
                          {name?.stringValue}
                        </h1>
                        <h1 className="block md:hidden text-[1.15rem] font-normal pl-5">{position?.stringValue}</h1>
                        
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
        </div>
        <div className="flex justify-start items-center gap-5 py-10">
          <p className="font-medium">View Past Teams:</p>
          <select
            className="border border-gray-300 rounded-md p-2"
            onChange={(e) => setYear(e.target.value)}
          >
            {Array.from({ length: 6 }, (_, i) => 2025 - i).map((year) => (
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
