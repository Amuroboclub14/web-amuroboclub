import OpportunityCard from "./ui/OpportunityCard";
import StatBox from "./ui/StatBox";
import Image from "next/image";
import cord from "../../assets/coords.webp";

export default function OpportunitiesOffered() {
  const opportunities = [
    {
      icon: "🏆",
      title: "COMPETITIONS",
      description:
        "National & international robotics contests with hands-on experience",
    },
    {
      icon: "🛠️",
      title: "WORKSHOPS",
      description: "Technical training sessions and skill development programs",
    },
    {
      icon: "💼",
      title: "CAREER GROWTH",
      description:
        "Alumni network in top companies and successful career paths",
    },
    {
      icon: "🎓",
      title: "GATE PREPARATION",
      description: "Top ranks in competitive exams and IIT admissions",
    },
  ];

  const badges = ["🤖", "⚡", "🚀"];
  return (
    <div className="bg-[#161616] min-h-screen text-white overflow-hidden relative">
      <div className="flex items-start min-h-screen px-12 gap-12  lg:gap-24 mb-16  max-w-screen-xl mx-auto mt-24 flex-col lg:flex-row py-16">
        {/* Image Section */}
        <div className="flex-[0.7] relative h-full">
          <div className="w-full mx-auto">
            <div className="relative">
              <div className="flex flex-col items-center justify-center gap-[24px] max-w-[320px] w-full mx-auto">
                <Image
                  src={cord}
                  alt="AMURoboClub Team"
                  className="h-80 lg:h-[420px] object-cover rounded-2xl border-2 border-blue-400 transition-all duration-300 filter brightness-90 group-hover:-translate-y-2 group-hover:border-cyan-400 group-hover:brightness-100 group-hover:shadow-xl group-hover:shadow-blue-400/20"
                />
                {/* stats for large screens */}
                <div className="hidden lg:flex flex-col items-stretch lg:items-center gap-10">
                  <div className="flex gap-8 justify-center lg:justify-start">
                    <StatBox number={50} label="Projects" />
                    <StatBox number={100} label="Members" />
                    <StatBox number={25} label="Awards" />
                  </div>
                  <button className="relative bg-blue-400 !text-black border-none px-8 py-4 rounded-lg !font-bold !text-[18px] cursor-pointer transition-all duration-300 uppercase tracking-wider overflow-hidden hover:bg-cyan-400 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-400/30 group">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                    Join Our Club
                  </button>
                </div>
              </div>
              {/* Floating badges*/}
              <div className="absolute top-0 -right-5 lg:right-8 flex flex-col gap-3">
                {badges.map((badge, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 lg:w-20 lg:h-20 bg-gray-900 border-2 border-blue-400 rounded-xl flex items-center justify-center !text-xl transition-all duration-300 hover:bg-blue-400 hover:scale-110"
                    style={{
                      animation: `float 3s ease-in-out infinite`,
                      animationDelay: `${-index}s`,
                    }}
                  >
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-[1]">
          <h1 className="!text-5xl lg:!text-6xl font-extrabold !leading-tight mb-10 text-white">
            What Opportunities Do We{" "}
            <span className="text-gradient relative inline-block !text-5xl lg:!text-6xl font-extrabold !leading-tight">
              Offer?
            </span>
          </h1>

          <p className="!text-[18px] text-gray-300 mb-14 font-normal">
            <span className="!text-[18px] text-blue-400 font-semibold bg-blue-400/10 py-1">
              AMURoboClub
            </span>{" "}
            is a vibrant space for students to explore robotics and engineering,
            gain hands-on experience, and grow through teamwork and innovation.
            We&apos;re driven by a shared goal — turning passion into{" "}
            <span className="!text-[18px] text-blue-400 font-semibold bg-blue-400/10 px-2 py-1 rounded">
              successful careers
            </span>
            .
          </p>

          {/* Opportunities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {opportunities.map((opportunity, index) => (
              <OpportunityCard
                key={index}
                icon={opportunity.icon}
                title={opportunity.title}
                description={opportunity.description}
              />
            ))}
          </div>
          {/* stats for mobile */}
          <div className="flex flex-col items-center gap-10 lg:hidden mt-8">
            <div className="flex gap-8 justify-center">
              <StatBox number={50} label="Projects" />
              <StatBox number={100} label="Members" />
              <StatBox number={25} label="Awards" />
            </div>

            <button className="relative bg-blue-400 !text-black border-none px-8 py-4 rounded-lg !font-bold !text-[18px] cursor-pointer transition-all duration-300 uppercase tracking-wider overflow-hidden hover:bg-cyan-400 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-400/30 group">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              Join Our Club
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}
