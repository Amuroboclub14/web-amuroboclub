import React from "react";

const AnimatedSVG = () => {
  return (
    <svg
      className="absolute inset-0 block w-full h-full"
      width="1263.3333740234375"
      height="270"
      viewBox="0 0 1263.3333740234375 270"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g stroke="url(#route-gradient)" strokeWidth="8" strokeLinecap="round" vectorEffect="non-scaling-stroke">
        <path
          d="M 0 135 L 1199.3333740234375 135 C 1211.3333740234375 135 1223.3333740234375 147 1223.3333740234375 159 L 1223.3333740234375 236 C 1223.3333740234375 248 1235.3333740234375 260 1247.3333740234375 260 L 1263.3333740234375 260"
          vectorEffect="non-scaling-stroke"
        ></path>
      </g>
      <defs>
        <linearGradient id="route-gradient" x1="1491" y1="838.999" x2="389.758" y2="838.999" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#009D81">
            <animate
              attributeName="stop-color"
              values="#009D81; #084CFF; #4441DC; #7D1455; #009D81;"
              dur="8s"
              repeatCount="indefinite"
            ></animate>
          </stop>
          <stop offset="0.317708" stopColor="#084CFF">
            <animate
              attributeName="stop-color"
              values="#084CFF; #4441DC; #7D1455; #009D81; #084CFF;"
              dur="8s"
              repeatCount="indefinite"
            ></animate>
          </stop>
          <stop offset="0.614583" stopColor="#4441DC">
            <animate
              attributeName="stop-color"
              values="#4441DC; #7D1455; #009D81; #084CFF; #4441DC;"
              dur="8s"
              repeatCount="indefinite"
            ></animate>
          </stop>
          <stop offset="1" stopColor="#7D1455">
            <animate
              attributeName="stop-color"
              values="#7D1455; #009D81; #084CFF; #4441DC; #7D1455;"
              dur="8s"
              repeatCount="indefinite"
            ></animate>
          </stop>
        </linearGradient>
      </defs>
    </svg>
  );
};

export default AnimatedSVG;
