import React from "react";

const DogSVG = () => {
  return (
    <svg
      width="200px"
      height="200px"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        @keyframes wag {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(30deg); }
          50% { transform: rotate(-30deg); }
          75% { transform: rotate(15deg); }
          100% { transform: rotate(0deg); }
        }
        .tail {
          animation: wag 1s infinite;
          transform-origin: 50% 50%;
        }
      `}</style>

      <g>
        <circle cx="100" cy="100" r="40" fill="#FFD700" /> {/* Dog's body */}
        <circle cx="80" cy="90" r="10" fill="#000" /> {/* Dog's eye */}
        <circle cx="120" cy="90" r="10" fill="#000" /> {/* Dog's eye */}
        <path
          d="M100 120 Q90 130 80 120"
          stroke="#000"
          strokeWidth="2"
          fill="none"
        />{" "}
        {/* Dog's mouth */}
        <rect
          x="140"
          y="100"
          width="10"
          height="40"
          fill="#8B4513"
          className="tail"
        />{" "}
        {/* Dog's tail */}
      </g>
    </svg>
  );
};

export default DogSVG;
