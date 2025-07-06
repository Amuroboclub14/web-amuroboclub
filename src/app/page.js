"use client";

import Image from "next/image";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import team from "../assets/IMG_1559.webp";
import * as motion from "framer-motion/client";
import Faqs from "./components/Faqs";
import OpportunitiesOffered from "./components/OpportunitiesOffered";
import WhatSetsUsApart from "./components/WhatSetsUsApart";
import SSAMUSAT from "./components/SSAMUSAT";
import OurProjects from "./components/OurProjects";

export default function Home() {
  return (
    <main className="bg-black max-w-[100vw] overflow-x-hidden">
      <Navbar />
      <div className="flex md:flex-row flex-col items-center justify-between gap-[5rem] md:gap-[2rem] px-2 md:pl-5 py-[3rem] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.3 }}
          className="md:w-[45%] flex flex-col px-5"
        >
          <p className="text-[1rem] leading-[1.5rem] mb-[1rem] md:leading-[2rem] md:text-[1.5rem] text-white font-bold text-justif-start pt-[1rem] text-mainblue ">
            Where Innovation meets{" "}
            <span className="text-gradient ">Implementation</span>.
          </p>
          <p className="text-justify text-[18px] text-white font-mono font-medium text-mainblue/90 mt-[15px] mb-[2rem]">
            At AMURoboClub, it&apos;s not just about building robots—it&apos;s
            about helping students become creative thinkers and problem-solvers.
            With awesome support from our ZHCET faculty, this is a space where
            ideas come to life, experiments are fun, and learning happens by
            doing cool projects together.
          </p>

          <div className="w-fit">
            <a
              className="group flex items-center gap-5 border-2 border-green-600 hover:bg-green-600 hover:text-white transition-colors duration-300 px-5 py-3 rounded-full font-bold text-[1.1rem]"
              href="https://drive.google.com/file/d/1RFu5NtxDXvg54ka9GJcrxYiexZaR1wXk/view?usp=sharing"
              target="_blank" // Optional: Opens in a new tab
              rel="noopener noreferrer" // Optional: Security for external links
            >
              <p className="text-[18px] text-white !font-mono">
                Download Our APP
              </p>
              <span className="flex justify-end w-0 h-4 -ml-2 pointer-events-none overflow-hidden transition-[width] duration-300 group-hover:w-6">
                <svg
                  className="block w-4 h-4 flex-initial pointer-events-none fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 9h-4V2H9v7H5l7 7 7-7zm-7 9H5v2h14v-2h-7z" />
                </svg>
              </span>
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.3 }}
          className="relative pl-5"
        >
          <div className="w-[90%] h-[30vh] bg-[#379040] rounded-l-[3rem] absolute -top-5 right-0"></div>
          <Image
            src={team}
            alt="team"
            placeholder="blur"
            className="w-full md:w-[40vw] rounded-l-[3rem] relative max-w-full"
          />
        </motion.div>
      </div>
      {/* What Opportunities do we offer */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <OpportunitiesOffered />
      </motion.div>

      {/* What sets us apart */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative -mt-10 md:pt-24"
      >
        <WhatSetsUsApart />
      </motion.div>

      {/* Our Projects */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <OurProjects />
      </motion.div>

      {/* SSAMUSAT*/}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative -mt-10 md:pt-8"
      >
        <SSAMUSAT />
      </motion.div>
      <Faqs />
      <br />
      <Footer />
    </main>
  );
}
