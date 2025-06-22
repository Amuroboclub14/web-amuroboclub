import React from "react";

export default function WhatSetsUsApart() {
  const features = [
    { icon: "⚡", text: "Innovation Hub" },
    { icon: "🔧", text: "Hands-on Learning" },
    { icon: "🏆", text: "Competition Ready" },
    { icon: "📈", text: "Career Growth" },
  ];

  const impacts = [
    { icon: "🏢", text: "Top Companies" },
    { icon: "🎓", text: "GATE Success" },
    { icon: "🏛️", text: "IIT Admissions" },
    { icon: "🚀", text: "Career Excellence" },
  ];

  return (
    <div className="min-h-screen w-full bg-black !text-white">
      <div className="container mx-auto px-8 py-16">
        {/* Header Section */}
        <header className="text-center mb-16 lg:mb-12 md:mb-10 sm:mb-8">
          <h1 className="mb-4 !text-5xl lg:!text-6xl font-semibold !leading-tight">
            <span className="!text-5xl lg:!text-6xl font-semibold !leading-tight bg-gradient-to-br from-white to-sky-300 bg-clip-text text-transparent">
              What Sets Our Club Apart
            </span>
            ?
          </h1>
          <p className="!text-[18px] text-sky-300 mt-8">
            Excellence through Innovation & Implementation
          </p>
        </header>

        <div className="flex-col md:flex md:flex-row justify-between items-start gap-16 mt-20">
          {/* Mission Card */}
          <section className="relative bg-zinc-900/60 border border-zinc-700 rounded-xl p-10 mb-12 overflow-hidden flex-1">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-sky-300" />
            <h2 className="!text-[24px] text-sky-300 font-semibold mb-4 sm:mb-3">
              Our Mission
            </h2>
            <p className="!text-[16px] text-gray-300 leading-relaxed">
              Foster interest and showcase talent in robotics through engaging
              activities, competitions, and year-round workshops. We create a
              collaborative environment where experienced seniors and fresh
              innovators work together, encouraging participation in national
              and international contests across all branches and academic years.
            </p>
          </section>

          {/* Features Grid */}
          <section className="flex-1 grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2  gap-6 lg:gap-5 md:gap-4 sm:gap-4 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 lg:p-6 md:p-5 sm:p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg transition-all duration-300 hover:bg-blue-500/10 hover:-translate-y-1 active:scale-95 md:hover:transform-none md:active:bg-blue-500/15"
              >
                <span className="!text-[24px] block mb-4">{feature.icon}</span>
                <div className="!text-[16px]  text-gray-300 font-medium">
                  {feature.text}
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* Impact Section */}
        <section className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/60 rounded-xl p-8 lg:p-7 md:p-6 sm:p-5 border border-zinc-700 my-12 lg:my-10 md:my-8 sm:my-6">
          <h3 className="!text-[24px] text-sky-300 font-semibold mb-6 lg:mb-5 md:mb-4 sm:mb-4 text-center">
            Our Impact
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {impacts.map((impact, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center w-full justify-start md:justify-center p-4 sm:p-3 bg-blue-500/5 rounded-md transition-all duration-300 hover:bg-blue-500/10
                  sm:flex sm:items-center sm:gap-3"
              >
                <span className={`!text-[24px] block mb-2 `}>
                  {impact.icon}
                </span>
                <div className="!text-[16px] text-center md:text-justify lg:!text-[18px] text-gray-400">
                  {impact.text}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
