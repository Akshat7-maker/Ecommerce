import React from "react";

const CircleProgress = ({ percentage, size = 100, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          className="text-gray-300"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Foreground circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          className={percentage < 0 ? "text-red-500" : "text-green-500"}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.3s ease",
          }}
        />
      </svg>
      {/* Percentage text */}
      <div className="absolute text-xl font-semibold text-gray-700">
        {`${percentage}%`}
      </div>
    </div>
  );
};

export default CircleProgress;
