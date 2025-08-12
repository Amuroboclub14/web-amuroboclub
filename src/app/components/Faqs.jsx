import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

export default function Faqs() {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const faqData = [
    {
      id: 1,
      question:
        "How can I join the robotics club? Is there an application process?",
      answer:
        "You can download the AMURoboclub Android App and join the club from there. A nominal membership fee of Rs.250/- is charged which gives you access to the club's inventory, experts and exclusive classes as well as discounts on various events we conduct throughout the year.",
    },
    {
      id: 2,
      question: "What types of robots does your club build?",
      answer:
        "Our club builds a variety of robot types including wheeled robots, drones, robotic arms, and even robots that can swim underwater! We like taking on new challenges and building different kinds of robots every year.",
    },
    {
      id: 3,
      question: "Where can I visit the club?",
      answer:
        "WS-18, Department of Mechnical Engineering, AMU Campus · +91 7906350149 ",
    },
    {
      id: 4,
      question:
        "What resources or parts does the club provide for building robots?",
      answer:
        "Our club has a parts inventory with things like motors, sensors, controllers and structural materials that members can use for their robot projects. We also have access to 3D printers, laser cutters and a full woodshop to build custom parts.",
    },
    {
      id: 5,
      question: "What competitions or events does the club participate in?",
      answer:
        "Each year our club competes in various national competitions (like Smart India Hackathon) as well as international ones like in the ABU Asia-Pacific Robot Contest.",
    },
    {
      id: 6,
      question:
        "Do you have to know how to code or have robotics experience to join?",
      answer:
        "No experience required! Our members have a wide range of skill levels. We teach coding and electronics skills needed so anyone can learn.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-8 py-12 sm:py-16 lg:py-20">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h1 className="text-[20px] lg:text-[24px] font-bold text-white mb-4 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-[16px] !font-mono text-blue-400 font-medium">
            Everything you need to know about our Robotics club
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16 lg:mb-20">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="!font-mono bg-gray-900 border-2 border-gray-800 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:border-blue-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-400/10"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full text-justify focus:outline-none"
              >
                <div className=" flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h3 className=" text-[14px] sm:text-[16px] font-semibold text-blue-400 leading-tight">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {openItems[index] ? (
                      <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 transition-transform duration-200" />
                    ) : (
                      <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 transition-transform duration-200" />
                    )}
                  </div>
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openItems[index]
                    ? "max-h-96 opacity-100 mt-4 sm:mt-6"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="ml-11 sm:ml-14">
                  <p className="text-gray-300 text-[12px] sm:text-[14px] leading-relaxed">
                    {faq.answer
                      .split(
                        /(\bAMURoboclub Android App\b|\bnominal membership fee of Rs\.250\/-\b|\bvariety of robot types\b|\bMS-18, Department of Mechanical Engineering, AMU Campus\b|\bparts library\b|\b3D printers, laser cutters and a full workshop\b|\bnational competitions\b|\binternational ones\b|\bNo experience required!\b)/g
                      )
                      .map((part, i) => {
                        const highlights = [
                          "AMURoboclub Android App",
                          "nominal membership fee of Rs. 200/-",
                          "variety of robot types",
                          "MS-18, Department of Mechanical Engineering, AMU Campus",
                          "parts library",
                          "3D printers, laser cutters and a full workshop",
                          "national competitions",
                          "international ones",
                          "No experience required!",
                        ];

                        return highlights.includes(part) ? (
                          <span
                            key={i}
                            className="text-blue-400 !text-base sm:!text-lg leading-relaxed font-semibold"
                          >
                            {part}
                          </span>
                        ) : (
                          part
                        );
                      })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="text-center bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12 border-2 border-gray-700">
          <h3 className="text-[16px] sm:text-[18px] font-bold text-blue-400 mb-4 sm:mb-6">
            Still Curious?
          </h3>
          <p className="text-gray-400 text-[16px] !font-mono mb-8 sm:mb-10">
            Get in touch with us and we&apos;ll be happy to help!
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center gap-6 sm:gap-12">
            <div className="flex items-center justify-between gap-3 sm:gap-4 text-gray-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-xl sm:!text-2xl">
                📍
              </div>
              <span className="!font-mono text-justify text-base sm:text-lg font-medium">
                WS-18, Department of Mechnical Engineering, AMU Campus
              </span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-gray-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center !text-xl sm:!text-2xl">
                📱
              </div>
              <span className="!font-mono text-base sm:text-lg font-medium">
                +91 7906350149
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
