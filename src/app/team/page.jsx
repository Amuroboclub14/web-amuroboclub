"use client"; 

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import pic from "../../assets/nopicture.png";
import linkedin from "../../assets/linkedin.png";
import x from "../../assets/x.png";
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Team() {
  const [teamType, setTeamType] = useState("Coordinator");
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth < 768);

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);


  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "teams"));
        const latestYear = querySnapshot.docs.length - 1; //-1 for 2024-2025
        const allMembers = querySnapshot.docs[latestYear]?._document.data.value.mapValue.fields.members.arrayValue.values || [];
        setMembers(allMembers);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    fetchMembers();
  }, []);

  // Filtering members based on selected team type
  useEffect(() => {
    const excludedPositions = ["Coordinator", "Joint Coordinator", "Web Developer", "App Developer", "Volunteer"];

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
    <main className="w-full min-h-screen text-[#0b2059]">
      <Navbar bgColor={'white'}/>
      <section className="flex flex-col items-center px-5 md:px-[6.2rem] pt-20 font-mont">
        <h1 className="text-3xl md:text-5xl font-medium text-center">AMURoboclub Team <br></br>2024-2025</h1>
        <div className="hidden md:flex gap-5 font-medium text-[0.5rem] md:text-xl pt-10">
          {["Coordinator", "Joint Coordinator", "Web Developer", "App Developer", "Volunteer", "pr"].map((type) => (
            <h1
              key={type}
              className={`cursor-pointer py-5 px-1 ${teamType === type ? "border-b-2 border-blue-800" : "text-[#0b2059]/80"}`}
              onClick={() => setTeamType(type)}
            >
              {type.toUpperCase().replace("_", " ")}
            </h1>
          ))}
        </div>

        <div className="flex md:flex-row flex-col flex-wrap justify-center md:gap-[6rem] pb-20">
        {(isSmallScreen ? members : filteredMembers).map((member, index) => {
            const { name, position, profileImageUrl} = member.mapValue.fields;
            return (
              <div key={index} className="flex flex-col gap-5 mt-10 w-[40vw] md:w-[18rem]">
                <Image src={profileImageUrl?.stringValue || pic} alt={name?.stringValue}width={300} height={600} className="h-[70vh] w-full md:rounded-xl rounded-md" />
                <div className="flex flex-col gap-3 pb-5">
                  <h1 className="text-[1.6rem] font-medium pl-5">{name?.stringValue}</h1>
                  <h1 className="text-[1.15rem] font-normal pl-5">{position?.stringValue}</h1>
                  {/* <div className="flex">
                    {linkedin?.stringValue && (
                      <Image src={linkedin} alt="LinkedIn" className="w-10 h-10 ml-5 cursor-pointer" onClick={handleLinkClick(linkedin?.stringValue)} />
                    )}
                    {x?.stringValue && (
                      <Image src={x} alt="X" className="w-10 h-10 ml-5 cursor-pointer" onClick={handleLinkClick(x?.stringValue)} />
                    )}
                  </div> */}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <Footer />
    </main>
  );
}
