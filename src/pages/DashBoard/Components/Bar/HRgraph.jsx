// import axios from "axios";
// import { CategoryScale, Chart } from "chart.js";
// import moment from "moment";
// import React, { useContext, useState } from "react";
// import { Bar } from "react-chartjs-2";
// import { useMutation, useQuery } from "react-query";
// import Select from "react-select";
// import * as XLSX from "xlsx";
// import { TestContext } from "../../../../State/Function/Main";
// import { UseContext } from "../../../../State/UseState/UseContext";
// import UserProfile from "../../../../hooks/UserData/useUser";
// Chart.register(CategoryScale);

// const HRgraph = () => {
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();
//   const [employeeData, setEmployeeData] = useState([]);
//   console.log(`🚀 ~ file: HRgraph.jsx:20 ~ employeeData:`, employeeData);
//   const [employee, setEmployee] = useState([]);

//   const [selectedyear, setSelectedYear] = useState({
//     value: new Date().getFullYear(),
//     label: new Date().getFullYear(),
//   });

//   const customStyles = {
//     control: (base) => ({
//       ...base,

//       boxShadow: "none",
//       border: ".5px solid #f1f1f1",
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

//   const getYearLeaves = async () => {
//     const { data } = await axios.get(
//       `${process.env.REACT_APP_API}/route/leave/getYearLeaves/${user?._id}/${selectedyear.value}`,
//       {
//         headers: {
//           Authorization: authToken,
//         },
//       }
//     );

//     setEmployeeData(data?.getEmployeeLeaves?.summary?.map((item) => item));
//     setEmployee(data?.getEmployeeLeaves[0]?.employeeId);
//     const currentYear = new Date().getFullYear();
//     const filterData = data?.sortedData?.filter(
//       (item) => item.year === currentYear
//     );
//     return filterData;
//   };

//   const { data: LeaveYearData } = useQuery(
//     ["leaveData", selectedyear],
//     getYearLeaves
//   );
//   const monthNames = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sept",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];

//   const allMonths = monthNames;

//   console.log(`🚀 ~ LeaveYearData:`, LeaveYearData);
//   const organizeDataByMonth = (data) => {
//     const organizedData = Array.from({ length: 12 }, (_, index) => {
//       const month = index + 1;
//       return {
//         month,
//         year: null,
//         PresentPercent: 0,
//         absentPercent: 0,
//       };
//     });

//     data?.forEach((monthData) => {
//       const monthIndex = monthData.month - 1;
//       organizedData[monthIndex] = {
//         month: monthData.month,
//         year: monthData.year,
//         availableDays: monthData.availableDays,
//         unpaidleaveDays: monthData.unpaidleaveDays,
//         paidleaveDays: monthData.paidleaveDays,
//       };
//     });

//     return organizedData;
//   };

//   const EmployeeleaveData = organizeDataByMonth(LeaveYearData);
//   const MonthArray = allMonths.map((month) => month);
//   const { handleAlert } = useContext(TestContext);

//   const data = {
//     labels: MonthArray,
//     datasets: [
//       {
//         label: "Available Days",
//         data: EmployeeleaveData.map((monthData) => monthData.availableDays),
//         backgroundColor: "#00b0ff",
//         borderWidth: 1,
//       },
//       {
//         label: "Unpaid Leave Days",
//         data: EmployeeleaveData.map((monthData) => monthData.unpaidleaveDays),
//         backgroundColor: "#f50057",
//         borderWidth: 1,
//       },
//       {
//         label: "Paid Leave Days",
//         data: EmployeeleaveData.map((monthData) => monthData.paidleaveDays),
//         backgroundColor: "#4caf50",
//         borderWidth: 1,
//       },
//     ],
//   };

//   const generateReport = () => {
//     try {
//       const withMonth = LeaveYearData?.map(({ _id, ...item }) => {
//         const date = moment({ year: item.year, month: item.month - 1 }); // Create a moment object for the current year and month
//         const daysInMonth = date.daysInMonth(); // Get the total number of days in the current month
//         return {
//           // ...item,
//           // month: monthNames[item.month - 1],
//           // daysInMonth,
//           Month: monthNames[item.month - 1],
//           Year: item.year,
//           "Days In Month": daysInMonth,
//           "Avaliable Days": item.availableDays,
//           "Paid Days": item.paidleaveDays,
//           "Unpaid Days": item.unpaidleaveDays,
//         };
//       });
//       // Employee information
//       const employeeInfo = [
//         ["", "Employee Id", `${employee?.empId}`],
//         ["", "Name", `${employee?.first_name} ${employee?.last_name}`],
//         ["", "Email", employee?.email],
//         ["", "Pan Card", employee?.pan_card_number],
//         ["", "Bank Account No", `${employee?.bank_account_no}`],
//         // Add more employee information here
//       ];

//       const wb = XLSX.utils.book_new();
//       const wsData = withMonth.map(Object.values);
//       wsData.unshift(Object.keys(withMonth[0]));

//       // Add padding (empty rows and columns)
//       const padding = [
//         ["", "", "", ""],
//         ["", "", "", ""],
//       ];
//       const finalData = padding.concat(employeeInfo, padding, wsData);
//       const ws = XLSX.utils.aoa_to_sheet(finalData);
//       XLSX.utils.book_append_sheet(wb, ws, "Salary Data");
//       XLSX.writeFile(wb, "AttendenceData.xlsx");
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
//       handleAlert(true, "success", "Attendence Report Generated Successfully");
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
//       <article className=" bg-white  rounded-md ">
//         <div
//           className="w-full 
//       px-4 pb-4  flex flex-col border rounded-md bg-white  justify-center"
//         >
//           <div className="flex  my-4 justify-between items-start md:items-center">
//             <h1 className="text-lg  font-bold text-[#67748E]">
//               Employee Attendance
//             </h1>
//             <div className="flex md:flex-row flex-col-reverse gap-2 items-center">
//               <button
//                 onClick={() => mutation.mutate()}
//                 disabled={mutation.isLoading}
//                 className={` flex group justify-center w-max gap-2 items-center rounded-sm h-[30px] px-4 py-4 text-md font-semibold text-white bg-yellow-500 hover:bg-yellow-500 focus-visible:outline-yellow-500
//                   ${
//                     mutation.isLoading &&
//                     "cursor-not-allowed bg-gray-400 text-gray-700"
//                   }
//                   `}
//               >
//                 Generate Report
//               </button>
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
//           </div>

//           <div className="px-4 h-[250px] md:h-[300px]  flex items-center">
//             <Bar
//               data={data}
//               options={{
//                 elements: {
//                   line: {
//                     tension: 0.5,
//                   },
//                 },

//                 scales: {
//                   x: {
//                     grid: {
//                       display: false,
//                     },
//                   },
//                   y: {
//                     suggestedMax: 31,
//                     weight: 31,
//                     ticks: {
//                       beginAtZero: true,
//                       stepSize: 5,
//                       min: 0,
//                     },
//                     grid: {
//                       display: true,
//                     },
//                   },
//                 },
//                 maintainAspectRatio: false,
//                 responsive: true,
//               }}
//             />
//           </div>
//         </div>
//       </article>
//     </>
//   );
// };

// export default HRgraph;



// ....

import axios from "axios";
import { CategoryScale, Chart } from "chart.js";
import moment from "moment";
import React, { useContext, useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useMutation, useQuery } from "react-query";
import Select from "react-select";
import * as XLSX from "xlsx";
import { TestContext } from "../../../../State/Function/Main";
import { UseContext } from "../../../../State/UseState/UseContext";
import UserProfile from "../../../../hooks/UserData/useUser";
import { FaFileExcel } from 'react-icons/fa';
import { motion } from "framer-motion";
import AOS from 'aos';
import 'aos/dist/aos.css';
Chart.register(CategoryScale);

const HRgraph = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const [employeeData, setEmployeeData] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [selectedyear, setSelectedYear] = useState({
    value: new Date().getFullYear(),
    label: new Date().getFullYear(),
  });

console.log(employeeData);

  // const customStyles = {
  //   control: (base) => ({
  //     ...base,
  //     border: "1px solid #ddd",
  //     boxShadow: "none",
  //     backgroundColor: "#f9f9f9",
  //     borderRadius: "8px",
  //     padding: "2px 8px",
  //     fontFamily: "'Roboto', sans-serif",
  //   }),
  //   menu: (base) => ({
  //     ...base,
  //     width: "max-content",
  //     minWidth: "100%",
  //     right: 0,
  //     fontFamily: "'Roboto', sans-serif",
  //   }),
  //   placeholder: (defaultStyles) => ({
  //     ...defaultStyles,
  //     color: "#555",
  //     fontFamily: "'Roboto', sans-serif",
  //   }),
  //   singleValue: (base) => ({
  //     ...base,
  //     fontFamily: "'Roboto', sans-serif",
  //   }),
  //   dropdownIndicator: (base) => ({
  //     ...base,
  //     color: "#555",
  //   }),
  // };

  // const option = {
  //   elements: {
  //     line: {
  //       tension: 0.5,
  //     },
  //   },
  //   scales: {
  //     x: {
  //       grid: {
  //         display: false,
  //       },
  //       ticks: {
  //         color: "#555",
  //         font: {
  //           family: "'Roboto', sans-serif",
  //           size: 10,
  //         },
  //       },
  //     },
  //     y: {
  //       grid: {
  //         display: true,
  //         color: "#e0e0e0",
  //       },
  //       ticks: {
  //         color: "#555",
  //         font: {
  //           family: "'Roboto', sans-serif",
  //           size: 10,
  //         },
  //       },
  //     },
  //   },
  //   maintainAspectRatio: false,
  //   responsive: true,
  // };
  
  const customStyles = {
    control: (base) => ({
      ...base,
      border: "1px solid #ddd",
      boxShadow: "none",
      backgroundColor: "#f9f9f9",
      borderRadius: "4px",
      // padding: "2px 4px", 
      fontFamily: "'Roboto', sans-serif",
      zIndex: 10,
      // minHeight: '28px', 
      // height: '28px', 
      display: 'flex',
      alignItems: 'center', 
      justifyContent: 'center', 
      margin:'auto',
    }),
    menu: (base) => ({
      ...base,
      width: "max-content",
      minWidth: "100%",
      right: 0,
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
      // padding: 4, // Reduced padding
    }),
    indicatorSeparator: (base) => ({
      ...base,
      display: 'none', 
    }),
  };
  
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, index) => currentYear - index);
  const yearOptions = years.map((year) => ({
    value: year.toString(),
    label: year,
  }));

  const getYearLeaves = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/leave/getYearLeaves/${user?._id}/${selectedyear.value}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    setEmployeeData(data?.getEmployeeLeaves?.summary?.map((item) => item));
    setEmployee(data?.getEmployeeLeaves[0]?.employeeId);
    const currentYear = new Date().getFullYear();
    const filterData = data?.sortedData?.filter(
      (item) => item.year === currentYear
    );
    return filterData;
  };

  const { data: LeaveYearData } = useQuery(
    ["leaveData", selectedyear],
    getYearLeaves
  );
  
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];

  const allMonths = monthNames;

  const organizeDataByMonth = (data) => {
    const organizedData = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      year: null,
      availableDays: 0,
      unpaidleaveDays: 0,
      paidleaveDays: 0,
    }));

    data?.forEach((monthData) => {
      const monthIndex = monthData.month - 1;
      organizedData[monthIndex] = {
        month: monthData.month,
        year: monthData.year,
        availableDays: monthData.availableDays,
        unpaidleaveDays: monthData.unpaidleaveDays,
        paidleaveDays: monthData.paidleaveDays,
      };
    });

    return organizedData;
  };

  const EmployeeleaveData = organizeDataByMonth(LeaveYearData);
  const MonthArray = allMonths;
  const { handleAlert } = useContext(TestContext);

  const data = {
    labels: MonthArray,
    datasets: [
      {
        label: "Available Days",
        data: EmployeeleaveData.map((monthData) => monthData.availableDays),
        backgroundColor: "#00b0ff",
        borderWidth: 1,
      },
      {
        label: "Unpaid Leave Days",
        data: EmployeeleaveData.map((monthData) => monthData.unpaidleaveDays),
        backgroundColor: "#f50057",
        borderWidth: 1,
      },
      {
        label: "Paid Leave Days",
        data: EmployeeleaveData.map((monthData) => monthData.paidleaveDays),
        backgroundColor: "#4caf50",
        borderWidth: 1,
      },
    ],
  };

  const generateReport = () => {
    try {
      const withMonth = LeaveYearData?.map(({ _id, ...item }) => {
        const date = moment({ year: item.year, month: item.month - 1 });
        const daysInMonth = date.daysInMonth();
        return {
          Month: monthNames[item.month - 1],
          Year: item.year,
          "Days In Month": daysInMonth,
          "Available Days": item.availableDays,
          "Paid Days": item.paidleaveDays,
          "Unpaid Days": item.unpaidleaveDays,
        };
      });

      const employeeInfo = [
        ["", "Employee Id", `${employee?.empId}`],
        ["", "Name", `${employee?.first_name} ${employee?.last_name}`],
        ["", "Email", employee?.email],
        ["", "Pan Card", employee?.pan_card_number],
        ["", "Bank Account No", `${employee?.bank_account_no}`],
      ];

      const wb = XLSX.utils.book_new();
      const wsData = withMonth.map(Object.values);
      wsData.unshift(Object.keys(withMonth[0]));

      const padding = [["", "", "", ""], ["", "", "", ""]];
      const finalData = padding.concat(employeeInfo, padding, wsData);
      const ws = XLSX.utils.aoa_to_sheet(finalData);
      XLSX.utils.book_append_sheet(wb, ws, "Attendance Data");
      XLSX.writeFile(wb, "AttendanceData.xlsx");
    } catch (error) {
      handleAlert(true, "error", "There is an issue with the server, please try again later");
    }
  };

  const mutation = useMutation(generateReport, {
    onSuccess: () => {
      handleAlert(true, "success", "Attendance Report Generated Successfully");
    },
    onError: () => {
      handleAlert(true, "error", "There is an issue with the server, please try again later");
    },
  });

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className=" relative mb-6 h-[440px]  bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-200 p-6 rounded-lg shadow-lg">
      <div className="flex flex-col gap-2" data-aos="fade-up">
        <div className="flex-col sm:flex-row sm:justify-between items-start gap-2 mb-2">
          <h1 className="text-xl font-bold text-gray-800">Employee Attendance </h1>
          <p className="text-gray-600 text-xs">
            {/* The chart below provides an overview of employee attendance, including available days, unpaid leave days, and paid leave days for each month. */}
            The chart below provides an overview of employee attendance.
          </p>
          <div className=" pt-4 flex gap-2 items-center">
            <motion.button
              onClick={() => mutation.mutate()}
              disabled={mutation.isLoading}
              className={`flex items-center gap-1 px-2 py-2 text-sm rounded-md text-white bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${mutation.isLoading && "cursor-not-allowed bg-gray-400 text-gray-700"}`}
              aria-label="Generate Excel Report"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
             
            >
              <FaFileExcel className="text-xs" />
              {mutation.isLoading ? "Generating..." : "Generate Report"}
            </motion.button>
            <Select
              placeholder={"Select year"}
              onChange={(year) => setSelectedYear(year)}
              components={{ IndicatorSeparator: () => null }}
              styles={customStyles}
              value={selectedyear}
              options={yearOptions}
              data-aos="fade-up"
            />
          </div>
        </div>
        <div className="relative h-[300px]" data-aos="fade-up">
          <Bar
            data={data}
            options={{
              elements: {
                line: {
                  tension: 0.5,
                },
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                },
                y: {
                  suggestedMax: 31,
                  weight: 31,
                  ticks: {
                    beginAtZero: true,
                    stepSize: 5,
                    min: 0,
                  },
                  grid: {
                    display: true,
                  },
                },
              },
              maintainAspectRatio: false,
              responsive: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HRgraph;


//Reffer this HrGraph.jsx component  change exact styling design Ui into Graphs representation . note:dont change or remove any code functionality