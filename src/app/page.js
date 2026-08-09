"use client";

import Image from "next/image";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import team from "../assets/roboclub-team.jpeg";
import * as motion from "framer-motion/client";
import Faqs from "./components/Faqs";
import OpportunitiesOffered from "./components/OpportunitiesOffered";
import WhatSetsUsApart from "./components/WhatSetsUsApart";
import SSAMUSAT from "./components/SSAMUSAT";
import OurProjects from "./components/OurProjects";
import Link from "next/link";

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

          <Link
            href="/recruitments/technoxian-11"
            className="group relative mb-6 block w-full max-w-md overflow-hidden rounded-2xl border border-orange-400/50 bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-black/40 p-[1px] shadow-[0_0_40px_-14px_rgba(251,146,60,0.6)] transition-transform duration-300 hover:scale-[1.015]"
          >
            <div className="relative rounded-2xl bg-black/80 px-4 py-3.5 backdrop-blur-sm">
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-500/25 blur-2xl transition-opacity group-hover:opacity-80" />
              <div className="relative flex items-center justify-between gap-3">
                <div className="min-w-0 text-left">
                  <div className="mb-1 inline-flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-400" />
                    </span>
                    <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-orange-400">
                      Now recruiting
                    </p>
                  </div>
                  <p className="text-[16px] md:text-[18px] font-bold text-white !font-mono">
                    Technoxian 11.0 Project Teams
                  </p>
                  <p className="text-[12px] text-gray-400 !font-mono mt-0.5">
                    Join our championship builds — applications open.
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-gradient-to-r from-orange-400 to-amber-300 px-3.5 py-2 text-[12px] font-bold text-black !font-mono shadow-md transition-transform group-hover:translate-x-0.5">
                  Apply →
                </span>
              </div>
            </div>
          </Link>

          <div className="flex items-center justify-between gap-[24px] w-fit flex-wrap">
            <a
              className="group flex items-center gap-5 border-2 border-green-600 cursor-pointer bg-green-600 text-white transition-colors duration-300 px-5 py-3 rounded-full font-bold text-[1.1rem]"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Link href={"/membershipForm"}>
                <p className="text-[18px] text-white !font-mono">
                  Become a member
                </p>
              </Link>
            </a>
            <a
              className="group cursor-pointer flex items-center gap-5 border-2 border-green-600  transition-colors duration-300 px-5 py-3 rounded-full font-bold text-[1.1rem]"
              target="_blank"
              rel="noopener noreferrer"
              download={true}
              href="/app.apk"
            >
              <p className="text-[18px] text-white !font-mono">
                Download the App
              </p>
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
            className="w-full  md:w-[40vw] rounded-l-[3rem] relative max-w-full"
          />
          <Link
            href="/recruitments/technoxian-11"
            className="absolute bottom-4 left-8 z-10 inline-flex items-center gap-2 rounded-full border border-orange-400/60 bg-black/75 px-3 py-1.5 text-white backdrop-blur-md transition hover:bg-orange-500 hover:text-black"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-400" />
            </span>
            <span className="text-[12px] font-mono font-semibold">
              Technoxian 11.0 — Apply
            </span>
          </Link>
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
