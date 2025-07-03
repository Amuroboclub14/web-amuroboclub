import { useState } from "react";

interface OpportunityCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function OpportunityCard({
  icon,
  title,
  description,
}: OpportunityCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative !font-mono  border-blue-400 bg-gray-800 shadow-lg lg:bg-gray-900 border lg:border-gray-700 rounded-xl p-6 transition-all duration-300 overflow-hidden group hover:-translate-y-2 lg:hover:border-blue-400 lg:hover:bg-gray-800 lg:hover:shadow-lg lg:hover:shadow-blue-400/15"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

      <span
        className={`text-3xl block mb-4 transition-all duration-300 grayscale-0 ${
          isHovered ? "lg:grayscale-0" : "lg:grayscale"
        }`}
      >
        {icon}
      </span>
      <div className="font-bold text-white mb-2 !text-[16px]">{title}</div>
      <div className="!text-[14px] text-gray-400 leading-relaxed">
        {description}
      </div>
    </div>
  );
}
