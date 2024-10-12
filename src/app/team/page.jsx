"use client"; // Keep this if you are using state management

import Image from "next/image";
import { useState } from "react";
import pic from "../../assets/profileSA1.jpg";
import linkedin from "../../assets/linkedin.png";
import x from "../../assets/x.png";
import Navbar from "../components/Navbar"; 

const teamData = {
  cords: [
    {
      name: "Imad Bin Asad",
      img: pic,
      position: "Co-ordinator",
      class: "Mechanical Class of 2025",
    },
    {
      name: "Suhaib Shahid",
      img: pic,
      position: "Co-ordinator",
      class: "Mechanical Class of 2025",
    },
    {
      name: "Fatima",
      img: pic,
      position: "Co-ordinator",
      class: "Mechanical Class of 2025",
    },
    {
      name: "Megha",
      img: pic,
      position: "Co-ordinator",
      class: "Mechanical Class of 2025",
    },
  ],
  jointcords: [
    {
      name: "Imad Bin Asad",
      img: pic,
      position: "Co-ordinator",
      class: "Mechanical Class of 2025",
    },
    {
      name: "Suhaib Shahid",
      img: pic,
      position: "Co-ordinator",
      class: "Mechanical Class of 2025",
    },
    {
      name: "Fatima",
      img: pic,
      position: "Co-ordinator",
      class: "Mechanical Class of 2025",
    },
    {
      name: "Megha",
      img: pic,
      position: "Co-ordinator",
      class: "Mechanical Class of 2025",
    },
  ],
  webdev: [
    {
      name: "Sharjeel Afridi",
      img: pic,
      position: "Web Developer",
      class: "Automobile Class of 2027",
      linkedin: "https://www.linkedin.com/in/sharjeelafridi/",
      x: "https://x.com/sharjeelafridi_"
    },
    {
      name: "Avyukt Soni",
      img: pic,
      position: "Web Developer",
      class: "Computer Class of 2027",
      linkedin: "https://www.linkedin.com/in/avyukt-soni-1b1b3b1b3/",
    },
  ],
  voluenteer: [
    {
      name: "Imad Bin Asad",
      img: pic,
      position: "Co-ordinator",
      class: "Mechanical Class of 2025",
    },
    {
      name: "Suhaib Shahid",
      img: pic,
      position: "Co-ordinator",
      class: "Mechanical Class of 2025",
    },
    {
      name: "Fatima",
      img: pic,
      position: "Co-ordinator",
      class: "Mechanical Class of 2025",
    },
    {
      name: "Megha",
      img: pic,
      position: "Co-ordinator",
      class: "Mechanical Class of 2025",
    },
  ],
  pr: [
    {
      name: "Imad Bin Asad",
      img: pic,
      position: "Co-ordinator",
      class: "Mechanical Class of 2025",
    },
    {
      name: "Suhaib Shahid",
      img: pic,
      position: "Co-ordinator",
      class: "Mechanical Class of 2025",
    },
    {
      name: "Fatima",
      img: pic,
      position: "Co-ordinator",
      class: "Mechanical Class of 2025",
    },
    {
      name: "Megha",
      img: pic,
      position: "Co-ordinator",
      class: "Mechanical Class of 2025",
    },
  ],
};

export default function Team() {
  const [teamType, setTeamType] = useState("cords");

  const handleClick = (type) => {
    setTeamType(type);
  };

  const handleLinkClick = (link) => () => {
    window.open(link, "_blank");
  };

  return (
    <main className="w-full min-h-screen text-[#0b2059]">
      <Navbar />
      <div className="h-screen md:h-[70vh] w-[100%] flex flex-col gap-10 justify-center items-center bg-gradient-to-b from-[rgb(242,246,255)] via-[rgb(242,246,255)] to-blue-100">
        <h1 className="text-[3rem] text-center w-[80%] md:text-[3.8rem] font-medium">
          Future-Focused Team
        </h1>
        <p className="text-[1.1rem] md:text-xl w-[80%] md:w-[70%] text-center">
          Pioneering innovative solutions and fostering a collaborative
          environment that empowers members to excel in robotics and technology.
        </p>
        <button className="group flex items-center gap-5 border-2 border-green-600 hover:bg-green-600 hover:text-white transition-colors duration-300 px-5 py-4 rounded-full font-bold text-[1.1rem]">
          Join Our Team
          <span className="flex justify-end w-0 h-4 -ml-2 pointer-events-none overflow-hidden transition-[width] duration-300 group-hover:w-6">
            <svg
              className="block w-4 h-4 flex-initial pointer-events-none fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              aria-hidden="true"
            >
              <path d="M113.3 47.41l183.1 191.1c4.469 4.625 6.688 10.62 6.688 16.59s-2.219 11.97-6.688 16.59l-183.1 191.1c-9.152 9.594-24.34 9.906-33.9 .7187c-9.625-9.125-9.938-24.38-.7187-33.91l168-175.4L78.71 80.6c-9.219-9.5-8.906-24.78 .7187-33.91C88.99 37.5 104.2 37.82 113.3 47.41z"></path>
            </svg>
          </span>
        </button>
      </div>

      <div className="flex flex-col items-start px-5 md:px-40 pt-20">
        <h1 className="text-4xl md:text-5xl font-medium text-center">
          Our Leadership Team
        </h1>
        <div className="flex gap-5 font-medium text-[0.89rem] md:text-xl pt-10">
          <h1
            className={`cursor-pointer pb-10 ${
              teamType === "cords"
                ? "border-b-2 border-blue-800 "
                : "text-[#0b2059]/80"
            }`}
            onClick={() => handleClick("cords")}
          >
            CO-ORDINATORS
          </h1>
          <h1
            className={`cursor-pointer pb-10 ${
              teamType === "jointcords"
                ? "border-b-2 border-blue-800"
                : "text-[#0b2059]/80"
            }`}
            onClick={() => handleClick("jointcords")}
          >
            JOINT CO-ORDINATORS
          </h1>
          <h1
            className={`cursor-pointer pb-10 ${
              teamType === "webdev"
                ? "border-b-2 border-blue-800"
                : "text-[#0b2059]/80"
            }`}
            onClick={() => handleClick("webdev")}
          >
            WEB DEVELOPERS
          </h1>
          <h1
            className={`cursor-pointer pb-10 ${
              teamType === "voluenteer"
                ? "border-b-2 border-blue-800"
                : "text-[#0b2059]/80"
            }`}
            onClick={() => handleClick("voluenteer")}
          >
            VOLUNTEERS
          </h1>
          <h1
            className={`cursor-pointer pb-10 ${
              teamType === "pr"
                ? "border-b-2 border-blue-800"
                : "text-[#0b2059]/80"
            }`}
            onClick={() => handleClick("pr")}
          >
            PR
          </h1>
        </div>

        {/* TEAM PHOTOS */}
        <div className="flex justify-between flex-wrap gap-5 pb-20">
          {teamData[teamType].map((member, index) => (
            <div
              key={index}
              className="flex flex-col gap-5 mt-10 w-[40vw] md:w-[18rem]  rounded-xl bg-[#dbe3f8]"
            >
              <Image
                src={member.img}
                alt={member.name}
                className="object-cover h-[10rem] rounded-tl-2xl"
              />
              <div className="flex flex-col gap-3 pb-5">
                <h1 className="text-[1.6rem] font-medium pl-5">
                  {member.name}
                </h1>
                <h1 className="text-sm font-normal pl-5">{member.position}</h1>
                <h1 className="text-sm font-normal pl-5">{member.class}</h1>
                <div className="flex ">
                  <Image
                    src={linkedin}
                    alt="linkedin"
                    className="w-10 h-10 ml-5 cursor-pointer"
                    onClick={handleLinkClick(member.linkedin)}
                  />
                  {member.x && (
                    <Image
                      src={x}
                      alt="linkedin"
                      className="w-10 h-10 ml-5 cursor-pointer"
                      onClick={handleLinkClick(member.x)}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
