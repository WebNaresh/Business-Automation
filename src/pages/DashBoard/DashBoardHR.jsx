// import {
//   Dashboard,
//   EventAvailable,
//   EventBusy,
//   FilterAlt,
//   FilterAltOff,
//   Groups,
//   LocationOn,
//   NearMe,
//   SupervisorAccount,
// } from "@mui/icons-material";
// import { IconButton, Popover } from "@mui/material";
// import axios from "axios";
// import { default as React, useEffect } from "react";
// import { useQuery, useQueryClient } from "react-query";
// import { useLocation, useParams } from "react-router-dom/dist";
// import Select from "react-select";
// import useDashGlobal from "../../hooks/Dashboard/useDashGlobal";
// import useDashboardFilter from "../../hooks/Dashboard/useDashboardFilter";
// import useEmployee from "../../hooks/Dashboard/useEmployee";
// import useAuthToken from "../../hooks/Token/useAuth";
// import UserProfile from "../../hooks/UserData/useUser";
// import LineGraph from "./Components/Bar/LineGraph";
// import AttendenceBar from "./Components/Bar/SuperAdmin/AttendenceBar";
// import SuperAdminCard from "./Components/Card/superadmin/SuperAdminCard";
// import SkeletonFilterSection from "./Components/Skeletons/SkeletonFilterSection";

// const DashBoardHR = () => {
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();
//   const { employee, employeeLoading } = useEmployee(user.organizationId);
//   const { setSelectedSalaryYear, selectedSalaryYear } = useDashGlobal();
//   const location = useLocation("");
//   const authToken = useAuthToken();
//   const { organisationId } = useParams();

//   const queryClient = useQueryClient();

//   const [anchorEl, setAnchorEl] = React.useState(null);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const open = Boolean(anchorEl);
//   const id = open ? "simple-popover" : undefined;

//   // custom hooks

//   const {
//     Managers,
//     managerLoading,
//     oraganizationLoading,
//     salaryGraphLoading,
//     locationOptions,
//     managerOptions,
//     Departmentoptions,
//     customStyles,
//     data,
//     locations,
//     location: loc,
//     setLocations,
//     manager,
//     setManager,
//     department,
//     setDepartment,
//     salaryData,
//     absentEmployee,
//     getAttendenceData,
//   } = useDashboardFilter(user.organizationId);

//   const getRemoteEmployeeCount = async () => {
//     try {
//       const { data } = await axios.get(
//         `${import.meta.env.VITE_API}/route/punch/getTodayRemoteEmp/${organisationId}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return data;
//     } catch (error) {
//       console.log("error", error);
//     }
//   };

//   const { data: remoteEmployeeCount } = useQuery({
//     queryKey: ["remoteEmployee"],
//     queryFn: getRemoteEmployeeCount,
//   });

//   useEffect(() => {
//     if (location.pathname?.includes("/DH-dashboard")) {
//       getAttendenceData();
//     }
//     // eslint-disable-next-line
//   }, []);

//   return (
//     <section className=" bg-gray-50  min-h-screen w-full ">
//       <header className="text-lg font-bold w-full px-8 pt-6 bg-white !text-[#67748E] shadow-md  p-4">
//         {location.pathname?.includes("/DH-dashboard")
//           ? "Department Head Dashboard"
//           : "HR Dashboard"}
//       </header>
//       <div className="md:px-8 px-2 w-full">
//         {/* <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1  mt-6  w-full   gap-2 md:gap-5 "> */}
//         <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 mt-6 w-full gap-2 md:gap-5">
//           <SuperAdminCard
//             icon={Groups}
//             color={"!bg-blue-500"}
//             data={employee?.totalEmployees}
//             isLoading={employeeLoading}
//             title={"Overall Employees"}
//           />

//           <SuperAdminCard
//             color={"!bg-green-500"}
//             isLoading={employeeLoading}
//             icon={EventAvailable}
//             data={
//               !isNaN(employee?.totalEmployees)
//                 ? employee?.totalEmployees - absentEmployee
//                 : 0
//             }
//             title={"Present Today"}
//           />
//           <SuperAdminCard
//             title={"Today's Leave"}
//             icon={EventBusy}
//             color={"!bg-red-500"}
//             data={absentEmployee}
//             isLoading={false}
//           />

//           <SuperAdminCard
//             color={"!bg-amber-500"}
//             icon={SupervisorAccount}
//             data={Managers?.length}
//             isLoading={managerLoading}
//             title={"People's Manager"}
//           />
//           <SuperAdminCard
//             color={"!bg-orange-500"}
//             isLoading={false}
//             icon={LocationOn}
//             data={loc?.locationCount}
//             title={"Locations"}
//           />

//           <SuperAdminCard
//             color={"!bg-indigo-500"}
//             isLoading={false}
//             icon={NearMe}
//             data={remoteEmployeeCount}
//             title={"Remote Employees"}
//           />
//         </div>
//         {oraganizationLoading ? (
//           <SkeletonFilterSection />
//         ) : (
//           <div className="mt-4  w-full  bg-white border  rounded-md  ">
//             <div className=" items-center justify-between flex gap-2 py-2 px-4 ">
//               <div className="flex items-center gap-2">
//                 <Dashboard className="!text-[#67748E]" />
//                 {/* <h1 className="text-md font-bold text-[#67748E]">Dashboard</h1> */}
//               </div>
//               <div className=" w-[80%]  md:hidden flex gap-6 items-center justify-end">
//                 <IconButton onClick={handleClick}>
//                   <FilterAlt />
//                 </IconButton>
//               </div>

//               <Popover
//                 id={id}
//                 open={open}
//                 anchorEl={anchorEl}
//                 onClose={handleClose}
//                 anchorOrigin={{
//                   vertical: "bottom",
//                   horizontal: "left",
//                 }}
//               >
//                 <div className="w-full  flex-col   h-auto pr-10  p-4 flex gap-4 ">
//                   <button
//                     onClick={() => {
//                       setLocations("");
//                       setDepartment("");
//                       setManager("");
//                       queryClient.invalidateQueries("organization-attenedence");
//                       queryClient.invalidateQueries("Org-Salary-overview");
//                     }}
//                     className="!w-max flex justify-center h-[25px]  gap-2 items-center rounded-md px-1 text-sm font-semibold text-[#152745]  hover:bg-gray-50 focus-visible:outline-gray-100"
//                   >
//                     <FilterAltOff className="!text-[1.4em] text-[#152745] " />
//                     Remove Filter
//                   </button>

//                   <Select
//                     placeholder={"Departments"}
//                     onChange={(dept) => {
//                       setDepartment(dept.value);
//                       setLocations("");
//                       setManager("");
//                       queryClient.invalidateQueries("department-attenedence");
//                     }}
//                     styles={customStyles}
//                     value={
//                       department
//                         ? Departmentoptions?.find(
//                             (option) => option.value === department
//                           )
//                         : ""
//                     } // Add this line
//                     options={Departmentoptions}
//                   />

//                   <Select
//                     placeholder={"Manager"}
//                     components={{
//                       IndicatorSeparator: () => null,
//                     }}
//                     onChange={(Managers) => {
//                       setManager(Managers.value);
//                       setDepartment("");
//                       setLocations("");
//                       queryClient.invalidateQueries("manager-attenedence");
//                     }}
//                     value={
//                       manager
//                         ? managerOptions.find((item) => item.name === manager)
//                         : ""
//                     }
//                     styles={customStyles}
//                     options={managerOptions}
//                   />

//                   <Select
//                     placeholder={"Location"}
//                     components={{
//                       IndicatorSeparator: () => null,
//                     }}
//                     onChange={(loc) => {
//                       setLocations(loc.value);
//                       setDepartment("");
//                       setManager("");
//                       queryClient.invalidateQueries("location-attenedence");
//                     }}
//                     value={
//                       locations
//                         ? locationOptions.find(
//                             (item) => item.name === locations
//                           )
//                         : ""
//                     }
//                     styles={customStyles}
//                     options={locationOptions}
//                   />
//                 </div>
//               </Popover>

//               {location.pathname?.includes("/HR-dashboard") && (
//                 <div className=" w-[80%] hidden md:flex gap-6 items-center justify-end">
//                   <button
//                     onClick={() => {
//                       setLocations("");
//                       setDepartment("");
//                       setManager("");
//                       queryClient.invalidateQueries("organization-attenedence");
//                     }}
//                     className="!w-max flex justify-center h-[25px]  gap-2 items-center rounded-md px-1 text-sm font-semibold text-[#152745]  hover:bg-gray-50 focus-visible:outline-gray-100"
//                   >
//                     <FilterAltOff className="!text-[1.4em] text-[#152745] " />
//                     Remove Filter
//                   </button>

//                   <Select
//                     placeholder={"Departments"}
//                     onChange={(dept) => {
//                       setDepartment(dept.value);
//                       setLocations("");
//                       setManager("");
//                       queryClient.invalidateQueries("department-attenedence");
//                     }}
//                     components={{
//                       IndicatorSeparator: () => null,
//                     }}
//                     styles={customStyles}
//                     value={
//                       department
//                         ? Departmentoptions?.find(
//                             (option) => option.value === department
//                           )
//                         : ""
//                     } // Add this line
//                     options={Departmentoptions}
//                   />

//                   <Select
//                     placeholder={"Manager"}
//                     components={{
//                       IndicatorSeparator: () => null,
//                     }}
//                     onChange={(Managers) => {
//                       setManager(Managers.value);
//                       setDepartment("");
//                       setLocations("");
//                       queryClient.invalidateQueries("manager-attenedence");
//                     }}
//                     value={
//                       manager
//                         ? managerOptions.find((item) => item.name === manager)
//                         : ""
//                     }
//                     styles={customStyles}
//                     options={managerOptions}
//                   />

//                   <Select
//                     placeholder={"Location"}
//                     components={{
//                       IndicatorSeparator: () => null,
//                     }}
//                     onChange={(loc) => {
//                       setLocations(loc.value);
//                       setDepartment("");
//                       setManager("");
//                       queryClient.invalidateQueries("location-attenedence");
//                     }}
//                     value={
//                       locations
//                         ? locationOptions.find(
//                             (item) => item.name === locations
//                           )
//                         : ""
//                     }
//                     styles={customStyles}
//                     options={locationOptions}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         <div className="w-full md:gap-4 md:space-y-0 space-y-3 mt-4 flex md:flex-row flex-col items-center">
//           <div className="w-[100%] md:w-[50%]">
//             <LineGraph
//               salarydata={salaryData}
//               isLoading={salaryGraphLoading}
//               selectedyear={selectedSalaryYear}
//               setSelectedYear={setSelectedSalaryYear}
//             />
//           </div>
//           <div className="w-[100%] md:w-[50%]">
//             <AttendenceBar
//               orgId={user.organizationId}
//               isLoading={oraganizationLoading}
//               attendenceData={data}
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default DashBoardHR;
//😎
// import {
//   Dashboard,
//   EventAvailable,
//   EventBusy,
//   FilterAlt,
//   FilterAltOff,
//   Groups,
//   LocationOn,
//   NearMe,
//   SupervisorAccount,
// } from "@mui/icons-material";
// import { IconButton, Popover } from "@mui/material";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useQuery, useQueryClient } from "react-query";
// import { useLocation, useParams } from "react-router-dom";
// import Select from "react-select";
// import { motion } from "framer-motion";
// import { css } from '@emotion/react';
// import useDashGlobal from "../../hooks/Dashboard/useDashGlobal";
// import useDashboardFilter from "../../hooks/Dashboard/useDashboardFilter";
// import useEmployee from "../../hooks/Dashboard/useEmployee";
// import useAuthToken from "../../hooks/Token/useAuth";
// import UserProfile from "../../hooks/UserData/useUser";
// import LineGraph from "./Components/Bar/LineGraph";
// import AttendenceBar from "./Components/Bar/SuperAdmin/AttendenceBar";
// import SuperAdminCard from "./Components/Card/superadmin/SuperAdminCard";
// import SkeletonFilterSection from "./Components/Skeletons/SkeletonFilterSection";

// // Emotion styles
// const headerStyle = css`
//   text-lg font-bold w-full px-8 pt-6 bg-white text-[#67748E] shadow-md p-4;
// `;

// const sectionStyle = css`
//   min-h-screen w-full bg-gray-50;
// `;

// const gridStyle = css`
//   grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 mt-6 w-full gap-2 md:gap-5;
// `;

// const popoverStyle = css`
//   width: 100%;
//   display: flex;
//   flex-direction: column;
//   padding: 1rem;
//   gap: 1rem;
//   position: relative;
//   background: white;
//   border-radius: 4px;
// `;

// const buttonStyle = css`
//   width: max-content;
//   display: flex;
//   align-items: center;
//   height: 25px;
//   gap: 0.5rem;
//   padding: 0 0.5rem;
//   text-sm font-semibold text-[#152745];
//   border-radius: 4px;
//   background: white;
//   cursor: pointer;
//   &:hover {
//     background-color: #f0f0f0;
//   }
//   &:focus {
//     outline: 1px solid #ccc;
//   }
// `;

// // Framer-motion variants
// const fadeInUp = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
// };

// const DashBoardHR = () => {
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();
//   const { employee, employeeLoading } = useEmployee(user.organizationId);
//   const { setSelectedSalaryYear, selectedSalaryYear } = useDashGlobal();
//   const location = useLocation();
//   const authToken = useAuthToken();
//   const { organisationId } = useParams();

//   const cardSize = "w-72 h-30"; // Adjust card size here
//   const iconSize="w-7 h-4"
//   const queryClient = useQueryClient();
//   const [anchorEl, setAnchorEl] = useState(null);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const open = Boolean(anchorEl);
//   const id = open ? "simple-popover" : undefined;

//   const {
//     Managers,
//     managerLoading,
//     oraganizationLoading,
//     salaryGraphLoading,
//     locationOptions,
//     managerOptions,
//     Departmentoptions,
//     customStyles,
//     data,
//     locations,
//     location: loc,
//     setLocations,
//     manager,
//     setManager,
//     department,
//     setDepartment,
//     salaryData,
//     absentEmployee,
//     getAttendenceData,
//   } = useDashboardFilter(user.organizationId);

//   const getRemoteEmployeeCount = async () => {
//     try {
//       const { data } = await axios.get(
//         `${import.meta.env.VITE_API}/route/punch/getTodayRemoteEmp/${organisationId}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return data;
//     } catch (error) {
//       console.log("error", error);
//     }
//   };

//   const { data: remoteEmployeeCount } = useQuery({
//     queryKey: ["remoteEmployee"],
//     queryFn: getRemoteEmployeeCount,
//   });

//   useEffect(() => {
//     if (location.pathname?.includes("/DH-dashboard")) {
//       getAttendenceData();
//     }
//   }, [location.pathname, getAttendenceData]);

//   return (
//     <section css={sectionStyle}>
//       <header css={headerStyle}>
//         {location.pathname?.includes("/DH-dashboard")
//           ? "Department Head Dashboard"
//           : "HR Dashboard"}
//       </header>
//       {/* <div className="md:px-8 px-2 w-full"> */}
//       {/* <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-4"> */}
//       <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 mt-6 w-full gap-2 md:gap-5">
//         <motion.div
//           variants={fadeInUp}
//           initial="hidden"
//           animate="visible"
//           css={gridStyle}
//         >
//           <SuperAdminCard
//             icon={Groups}
//             color="!bg-blue-500"
//             data={employee?.totalEmployees}
//             isLoading={employeeLoading}
//             title="Overall Employees"
//             cardSize={cardSize}
//             iconSize={iconSize}
//           />

//           <SuperAdminCard
//             color="!bg-green-500"
//             isLoading={employeeLoading}
//             icon={EventAvailable}
//             data={
//               !isNaN(employee?.totalEmployees)
//                 ? employee?.totalEmployees - absentEmployee
//                 : 0
//             }
//             title="Present Today"
//             cardSize={cardSize}
//             iconSize={iconSize}
//           />
//           <SuperAdminCard
//             title="Today's Leave"
//             icon={EventBusy}
//             color="!bg-red-500"
//             data={absentEmployee}
//             isLoading={false}
//             cardSize={cardSize}
//           />

//           <SuperAdminCard
//             color="!bg-amber-500"
//             icon={SupervisorAccount}
//             data={Managers?.length}
//             isLoading={managerLoading}
//             title="People's Manager"
//             cardSize={cardSize}
//           />
//           <SuperAdminCard
//             color="!bg-orange-500"
//             isLoading={false}
//             icon={LocationOn}
//             data={loc?.locationCount}
//             title="Locations"
//             cardSize={cardSize}
//           />

//           <SuperAdminCard
//             color="!bg-indigo-500"
//             isLoading={false}
//             icon={NearMe}
//             data={remoteEmployeeCount}
//             title="Remote Employees"
//             cardSize={cardSize}
//           />
//         </motion.div>
//         {oraganizationLoading ? (
//           <SkeletonFilterSection />
//         ) : (
//           <div className="mt-4 w-full bg-white border rounded-md">
//             <div className="items-center justify-between flex gap-2 py-2 px-4">
//               <div className="flex items-center gap-2">
//                 <Dashboard className="text-[#67748E]" />
//               </div>
//               <div className="w-[80%] md:hidden flex gap-6 items-center justify-end">
//                 <IconButton onClick={handleClick}>
//                   <FilterAlt />
//                 </IconButton>
//               </div>

//               <Popover
//                 id={id}
//                 open={open}
//                 anchorEl={anchorEl}
//                 onClose={handleClose}
//                 anchorOrigin={{
//                   vertical: "bottom",
//                   horizontal: "left",
//                 }}
//               >
//                 <div css={popoverStyle}>
//                   <button
//                     onClick={() => {
//                       setLocations("");
//                       setDepartment("");
//                       setManager("");
//                       queryClient.invalidateQueries("organization-attenedence");
//                       queryClient.invalidateQueries("Org-Salary-overview");
//                     }}
//                     css={buttonStyle}
//                   >
//                     <FilterAltOff className="text-[1.4em] text-[#152745]" />
//                     Remove Filter
//                   </button>

//                   <Select
//                     placeholder="Departments"
//                     onChange={(dept) => {
//                       setDepartment(dept.value);
//                       setLocations("");
//                       setManager("");
//                       queryClient.invalidateQueries("department-attenedence");
//                     }}
//                     styles={customStyles}
//                     value={
//                       department
//                         ? Departmentoptions.find(
//                             (option) => option.value === department
//                           )
//                         : ""
//                     }
//                     options={Departmentoptions}
//                   />

//                   <Select
//                     placeholder="Manager"
//                     components={{ IndicatorSeparator: () => null }}
//                     onChange={(Managers) => {
//                       setManager(Managers.value);
//                       setDepartment("");
//                       setLocations("");
//                       queryClient.invalidateQueries("manager-attenedence");
//                     }}
//                     value={
//                       manager
//                         ? managerOptions.find((item) => item.name === manager)
//                         : ""
//                     }
//                     styles={customStyles}
//                     options={managerOptions}
//                   />

//                   <Select
//                     placeholder="Location"
//                     components={{ IndicatorSeparator: () => null }}
//                     onChange={(loc) => {
//                       setLocations(loc.value);
//                       setDepartment("");
//                       setManager("");
//                       queryClient.invalidateQueries("location-attenedence");
//                     }}
//                     value={
//                       locations
//                         ? locationOptions.find(
//                             (item) => item.name === locations
//                           )
//                         : ""
//                     }
//                     styles={customStyles}
//                     options={locationOptions}
//                   />
//                 </div>
//               </Popover>

//               {location.pathname?.includes("/HR-dashboard") && (
//                 <div className="w-[80%] hidden md:flex gap-6 items-center justify-end">
//                   <button
//                     onClick={() => {
//                       setLocations("");
//                       setDepartment("");
//                       setManager("");
//                       queryClient.invalidateQueries("organization-attenedence");
//                     }}
//                     css={buttonStyle}
//                   >
//                     <FilterAltOff className="text-[1.4em] text-[#152745]" />
//                     Remove Filter
//                   </button>

//                  <Select
//                     placeholder="Departments"
//                     onChange={(dept) => {
//                       setDepartment(dept.value);
//                       setLocations("");
//                       setManager("");
//                       queryClient.invalidateQueries("department-attenedence");
//                     }}
//                     components={{ IndicatorSeparator: () => null }}
//                     styles={customStyles}
//                     value={
//                       department
//                         ? Departmentoptions.find(
//                             (option) => option.value === department
//                           )
//                         : ""
//                     }
//                     options={Departmentoptions}
//                   />

//                   <Select
//                     placeholder="Manager"
//                     components={{ IndicatorSeparator: () => null }}
//                     onChange={(Managers) => {
//                       setManager(Managers.value);
//                       setDepartment("");
//                       setLocations("");
//                       queryClient.invalidateQueries("manager-attenedence");
//                     }}
//                     value={
//                       manager
//                         ? managerOptions.find((item) => item.name === manager)
//                         : ""
//                     }
//                     styles={customStyles}
//                     options={managerOptions}
//                   />

//                   <Select
//                     placeholder="Location"
//                     components={{ IndicatorSeparator: () => null }}
//                     onChange={(loc) => {
//                       setLocations(loc.value);
//                       setDepartment("");
//                       setManager("");
//                       queryClient.invalidateQueries("location-attenedence");
//                     }}
//                     value={
//                       locations
//                         ? locationOptions.find(
//                             (item) => item.name === locations
//                           )
//                         : ""
//                     }
//                     styles={customStyles}
//                     options={locationOptions}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         <div className="w-full md:gap-4 md:space-y-0 space-y-3 mt-4 flex md:flex-row flex-col items-center">
//           <div className="w-full md:w-[50%]">
//             <LineGraph
//               salarydata={salaryData}
//               isLoading={salaryGraphLoading}
//               selectedyear={selectedSalaryYear}
//               setSelectedYear={setSelectedSalaryYear}
//             />
//           </div>
//           <div className="w-full md:w-[50%]">
//             <AttendenceBar
//               orgId={user.organizationId}
//               isLoading={oraganizationLoading}
//               attendenceData={data}
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default DashBoardHR;

//😎😋😊

import {
  Dashboard,
  EventAvailable,
  EventBusy,
  FilterAlt,
  FilterAltOff,
  Groups,
  LocationOn,
  NearMe,
  SupervisorAccount,
} from "@mui/icons-material";
import { IconButton, Popover } from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { useQueryClient } from "react-query";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import HeaderComponentPro from "../../components/header/HeaderComponentPro";
import useDashGlobal from "../../hooks/Dashboard/useDashGlobal";
import useDashboardFilter from "../../hooks/Dashboard/useDashboardFilter";
import useEmployee from "../../hooks/Dashboard/useEmployee";
import UserProfile from "../../hooks/UserData/useUser";
import LineGraph from "./Components/Bar/LineGraph";
import AttendenceBar from "./Components/Bar/SuperAdmin/AttendenceBar";
import SuperAdminCard from "./Components/Card/superadmin/SuperAdminCard";
import SkeletonFilterSection from "./Components/Skeletons/SkeletonFilterSection";
import useRemoteCount from "./hooks/useRemoteCount";

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: "#d1d5db",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#4f46e5",
    },
    "&:focus": {
      borderColor: "#4f46e5",
    },
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "2px",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#4f46e5" : "#ffffff",
    color: state.isSelected ? "#ffffff" : "#000000",
    "&:hover": {
      backgroundColor: "#f3f4f6",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9ca3af",
  }),
};

const DashboardHr = () => {
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const { employee, employeeLoading } = useEmployee(user.organizationId);
  const { setSelectedSalaryYear, selectedSalaryYear } = useDashGlobal();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // Custom hooks
  const {
    Managers,
    managerLoading,
    oraganizationLoading,
    // salaryGraphLoading,
    locationOptions,
    managerOptions,
    Departmentoptions,
    // customStyles,
    data,
    locations,
    location: loc,
    setLocations,
    manager,
    setManager,
    department,
    setDepartment,
    salaryData,
    absentEmployee,
    getAttendenceData,
  } = useDashboardFilter(user.organizationId);

  const { remoteEmployeeCount } = useRemoteCount(user.organizationId);
  useEffect(() => {
    if (location.pathname?.includes("/DH-dashboard")) {
      getAttendenceData();
    }
    AOS.init({ duration: 1000, once: true });
    // eslint-disable-next-line
  }, []);

  const cardSize = "w-full h-36"; // Adjusted card size for better responsiveness

  return (
    <>
      <HeaderComponentPro
        heading={
          location.pathname?.includes("/DH-dashboard")
            ? "Department Head Dashboard"
            : "HR Dashboard"
        }
        oneLineInfo={
          location.pathname?.includes("/DH-dashboard")
            ? "Manage and review department-specific metrics and reports for better insights"
            : "View and manage general HR metrics and reports"
        }
      />
      <section className="p-2  shadow-lg bg-gray-50">
        <div className="md:px-8 px-2 w-full">
          {/* <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 place-items-center gap-2 md:gap-5 mt-6"> */}
          {/* <div className="grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 content-center sm:grid-cols-1 sm:justify-items-center sm:items-center  gap-4 mt-6 w-full"> */}
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 mt-6 w-full place-items-center">
            <SuperAdminCard
              icon={Groups}
              color={"!bg-blue-500"}
              data={employee?.totalEmployees}
              isLoading={employeeLoading}
              title={"Overall Employee"}
              data-aos="fade-up"
              cardSize={cardSize}
            />
            <SuperAdminCard
              color={"!bg-green-500"}
              isLoading={employeeLoading}
              icon={EventAvailable}
              data={
                !isNaN(employee?.totalEmployees)
                  ? employee?.totalEmployees - absentEmployee
                  : 0
              }
              title={"Present Today"}
              data-aos="fade-up"
              cardSize={cardSize}
            />
            <SuperAdminCard
              title={"Absent Employee"}
              icon={EventBusy}
              color={"!bg-red-500"}
              data={absentEmployee}
              isLoading={false}
              data-aos="fade-up"
              cardSize={cardSize}
            />
            <SuperAdminCard
              color={"!bg-amber-500"}
              icon={SupervisorAccount}
              data={Managers?.length}
              isLoading={managerLoading}
              title={"Manager Statistics"}
              data-aos="fade-up"
              cardSize={cardSize}
            />
            <SuperAdminCard
              color={"!bg-orange-500"}
              isLoading={false}
              icon={LocationOn}
              data={loc?.locationCount}
              title={"Work Location Overview"}
              data-aos="fade-up"
              cardSize={cardSize}
            />
            <SuperAdminCard
              color={"!bg-indigo-500"}
              isLoading={false}
              icon={NearMe}
              data={remoteEmployeeCount}
              title={"Remote Employees"}
              data-aos="fade-up"
              cardSize={cardSize}
            />
          </div>

          {oraganizationLoading ? (
            <SkeletonFilterSection />
          ) : (
            <div className="mt-4 w-full bg-white border rounded-md">
              <div className="items-center justify-between flex gap-2 py-2 px-4">
                <div className="flex items-center gap-2">
                  <Dashboard className="!text-[#67748E]" />
                </div>
                <div className="w-[70%] md:hidden flex gap-6 items-center justify-end">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconButton onClick={handleClick}>
                      <FilterAlt />
                    </IconButton>
                  </motion.div>
                </div>

                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <div className="w-full flex-col h-auto pr-10 p-4 flex gap-4">
                    <motion.button
                      onClick={() => {
                        setLocations("");
                        setDepartment("");
                        setManager("");
                        queryClient.invalidateQueries(
                          "organization-attenedence"
                        );
                        queryClient.invalidateQueries("Org-Salary-overview");
                      }}
                      className="!w-max flex justify-center h-[35px] gap-2 items-center rounded-md px-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      data-aos="fade-up"
                    >
                      <FilterAltOff className="!text-[1.4em] text-white" />
                      Remove Filter
                    </motion.button>

                    <Select
                      placeholder={"Departments"}
                      onChange={(dept) => {
                        setDepartment(dept.value);
                        setLocations("");
                        setManager("");
                        queryClient.invalidateQueries("department-attenedence");
                      }}
                      styles={customSelectStyles}
                      value={
                        department
                          ? Departmentoptions?.find(
                              (option) => option.value === department
                            )
                          : ""
                      }
                      options={Departmentoptions}
                    />

                    <Select
                      placeholder={"Manager"}
                      components={{ IndicatorSeparator: () => null }}
                      onChange={(Managers) => {
                        setManager(Managers.value);
                        setDepartment("");
                        setLocations("");
                        queryClient.invalidateQueries("manager-attenedence");
                      }}
                      value={
                        manager
                          ? managerOptions.find((item) => item.name === manager)
                          : ""
                      }
                      styles={customSelectStyles}
                      options={managerOptions}
                    />

                    <Select
                      placeholder={"Location"}
                      components={{ IndicatorSeparator: () => null }}
                      onChange={(loc) => {
                        setLocations(loc.value);
                        setDepartment("");
                        setManager("");
                        queryClient.invalidateQueries("location-attenedence");
                      }}
                      value={
                        locations
                          ? locationOptions.find(
                              (item) => item.name === locations
                            )
                          : ""
                      }
                      styles={customSelectStyles}
                      options={locationOptions}
                    />
                  </div>
                </Popover>

                {location.pathname?.includes("/HR-dashboard") && (
                  <div className="w-[80%] hidden md:flex gap-6 items-center justify-end">
                    <motion.button
                      onClick={() => {
                        setLocations("");
                        setDepartment("");
                        setManager("");
                        queryClient.invalidateQueries(
                          "organization-attenedence"
                        );
                      }}
                      className="!w-max flex justify-center h-[35px] gap-2 items-center rounded-md px-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      data-aos="fade-up"
                    >
                      <FilterAltOff className="!text-[1.4em] text-white" />
                      Remove Filter
                    </motion.button>

                    <Select
                      placeholder={"Departments"}
                      onChange={(dept) => {
                        setDepartment(dept.value);
                        setLocations("");
                        setManager("");
                        queryClient.invalidateQueries("department-attenedence");
                      }}
                      styles={customSelectStyles}
                      value={
                        department
                          ? Departmentoptions?.find(
                              (option) => option.value === department
                            )
                          : ""
                      }
                      options={Departmentoptions}
                    />

                    <Select
                      placeholder={"Manager"}
                      components={{ IndicatorSeparator: () => null }}
                      onChange={(Managers) => {
                        setManager(Managers.value);
                        setDepartment("");
                        setLocations("");
                        queryClient.invalidateQueries("manager-attenedence");
                      }}
                      value={
                        manager
                          ? managerOptions.find((item) => item.name === manager)
                          : ""
                      }
                      styles={customSelectStyles}
                      options={managerOptions}
                    />

                    <Select
                      placeholder={"Location"}
                      components={{ IndicatorSeparator: () => null }}
                      onChange={(loc) => {
                        setLocations(loc.value);
                        setDepartment("");
                        setManager("");
                        queryClient.invalidateQueries("location-attenedence");
                      }}
                      value={
                        locations
                          ? locationOptions.find(
                              (item) => item.name === locations
                            )
                          : ""
                      }
                      styles={customSelectStyles}
                      options={locationOptions}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="w-full  md:gap-4 md:space-y-0 space-y-3 mt-4 flex md:flex-row flex-col items-center">
            <div className="w-[100%] md:w-[50%]">
              <LineGraph
                salarydata={salaryData}
                selectedyear={selectedSalaryYear}
                setSelectedYear={setSelectedSalaryYear}
              />
            </div>
            <div className="w-[100%] md:w-[50%]">
              <AttendenceBar
                isLoading={oraganizationLoading}
                attendenceData={data}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DashboardHr;
