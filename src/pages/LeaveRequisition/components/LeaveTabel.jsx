// import { Help, MoreHoriz, MoreVert } from "@mui/icons-material";
// import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// import { IconButton, Popover, Skeleton, Tooltip } from "@mui/material";
// import Divider from "@mui/material/Divider";
// import React, { useContext, useState } from "react";
// import { TestContext } from "../../../State/Function/Main";
// import useLeaveRequesationHook from "../../../hooks/QueryHook/Leave-Requsation/hook";
// import SummaryTable from "./summaryTable";

// const LeaveTable = () => {
//   const { handleAlert } = useContext(TestContext);
//   const [anchorEl, setAnchorEl] = useState(null);

//   const { data, isLoading, isError, error } = useLeaveRequesationHook();

//   if (isError) {
//     handleAlert(
//       true,
//       "error ",
//       error?.response?.data?.message || "Sorry Server is under maintainance"
//     );
//     return (
//       <article className="w-[350px] h-max py-6 bg-white border-red-700 border shadow-xl rounded-lg ">
//         <h1 className="text-xl px-8 font-semibold flex items-center gap-3 ">
//           <Help className="text-red-700" /> Failed to load data
//         </h1>
//         <Divider
//           className="pt-6 !border-red-700"
//           variant="fullWidth"
//           orientation="horizontal"
//         />
//         <div className="w-full px-6 mt-4 space-y-4 ">
//           {[1, 2, 3, 4].map((index) => (
//             <div key={index} className="mt-6">
//               <Skeleton variant="text" className="w-[15%] h-6 text-lg " />
//               <Skeleton
//                 variant="text"
//                 className="w-[25%] !h-8 !mb-4 text-md "
//               />
//               <Divider
//                 variant="fullWidth"
//                 className="!border-red-700 !border"
//                 orientation="horizontal"
//               />
//             </div>
//           ))}
//         </div>
//       </article>
//     );
//   }
//   if (isLoading) {
//     return (
//       <article className="w-full md:w-[350px] h-max py-6 bg-white shadow-xl rounded-lg ">
//         <h1 className="text-xl px-8 font-semibold flex items-center gap-3 ">
//           <AccountBalanceIcon className="text-gray-400" /> Balance Leaves
//           <Tooltip title="Click to get Summary for current month">
//             <IconButton>
//               <MoreHoriz className="!text-[19px] text-black" />
//             </IconButton>
//           </Tooltip>
//         </h1>
//         <Divider
//           className="pt-6"
//           variant="fullWidth"
//           orientation="horizontal"
//         />
//         <div className="w-full px-6 mt-4 space-y-4 ">
//           {[1, 2, 3, 4].map((index) => (
//             <div key={index} className="mt-6">
//               <Skeleton variant="text" className="w-[15%] h-6 text-lg " />
//               <Skeleton
//                 variant="text"
//                 className="w-[25%] !h-8 !mb-4 text-md "
//               />
//               <Divider variant="fullWidth" orientation="horizontal" />
//             </div>
//           ))}
//         </div>
//       </article>
//     );
//   }

//   if (isError) {
//     return <p>Error loading data</p>;
//   }
//   const handlePopoverOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handlePopoverClose = () => {
//     setAnchorEl(null);
//   };
//   return (
//     <article className="md:w-[350px] w-full h-max bg-white shadow-lg rounded-lg ">
//       <h1 className="text-xl py-6 px-6 font-semibold flex items-center gap-3 justify-between">
//         <AccountBalanceIcon className="text-gray-400" />
//         <div>Balance Leaves</div>
//         <Tooltip title="Click to get Summary for current month">
//           <IconButton onClick={handlePopoverOpen}>
//             <MoreVert className="!text-[19px] text-black" />
//           </IconButton>
//         </Tooltip>
//       </h1>
//       <div className="w-full">
//         {data?.leaveTypes?.map((item, index) => {
//           return (
//             <div key={index} style={{ background: item.color }}>
//               <div className="flex justify-between items-center py-6 px-6">
//                 <h1 className="text-md text-gray-200 font-bold tracking-wide">
//                   {item.leaveName}
//                 </h1>
//                 <h1 className="text-lg tracking-wide font-bold text-gray-200">
//                   {item.count}
//                 </h1>
//               </div>
//             </div>
//           );
//         })}
//         <div className="flex justify-between items-center py-6 px-6">
//           <h1 className="text-md text-gray-200 font-bold tracking-wide">
//             Total Leave Balance
//           </h1>
//           <h1 className="text-lg tracking-wide text-gray-400">
//             {data.totalCoutn}
//           </h1>
//         </div>
//       </div>

//       <Popover
//         open={Boolean(anchorEl)}
//         anchorEl={anchorEl}
//         onClose={handlePopoverClose}
//         anchorOrigin={{
//           vertical: "bottom",
//           horizontal: "left",
//         }}
//       >
//         <SummaryTable />
//       </Popover>
//     </article>
//   );
// };

// export default LeaveTable;

// ✅
import { Help, MoreHoriz, MoreVert } from "@mui/icons-material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { IconButton, Popover, Skeleton, Tooltip } from "@mui/material";
import Divider from "@mui/material/Divider";
import React, { useContext, useState } from "react";
import { TestContext } from "../../../State/Function/Main";
import useLeaveRequesationHook from "../../../hooks/QueryHook/Leave-Requsation/hook";
import SummaryTable from "./summaryTable";

const LeaveTable = () => {
  const { handleAlert } = useContext(TestContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const { data, isLoading, isError, error } = useLeaveRequesationHook();

  if (isError) {
    handleAlert(
      true,
      "error",
      error?.response?.data?.message || "Sorry, the server is under maintenance"
    );
    return (
      <article className="w-full md:w-[215px] h-max py-4 bg-white border border-red-500 shadow-xl rounded-lg ">
        <h1 className="text-lg px-6 font-semibold flex items-center gap-2 text-red-600">
          <Help />
          <span>Failed to load data</span>
        </h1>
        <Divider className="mt-4 mb-6 border-red-500" />
        <div className="px-6 space-y-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="space-y-2">
              <Skeleton variant="text" className="w-1/4 h-6" />
              <Skeleton variant="text" className="w-2/4 h-8" />
              <Divider className="border-red-500" />
            </div>
          ))}
        </div>
      </article>
    );
  }

  if (isLoading) {
    return (
      <article className="w-full  px-6 h-max py-6 bg-white   ">
        <h1 className="text-lg  font-semibold flex items-center gap-2 text-gray-700   ">
          <AccountBalanceIcon />
          <span>Balance Leaves</span>
          <Tooltip title="Click to get Summary for current month">
            <IconButton className="">
              <MoreHoriz className="text-black" />
            </IconButton>
          </Tooltip>
        </h1>
        <Divider className="mt-4 mb-6" />
        <div className="px-6 space-y-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="space-y-2">
              <Skeleton variant="text" className="w-1/4 h-6" />
              <Skeleton variant="text" className="w-2/4 h-8" />
              <Divider />
            </div>
          ))}
        </div>
      </article>
    );
  }

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <article className="w-full  h-max bg-white shadow-sm rounded-lg ">
      <h1 className="text-lg p-1 px-4 font-semibold flex items-center gap-2 justify-between bg-gray-100 ">
        <AccountBalanceIcon className="text-gray-600" />
        <span className=" text-gray-600 font-semibold">Balance Leaves</span>
        <Tooltip title="Click to get Summary for current month">
          <IconButton
            onClick={handlePopoverOpen}
            className="transition-transform transform hover:scale-110"
          >
            <MoreVert className="text-black" />
          </IconButton>
        </Tooltip>
      </h1>

      <div className="mt-2 px-8">
        {data?.leaveTypes?.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center  py-2 px-0 rounded-lg mb-2 transition-shadow hover:shadow-lg"
          >
            <span
              style={{ backgroundColor: item.color }}
              className="h-8 w-8 rounded-full"
            ></span>

            <div style={{ width: "100px" }}>
              <h2 className="text-md font-medium text-gray-800">
                {item.leaveName}
              </h2>
            </div>
            <h2 className="text-md font-semibold text-gray-900">
              {item.count}
            </h2>
          </div>
        ))}
        <div className="flex justify-between items-center py-2 px-0 border-t border-gray-300">
          <h2 className="text-md font-medium text-gray-800">
            Total Leave Balance
          </h2>
          <h2 className="text-md font-semibold text-gray-900">
            {data.totalCoutn}
          </h2>
        </div>
      </div>
      {/* <div className="mt-2 px-8">
  {data?.leaveTypes?.map((item, index) => (
    <div
      key={index}
      className="flex items-center py-2 px-4 rounded-lg mb-2 transition-shadow hover:shadow-lg"
     
    >
      <span className="h-8 w-8 rounded-full mr-4" style={{ backgroundColor: item.color }}></span>
      <div className="flex-1">
        <h2 className="text-md font-medium text-gray-800">{item.leaveName}</h2>
      </div>
      <h2 className="text-md font-semibold text-gray-900">{item.count}</h2>
    </div>
  ))}
  <div className="flex justify-between items-center py-2 px-4 border-t border-gray-300">
    <h2 className="text-md font-medium text-gray-800">Total Leave Balance</h2>
    <h2 className="text-md font-semibold text-gray-900">{data.totalCoutn}</h2>
  </div>
</div> */}

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        className="transition-transform transform scale-95"
      >
        <SummaryTable />
      </Popover>
    </article>
  );
};

export default LeaveTable;
