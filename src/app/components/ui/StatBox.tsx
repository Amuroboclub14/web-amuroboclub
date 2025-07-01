import React, { useState, useEffect, useRef } from "react";

interface StatBoxProps {
  number: number;
  label: string;
}

export default function StatBox({ number, label }: StatBoxProps) {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let current = 0;
          const increment = number / 40;
          const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
              setCurrentNumber(number);
              clearInterval(timer);
            } else {
              setCurrentNumber(Math.floor(current));
            }
          }, 50);
        }
      },
      { threshold: 0.7, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [number, hasAnimated]);

  return (
    <div ref={ref} className="text-center">
      <span className="text-[20px] font-bold text-blue-400 block leading-none">
        {currentNumber}+
      </span>
      <span className="text-[12px] text-gray-500 uppercase tracking-wider mt-2 block">
        {label}
      </span>
    </div>
  );
}
