//old one
// import { Skeleton } from "@mui/material";
// import React from "react";
// import { Pie } from "react-chartjs-2";
// import useLeaveTable from "../../../../hooks/Leave/useLeaveTable";

// const EmployeeLeavePie = () => {
//   const RemainingLeaves = useLeaveTable();

//   const { data: remainingLeaves, isLoading } = RemainingLeaves;

//   const data = {
//     labels: remainingLeaves?.leaveTypes?.map((item) => item.leaveName) ?? [],
//     datasets: [
//       {
//         label: "Total Leaves",
//         data: remainingLeaves?.leaveTypes?.map((item) => item.count) ?? [],
//         backgroundColor:
//           remainingLeaves?.leaveTypes?.map((item) => item.color) ?? [],
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: true,
//         position: "right",
//       },
//     },
//   };
//   return (
//     <article className="mb-2 w-full h-max bg-white rounded-md border">
//       {isLoading ? (
//         <div className="p-4 !pb-2 space-y-2">
//           <h1 className="text-lg  font-bold text-[#67748E]">
//             Total Leaves Left
//           </h1>
//           <Skeleton variant="rounded" height={150} animation="wave" />
//         </div>
//       ) : (
//         <div className="w-full">
//           <div className="border-b-[2px] flex w-full px-4 items-center justify-between">
//             <div className="flex items-center gap-2 py-2  ">
//               <h1 className="text-lg  font-bold text-[#67748E]">
//                 Total Leaves Left
//               </h1>
//             </div>
//           </div>
//           {/* <Divider variant="fullWidth" orientation="horizontal" /> */}
//           <div className="p-2  w-auto ">
//             <Pie data={data} options={options} />
//           </div>
//         </div>
//       )}
//     </article>
//   );
// };

// export default EmployeeLeavePie;


import { Skeleton } from "@mui/material";
import React, { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import useLeaveTable from "../../../../hooks/Leave/useLeaveTable";
import AOS from 'aos';
import 'aos/dist/aos.css';


const EmployeeLeavePie = () => {
  const RemainingLeaves = useLeaveTable();
  const { data: remainingLeaves, isLoading } = RemainingLeaves;

  
  useEffect(() => {
    AOS.init({ duration: 800, once: true }); 
  }, []);

  const data = {
    labels: remainingLeaves?.leaveTypes?.map((item) => item.leaveName) ?? [],
    datasets: [
      {
        label: "Total Leaves",
        data: remainingLeaves?.leaveTypes?.map((item) => item.count) ?? [],
        backgroundColor:
          remainingLeaves?.leaveTypes?.map((item) => item.color) ?? [],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          color: "#444", 
          font: {
            size: 14, 
          },
        },
      },
    },
  };

  return (
    <article
      className="mb-2 w-full  h-max bg-gray-200 rounded-md shadow-md border border-gray-300 "
      data-aos="fade-up" 
    >
      <div className="flex flex-col ">
        <h1
          className="text-lg  font-semibold text-[#67748E] pt-4 px-4 mb-2"
          data-aos="fade-right" 
        >
          Total Leaves Left
        </h1>
        <br />
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-54">
            <Skeleton
              variant="rounded"
              width="100%"
              height="100%"
              animation="wave"
              data-aos="fade-in" 
            />
          </div>
        ) : (
          <div className="w-full h-54 pb-4" data-aos="fade-in"> 
            <Pie data={data} options={options} />
          </div>
        )}
      </div>
    </article>
  );
};

export default EmployeeLeavePie;
