


import { Avatar } from "@mui/material";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import AdminCardSke from "../../Skeletons/AdminCardSke";
import AOS from "aos";
import "aos/dist/aos.css";

const SuperAdminCard = ({
  title,
  icon: Icon, 
  data,
  color,
  isLoading,
  className = "",
  cardSize, // New prop for card size
  DHcardSize,
}) => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const sizeClass = cardSize  || DHcardSize ; // Default size if cardSize is not provided
  // const sizeClass = DHcardSize ; // Default size if cardSize is not provided
 
  // console.log('😋😋😋✔😋😋',DHcardSize); //
  
  //  "w-64 h-28"
  // "w-52 h-30
  return (
    <motion.div
      data-aos="fade-up"
      whileHover={{ scale: 1.05 }}
      className={` h-28 relative p-4 bg-gradient-to-r from-blue-50 to-blue-100 border rounded-lg shadow-lg flex flex-col items-center justify-center transition-transform duration-300 mt-4 mb-4 hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-200 hover:to-blue-300 ${className} ${sizeClass}`}
    >
      {isLoading ? (
        <AdminCardSke />
      ) : (
        <>
          <motion.div
            whileHover={{ scale: 1.15, rotate: 10 }}
            className={`flex items-center justify-center ${color} rounded-full p-2 shadow-lg mb-2 absolute -top-8 ${sizeClass}`}
            style={{ width: "4rem", height: "4rem" }} // Explicitly set icon container size
          >
            <Avatar
              className="text-white"
              sx={{
                bgcolor: "transparent",
                // width: 49,
                // height: 49,
                width: "2.5rem", //  icon size
                height: "2.5rem",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "none",
              }}
              variant="rounded"
            >
              <Icon style={{ fontSize: "2em" }} />
            </Avatar>
          </motion.div>

       
          <div className="text-center mt-12 space-y-1">
            <h1 className="text-xl font-bold text-gray-800 mb-0.5">{title}</h1>
            <h2 className="text-lg font-bold text-blue-800">{data}</h2>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default SuperAdminCard;





















// import { Avatar } from "@mui/material";
// import React from "react";
// import AdminCardSke from "../../Skeletons/AdminCardSke";

// const SuperAdminCard = ({
//   title,
//   icon: Icon,
//   data,
//   color,
//   isLoading,
//   className = "",
// }) => {
//   return (
//     <>
//       {isLoading ? (
//         <AdminCardSke />
//       ) : (
//         <div className="hover:scale-105 !px-0 !py-0  h-max transition-all w-full flex-1 border bg-white !rounded-md ">
//           <div className="space-y-2 w-full !px-6 !py-2  flex justify-between">
//             <div className="w-[50%]">
//               <h1 className="md:text-md text-sm font-bold text-[#67748E]  ">
//                 {title}
//               </h1>
//               <h1 className="md:text-2xl text-xl">{data}</h1>
//             </div>
//             <Avatar
//               className={`${color} md:!text-4xl md:!w-[46px] !w-[32px]  !text-2xl  shadow-sm`}
//               variant="rounded"
//             >
//               <Icon />
//             </Avatar>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default SuperAdminCard;

//😎

// import { Avatar } from "@mui/material";
// import React, { useEffect } from "react";
// import { motion } from "framer-motion";
// import AdminCardSke from "../../Skeletons/AdminCardSke";
// import AOS from 'aos';
// import 'aos/dist/aos.css';

// const SuperAdminCard = ({
//   title,
//   icon: Icon,
//   data,
//   color,
//   isLoading,
//   className = "",
// }) => {
//   useEffect(() => {
//     AOS.init({ duration: 1000 });
//   }, []);

//   return (
//     <motion.div
//       data-aos="fade-up"
//       whileHover={{ scale: 1.05 }}
//       className={` h-28  relative p-4 bg-gradient-to-r from-blue-50 to-blue-100 border rounded-lg shadow-lg flex flex-col items-center justify-center transition-transform duration-300 mt-4 mb-4 hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-200 hover:to-blue-300 ${className}`}
//     >
//       {isLoading ? (
//         <AdminCardSke />
//       ) : (
//         <>
//           <motion.div
//             whileHover={{ scale: 1.15, rotate: 10 }}
//             className={`flex items-center justify-center ${color} rounded-full p-2 shadow-lg mb-2 absolute -top-8`}
//           >
//             <Avatar
//               className="text-white"
//               sx={{
//                 bgcolor: 'transparent',
//                 width: 49,
//                 height: 49,
//                 borderRadius: '50%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 boxShadow: 'none',
//               }}
//               variant="rounded"
//             >
//               <Icon style={{ fontSize: '2em' }} />
//             </Avatar>
//           </motion.div>

//           <div className="text-center mt-12 space-y-1">
//             <h1 className="text-xl font-bold text-gray-800 mb-0.5">{title}</h1>
//             <h2 className="text-lg font-bold text-blue-800">{data}</h2>
//           </div>
//         </>
//       )}
//     </motion.div>
//   );
// };

// export default SuperAdminCard;

