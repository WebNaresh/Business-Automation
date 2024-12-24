//manager ka dashboard component here
// import React, { useContext, useState } from "react";
// import { Info } from "@mui/icons-material";
// import { Card, CircularProgress } from "@mui/material";
// import axios from "axios";
// import { CategoryScale, Chart } from "chart.js";
// import { Bar } from "react-chartjs-2";
// import { useMutation, useQuery } from "react-query";
// import Select from "react-select";
// import * as XLSX from "xlsx";
// import { TestContext } from "../../../../State/Function/Main";
// import { UseContext } from "../../../../State/UseState/UseContext";
// import UserProfile from "../../../../hooks/UserData/useUser";
// Chart.register(CategoryScale);

// const ManagerEmployeeChart = ({
//   EmployeeDataOfManager,
//   selectedyear,
//   setSelectedYear,
// }) => {
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const user = UserProfile().getCurrentUser();
//   const monthOptions = [
//     {
//       value: 1,
//       label: "January",
//     },
//     {
//       value: 2,
//       label: "February",
//     },
//     {
//       value: 3,
//       label: "March",
//     },
//     {
//       value: 4,
//       label: "April",
//     },
//     {
//       value: 5,
//       label: "May",
//     },
//     {
//       value: 6,
//       label: "June",
//     },
//     {
//       value: 7,
//       label: "July",
//     },
//     {
//       value: 8,
//       label: "August",
//     },
//     {
//       value: 9,
//       label: "September",
//     },
//     {
//       value: 10,
//       label: "October",
//     },
//     {
//       value: 11,
//       label: "November",
//     },
//     {
//       value: 12,
//       label: "December",
//     },
//   ];

//   const { handleAlert } = useContext(TestContext);
//   const [selectMonth, setSelectMonth] = useState({
//     label: monthOptions.find((item) => item.value === new Date().getMonth() + 1)
//       .label,
//     value: new Date().getMonth() + 1,
//   });
//   // const user = getCurrentUser();
//   // const RemainingLeaves = useLeaveTable();
//   // const, setuserId] = useState();

//   const customStyles = {
//     control: (base) => ({
//       ...base,
//       border: ".5px solid #f1f1f1",
//       boxShadow: "none",
//       hover: {
//         cursor: "pointer !important",
//       },
//     }),
//     menu: (base) => ({
//       ...base,
//       width: "max-content",
//       minWidth: "100%",
//       right: 0,
//     }),
//     placeholder: (defaultStyles) => {
//       return {
//         ...defaultStyles,
//         color: "#000",
//       };
//     },
//   };

//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 5 }, (_, index) => currentYear - index);

//   const yearOptions = years.map((year) => {
//     return {
//       value: year.toString(),
//       label: year,
//     };
//   });

//   const options = {
//     elements: {
//       line: {
//         tension: 0.5,
//       },
//     },
//     barThickness: 30,

//     scales: {
//       x: {
//         grid: {
//           display: false,
//           barPercentage: 0.4,
//         },
//       },
//       y: {
//         suggestedMax: 31,
//         ticks: {
//           max: 31,
//           beginAtZero: true,
//           stepSize: 5,
//           min: 0,
//         },
//         grid: {
//           display: true,
//         },
//       },
//     },
//     maintainAspectRatio: false,
//     responsive: true,
//   };

//   const getYearLeaves = async () => {
//     const { data } = await axios.get(
//       `${import.meta.env.VITE_API}/route/leave/getManagerEmployeeAttendence/${selectedyear.value}/${selectMonth.value}`,
//       {
//         headers: {
//           Authorization: authToken,
//         },
//       }
//     );
//     return data;
//   };

//   const { data: LeaveYearData, isLoading: leaveYearLoading } = useQuery(
//     ["leaveData", selectedyear, selectMonth],
//     getYearLeaves
//   );

//   const monthNames = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   // const allMonths = monthNames;

//   // const organizeDataByMonth = (data) => {
//   //   const organizedData = Array.from({ length: 12 }, (_, index) => {
//   //     console.log(`🚀 ~ LeaveYearData:`, LeaveYearData);
//   //     const month = index + 1;
//   //     return {
//   //       month,
//   //       year: null,
//   //       PresentPercent: 0,
//   //       absentPercent: 0,
//   //     };
//   //   });

//   //   Array.isArray(data) &&
//   //     data?.forEach((monthData) => {
//   //       const monthIndex = monthData.month - 1;
//   //       organizedData[monthIndex] = {
//   //         month: monthData.month,
//   //         year: monthData.year,
//   //         availableDays: monthData.availableDays,
//   //         unpaidleaveDays: monthData.unpaidleaveDays,
//   //         paidleaveDays: monthData.paidleaveDays,
//   //       };
//   //     });

//   //   return organizedData ?? [];
//   // };

//   // const EmployeeleaveData = organizeDataByMonth(
//   //   LeaveYearData?.sortedData ?? []
//   // );
//   // const MonthArray = allMonths.map((month) => month);

//   const data = {
//     labels: LeaveYearData?.map((monthData) => `${monthData?.empName}`),
//     datasets: [
//       {
//         label: "Available Days",
//         data: LeaveYearData?.map((monthData) => monthData.availableDays),
//         backgroundColor: "#00b0ff",
//         borderWidth: 1,
//       },
//       {
//         label: "Unpaid Leave Days",
//         data: LeaveYearData?.map((monthData) => monthData.unpaidleaveDays),
//         backgroundColor: "#f50057",
//         borderWidth: 1,
//       },
//       {
//         label: "Paid Leave Days",
//         data: LeaveYearData?.map((monthData) => monthData.paidleaveDays),
//         backgroundColor: "#4caf50",
//         borderWidth: 1,
//       },
//     ],
//   };

//   const generateReport = () => {
//     try {
//       // console.log("Report Generated Successfully", attendenceData);
//       const employeeLeaveData = LeaveYearData?.map(({ _id, ...item }) => ({
//         // month: monthNames[item.month - 1],
//         // year: item.year,

//         "Employee ID": `${item?.employeeId}`,
//         "Employee Name": `${item?.empName}`,
//         "Employee email": `${item?.email}`,
//         "present days": `${item?.availableDays}`,
//         "Paid leave days": `${item.paidleaveDays}`,
//         "unpaid leave days": `${item.unpaidleaveDays}`,
//       }));
//       let employeeInfo = [
//         ["", "Manager Name", `${user?.first_name} ${user?.last_name}`],
//         ["", "Month", monthNames[selectMonth.value - 1]],
//         ["", "year", LeaveYearData?.map((item) => `${item?.year}`)],
//       ];

//       const wb = XLSX.utils.book_new();
//       const wsData = employeeLeaveData.map(Object.values);
//       wsData.unshift(Object.keys(employeeLeaveData[0]));
//       const padding = [["", "", "", ""]];
//       const finalData = padding.concat(employeeInfo, padding, wsData);
//       const ws = XLSX.utils.aoa_to_sheet(finalData);

//       XLSX.utils.book_append_sheet(wb, ws, "Salary Data");
//       XLSX.writeFile(wb, "LeaveData.xlsx");
//     } catch (error) {
//       handleAlert(
//         true,
//         "error",
//         "There is a issue in server please try again later"
//       );
//     }
//   };

//   const mutation = useMutation(generateReport, {
//     onSuccess: () => {
//       handleAlert(true, "success", "Report Generated Successfully");
//     },
//     onError: (error) => {
//       // Handle error
//       handleAlert(
//         true,
//         "error",
//         "There is a issue in server please try again later"
//       );
//     },
//   });

//   return (
//     <>
//       <Card elevation={3}>
//         <div className="flex flex-col w-full px-4 items-start justify-between">
//           <div className="flex items-center w-full justify-between gap-2 py-2  ">
//             {/* <Avatar
//               variant="circle"
//               className="!bg-sky-400 p-1 !h-[32px] !w-[32px] rounded-full"
//             >
//               <WorkHistory className="!text-lg" />
//             </Avatar> */}
//             <h1 className="text-xl my-4 font-bold text-[#67748E]">
//               Attendance Overview
//             </h1>
//             <div className="flex items-end gap-4 w-max">
//               <button
//                 onClick={() => mutation.mutate()}
//                 disabled={mutation.isLoading}
//                 className={` flex group justify-center w-max gap-2 items-center rounded-sm h-[30px] mb-1 px-4 py-4 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500
//                   ${
//                     mutation.isLoading &&
//                     "cursor-not-allowed bg-gray-400 text-gray-700"
//                   }
//                   `}
//               >
//                 Generate Report
//               </button>
//               <div className="w-[150px] ">
//                 <label className="text-sm my-4 font-bold text-[#67748E]">
//                   Select Year
//                 </label>
//                 <Select
//                   placeholder={"Select year"}
//                   onChange={(year) => {
//                     setSelectedYear(year);
//                   }}
//                   components={{
//                     IndicatorSeparator: () => null,
//                   }}
//                   styles={customStyles}
//                   value={selectedyear} // Add this line
//                   options={yearOptions}
//                 />
//               </div>
//               <div className="w-[150px]">
//                 <label className="text-sm my-4 font-bold text-[#67748E]">
//                   Select Month
//                 </label>
//                 <Select
//                   placeholder={"Select Month"}
//                   onChange={(month) => {
//                     setSelectMonth(month);
//                   }}
//                   components={{
//                     IndicatorSeparator: () => null,
//                   }}
//                   styles={customStyles}
//                   value={selectMonth} // Add this line
//                   options={monthOptions}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex gap-4 w-full">
//             {/* <Autocomplete
//               disablePortal
//               id="combo-box-demo"
//               className="w-full"
//               // sx={{ width: 300 }}
//               size="small"
//               onChange={handleSelect}
//               options={EmployeeDataOfManager?.data[0]?.reporteeIds ?? []}
//               getOptionLabel={(option) => option?.first_name}
//               renderOption={(props, option) => (
//                 <li className="flex" {...props}>
//                   <p>
//                     {option?.first_name} {option?.last_name}
//                   </p>
//                 </li>
//               )}
//               renderInput={(params) => (
//                 <TextField {...params} label="Search Employee" />
//               )}
//             /> */}

//             {/* <div className="w-[150px] ">
//               <label className="text-sm my-4 font-bold text-[#67748E]">
//                 Select Year
//               </label>
//               <Select
//                 placeholder={"Select year"}
//                 onChange={(year) => {
//                   setSelectedYear(year);
//                 }}
//                 components={{
//                   IndicatorSeparator: () => null,
//                 }}
//                 styles={customStyles}
//                 value={selectedyear} // Add this line
//                 options={yearOptions}
//               />
//             </div>
//             <div className="w-[150px]">
//               <label className="text-sm my-4 font-bold text-[#67748E]">
//                 Select Month
//               </label>
//               <Select
//                 placeholder={"Select Month"}
//                 onChange={(month) => {
//                   setSelectMonth(month);
//                 }}
//                 components={{
//                   IndicatorSeparator: () => null,
//                 }}
//                 styles={customStyles}
//                 value={selectMonth} // Add this line
//                 options={monthOptions}
//               />
//             </div> */}
//           </div>
//         </div>

//         <div className="flex flex-col gap-2">
//           <Card elevation={0} className="w-full ">
//             {LeaveYearData?.length <= 0 ? (
//               <Card elevation={0} className="  mx-4 py-6 ">
//                 <article className="flex items-center mb-1 text-red-500 gap-2">
//                   <Info className="!text-2xl" />
//                   <h1 className="text-xl ">Data Not found for this employee</h1>
//                 </article>
//               </Card>
//             ) : (
//               <div className="flex flex-col gap-2">
//                 <div className="flex  justify-center w-full px-5 py-4 h-[340px]">
//                   {leaveYearLoading ? (
//                     <CircularProgress />
//                   ) : (
//                     // ) : LeaveYearData?.length <= 0 ? (
//                     //   <div className="my-1 w-[90%] rounded-md flex items-center space-x-4 justify-center h-[10vh] bg-orange-200 font-bold ">
//                     //     <Warning />
//                     //     <h1 className="text-2xl ">No data found for this user</h1>
//                     //       </div>
//                     <Bar
//                       options={options}
//                       data={data}
//                       style={{
//                         padding: "15px",
//                       }}
//                     />
//                   )}
//                 </div>
//               </div>
//             )}
//           </Card>
//         </div>
//       </Card>
//     </>
//   );
// };

// export default ManagerEmployeeChart;


//_____________________________________________________😑























///👨‍💻
// import React, { useContext, useState } from "react";
// import { Info } from "@mui/icons-material";
// import { Card, CircularProgress, Skeleton } from "@mui/material";
// import axios from "axios";
// import { CategoryScale, Chart } from "chart.js";
// import { Bar } from "react-chartjs-2";
// import { useMutation, useQuery } from "react-query";
// import Select from "react-select";
// import * as XLSX from "xlsx";
// import { TestContext } from "../../../../State/Function/Main";
// import { UseContext } from "../../../../State/UseState/UseContext";
// import UserProfile from "../../../../hooks/UserData/useUser";
// import { motion } from "framer-motion";
// Chart.register(CategoryScale);

// const customStyles = {
//   control: (base) => ({
//     ...base,
//     border: "1px solid #ddd",
//     boxShadow: "none",
//     backgroundColor: "#f9f9f9",
//     borderRadius: "4px",
//     fontFamily: "'Roboto', sans-serif",
//     zIndex: 10,
//     minWidth: '120px',
//   }),
//   menu: (base) => ({
//     ...base,
//     width: "100%",
//     fontFamily: "'Roboto', sans-serif",
//     fontSize: 12,
//   }),
//   placeholder: (defaultStyles) => ({
//     ...defaultStyles,
//     color: "#555",
//     fontFamily: "'Roboto', sans-serif",
//     fontSize: 12,
//     textAlign: 'center',
//   }),
//   singleValue: (base) => ({
//     ...base,
//     fontFamily: "'Roboto', sans-serif",
//     fontSize: 12,
//     textAlign: 'center',
//   }),
//   dropdownIndicator: (base) => ({
//     ...base,
//     color: "#555",
//   }),
//   indicatorSeparator: (base) => ({
//     ...base,
//     display: 'none',
//   }),
// };

// const ManagerEmployeeChart = ({ selectedyear, setSelectedYear }) => {
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const user = UserProfile().getCurrentUser();

//   const monthOptions = [
//     { value: 1, label: "January" },
//     { value: 2, label: "February" },
//     { value: 3, label: "March" },
//     { value: 4, label: "April" },
//     { value: 5, label: "May" },
//     { value: 6, label: "June" },
//     { value: 7, label: "July" },
//     { value: 8, label: "August" },
//     { value: 9, label: "September" },
//     { value: 10, label: "October" },
//     { value: 11, label: "November" },
//     { value: 12, label: "December" },
//   ];

//   const { handleAlert } = useContext(TestContext);
//   const [selectMonth, setSelectMonth] = useState({
//     label: monthOptions.find((item) => item.value === new Date().getMonth() + 1).label,
//     value: new Date().getMonth() + 1,
//   });

//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 5 }, (_, index) => currentYear - index);
//   const yearOptions = years.map((year) => ({
//     value: year.toString(),
//     label: year,
//   }));

//   const options = {
//     elements: {
//       line: {
//         tension: 0.5,
//       },
//     },
//     barThickness: 25,
//     scales: {
//       x: {
//         grid: {
//           display: false,
//         },
//         ticks: {
//           color: "#555",
//           font: {
//             family: "'Roboto', sans-serif",
//             size: 10,
//           },
//         },
//       },
//       y: {
//         suggestedMax: 31,
//         ticks: {
//           beginAtZero: true,
//           stepSize: 5,
//           min: 0,
//           color: "#555",
//           font: {
//             family: "'Roboto', sans-serif",
//             size: 10,
//           },
//         },
//         grid: {
//           display: true,
//           color: "#e0e0e0",
//         },
//       },
//     },
//     maintainAspectRatio: false,
//     responsive: true,
//   };

//   const getYearLeaves = async () => {
//     const { data } = await axios.get(
//       `${import.meta.env.VITE_API}/route/leave/getManagerEmployeeAttendence/${selectedyear.value}/${selectMonth.value}`,
//       {
//         headers: {
//           Authorization: authToken,
//         },
//       }
//     );
//     return data;
//   };

//   const { data: LeaveYearData, isLoading: leaveYearLoading } = useQuery(
//     ["leaveData", selectedyear, selectMonth],
//     getYearLeaves
//   );

//   const monthNames = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December",
//   ];

//   const data = {
//     labels: LeaveYearData?.map((monthData) => monthData?.empName),
//     datasets: [
//       {
//         label: "Available Days",
//         data: LeaveYearData?.map((monthData) => monthData.availableDays),
//         backgroundColor: "#00b0ff",
//         borderWidth: 1,
//       },
//       {
//         label: "Unpaid Leave Days",
//         data: LeaveYearData?.map((monthData) => monthData.unpaidleaveDays),
//         backgroundColor: "#f50057",
//         borderWidth: 1,
//       },
//       {
//         label: "Paid Leave Days",
//         data: LeaveYearData?.map((monthData) => monthData.paidleaveDays),
//         backgroundColor: "#4caf50",
//         borderWidth: 1,
//       },
//     ],
//   };

//   const generateReport = () => {
//     try {
//       const employeeLeaveData = LeaveYearData?.map(({ _id, ...item }) => ({
//         "Employee ID": `${item?.employeeId}`,
//         "Employee Name": `${item?.empName}`,
//         "Employee email": `${item?.email}`,
//         "Available Days": `${item?.availableDays}`,
//         "Paid Leave Days": `${item.paidleaveDays}`,
//         "Unpaid Leave Days": `${item.unpaidleaveDays}`,
//       }));

//       let employeeInfo = [
//         ["", "Manager Name", `${user?.first_name} ${user?.last_name}`],
//         ["", "Month", monthNames[selectMonth.value - 1]],
//         ["", "Year", LeaveYearData?.map((item) => `${item?.year}`)],
//       ];

//       const wb = XLSX.utils.book_new();
//       const wsData = employeeLeaveData.map(Object.values);
//       wsData.unshift(Object.keys(employeeLeaveData[0]));
//       const padding = [["", "", "", ""]];
//       const finalData = padding.concat(employeeInfo, padding, wsData);
//       const ws = XLSX.utils.aoa_to_sheet(finalData);

//       XLSX.utils.book_append_sheet(wb, ws, "Leave Data");
//       XLSX.writeFile(wb, "LeaveData.xlsx");
//     } catch (error) {
//       handleAlert(
//         true,
//         "error",
//         "There is an issue with the server, please try again later"
//       );
//     }
//   };

//   const mutation = useMutation(generateReport, {
//     onSuccess: () => {
//       handleAlert(true, "success", "Report Generated Successfully");
//     },
//     onError: () => {
//       handleAlert(true, "error", "There is an issue with the server, please try again later");
//     },
//   });

//   const buttonClass = `flex items-center gap-1 px-2 py-2 text-sm rounded-md text-white bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${mutation.isLoading ? "cursor-not-allowed bg-gray-400 text-gray-700" : ""}`;
//   const selectClass = "w-[70px]";

//   return (
//     <div className=" relative mb-6 bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-200 p-4 rounded-lg shadow-md ">
//       <div className="flex flex-col gap-4">
//         <div className="flex-col sm:flex-row sm:justify-between items-start gap-2 mb-2">
//           <h1 className="text-xl font-bold text-gray-800">Attendance Overview</h1>
//           <p className="text-gray-600 text-xs">
//             The chart below provides an overview of employee attendance.
//           </p>
          
//           <div className="pt-2  flex gap-4 items-center">
//             <motion.button
//               onClick={() => mutation.mutate()}
//               disabled={mutation.isLoading}
//               className={buttonClass}
//               aria-label="Generate Excel Report"
//               whileHover={{ scale: 1.05 }}
//               style={{marginTop:'2%'}}
//             >
//               Generate Report
//             </motion.button>
//             <div className={selectClass}>
//               <label className="text-xs font-bold text-gray-800">Select Year</label>
//               <Select
//                 placeholder="Select year"
//                 onChange={(year) => setSelectedYear(year)}
//                 components={{ IndicatorSeparator: () => null }}
//                 styles={customStyles}
//                 value={selectedyear}
//                 options={yearOptions}
//               />
//             </div>
//             <div className={selectClass}>
//               <label className="text-xs font-bold text-gray-800">Select Month</label>
//               <Select
//                 placeholder="Select Month"
//                 onChange={(month) => setSelectMonth(month)}
//                 components={{ IndicatorSeparator: () => null }}
//                 styles={customStyles}
//                 value={selectMonth}
//                 options={monthOptions}
//               />
//             </div>
//           </div>
//         </div>
//         <Card elevation={0} className="flex flex-col gap-3 p-2" style={{backgroundColor:"transparent"}}>
//           {leaveYearLoading ? (
//             <div className="flex items-center justify-center p-2">
//               <Skeleton variant="rectangular" width="100%" height={300} />
//             </div>
//           ) : LeaveYearData?.length === 0 ? (
//             <Card elevation={0} className="flex items-center justify-center p-5 bg-red-50 border border-red-200 ">
//               <Info className="text-red-500 text-xl" />
//               <h1 className="text-lg font-semibold text-red-500 ml-2">Data Not Found for This Employee</h1>
//             </Card>
//           ) : (
//             <div className="flex justify-center w-full p-2 h-[300px] rounded-lg shadow-md">
//               <Bar options={options} data={data} />
//             </div>
//           )}
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ManagerEmployeeChart;






//aos motion
import React, { useContext, useState, useEffect } from "react";
import { Info } from "@mui/icons-material";
import { Card, Skeleton } from "@mui/material";
import axios from "axios";
import { CategoryScale, Chart } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useMutation, useQuery } from "react-query";
import Select from "react-select";
import * as XLSX from "xlsx";
import { TestContext } from "../../../../State/Function/Main";
import { UseContext } from "../../../../State/UseState/UseContext";
import UserProfile from "../../../../hooks/UserData/useUser";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

Chart.register(CategoryScale);

const customStyles = {
  control: (base) => ({
    ...base,
    border: "1px solid #ddd",
    boxShadow: "none",
    backgroundColor: "#f9f9f9",
    borderRadius: "4px",
    fontFamily: "'Roboto', sans-serif",
    zIndex: 10,
    minWidth: '120px',
  }),
  menu: (base) => ({
    ...base,
    width: "100%",
    fontFamily: "'Roboto', sans-serif",
    fontSize: 12,
  }),
  placeholder: (defaultStyles) => ({
    ...defaultStyles,
    color: "#555",
    fontFamily: "'Roboto', sans-serif",
    fontSize: 12,
    textAlign: 'center',
  }),
  singleValue: (base) => ({
    ...base,
    fontFamily: "'Roboto', sans-serif",
    fontSize: 12,
    textAlign: 'center',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#555",
  }),
  indicatorSeparator: (base) => ({
    ...base,
    display: 'none',
  }),
};

const ManagerEmployeeChart = ({ selectedyear, setSelectedYear }) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const user = UserProfile().getCurrentUser();

  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const { handleAlert } = useContext(TestContext);
  const [selectMonth, setSelectMonth] = useState({
    label: monthOptions.find((item) => item.value === new Date().getMonth() + 1).label,
    value: new Date().getMonth() + 1,
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, index) => currentYear - index);
  const yearOptions = years.map((year) => ({
    value: year.toString(),
    label: year,
  }));

  const options = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    barThickness: 25,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#555",
          font: {
            family: "'Roboto', sans-serif",
            size: 10,
          },
        },
      },
      y: {
        suggestedMax: 31,
        ticks: {
          beginAtZero: true,
          stepSize: 5,
          min: 0,
          color: "#555",
          font: {
            family: "'Roboto', sans-serif",
            size: 10,
          },
        },
        grid: {
          display: true,
          color: "#e0e0e0",
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  const getYearLeaves = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API}/route/leave/getManagerEmployeeAttendence/${selectedyear.value}/${selectMonth.value}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return data;
  };

  const { data: LeaveYearData, isLoading: leaveYearLoading } = useQuery(
    ["leaveData", selectedyear, selectMonth],
    getYearLeaves
  );

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const data = {
    labels: LeaveYearData?.map((monthData) => monthData?.empName),
    datasets: [
      {
        label: "Available Days",
        data: LeaveYearData?.map((monthData) => monthData.availableDays),
        backgroundColor: "#00b0ff",
        borderWidth: 1,
      },
      {
        label: "Unpaid Leave Days",
        data: LeaveYearData?.map((monthData) => monthData.unpaidleaveDays),
        backgroundColor: "#f50057",
        borderWidth: 1,
      },
      {
        label: "Paid Leave Days",
        data: LeaveYearData?.map((monthData) => monthData.paidleaveDays),
        backgroundColor: "#4caf50",
        borderWidth: 1,
      },
    ],
  };

  const generateReport = () => {
    try {
      const employeeLeaveData = LeaveYearData?.map(({ _id, ...item }) => ({
        "Employee ID": `${item?.employeeId}`,
        "Employee Name": `${item?.empName}`,
        "Employee email": `${item?.email}`,
        "Available Days": `${item?.availableDays}`,
        "Paid Leave Days": `${item.paidleaveDays}`,
        "Unpaid Leave Days": `${item.unpaidleaveDays}`,
      }));

      let employeeInfo = [
        ["", "Manager Name", `${user?.first_name} ${user?.last_name}`],
        ["", "Month", monthNames[selectMonth.value - 1]],
        ["", "Year", LeaveYearData?.map((item) => `${item?.year}`)],
      ];

      const wb = XLSX.utils.book_new();
      const wsData = employeeLeaveData.map(Object.values);
      wsData.unshift(Object.keys(employeeLeaveData[0]));
      const padding = [["", "", "", ""]];
      const finalData = padding.concat(employeeInfo, padding, wsData);
      const ws = XLSX.utils.aoa_to_sheet(finalData);

      XLSX.utils.book_append_sheet(wb, ws, "Leave Data");
      XLSX.writeFile(wb, "LeaveData.xlsx");
    } catch (error) {
      handleAlert(
        true,
        "error",
        "There is an issue with the server, please try again later"
      );
    }
  };

  const mutation = useMutation(generateReport, {
    onSuccess: () => {
      handleAlert(true, "success", "Report Generated Successfully");
    },
    onError: () => {
      handleAlert(true, "error", "There is an issue with the server, please try again later");
    },
  });

  const buttonClass = `flex items-center gap-1 px-2 py-2 text-sm rounded-md text-white bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${mutation.isLoading ? "cursor-not-allowed bg-gray-400 text-gray-700" : ""}`;
  const selectClass = "w-[70px]";

  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration in milliseconds
      once: true,     // whether animation should happen only once
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mb-6 bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-200 p-4 rounded-lg shadow-md"
    >
      <div className="flex flex-col gap-4">
        <div className="flex-col sm:flex-row sm:justify-between items-start gap-2 mb-2">
          <motion.h1
            className="text-xl font-bold text-gray-800"
            data-aos="fade-up"
          >
            Attendance Overview
          </motion.h1>
          <p className="text-gray-600 text-xs">
            The chart below provides an overview of employee attendance.
          </p>
          
          <div className="pt-2 flex gap-4 items-center">
            <motion.button
              onClick={() => mutation.mutate()}
              disabled={mutation.isLoading}
              className={buttonClass}
              aria-label="Generate Excel Report"
              whileHover={{ scale: 1.05 }}
              style={{ marginTop: '2%' }}
            >
              Generate Report
            </motion.button>
            <div className={selectClass}>
              <label className="text-xs font-bold text-gray-800">Select Year</label>
              <Select
                placeholder="Select year"
                onChange={(year) => setSelectedYear(year)}
                components={{ IndicatorSeparator: () => null }}
                styles={customStyles}
                value={selectedyear}
                options={yearOptions}
              />
            </div>
            <div className={selectClass}>
              <label className="text-xs font-bold text-gray-800">Select Month</label>
              <Select
                placeholder="Select Month"
                onChange={(month) => setSelectMonth(month)}
                components={{ IndicatorSeparator: () => null }}
                styles={customStyles}
                value={selectMonth}
                options={monthOptions}
              />
            </div>
          </div>
        </div>
        <Card
          elevation={0}
          className="flex flex-col gap-3 p-2"
          style={{ backgroundColor: "transparent" }}
        >
          {leaveYearLoading ? (
            <div className="flex items-center justify-center p-2">
              <Skeleton variant="rectangular" width="100%" height={300} />
            </div>
          ) : LeaveYearData?.length === 0 ? (
            <Card
              elevation={0}
              className="flex items-center justify-center p-5 bg-red-50 border border-red-200"
            >
              <Info className="text-red-500 text-xl" />
              <h1 className="text-lg font-semibold text-red-500 ml-2">
                Data Not Found for This Employee
              </h1>
            </Card>
          ) : (
            <motion.div
              className="flex justify-center w-full p-2 h-[300px] rounded-lg shadow-md"
              data-aos="fade-up"
            >
              <Bar options={options} data={data} />
            </motion.div>
          )}
        </Card>
      </div>
    </motion.div>
  );
};

export default ManagerEmployeeChart;















