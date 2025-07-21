import OpportunityCard from "./ui/OpportunityCard";
import StatBox from "./ui/StatBox";
import Image from "next/image";
import team from "../../assets/roboclub-team.jpeg";
export default function OpportunitiesOffered() {
  const opportunities = [
    {
      icon: "🏆",
      title: "Competitions",
      description:
        "Step onto national stages where your ideas go head-to-head with the best. ",
    },
    {
      icon: "🛠️",
      title: "Hands-On Workshops",
      description:
        "Explore the real world of robotics through engaging, immersive experiences.",
    },
    {
      icon: "💼",
      title: "Career Growth & Mentorship ",
      description:
        "Get one-on-one guidance, industry exposure, and a roadmap to success.\nAt AMURoboClub, it's more than just tech—it's a community.",
    },
    {
      icon: "🎓",
      title: "Networking",
      description:
        "Connect with like-minded students, alumni, and professionals from across the country. Build friendships, find teammates, and grow your circle.",
    },
  ];

  const badges = ["🤖", "⚡", "🚀"];
  return (
    <div className="bg-[#161616] min-h-screen  text-white overflow-hidden relative">
      <div className="flex items-start min-h-screen px-8 sm:px-12 gap-4 sm:gap-8 lg:gap-24 mb-16  mx-auto mt-8 flex-col lg:flex-row py-16">
        {/* Image Section */}
        <div className="flex-[0.7] relative h-full">
          <div className="w-full mx-auto">
            <div className="relative">
              <div className="flex flex-col items-center justify-center gap-[24px] max-w-[320px] w-full mx-auto">
                <Image
                  src={team}
                  alt="AMURoboClub Team"
                  className="h-80 lg:h-[420px] w-full object-cover rounded-2xl border-2 border-blue-400 transition-all duration-300 filter brightness-90 group-hover:-translate-y-2 group-hover:border-cyan-400 group-hover:brightness-100 group-hover:shadow-xl group-hover:shadow-blue-400/20"
                />
                {/* stats for large screens */}
                <div className="hidden lg:flex flex-col items-stretch lg:items-center gap-10">
                  <div className="flex gap-8 justify-center lg:justify-start">
                    <StatBox number={50} label="Projects" />
                    <StatBox number={100} label="Members" />
                    <StatBox number={25} label="Awards" />
                  </div>
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
        <div className="flex-[1] max-w-[100%]">
          <h1 className="text-[24px] lg:!text-[32px] !leading-tight mb-8 text-white">
            What Opportunities Do We{" "}
            <span className="text-gradient relative inline-block font-extrabold !leading-tight">
              Offer?
            </span>
          </h1>

          <p className="text-[18px] !font-mono text-gray-300 mb-8 font-normal">
            <span className="text-blue-400 font-semibold bg-blue-400/10 py-1">
              AMURoboClub
            </span>{" "}
            is a fun and active place where students explore robotics, build
            things together, and learn by doing. We&apos;re all about turning
            passion into skills that help you grow and build{" "}
            <span className="text-blue-400 font-semibold bg-blue-400/10 px-2 py-1 rounded">
              a great future
            </span>
            .
          </p>

          {/* Opportunities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="flex flex-col items-center gap-10 lg:hidden mt-8 ">
            <div className="flex gap-8 justify-center">
              <StatBox number={50} label="Projects" />
              <StatBox number={100} label="Members" />
              <StatBox number={25} label="Awards" />
            </div>

          
              
              
            
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
