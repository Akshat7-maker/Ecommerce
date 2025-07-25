import React from "react";
import CircleProgress from "./CircularProgess";
import { CircularProgressbar } from "react-circular-progressbar";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";

function Card({ heading, count, percentage, loading }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex justify-around">
      {/* left side */}
      <div className="flex flex-col justify-center">
        {/* heading */}
        <span className="font-bold text-2xl">{heading}</span>

        {/* description */}
        <span className="font-bold text-2xl">{count}</span>

        <span className="text-gray-500 text-xs ">Compared to last month</span>

        {/* price */}
        <span className="flex items-center gap-2">
          {percentage < 0 ? (
            <>
              <div>
                <HiTrendingDown className="text-red-500" />
              </div>

              <div>
                <span className="mt-5 font-bold ">{percentage}%</span>
              </div>
            </>
          ) : percentage === 0 ? (
            <>
              
              <div>
                <span className="mt-5 font-bold ">{percentage}%</span>
              </div>
            </>
          ) : (
            <>
              <div>
                <HiTrendingUp className="text-green-500" />
              </div>

              <div>
                <span className="mt-5 font-bold ">+{percentage}%</span>
              </div>
            </>
          )}
          {/* <div>
          <span className="mt-5 font-bold ">{percentage}%</span>
        </div> */}
        </span>
      </div>

      {/* right side */}

      {/* circular progress bar */}
      <div>
        <CircleProgress percentage={percentage} />
      </div>
    </div>
  );
}

export default Card;

// {
//   percentage < 0 ? (
//     <div>
//       <HiTrendingDown className="text-red-500" />
//     </div>

//   ) : (
//     <div>
//       <HiTrendingUp className="text-green-500" />
//     </div>
//   )
// }
// <div>
//   <span className="mt-5 font-bold ">{percentage}%</span>
// </div>
