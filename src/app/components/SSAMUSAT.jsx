import React from "react";
import amusat from "../../assets/ssamusat.jpeg";
import Image from "next/image";

export default function SSAMUSAT() {
  const amusatFeatures = [
    {
      icon: "🎯",
      heading: "Mission Focus",
      desc: "Pioneer satellite technology at AMU",
    },
    {
      icon: "⚙️",
      heading: "Core Systems",
      desc: "4 specialized development teams",
    },
    {
      icon: "🌍",
      heading: "Target Orbit",
      desc: "Low Earth Orbit deployment",
    },
    {
      icon: "🏆",
      heading: "Expert Support",
      desc: "ISRO guidance & mentorship",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto px-20 py-20">
        {/* Project Header */}
        <div className="text-center mb-24">
          <h1 className="!text-5xl lg:!text-6xl font-bold text-white mb-3 tracking-tight">
            SSSAMUSAT
          </h1>
          <p className="!text-[18px] text-blue-400 font-normal mb-8">
            AMU&apos;s First Satellite Project
          </p>
          <div className="inline-block bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-3 rounded-full !text-[16px] font-semibold shadow-lg shadow-blue-600/30">
            🚀 Launched December 2021
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Section */}
          <div className="flex flex-col gap-10">
            {/* Project Description */}
            <div className="text-gray-300 !text-[16px] leading-relaxed mb-5">
              The{" "}
              <span className="text-blue-400 !text-[16px] font-semibold">
                SSSAMUSAT project
              </span>{" "}
              marks AMU&apos;s groundbreaking entry into satellite technology,
              launched by students and alumni of Zakir Husain College of
              Engineering and Technology. Inspired by NAAC&apos;s call for
              Aerial Technology advancement, the initiative quickly evolved into
              specialized teams focused on advanced satellite systems. With
              expert guidance from{" "}
              <span className="!text-[16px] text-blue-400 font-semibold">
                ISRO professionals
              </span>
              , it aims for Low Earth Orbit deployment— a milestone in
              AMU&apos;s aerospace research.
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {amusatFeatures.map((feature, idx) => {
                return (
                  <div className="bg-gray-900 border-2 border-gray-700 rounded-2xl p-4 transition-all duration-300 text-center hover:border-blue-400 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-400/10">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl flex items-center justify-center !text-2xl mx-auto mb-4 shadow-lg shadow-blue-600/30">
                      {feature.icon}
                    </div>
                    <h3 className="text-blue-400 !text-lg mb-3 font-semibold">
                      {feature.heading}
                    </h3>
                    <p className="text-gray-300 !text-sm leading-snug">
                      {feature.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team Section */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
            {/* Placeholder SVG Team Image */}
            <div className="w-full h-full transition-transform duration-300 group-hover:scale-105">
              <Image
                src={amusat}
                alt="team"
                className="w-full md:rounded-[1rem] rounded-md -mr-5 shadow-xl"
              />

              {/* Overlay */}
              <div className="absolute p-3 bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-black/30">
                <h4 className="text-blue-400 !text-xl lg:!text-2xl mb-2">
                  SSAMUSAT- Project Team
                </h4>
                <p className="text-gray-300 !text-base lg:!text-lg">
                  Students & Alumni of Zakir Husain College of Engineering and
                  Technology
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-24 p-8 lg:p-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl border-2 border-gray-700">
          <h3 className="text-blue-400 !text-2xl lg:!text-3xl mb-5">
            Join the Mission
          </h3>
          <p className="text-gray-400 !text-lg lg:!text-xl mb-8 max-w-2xl mx-auto">
            Be part of AMU&apos;s aerospace revolution and contribute to
            cutting-edge satellite technology
          </p>
          <button className="inline-block bg-gradient-to-r from-blue-600 to-blue-400 text-white px-9 py-5 rounded-full !text-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-600/40 shadow-lg shadow-blue-600/30">
            Join Us
          </button>
        </div>
      </div>
    </div>
  );
}
