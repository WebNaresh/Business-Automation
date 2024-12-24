// import { Close } from "@mui/icons-material";
// import {
//   Backdrop,
//   Button,
//   CircularProgress,
//   MenuItem,
//   Popover,
//   Select,
// } from "@mui/material";
// import moment from "moment";
// import { momentLocalizer } from "react-big-calendar";
// import { useQuery, useQueryClient } from "react-query";
// import axios from "axios";
// import React, { useContext, useEffect, useMemo, useState } from "react";
// import { Calendar } from "react-big-calendar";
// import { useParams } from "react-router-dom";
// import { TestContext } from "../../State/Function/Main";
// import useGetUser from "../../hooks/Token/useUser";
// import usePublicHoliday from "../../pages/SetUpOrganization/PublicHolidayPage/usePublicHoliday";
// import ReusableModal from "../Modal/component";
// import MiniForm from "./components/mini-form";

// const AppDatePicker = ({
//   data,
//   handleUpdateFunction,
//   selectEvent,
//   setselectEvent,
//   setCalendarOpen,
//   setNewAppliedLeaveEvents,
//   selectedLeave,
//   setSelectedLeave,
//   newAppliedLeaveEvents,
//   isCalendarOpen,
//   shiftData,
//   deleteLeaveMutation,
//   calLoader,
//   setCalLoader,
// }) => {
//   const localizer = momentLocalizer(moment);
//   const queryClient = useQueryClient();
//   const { organisationId } = useParams();
//   const [Delete, setDelete] = useState(false);
//   const [update, setUpdate] = useState(false);
//   const { handleAlert } = useContext(TestContext);
//   const { authToken } = useGetUser();
//   const [openDelete, setOpenDelete] = useState(false);
//   const { filteredHolidayWithStartAndEnd, allPublicHoliday } =
//     usePublicHoliday(organisationId);

//   const currentMonth = moment().month();
//   const currentYear = moment().year();
//   console.log("current month", currentMonth);
//   console.log("currentYear ", currentYear);

//   const { data: data2 } = useQuery(
//     "employee-disable-weekends",
//     async () => {
//       setCalLoader(true);
//       const response = await axios.get(
//         `${import.meta.env.VITE_API}/route/weekend/get`,
//         {
//           headers: { Authorization: authToken },
//         }
//       );

//       return response.data;
//     },
//     {
//       onSuccess: () => {
//         setCalLoader(false);
//       },
//       onError: () => {
//         setCalLoader(false);
//       },
//     }
//   );
//   const handleSelectEvent = (event) => {
//     setCalLoader(true);
//     setSelectedLeave(event);
//     setCalendarOpen(true);
//     if (event.title === "Selected Leave") {
//       setDelete(true);
//       setUpdate(false);
//     } else if (event.color) {
//       setUpdate(true);
//       setDelete(true);
//     } else {
//       setDelete(false);
//       setUpdate(false);
//     }
//     setCalLoader(false);
//   };

//   const dayPropGetter = (date) => {
//     const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });

//     // Check if the current day is in the data? array
//     const isDisabled = data2?.days?.days?.some((day) => {
//       return day.day === dayOfWeek;
//     });
//     if (isDisabled) {
//       return {
//         style: {
//           pointerEvents: "none",
//           backgroundColor: "#f7bfbf",
//         },
//       };
//     }

//     return {};
//   };

//   const makeMessage = useMemo(() => {
//     if (selectedLeave?.status === "Approved") {
//       return "Your leave has been approved";
//     } else if (selectedLeave?.status === "Pending") {
//       return "Your leave is pending for approval";
//     } else if (selectedLeave?.status === "Rejected") {
//       return "Your leave has been rejected";
//     } else {
//       return "";
//     }
//   }, [selectedLeave]);

//   const handleSelectSlot = async ({ start, end }) => {
//     setCalLoader(true);
//     const selectedStartDate = moment(start).startOf("day");
//     const selectedEndDate = moment(end).startOf("day").subtract(1, "days");

//     const currentDate = moment(selectedStartDate);

//     const includedDays = data2.days?.days?.map((day) => day.day);

//     while (currentDate.isSameOrBefore(selectedEndDate)) {
//       const currentDay = currentDate.format("ddd");
//       if (includedDays.includes(currentDay)) {
//         setCalLoader(false);
//         return handleAlert(
//           true,
//           "warning",
//           `You cannot select ${currentDay} for leave`
//         );
//       }
//       currentDate.add(1, "day");
//     }
//     await queryClient.invalidateQueries("employee-leave-table-without-default");

//     const isOverlap = [
//       ...data?.currentYearLeaves,
//       ...newAppliedLeaveEvents,
//       ...shiftData?.requests,
//     ].some((range) => {
//       // Convert range start and end dates to Moment.js objects
//       const rangeStart = range.start;
//       const rangeEnd = moment(range.end).startOf("day").subtract(1, "days");

//       // Check if selected start date is between any existing range
//       const isStartBetween = selectedStartDate.isBetween(
//         rangeStart,
//         rangeEnd,
//         undefined,
//         "[)"
//       );

//       // Check if selected end date is between any existing range
//       const isEndBetween = selectedEndDate.isBetween(
//         rangeStart,
//         rangeEnd,
//         undefined,
//         "(]"
//       );

//       // Check if selected start and end date overlaps with any existing range

//       const isOverlap =
//         selectedStartDate.isSameOrBefore(rangeEnd) &&
//         selectedEndDate.isSameOrAfter(rangeStart);
//       // Return true if any overlap is found
//       return isStartBetween || isEndBetween || isOverlap;
//     });

//     if (isOverlap) {
//       setCalLoader(false);
//       return handleAlert(
//         true,
//         "warning",
//         "You have already selected this leave"
//       );
//     } else {
//       const newLeave = {
//         title: selectEvent ? "Updated Leave" : "Selected Leave",
//         start: new Date(start).toISOString(),
//         end: new Date(end).toISOString(),
//         color: selectEvent ? "black" : "blue",
//         leaveTypeDetailsId: "",
//         _id: selectedLeave?._id ? selectedLeave?._id : null,
//       };

//       setNewAppliedLeaveEvents((prevEvents) => [...prevEvents, newLeave]);
//       setSelectedLeave(selectEvent ? null : newLeave);
//       setselectEvent(false);
//     }
//     setCalLoader(false);
//   };

//   const CustomToolbar = (toolbar) => {
//     const handleMonthChange = (event) => {
//       const newDate = moment(toolbar.date).month(event.target.value).toDate();
//       toolbar.onNavigate("current", newDate);
//     };

//     const handleYearChange = (event) => {
//       setCalLoader(true);
//       const newDate = moment(toolbar.date).year(event.target.value).toDate();
//       toolbar.onNavigate("current", newDate);
//       setCalLoader(false);
//     };

//     return (
//       <>
//         <div className="flex-row-reverse flex gap-4 items-center">
//           <Button
//             color="error"
//             className="!h-full hover:!bg-[#da4f4f] hover:!text-white"
//             size="small"
//             onClick={() => setCalendarOpen(false)}
//           >
//             <Close />
//           </Button>
//           <Select
//             className="m-2"
//             size="small"
//             value={moment(toolbar.date).month()}
//             onChange={handleMonthChange}
//           >
//             {moment.months().map((month, index) => (
//               <MenuItem key={index} value={index}>
//                 {month}
//               </MenuItem>
//             ))}
//           </Select>
//           <Select
//             className="m-2"
//             size="small"
//             value={moment(toolbar.date).year()}
//             onChange={handleYearChange}
//           >
//             {Array.from({ length: 10 }).map((_, index) => (
//               <MenuItem key={index} value={moment(toolbar.date).year() + index}>
//                 {moment(toolbar.date).year() + index}
//               </MenuItem>
//             ))}
//           </Select>
//         </div>
//         <div className="flex w-full flex-row-reverse px-3 text-red-500 italic font-extrabold text-xs h-[20px]">
//           {" "}
//           {selectedLeave && makeMessage}{" "}
//         </div>
//       </>
//     );
//   };
//   const handleClickAway = (event) => {
//     const clickableElements = document.querySelectorAll(`.rbc-event-content`);

//     if (
//       !Array.from(clickableElements).some((element) =>
//         element.contains(event.target)
//       )
//     ) {
//     } else {
//     }
//   };
//   const handleDelete = (e) => {
//     if (selectedLeave.title === "Selected Leave") {
//       setNewAppliedLeaveEvents((prev) =>
//         prev.filter((data) => {
//           // Check if the current leave matches the leave to be removed
//           return !(
//             data.title === selectedLeave.title &&
//             data.start === selectedLeave.start &&
//             data.end === selectedLeave.end
//           );
//         })
//       );
//     } else {
//       setOpenDelete(true);
//     }
//     setDelete(false);
//   };
//   useEffect(() => {
//     // Add click event listener when component mounts
//     document.addEventListener("click", handleClickAway);

//     // Cleanup the event listener when the component unmounts
//     return () => {
//       document.removeEventListener("click", handleClickAway);
//     };
//   }, []);

//   return (
//     <Popover
//     // className="!w-[400px] "
//     // className="xl:!w-[400px] xl:h-[200px] !bottom-0 !p-0 flex flex-col justify-between !top-auto relative"

//       PaperProps={{
//         className:
//           "xl:!w-[400px] xl:!h-[150px] !bottom-0 !p-0 flex flex-col justify-between !top-auto relative",
//       }}
//       open={isCalendarOpen}
//       onClose={() => setCalendarOpen(false)}
//       components={{
//         toolbar: CustomToolbar,
//       }}
//       anchorOrigin={{
//         vertical: "bottom",
//         horizontal: "right",
//       }}
//       style={{ height: "500px !important" }}
//     >
//       {calLoader && (
//         <div className="absolute h-[-webkit-fill-available] w-[-webkit-fill-available] flex items-center justify-center z-50">
//           <Backdrop style={{ position: "absolute" }} open={true}>
//             <CircularProgress />
//           </Backdrop>
//         </div>
//       )}
//       <div className=" bg-white z-10 ">
//         <div className="w-full">
//           {allPublicHoliday &&
//             filteredHolidayWithStartAndEnd &&
//             shiftData?.requests &&
//             data?.currentYearLeaves && (
//               <Calendar
//                 localizer={localizer}
//                 views={["month"]}
//                 components={{
//                   toolbar: CustomToolbar,
//                 }}
//                 events={
//                   data
//                     ? [
//                       ...data?.currentYearLeaves,
//                       ...shiftData?.requests,
//                       ...newAppliedLeaveEvents,
//                       ...filteredHolidayWithStartAndEnd,
//                       ...allPublicHoliday,
//                     ]
//                     : [...newAppliedLeaveEvents]
//                 }
//                 startAccessor="start"
//                 endAccessor="end"
//                 style={{
//                   height: "380px",
//                   width: "100%",
//                   background: "#fff",
//                 }}
//                 selectable
//                 onSelectSlot={handleSelectSlot}
//                 onSelectEvent={handleSelectEvent}
//                 datePropGetter={selectedLeave}
//                 eventPropGetter={(event) => {
//                   let backgroundColor = "blue";

//                   if (event?.status) {
//                     switch (event.status) {
//                       case "Pending":
//                         backgroundColor = "orange";
//                         break;
//                       case "Rejected":
//                         backgroundColor = "red";
//                         break;
//                       case "Approved":
//                         backgroundColor = "green";
//                         break;
//                       default:
//                         backgroundColor = "blue";
//                         break;
//                     }
//                   }
//                   if (event.color) {
//                     backgroundColor = event.color;
//                   }

//                   return {
//                     style: {
//                       backgroundColor,
//                     },
//                   };
//                 }}
//                 dayPropGetter={dayPropGetter}
//               />
//             )}
//         </div>
//       </div>

//       <div className="!px-4 !py-2 bg-white flex justify-between">
//         <Button variant="contained" onClick={() => setCalendarOpen(false)}>
//           Submit
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleDelete}
//           className="rbc-event-content"
//           disabled={!Delete}
//         >
//           Delete
//         </Button>
//         <Button
//           variant="contained"
//           onClick={async () => {
//             await handleUpdateFunction();
//             setDelete(false);
//             setUpdate(false);
//           }}
//           className="rbc-event-content"
//           disabled={!update}
//         >
//           Update
//         </Button>
//       </div>

//       <ReusableModal
//         open={openDelete}
//         onClose={() => setOpenDelete(false)}
//         heading={"Are you sure want delete ?"}
//       >
//         <MiniForm
//           id={selectedLeave?._id}
//           mutate={deleteLeaveMutation?.mutate}
//           onClose={() => setOpenDelete(false)}
//         />
//       </ReusableModal>
//     </Popover>
//   );
// };

// export default AppDatePicker;

// ✅

// import { Close } from "@mui/icons-material";
// import {
//   Backdrop,
//   Button,
//   CircularProgress,
//   MenuItem,
//   Popover,
//   Select,
// } from "@mui/material";
// import moment from "moment";
// import { momentLocalizer } from "react-big-calendar";
// import { useQuery, useQueryClient } from "react-query";
// import axios from "axios";
// import React, { useContext, useEffect, useMemo, useState } from "react";
// import { Calendar } from "react-big-calendar";
// import { useParams } from "react-router-dom";
// import { TestContext } from "../../State/Function/Main";
// import useGetUser from "../../hooks/Token/useUser";
// import usePublicHoliday from "../../pages/SetUpOrganization/PublicHolidayPage/usePublicHoliday";
// import ReusableModal from "../Modal/component";
// import MiniForm from "./components/mini-form";

// const CAppDatePicker = ({
//   data,
//   handleUpdateFunction,
//   selectEvent,
//   setselectEvent,
//   setCalendarOpen,
//   setNewAppliedLeaveEvents,
//   selectedLeave,
//   setSelectedLeave,
//   newAppliedLeaveEvents,
//   isCalendarOpen,
//   shiftData,
//   deleteLeaveMutation,
//   calLoader,
//   setCalLoader,
// }) => {
//   const localizer = momentLocalizer(moment);
//   const queryClient = useQueryClient();
//   const { organisationId } = useParams();
//   const [Delete, setDelete] = useState(false);
//   const [update, setUpdate] = useState(false);
//   const { handleAlert } = useContext(TestContext);
//   const { authToken } = useGetUser();
//   const [openDelete, setOpenDelete] = useState(false);
//   const { filteredHolidayWithStartAndEnd, allPublicHoliday } =
//     usePublicHoliday(organisationId);

//   const currentMonth = moment().month();
//   const currentYear = moment().year();
//   console.log("current month", currentMonth);
//   console.log("currentYear ", currentYear);

//   const { data: data2 } = useQuery(
//     "employee-disable-weekends",
//     async () => {
//       setCalLoader(true);
//       const response = await axios.get(
//         `${import.meta.env.VITE_API}/route/weekend/get`,
//         {
//           headers: { Authorization: authToken },
//         }
//       );

//       return response.data;
//     },
//     {
//       onSuccess: () => {
//         setCalLoader(false);
//       },
//       onError: () => {
//         setCalLoader(false);
//       },
//     }
//   );
//   const handleSelectEvent = (event) => {
//     setCalLoader(true);
//     setSelectedLeave(event);
//     setCalendarOpen(true);
//     if (event.title === "Selected Leave") {
//       setDelete(true);
//       setUpdate(false);
//     } else if (event.color) {
//       setUpdate(true);
//       setDelete(true);
//     } else {
//       setDelete(false);
//       setUpdate(false);
//     }
//     setCalLoader(false);
//   };

//   const dayPropGetter = (date) => {
//     const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });

//     // Check if the current day is in the data? array
//     const isDisabled = data2?.days?.days?.some((day) => {
//       return day.day === dayOfWeek;
//     });
//     if (isDisabled) {
//       return {
//         style: {
//           pointerEvents: "none",
//           backgroundColor: "#f7bfbf",
//         },
//       };
//     }

//     return {};
//   };

//   // const makeMessage = useMemo(() => {
//   //   if (selectedLeave?.status === "Approved") {
//   //     return "Your leave has been approved";
//   //   } else if (selectedLeave?.status === "Pending") {
//   //     return "Your leave is pending for approval";
//   //   } else if (selectedLeave?.status === "Rejected") {
//   //     return "Your leave has been rejected";
//   //   } else {
//   //     return "";
//   //   }
//   // }, [selectedLeave]);

//   // const handleSelectSlot = async ({ start, end }) => {
//   //   setCalLoader(true);
//   //   const selectedStartDate = moment(start).startOf("day");
//   //   const selectedEndDate = moment(end).startOf("day").subtract(1, "days");

//   //   const currentDate = moment(selectedStartDate);

//   //   const includedDays = data2.days?.days?.map((day) => day.day);

//   //   while (currentDate.isSameOrBefore(selectedEndDate)) {
//   //     const currentDay = currentDate.format("ddd");
//   //     if (includedDays.includes(currentDay)) {
//   //       setCalLoader(false);
//   //       return handleAlert(
//   //         true,
//   //         "warning",
//   //         `You cannot select ${currentDay} for leave`
//   //       );
//   //     }
//   //     currentDate.add(1, "day");
//   //   }
//   //   await queryClient.invalidateQueries("employee-leave-table-without-default");

//   //   const isOverlap = [
//   //     ...data?.currentYearLeaves,
//   //     ...newAppliedLeaveEvents,
//   //     ...shiftData?.requests,
//   //   ].some((range) => {
//   //     // Convert range start and end dates to Moment.js objects
//   //     const rangeStart = range.start;
//   //     const rangeEnd = moment(range.end).startOf("day").subtract(1, "days");

//   //     // Check if selected start date is between any existing range
//   //     const isStartBetween = selectedStartDate.isBetween(
//   //       rangeStart,
//   //       rangeEnd,
//   //       undefined,
//   //       "[)"
//   //     );

//   //     // Check if selected end date is between any existing range
//   //     const isEndBetween = selectedEndDate.isBetween(
//   //       rangeStart,
//   //       rangeEnd,
//   //       undefined,
//   //       "(]"
//   //     );

//   //     // Check if selected start and end date overlaps with any existing range

//   //     const isOverlap =
//   //       selectedStartDate.isSameOrBefore(rangeEnd) &&
//   //       selectedEndDate.isSameOrAfter(rangeStart);
//   //     // Return true if any overlap is found
//   //     return isStartBetween || isEndBetween || isOverlap;
//   //   });

//   //   if (isOverlap) {
//   //     setCalLoader(false);
//   //     return handleAlert(
//   //       true,
//   //       "warning",
//   //       "You have already selected this leave"
//   //     );
//   //   } else {
//   //     const newLeave = {
//   //       title: selectEvent ? "Updated Leave" : "Selected Leave",
//   //       start: new Date(start).toISOString(),
//   //       end: new Date(end).toISOString(),
//   //       color: selectEvent ? "black" : "blue",
//   //       leaveTypeDetailsId: "",
//   //       _id: selectedLeave?._id ? selectedLeave?._id : null,
//   //     };

//   //     setNewAppliedLeaveEvents((prevEvents) => [...prevEvents, newLeave]);
//   //     setSelectedLeave(selectEvent ? null : newLeave);
//   //     setselectEvent(false);
//   //   }
//   //   setCalLoader(false);
//   // };

//   // const CustomToolbar = (toolbar) => {
//   //   const handleMonthChange = (event) => {
//   //     const newDate = moment(toolbar.date).month(event.target.value).toDate();
//   //     toolbar.onNavigate("current", newDate);
//   //   };

//   //   const handleYearChange = (event) => {
//   //     setCalLoader(true);
//   //     const newDate = moment(toolbar.date).year(event.target.value).toDate();
//   //     toolbar.onNavigate("current", newDate);
//   //     setCalLoader(false);
//   //   };

//   //   return (
//   //     <>
//   //       <div className="flex-row-reverse flex gap-4 items-center">
//   //         <Button
//   //           color="error"
//   //           className="!h-full hover:!bg-[#da4f4f] hover:!text-white"
//   //           size="small"
//   //           onClick={() => setCalendarOpen(false)}
//   //         >
//   //           <Close />
//   //         </Button>
//   //         <Select
//   //           className="m-2"
//   //           size="small"
//   //           value={moment(toolbar.date).month()}
//   //           onChange={handleMonthChange}
//   //         >
//   //           {moment.months().map((month, index) => (
//   //             <MenuItem key={index} value={index}>
//   //               {month}
//   //             </MenuItem>
//   //           ))}
//   //         </Select>
//   //         <Select
//   //           className="m-2"
//   //           size="small"
//   //           value={moment(toolbar.date).year()}
//   //           onChange={handleYearChange}
//   //         >
//   //           {Array.from({ length: 10 }).map((_, index) => (
//   //             <MenuItem key={index} value={moment(toolbar.date).year() + index}>
//   //               {moment(toolbar.date).year() + index}
//   //             </MenuItem>
//   //           ))}
//   //         </Select>
//   //       </div>
//   //       <div className="flex w-full flex-row-reverse px-3 text-red-500 italic font-extrabold text-xs h-[20px]">
//   //         {" "}
//   //         {selectedLeave && makeMessage}{" "}
//   //       </div>
//   //     </>
//   //   );
//   // };
//   // const handleClickAway = (event) => {
//   //   const clickableElements = document.querySelectorAll(`.rbc-event-content`);

//   //   if (
//   //     !Array.from(clickableElements).some((element) =>
//   //       element.contains(event.target)
//   //     )
//   //   ) {
//   //   } else {
//   //   }
//   // };
//   // const handleDelete = (e) => {
//   //   if (selectedLeave.title === "Selected Leave") {
//   //     setNewAppliedLeaveEvents((prev) =>
//   //       prev.filter((data) => {
//   //         // Check if the current leave matches the leave to be removed
//   //         return !(
//   //           data.title === selectedLeave.title &&
//   //           data.start === selectedLeave.start &&
//   //           data.end === selectedLeave.end
//   //         );
//   //       })
//   //     );
//   //   } else {
//   //     setOpenDelete(true);
//   //   }
//   //   setDelete(false);
//   // };
//   // useEffect(() => {
//   //   // Add click event listener when component mounts
//   //   document.addEventListener("click", handleClickAway);

//   //   // Cleanup the event listener when the component unmounts
//   //   return () => {
//   //     document.removeEventListener("click", handleClickAway);
//   //   };
//   // }, []);

//   return (
//     <div className=" bg-white z-10 ">
//     <div className="w-full">
//       {allPublicHoliday &&
//         filteredHolidayWithStartAndEnd &&
//         shiftData?.requests &&
//         data?.currentYearLeaves && (
//           <Calendar
//             localizer={localizer}
//             views={["month"]}
//             // components={{
//             //   toolbar: CustomToolbar,
//             // }}
//             events={
//               data
//                 ? [
//                   ...data?.currentYearLeaves,
//                   ...shiftData?.requests,
//                   ...newAppliedLeaveEvents,
//                   ...filteredHolidayWithStartAndEnd,
//                   ...allPublicHoliday,
//                 ]
//                 : [...newAppliedLeaveEvents]
//             }
//             startAccessor="start"
//             endAccessor="end"
//             style={{
//               height: "400px",
//               width: "100%",
//               background: "#fff",
//             }}
//             selectable
//             // onSelectSlot={handleSelectSlot}
//             onSelectEvent={handleSelectEvent}
//             datePropGetter={selectedLeave}
//             eventPropGetter={(event) => {
//               let backgroundColor = "blue";

//               if (event?.status) {
//                 switch (event.status) {
//                   case "Pending":
//                     backgroundColor = "orange";
//                     break;
//                   case "Rejected":
//                     backgroundColor = "red";
//                     break;
//                   case "Approved":
//                     backgroundColor = "green";
//                     break;
//                   default:
//                     backgroundColor = "blue";
//                     break;
//                 }
//               }
//               if (event.color) {
//                 backgroundColor = event.color;
//               }

//               return {
//                 style: {
//                   backgroundColor,
//                 },
//               };
//             }}
//             dayPropGetter={dayPropGetter}
//           />
//         )}
//     </div>
//   </div>
//   );
// };

// export default CAppDatePicker;

// import { Close } from "@mui/icons-material";
// import {
//   Backdrop,
//   Button,
//   CircularProgress,
//   MenuItem,
//   Popover,
//   Select,
// } from "@mui/material";
// import moment from "moment";
// import { momentLocalizer } from "react-big-calendar";
// import { useQuery, useQueryClient } from "react-query";
// import axios from "axios";
// import React, { useContext, useEffect, useMemo, useState } from "react";
// import { Calendar } from "react-big-calendar";
// import { useParams } from "react-router-dom";
// import { TestContext } from "../../State/Function/Main";
// import useGetUser from "../../hooks/Token/useUser";
// import usePublicHoliday from "../../pages/SetUpOrganization/PublicHolidayPage/usePublicHoliday";
// import ReusableModal from "../Modal/component";
// import MiniForm from "./components/mini-form";

// const AppDatePicker = ({
//   data,
//   handleUpdateFunction,
//   selectEvent,
//   setselectEvent,
//   setCalendarOpen,
//   setNewAppliedLeaveEvents,
//   selectedLeave,
//   setSelectedLeave,
//   newAppliedLeaveEvents,
//   isCalendarOpen,
//   shiftData,
//   deleteLeaveMutation,
//   calLoader,
//   setCalLoader,
// }) => {
//   const localizer = momentLocalizer(moment);
//   const queryClient = useQueryClient();
//   const { organisationId } = useParams();
//   const [Delete, setDelete] = useState(false);
//   const [update, setUpdate] = useState(false);
//   const { handleAlert } = useContext(TestContext);
//   const { authToken } = useGetUser();
//   const [openDelete, setOpenDelete] = useState(false);
//   const { filteredHolidayWithStartAndEnd, allPublicHoliday } =
//     usePublicHoliday(organisationId);

//   const currentMonth = moment().month();
//   const currentYear = moment().year();
//   console.log("current month", currentMonth);
//   console.log("currentYear ", currentYear);

//   const { data: data2 } = useQuery(
//     "employee-disable-weekends",
//     async () => {
//       setCalLoader(true);
//       const response = await axios.get(
//         `${import.meta.env.VITE_API}/route/weekend/get`,
//         {
//           headers: { Authorization: authToken },
//         }
//       );

//       return response.data;
//     },
//     {
//       onSuccess: () => {
//         setCalLoader(false);
//       },
//       onError: () => {
//         setCalLoader(false);
//       },
//     }
//   );
//   const handleSelectEvent = (event) => {
//     setCalLoader(true);
//     setSelectedLeave(event);
//     setCalendarOpen(true);
//     if (event.title === "Selected Leave") {
//       setDelete(true);
//       setUpdate(false);
//     } else if (event.color) {
//       setUpdate(true);
//       setDelete(true);
//     } else {
//       setDelete(false);
//       setUpdate(false);
//     }
//     setCalLoader(false);
//   };

//   const dayPropGetter = (date) => {
//     const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });

//     // Check if the current day is in the data? array
//     const isDisabled = data2?.days?.days?.some((day) => {
//       return day.day === dayOfWeek;
//     });
//     if (isDisabled) {
//       return {
//         style: {
//           pointerEvents: "none",
//           backgroundColor: "#f7bfbf",
//         },
//       };
//     }

//     return {};
//   };

//   const makeMessage = useMemo(() => {
//     if (selectedLeave?.status === "Approved") {
//       return "Your leave has been approved";
//     } else if (selectedLeave?.status === "Pending") {
//       return "Your leave is pending for approval";
//     } else if (selectedLeave?.status === "Rejected") {
//       return "Your leave has been rejected";
//     } else {
//       return "";
//     }
//   }, [selectedLeave]);

//   const handleSelectSlot = async ({ start, end }) => {
//     setCalLoader(true);
//     const selectedStartDate = moment(start).startOf("day");
//     const selectedEndDate = moment(end).startOf("day").subtract(1, "days");

//     const currentDate = moment(selectedStartDate);

//     const includedDays = data2.days?.days?.map((day) => day.day);

//     while (currentDate.isSameOrBefore(selectedEndDate)) {
//       const currentDay = currentDate.format("ddd");
//       if (includedDays.includes(currentDay)) {
//         setCalLoader(false);
//         return handleAlert(
//           true,
//           "warning",
//           `You cannot select ${currentDay} for leave`
//         );
//       }
//       currentDate.add(1, "day");
//     }
//     await queryClient.invalidateQueries("employee-leave-table-without-default");

//     const isOverlap = [
//       ...data?.currentYearLeaves,
//       ...newAppliedLeaveEvents,
//       ...shiftData?.requests,
//     ].some((range) => {
//       // Convert range start and end dates to Moment.js objects
//       const rangeStart = range.start;
//       const rangeEnd = moment(range.end).startOf("day").subtract(1, "days");

//       // Check if selected start date is between any existing range
//       const isStartBetween = selectedStartDate.isBetween(
//         rangeStart,
//         rangeEnd,
//         undefined,
//         "[)"
//       );

//       // Check if selected end date is between any existing range
//       const isEndBetween = selectedEndDate.isBetween(
//         rangeStart,
//         rangeEnd,
//         undefined,
//         "(]"
//       );

//       // Check if selected start and end date overlaps with any existing range

//       const isOverlap =
//         selectedStartDate.isSameOrBefore(rangeEnd) &&
//         selectedEndDate.isSameOrAfter(rangeStart);
//       // Return true if any overlap is found
//       return isStartBetween || isEndBetween || isOverlap;
//     });

//     if (isOverlap) {
//       setCalLoader(false);
//       return handleAlert(
//         true,
//         "warning",
//         "You have already selected this leave"
//       );
//     } else {
//       const newLeave = {
//         title: selectEvent ? "Updated Leave" : "Selected Leave",
//         start: new Date(start).toISOString(),
//         end: new Date(end).toISOString(),
//         color: selectEvent ? "black" : "blue",
//         leaveTypeDetailsId: "",
//         _id: selectedLeave?._id ? selectedLeave?._id : null,
//       };

//       setNewAppliedLeaveEvents((prevEvents) => [...prevEvents, newLeave]);
//       setSelectedLeave(selectEvent ? null : newLeave);
//       setselectEvent(false);
//     }
//     setCalLoader(false);
//   };

//   const CustomToolbar = (toolbar) => {
//     const handleMonthChange = (event) => {
//       const newDate = moment(toolbar.date).month(event.target.value).toDate();
//       toolbar.onNavigate("current", newDate);
//     };

//     const handleYearChange = (event) => {
//       setCalLoader(true);
//       const newDate = moment(toolbar.date).year(event.target.value).toDate();
//       toolbar.onNavigate("current", newDate);
//       setCalLoader(false);
//     };

//     return (
//       <>
//         <div className="flex-row-reverse flex gap-4 items-center">
//           <Button
//             color="error"
//             className="!h-full hover:!bg-[#da4f4f] hover:!text-white"
//             size="small"
//             onClick={() => setCalendarOpen(false)}
//           >
//             <Close />
//           </Button>
//           <Select
//             className="m-2"
//             size="small"
//             value={moment(toolbar.date).month()}
//             onChange={handleMonthChange}
//           >
//             {moment.months().map((month, index) => (
//               <MenuItem key={index} value={index}>
//                 {month}
//               </MenuItem>
//             ))}
//           </Select>
//           <Select
//             className="m-2"
//             size="small"
//             value={moment(toolbar.date).year()}
//             onChange={handleYearChange}
//           >
//             {Array.from({ length: 10 }).map((_, index) => (
//               <MenuItem key={index} value={moment(toolbar.date).year() + index}>
//                 {moment(toolbar.date).year() + index}
//               </MenuItem>
//             ))}
//           </Select>
//         </div>
//         <div className="flex w-full flex-row-reverse px-3 text-red-500 italic font-extrabold text-xs h-[20px]">
//           {" "}
//           {selectedLeave && makeMessage}{" "}
//         </div>
//       </>
//     );
//   };
//   const handleClickAway = (event) => {
//     const clickableElements = document.querySelectorAll(`.rbc-event-content`);

//     if (
//       !Array.from(clickableElements).some((element) =>
//         element.contains(event.target)
//       )
//     ) {
//     } else {
//     }
//   };
//   const handleDelete = (e) => {
//     if (selectedLeave.title === "Selected Leave") {
//       setNewAppliedLeaveEvents((prev) =>
//         prev.filter((data) => {
//           // Check if the current leave matches the leave to be removed
//           return !(
//             data.title === selectedLeave.title &&
//             data.start === selectedLeave.start &&
//             data.end === selectedLeave.end
//           );
//         })
//       );
//     } else {
//       setOpenDelete(true);
//     }
//     setDelete(false);
//   };
//   useEffect(() => {
//     // Add click event listener when component mounts
//     document.addEventListener("click", handleClickAway);

//     // Cleanup the event listener when the component unmounts
//     return () => {
//       document.removeEventListener("click", handleClickAway);
//     };
//   }, []);

//   return (
//     <Popover
//       PaperProps={{
//         className:
//           "w-full xl:w-[400px] xl:h-[470px] !bottom-0 !p-0 flex flex-col justify-between !top-auto relative",
//       }}
//       open={isCalendarOpen}
//       onClose={() => setCalendarOpen(false)}
//       components={{
//         toolbar: CustomToolbar,
//       }}
//       anchorOrigin={{
//         vertical: "bottom",
//         horizontal: "right",
//       }}
//       style={{ height: "500px !important" }}
//     >
//       {calLoader && (
//         <div className="absolute h-[-webkit-fill-available] w-[-webkit-fill-available] flex items-center justify-center z-50">
//           <Backdrop style={{ position: "absolute" }} open={true}>
//             <CircularProgress />
//           </Backdrop>
//         </div>
//       )}
//       <div className=" bg-white z-10 ">
//         <div className="w-full">
//           {allPublicHoliday &&
//             filteredHolidayWithStartAndEnd &&
//             shiftData?.requests &&
//             data?.currentYearLeaves && (
//               <Calendar
//                 localizer={localizer}
//                 views={["month"]}
//                 components={{
//                   toolbar: CustomToolbar,
//                 }}
//                 events={
//                   data
//                     ? [
//                       ...data?.currentYearLeaves,
//                       ...shiftData?.requests,
//                       ...newAppliedLeaveEvents,
//                       ...filteredHolidayWithStartAndEnd,
//                       ...allPublicHoliday,
//                     ]
//                     : [...newAppliedLeaveEvents]
//                 }
//                 startAccessor="start"
//                 endAccessor="end"
//                 style={{
//                   height: "400px",
//                   width: "100%",
//                   background: "#fff",
//                 }}
//                 selectable
//                 onSelectSlot={handleSelectSlot}
//                 onSelectEvent={handleSelectEvent}
//                 datePropGetter={selectedLeave}
//                 eventPropGetter={(event) => {
//                   let backgroundColor = "blue";

//                   if (event?.status) {
//                     switch (event.status) {
//                       case "Pending":
//                         backgroundColor = "orange";
//                         break;
//                       case "Rejected":
//                         backgroundColor = "red";
//                         break;
//                       case "Approved":
//                         backgroundColor = "green";
//                         break;
//                       default:
//                         backgroundColor = "blue";
//                         break;
//                     }
//                   }
//                   if (event.color) {
//                     backgroundColor = event.color;
//                   }

//                   return {
//                     style: {
//                       backgroundColor,
//                     },
//                   };
//                 }}
//                 dayPropGetter={dayPropGetter}
//               />
//             )}
//         </div>
//       </div>

//       <div className="!px-4 !py-2 bg-white flex justify-between">
//         <Button variant="contained" onClick={() => setCalendarOpen(false)}>
//           Submit
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleDelete}
//           className="rbc-event-content"
//           disabled={!Delete}
//         >
//           Delete
//         </Button>
//         <Button
//           variant="contained"
//           onClick={async () => {
//             await handleUpdateFunction();
//             setDelete(false);
//             setUpdate(false);
//           }}
//           className="rbc-event-content"
//           disabled={!update}
//         >
//           Update
//         </Button>
//       </div>

//       <ReusableModal
//         open={openDelete}
//         onClose={() => setOpenDelete(false)}
//         heading={"Are you sure want delete ?"}
//       >
//         <MiniForm
//           id={selectedLeave?._id}
//           mutate={deleteLeaveMutation?.mutate}
//           onClose={() => setOpenDelete(false)}
//         />
//       </ReusableModal>
//     </Popover>
//   );
// };

// export default AppDatePicker;

//😎RECENT
// import {
//   Button,
//   CircularProgress,
//   MenuItem,
//   Backdrop,
//   Select,
// } from "@mui/material";
// import moment from "moment";
// import { momentLocalizer } from "react-big-calendar";
// import { useQuery, useQueryClient } from "react-query";
// import axios from "axios";
// import React, { useContext, useEffect, useMemo, useState } from "react";
// import { Calendar } from "react-big-calendar";
// import { useParams } from "react-router-dom";
// import { TestContext } from "../../State/Function/Main";
// import useGetUser from "../../hooks/Token/useUser";
// import usePublicHoliday from "../../pages/SetUpOrganization/PublicHolidayPage/usePublicHoliday";
// import ReusableModal from "../Modal/component";
// import MiniForm from "./components/mini-form";

// const CAppDatePicker = ({
//   data,
//   handleUpdateFunction,
//   selectEvent,
//   setselectEvent,
//   setNewAppliedLeaveEvents,
//   selectedLeave,
//   setSelectedLeave,
//   newAppliedLeaveEvents,
//   shiftData,
//   deleteLeaveMutation,
//   setIsCAppDatePickerVisible,
//   calLoader,
//   setCalLoader,
// }) => {
//   const localizer = momentLocalizer(moment);
//   const queryClient = useQueryClient();
//   const { organisationId } = useParams();
//   const [Delete, setDelete] = useState(false);
//   const [update, setUpdate] = useState(false);
//   const { handleAlert } = useContext(TestContext);
//   const { authToken } = useGetUser();
//   const [openDelete, setOpenDelete] = useState(false);
//   const { filteredHolidayWithStartAndEnd, allPublicHoliday } =
//     usePublicHoliday(organisationId);

//   const currentMonth = moment().month();
//   const currentYear = moment().year();
//   console.log("current month", currentMonth);
//   console.log("currentYear ", currentYear);

//   const { data: data2 } = useQuery(
//     "employee-disable-weekends",
//     async () => {
//       setCalLoader(true);
//       const response = await axios.get(
//         `${import.meta.env.VITE_API}/route/weekend/get`,
//         {
//           headers: { Authorization: authToken },
//         }
//       );

//       return response.data;
//     },
//     {
//       onSuccess: () => {
//         setCalLoader(false);
//       },
//       onError: () => {
//         setCalLoader(false);
//       },
//     }
//   );

//   const handleSelectEvent = (event) => {
//     setCalLoader(true);
//     setSelectedLeave(event);
//     if (event.title === "Selected Leave") {
//       setDelete(true);
//       setUpdate(false);
//     } else if (event.color) {
//       setUpdate(true);
//       setDelete(true);
//     } else {
//       setDelete(false);
//       setUpdate(false);
//     }
//     setCalLoader(false);
//   };

//   const dayPropGetter = (date) => {
//     const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });

//     // Check if the current day is in the data? array
//     const isDisabled = data2?.days?.days?.some((day) => {
//       return day.day === dayOfWeek;
//     });
//     if (isDisabled) {
//       return {
//         style: {
//           pointerEvents: "none",
//           backgroundColor: "#f7bfbf",
//         },
//       };
//     }

//     return {};
//   };

//   const makeMessage = useMemo(() => {
//     if (selectedLeave?.status === "Approved") {
//       return "Your leave has been approved";
//     } else if (selectedLeave?.status === "Pending") {
//       return "Your leave is pending for approval";
//     } else if (selectedLeave?.status === "Rejected") {
//       return "Your leave has been rejected";
//     } else {
//       return "";
//     }
//   }, [selectedLeave]);

//   const handleSelectSlot = async ({ start, end }) => {
//     setCalLoader(true);
//     const selectedStartDate = moment(start).startOf("day");
//     const selectedEndDate = moment(end).startOf("day").subtract(1, "days");

//     const currentDate = moment(selectedStartDate);

//     const includedDays = data2.days?.days?.map((day) => day.day);

//     while (currentDate.isSameOrBefore(selectedEndDate)) {
//       const currentDay = currentDate.format("ddd");
//       if (includedDays.includes(currentDay)) {
//         setCalLoader(false);
//         return handleAlert(
//           true,
//           "warning",
//           `You cannot select ${currentDay} for leave`
//         );
//       }
//       currentDate.add(1, "day");
//     }
//     await queryClient.invalidateQueries("employee-leave-table-without-default");

//     const isOverlap = [
//       ...data?.currentYearLeaves,
//       ...newAppliedLeaveEvents,
//       ...shiftData?.requests,
//     ].some((range) => {
//       // Convert range start and end dates to Moment.js objects
//       const rangeStart = range.start;
//       const rangeEnd = moment(range.end).startOf("day").subtract(1, "days");

//       // Check if selected start date is between any existing range
//       const isStartBetween = selectedStartDate.isBetween(
//         rangeStart,
//         rangeEnd,
//         undefined,
//         "[)"
//       );

//       // Check if selected end date is between any existing range
//       const isEndBetween = selectedEndDate.isBetween(
//         rangeStart,
//         rangeEnd,
//         undefined,
//         "(]"
//       );

//       // Check if selected start and end date overlaps with any existing range

//       const isOverlap =
//         selectedStartDate.isSameOrBefore(rangeEnd) &&
//         selectedEndDate.isSameOrAfter(rangeStart);
//       // Return true if any overlap is found
//       return isStartBetween || isEndBetween || isOverlap;
//     });

//     if (isOverlap) {
//       setCalLoader(false);
//       return handleAlert(
//         true,
//         "warning",
//         "You have already selected this leave"
//       );
//     } else {
//       const newLeave = {
//         title: selectEvent ? "Updated Leave" : "Selected Leave",
//         start: new Date(start).toISOString(),
//         end: new Date(end).toISOString(),
//         color: selectEvent ? "black" : "blue",
//         leaveTypeDetailsId: "",
//         _id: selectedLeave?._id ? selectedLeave?._id : null,
//       };

//       setNewAppliedLeaveEvents((prevEvents) => [...prevEvents, newLeave]);
//       setSelectedLeave(selectEvent ? null : newLeave);
//       setselectEvent(false);
//     }
//     setCalLoader(false);
//   };

//   const CustomToolbar = (toolbar) => {
//     const handleMonthChange = (event) => {
//       const newDate = moment(toolbar.date).month(event.target.value).toDate();
//       toolbar.onNavigate("current", newDate);
//     };

//     const handleYearChange = (event) => {
//       setCalLoader(true);
//       const newDate = moment(toolbar.date).year(event.target.value).toDate();
//       toolbar.onNavigate("current", newDate);
//       setCalLoader(false);
//     };

//     return (
//       <>
//         <div className="flex-row-reverse flex gap-4 items-center ">

//           <Select
//             className="m-2"
//             size="small"
//             value={moment(toolbar.date).month()}
//             onChange={handleMonthChange}
//           >
//             {moment.months().map((month, index) => (
//               <MenuItem key={index} value={index}>
//                 {month}
//               </MenuItem>
//             ))}
//           </Select>
//           <Select
//             className="m-2"
//             size="small"
//             value={moment(toolbar.date).year()}
//             onChange={handleYearChange}
//           >
//             {Array.from({ length: 10 }).map((_, index) => (
//               <MenuItem key={index} value={moment(toolbar.date).year() + index}>
//                 {moment(toolbar.date).year() + index}
//               </MenuItem>
//             ))}
//           </Select>
//         </div>
//         <div className="flex w-full flex-row-reverse px-3 text-red-500 italic font-extrabold text-xs h-[20px]">
//           {" "}
//           {selectedLeave && makeMessage}{" "}
//         </div>
//       </>
//     );
//   };

//   const handleDelete = (e) => {
//     if (selectedLeave.title === "Selected Leave") {
//       setNewAppliedLeaveEvents((prev) =>
//         prev.filter((data) => {
//           // Check if the current leave matches the leave to be removed
//           return !(
//             data.title === selectedLeave.title &&
//             data.start === selectedLeave.start &&
//             data.end === selectedLeave.end
//           );
//         })
//       );
//     } else {
//       setOpenDelete(true);
//     }
//     setDelete(false);
//   };

//   useEffect(() => {
//     // Add click event listener when component mounts
//     // document.addEventListener("click", handleClickAway);

//     // Cleanup the event listener when the component unmounts
//     return () => {
//       // document.removeEventListener("click", handleClickAway);
//     };
//   }, []);

//   return (

//     // <div className="relative" style={{backgroundColor:"red"}}>

//     <div className="relative" >
//       {/* <p>abc</p> */}
//       {calLoader && (
//         <div className="absolute h-[-webkit-fill-available] w-[-webkit-fill-available] flex items-center justify-center z-50">
//           <Backdrop style={{ position: "absolute" }} open={true}>
//             <CircularProgress />
//           </Backdrop>
//         </div>
//       )}
//       <div className=" bg-white z-10 " >
//         <div className="w-full">
//           {allPublicHoliday &&
//             filteredHolidayWithStartAndEnd &&
//             shiftData?.requests &&
//             data?.currentYearLeaves && (
//               <Calendar
//                 localizer={localizer}
//                 views={["month"]}
//                 components={{
//                   toolbar: CustomToolbar,
//                 }}
//                 events={
//                   data
//                     ? [
//                       ...data?.currentYearLeaves,
//                       ...shiftData?.requests,
//                       ...newAppliedLeaveEvents,
//                       ...filteredHolidayWithStartAndEnd,
//                       ...allPublicHoliday,
//                     ]
//                     : [...newAppliedLeaveEvents]
//                 }
//                 startAccessor="start"
//                 endAccessor="end"
//                 style={{
//                   height: "400px",
//                   width: "100%",
//                   background: "#fff",
//                 }}
//                 selectable
//                 onSelectSlot={handleSelectSlot}
//                 onSelectEvent={handleSelectEvent}
//                 datePropGetter={selectedLeave}
//                 eventPropGetter={(event) => {
//                   let backgroundColor = "blue";

//                   if (event?.status) {
//                     switch (event.status) {
//                       case "Pending":
//                         backgroundColor = "orange";
//                         break;
//                       case "Rejected":
//                         backgroundColor = "red";
//                         break;
//                       case "Approved":
//                         backgroundColor = "green";
//                         break;
//                       default:
//                         backgroundColor = "blue";
//                         break;
//                     }
//                   }
//                   if (event.color) {
//                     backgroundColor = event.color;
//                   }

//                   return {
//                     style: {
//                       backgroundColor,
//                     },
//                   };
//                 }}
//                 dayPropGetter={dayPropGetter}
//               />
//             )}
//         </div>
//       </div>

//       <div className=" !px-4 !py-2 bg-white flex justify-center gap-2">
//         <Button variant="contained" onClick={() => {setCalLoader(false)
//         if(newAppliedLeaveEvents?.length > 0){

//           setIsCAppDatePickerVisible(false)
//         }
// }

//         }>
//           Submit
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleDelete}
//           className="rbc-event-content"
//           disabled={!Delete}
//         >
//           Delete
//         </Button>
//         <Button
//           variant="contained"
//           onClick={async () => {
//             await handleUpdateFunction();
//             setDelete(false);
//             setUpdate(false);
//           }}
//           className="rbc-event-content"
//           disabled={!update}
//         >
//           Update
//         </Button>
//       </div>

//       <ReusableModal
//         open={openDelete}
//         onClose={() => setOpenDelete(false)}
//         heading={"Are you sure want delete ?"}
//       >
//         <MiniForm
//           id={selectedLeave?._id}
//           mutate={deleteLeaveMutation?.mutate}
//           onClose={() => setOpenDelete(false)}
//         />
//       </ReusableModal>
//     </div>
//   );
// };

// export default CAppDatePicker;

import {
  Backdrop,
  Button,
  CircularProgress,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import DateDisplay from "../../components/date-picker/DateDisplay";
import useGetUser from "../../hooks/Token/useUser";
import usePublicHoliday from "../../pages/SetUpOrganization/PublicHolidayPage/usePublicHoliday";
import ReusableModal from "../Modal/component";
import MiniForm from "./components/mini-form";

const CAppDatePicker = ({
  data,
  handleUpdateFunction,
  selectEvent,
  setselectEvent,
  setNewAppliedLeaveEvents,
  selectedLeave,
  setSelectedLeave,
  newAppliedLeaveEvents,
  shiftData,
  deleteLeaveMutation,
  setIsCAppDatePickerVisible,
  calLoader,
  setCalLoader,
  setCalendarOpen,
}) => {
  const localizer = momentLocalizer(moment);
  const queryClient = useQueryClient();
  const { organisationId } = useParams();
  const [Delete, setDelete] = useState(false);
  const [update, setUpdate] = useState(false);
  const { handleAlert } = useContext(TestContext);
  const { authToken } = useGetUser();
  const [openDelete, setOpenDelete] = useState(false);
  const { filteredHolidayWithStartAndEnd, allPublicHoliday } =
    usePublicHoliday(organisationId);

  const increaseEndDateByOneDay = (events) => {
    return events?.map((event) => ({
      ...event,
      end: moment(event.end).add(1, "days").toDate(),
    }));
  };

  const leaves = increaseEndDateByOneDay(data?.currentYearLeaves);
  const newAppliedLeaveEvent = increaseEndDateByOneDay(newAppliedLeaveEvents);

  const currentMonth = moment().month();
  const currentYear = moment().year();
  console.log("current month", currentMonth);
  console.log("currentYear ", currentYear);

  const { data: data2 } = useQuery(
    "employee-disable-weekends",
    async () => {
      setCalLoader(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API}/route/weekend/get`,
        {
          headers: { Authorization: authToken },
        }
      );

      return response.data;
    },
    {
      onSuccess: () => {
        setCalLoader(false);
      },
      onError: () => {
        setCalLoader(false);
      },
    }
  );

  const handleSelectEvent = (event) => {
    setCalLoader(true);
    setSelectedLeave(event);
    if (event.title === "Selected Leave") {
      setDelete(true);
      setUpdate(false);
    } else if (event.color) {
      setUpdate(true);
      setDelete(true);
    } else {
      setDelete(false);
      setUpdate(false);
    }
    setCalLoader(false);
  };

  const dayPropGetter = (date) => {
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });

    // Check if the current day is in the data? array
    const isDisabled = data2?.days?.days?.some((day) => {
      return day.day === dayOfWeek;
    });
    if (isDisabled) {
      return {
        style: {
          pointerEvents: "none",
          backgroundColor: "#f7bfbf",
        },
      };
    }

    return {};
  };

  const makeMessage = useMemo(() => {
    if (selectedLeave?.status === "Approved") {
      return "Your leave has been approved";
    } else if (selectedLeave?.status === "Pending") {
      return "Your leave is pending for approval";
    } else if (selectedLeave?.status === "Rejected") {
      return "Your leave has been rejected";
    } else {
      return "";
    }
  }, [selectedLeave]);

  const handleSelectSlot = async ({ start, end }) => {
    setCalLoader(true);
    const selectedStartDate = moment(start).startOf("day");
    const selectedEndDate = moment(end).startOf("day").subtract(1, "days");

    const currentDate = moment(selectedStartDate);

    const includedDays = data2.days?.days?.map((day) => day.day);

    while (currentDate.isSameOrBefore(selectedEndDate)) {
      const currentDay = currentDate.format("ddd");
      if (includedDays.includes(currentDay)) {
        setCalLoader(false);
        return handleAlert(
          true,
          "warning",
          `You cannot select ${currentDay} for leave`
        );
      }
      currentDate.add(1, "day");
    }
    await queryClient.invalidateQueries("employee-leave-table-without-default");

    const isOverlap = [
      ...data?.currentYearLeaves,
      ...newAppliedLeaveEvents,
      ...shiftData?.requests,
    ].some((range) => {
      // Convert range start and end dates to Moment.js objects
      const rangeStart = range.start;
      const rangeEnd = moment(range.end).startOf("day").subtract(1, "days");

      // Check if selected start date is between any existing range
      const isStartBetween = selectedStartDate.isBetween(
        rangeStart,
        rangeEnd,
        undefined,
        "[)"
      );

      // Check if selected end date is between any existing range
      const isEndBetween = selectedEndDate.isBetween(
        rangeStart,
        rangeEnd,
        undefined,
        "(]"
      );

      // Check if selected start and end date overlaps with any existing range

      const isOverlap =
        selectedStartDate.isSameOrBefore(rangeEnd) &&
        selectedEndDate.isSameOrAfter(rangeStart);
      // Return true if any overlap is found
      return isStartBetween || isEndBetween || isOverlap;
    });

    if (isOverlap) {
      setCalLoader(false);
      return handleAlert(
        true,
        "warning",
        "You have already selected this leave"
      );
    } else {
      const newLeave = {
        title: selectEvent ? "Updated Leave" : "Selected Leave",
        start: new Date(start).toISOString(),
        end: new Date(selectedEndDate).toISOString(),
        color: selectEvent ? "black" : "blue",
        leaveTypeDetailsId: "",
        _id: selectedLeave?._id ? selectedLeave?._id : null,
      };
      console.log("newleave", newLeave);

      setNewAppliedLeaveEvents((prevEvents) => [...prevEvents, newLeave]);
      setSelectedLeave(selectEvent ? null : newLeave);
      setselectEvent(false);
    }
    setCalLoader(false);
  };

  const CustomToolbar = (toolbar) => {
    const handleMonthChange = (event) => {
      const newDate = moment(toolbar.date).month(event.target.value).toDate();
      toolbar.onNavigate("current", newDate);
    };

    const handleYearChange = (event) => {
      setCalLoader(true);
      const newDate = moment(toolbar.date).year(event.target.value).toDate();
      toolbar.onNavigate("current", newDate);
      setCalLoader(false);
    };

    return (
      <>
        <div className="flex-row-reverse flex justify-between gap-2 items-center ">
          <div className="flex justify-end">
            <Select
              className="m-2"
              size="small"
              value={moment(toolbar.date).month()}
              onChange={handleMonthChange}
            >
              {moment.months().map((month, index) => (
                <MenuItem key={index} value={index}>
                  {month}
                </MenuItem>
              ))}
            </Select>
            <Select
              className="m-2"
              size="small"
              value={moment(toolbar.date).year()}
              onChange={handleYearChange}
            >
              {Array.from({ length: 10 }).map((_, index) => (
                <MenuItem
                  key={index}
                  value={moment(toolbar.date).year() + index}
                >
                  {moment(toolbar.date).year() + index}
                </MenuItem>
              ))}
            </Select>
          </div>

          <div className="flex justify-start">
            {/* shows today date */}
            <DateDisplay />
          </div>
        </div>

        <div className="flex w-full flex-row-reverse px-3 text-red-500 italic font-extrabold text-xs h-[20px]">
          {" "}
          {selectedLeave && makeMessage}{" "}
        </div>
      </>
    );
  };

  const handleDelete = (e) => {
    if (selectedLeave.title === "Selected Leave") {
      setNewAppliedLeaveEvents((prev) =>
        prev.filter((data) => {
          // Check if the current leave matches the leave to be removed
          return !(
            data.title === selectedLeave.title &&
            data.start === selectedLeave.start &&
            data.end === selectedLeave.end
          );
        })
      );
    } else {
      setOpenDelete(true);
    }
    setDelete(false);
  };

  useEffect(() => {
    // Add click event listener when component mounts
    // document.addEventListener("click", handleClickAway);

    // Cleanup the event listener when the component unmounts
    return () => {
      // document.removeEventListener("click", handleClickAway);
    };
  }, []);

  return (
    <div className="relative border-2 border-gray-200 p-3">
      {/* // <div className="relative  p-2"> */}

      {calLoader && (
        <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center z-50 bg-opacity-50 bg-gray-800">
          <Backdrop style={{ position: "absolute" }} open={true}>
            <CircularProgress />
          </Backdrop>
        </div>
      )}
      <div className="bg-white z-10 ">
        <div className="w-full">
          {allPublicHoliday &&
            filteredHolidayWithStartAndEnd &&
            shiftData?.requests &&
            data?.currentYearLeaves && (
              <Calendar
                localizer={localizer}
                views={["month"]}
                components={{
                  toolbar: CustomToolbar,
                }}
                events={
                  data
                    ? [
                        ...leaves,
                        ...shiftData?.requests,
                        ...newAppliedLeaveEvent,
                        ...filteredHolidayWithStartAndEnd,
                        ...allPublicHoliday,
                      ]
                    : [...newAppliedLeaveEvent]
                }
                startAccessor="start"
                endAccessor="end"
                style={{
                  height: "400px",
                  width: "100%",
                  background: "#fff",
                }}
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                datePropGetter={selectedLeave}
                eventPropGetter={(event) => {
                  let backgroundColor = "blue";

                  if (event?.status) {
                    switch (event.status) {
                      case "Pending":
                        backgroundColor = "orange";
                        break;
                      case "Rejected":
                        backgroundColor = "red";
                        break;
                      case "Approved":
                        backgroundColor = "green";
                        break;
                      default:
                        backgroundColor = "blue";
                        break;
                    }
                  }
                  if (event.color) {
                    backgroundColor = event.color;
                  }

                  return {
                    style: {
                      backgroundColor,
                    },
                  };
                }}
                dayPropGetter={dayPropGetter}
              />
            )}
        </div>
      </div>

      <div className="px-4 py-2 bg-white flex justify-center gap-2">
        <Button
          variant="contained"
          onClick={() => {
            setCalLoader(false);
            if (newAppliedLeaveEvents?.length > 0) {
              setIsCAppDatePickerVisible(false);
            }
            //it is more importatnt👍
            setCalendarOpen(false);
          }}
        >
          Submit
        </Button>
        <Button
          variant="contained"
          onClick={handleDelete}
          className="rbc-event-content"
          disabled={!Delete}
        >
          Delete
        </Button>
        <Button
          variant="contained"
          onClick={async () => {
            await handleUpdateFunction();
            setDelete(false);
            setUpdate(false);
          }}
          className="rbc-event-content"
          disabled={!update}
        >
          Update
        </Button>
      </div>

      <ReusableModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        heading={"Are you sure want delete ?"}
      >
        <MiniForm
          id={selectedLeave?._id}
          mutate={deleteLeaveMutation?.mutate}
          onClose={() => setOpenDelete(false)}
        />
      </ReusableModal>
    </div>
  );
};

export default CAppDatePicker;
