import { Skeleton } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useMutation } from "react-query";
import Select from "react-select";
import * as XLSX from "xlsx";
import { TestContext } from "../../../../../State/Function/Main";
import useDashGlobal from "../../../../../hooks/Dashboard/useDashGlobal";
// import UserProfile from "../../../../../hooks/UserData/useUser";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { FaFileExcel } from "react-icons/fa";
import UserProfile from "../../../../../hooks/UserData/useUser";

const customStyles = {
  control: (base) => ({
    ...base,
    border: "1px solid #ddd",
    boxShadow: "none",
    backgroundColor: "#f9f9f9",
    borderRadius: "4px",
    // padding: "2px 4px",
    fontFamily: "'Roboto', sans-serif",
    zIndex: 20,
    // minHeight: '28px',
    // height: '28px',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
  }),
  menu: (base) => ({
    ...base,
    width: "max-content",
    minWidth: "100%",
    right: 0,
    fontFamily: "'Roboto', sans-serif",
    fontSize: 12,
    zIndex: 30,
    position: "absolute",
  }),
  placeholder: (defaultStyles) => ({
    ...defaultStyles,
    color: "#555",
    fontFamily: "'Roboto', sans-serif",
    fontSize: 12,
    textAlign: "center",
  }),
  singleValue: (base) => ({
    ...base,
    fontFamily: "'Roboto', sans-serif",
    fontSize: 12,
    textAlign: "center",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#555",
    // padding: 4, // Reduced padding
  }),
  indicatorSeparator: (base) => ({
    ...base,
    display: "none", // Hide the separator
  }),
};

const AttendenceBar = ({ attendenceData, isLoading }) => {
  const { setSelectedYear, selectedYear } = useDashGlobal();
  const user = UserProfile().getCurrentUser();
  console.log(user);
  const { handleAlert } = useContext(TestContext);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, index) => currentYear - index);
  const yearOptions = years.map((year) => ({
    value: year.toString(),
    label: year,
  }));

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const allMonths = monthNames;

  const organizeDataByMonth = (data) => {
    const organizedData = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      year: null,
      PresentPercent: 0,
      absentPercent: 0,
    }));

    data?.forEach((monthData) => {
      const monthIndex = monthData.month - 1;
      organizedData[monthIndex] = {
        month: monthData.month,
        year: monthData.year,
        PresentPercent: monthData.PresentPercent,
        absentPercent: monthData.absentPercent,
      };
    });

    return organizedData;
  };

  const organizationData = organizeDataByMonth(attendenceData);
  const MonthArray = allMonths.map((month) => month);

  const data = {
    labels: MonthArray,
    datasets: [
      {
        label: "Present",
        data: organizationData.map((monthData) => monthData.PresentPercent),
        backgroundColor: "#9b59b6",
        borderColor: "#8e44ad",
        borderWidth: 1,
      },
      {
        label: "Absent",
        data: organizationData.map((monthData) => monthData.absentPercent),
        backgroundColor: "#e74c3c",
        borderColor: "#c0392b",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#555",
          font: {
            size: 10,
            weight: "bold",
          },
        },
      },
      y: {
        grid: {
          borderColor: "#ddd",
          borderWidth: 1,
        },
        ticks: {
          color: "#555",
          font: {
            size: 10,
          },
        },
      },
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#333",
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
    },
  };

  const generateReport = () => {
    try {
      const employeeLeaveData = attendenceData?.map(({ _id, ...item }) => ({
        month: monthNames[item.month - 1],
        year: item.year,
        "Present Percentage": `${Math.round(item.PresentPercent)} %`,
        "Absent Percentage": `${Math.round(item.absentPercent)} %`,
      }));
      let employeeInfo = [["Employee Leave Ratio Data"]];

      const wb = XLSX.utils.book_new();
      const wsData = employeeLeaveData.map(Object.values);
      wsData.unshift(Object.keys(employeeLeaveData[0]));
      const padding = [[""]];
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
      handleAlert(
        true,
        "error",
        "There is an issue with the server, please try again later"
      );
    },
  });

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="relative mb-6 h-[440px] border p-4 rounded-lg shadow-md">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-4 rounded-lg shadow-md">
          <h1
            data-aos="fade-up"
            className="text-base font-semibold text-gray-700 mb-4"
          >
            <Skeleton variant="text" width={140} height={20} />
          </h1>
          <div className="w-full h-48">
            <Skeleton variant="rect" width="100%" height="100%" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div
            data-aos="fade-up"
            className="flex-col sm:flex-row sm:justify-between items-start gap-2 mb-2"
          >
            <h1 className="text-xl font-bold text-gray-800">
              Attendance Overview
            </h1>
            <p className="text-gray-600 text-xs">
              The chart below provides an overview of attendance data.
            </p>
            <div className="pt-4 flex gap-2 items-center">
              <motion.button
                onClick={() => mutation.mutate()}
                disabled={mutation.isLoading}
                className={`flex items-center gap-1 px-2 py-2 text-sm rounded-md text-white bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  mutation.isLoading &&
                  "cursor-not-allowed bg-gray-400 text-gray-700"
                }`}
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
                value={selectedYear}
                options={yearOptions}
                data-aos="fade-up"
              />
            </div>
          </div>
          <div data-aos="fade-up " className="relative w-full h-[300px]">
            <Bar options={options} data={data} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendenceBar;

//after push
