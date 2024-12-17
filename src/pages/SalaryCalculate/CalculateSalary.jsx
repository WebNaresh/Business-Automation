import axios from "axios";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import useCalculateSalaryQuery from "../../hooks/CalculateSalaryHook/useCalculateSalaryQuery";
import { useQuery } from "react-query";
import useAdvanceSalaryQuery from "../../hooks/AdvanceSalaryHook/useAdvanceSalaryQuery";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Button from "@mui/material/Button";
import useGetPfEsicSetup from "../../hooks/Salary/useGetPfEsicSetup";
import { CircularProgress } from "@mui/material";

function CalculateSalary() {
  // state
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];
  const { userId, organisationId } = useParams();
  const currentDate = dayjs();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [numDaysInMonth, setNumDaysInMonth] = useState(0);
  const [employeeSummary, setEmployeeSummary] = useState([]);
  const [paidLeaveDays, setPaidLeaveDays] = useState(0);
  const [unPaidLeaveDays, setUnPaidLeaveDays] = useState(0);
  const [remotePunchingCount, setRemotePunchingCount] = useState(0);
  const [publicHolidays, setPublicHoliDays] = useState([]);
  const [activeButton, setActiveButton] = useState("submit");

  const { availableEmployee, empLoanAplicationInfo, remotePunchAllowance } =
    useCalculateSalaryQuery({ userId, organisationId, remotePunchingCount });

  const formattedDate = selectedDate.format("MMM-YY");

  // handle the date
  const handleDateChange = (event) => {
    setSelectedDate(dayjs(event.target.value));
  };

  // Fetch leave of employee in specific month
  const month = selectedDate.$M + 1;
  const year = selectedDate.$y;
  useEffect(() => {
    const fetchDataAndFilter = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/employee/leaves/${year}/${month}/${userId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setEmployeeSummary(response.data);
      } catch (error) {
        console.error(error);
        handleAlert(
          true,
          "error",
          "Failed to fetch Employee Attendance Summary"
        );
      }
    };
    fetchDataAndFilter();
    // eslint-disable-next-line
  }, [month, year]);
  useEffect(() => {
    setPaidLeaveDays(employeeSummary?.paidLeaveDays || 0);
    setUnPaidLeaveDays(employeeSummary?.unpaidLeaveDays || 0);
  }, [employeeSummary, month, year]);

  useEffect(() => {
    setNumDaysInMonth(selectedDate.daysInMonth());
  }, [selectedDate]);
  console.log("employee summary", employeeSummary);

  // to get holiday in the organization
  const fetchHoliday = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/holiday/get/${organisationId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setPublicHoliDays(response.data.holidays);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch Holiday");
    }
  };
  useEffect(() => {
    fetchHoliday();
    // eslint-disable-next-line
  }, []);

  // count the public holidays count
  const countPublicHolidaysInCurrentMonth = () => {
    const selectedMonth = selectedDate.format("M");
    const selectedYear = selectedDate.format("YYYY");

    const holidaysInCurrentMonth = publicHolidays.filter((holiday) => {
      const holidayDate = dayjs(holiday.date);
      return (
        holidayDate.month() + 1 === parseInt(selectedMonth) &&
        holidayDate.year() === parseInt(selectedYear)
      );
    });

    return holidaysInCurrentMonth.length;
  };
  let publicHolidaysCount = countPublicHolidaysInCurrentMonth();

  // to get shifts of employee based on month
  const selectedMonths = selectedDate.format("M");
  const selectedYears = selectedDate.format("YYYY");
  const { data: getShifts } = useQuery(
    ["shiftAllowance", userId, selectedMonths, selectedYears],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get/shifts/${userId}`,
        {
          headers: {
            Authorization: token,
          },
          params: {
            month: parseInt(selectedMonths),
            year: parseInt(selectedYears),
          },
        }
      );
      return response.data.shiftRequests;
    }
  );
  console.log("getShifts", getShifts);

  // to get shift count of employee
  const countShifts = (shifts) => {
    const shiftCount = {};
    shifts.forEach((shift) => {
      const title = shift?.title;
      if (shiftCount[title]) {
        shiftCount[title]++;
      } else {
        shiftCount[title] = 1;
      }
    });
    return shiftCount;
  };
  const shiftCounts = useMemo(
    () => (getShifts ? countShifts(getShifts) : {}),
    [getShifts]
  );
  console.log("shiftCounts", shiftCounts);

  // get the amount of shift in the organization
  const { data: shiftAllowanceAmount } = useQuery(
    ["shift-allowance-amount"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/shifts/${organisationId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.shifts;
    }
  );
  const shiftAllowances = useMemo(() => {
    if (shiftAllowanceAmount) {
      return shiftAllowanceAmount?.reduce((acc, shift) => {
        acc[shift.shiftName.toLowerCase()] = shift.allowance;
        return acc;
      }, {});
    }
    return {};
  }, [shiftAllowanceAmount]);

  const [shiftTotalAllowance, setShiftTotalAllowance] = useState(0);
  useEffect(() => {
    let total = 0;
    for (const [shiftTitle, count] of Object.entries(shiftCounts)) {
      const shiftAllowance = shiftAllowances[shiftTitle.toLowerCase()];
      if (shiftAllowance) {
        total += count * shiftAllowance;
      }
    }
    setShiftTotalAllowance(total);
  }, [shiftCounts, shiftAllowances]);

  // to fetch the remote punching count of employee in a specific month
  const fetchRemotePunchingCount = async (userId, startDate, endDate) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/remote-punch-count/${userId}?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setRemotePunchingCount(response.data.remotePunchingCount || 0);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch remote punching count");
    }
  };
  const startDate = selectedDate.startOf("month").format("YYYY-MM-DD");
  const endDate = selectedDate.endOf("month").format("YYYY-MM-DD");

  useEffect(() => {
    fetchRemotePunchingCount(userId, startDate, endDate);
    // eslint-disable-next-line
  }, [selectedDate, userId, startDate, endDate]);

  // to get the total salary of employee
  const { getTotalSalaryEmployee } = useAdvanceSalaryQuery(organisationId);

  // Check if getShifts is defined and is an array before filtering
  const extradayShifts = Array.isArray(getShifts)
    ? getShifts.filter((shift) => shift.title === "Extra Day")
    : []; // Default to an empty array if getShifts is not valid

  // Check if extradayShifts is defined and is an array before getting the length
  const extradayCount = Array.isArray(extradayShifts)
    ? extradayShifts.length
    : 0; // Default to 0 if extradayShifts is not a valid array

  console.log("Count of 'extraday' shifts:", extradayCount);

  // calculate the no fo days employee present
  // Extract the dynamic joining date from the employee data
  const joiningDate = new Date(availableEmployee?.joining_date);
  const calculateDaysEmployeePresent = (joiningDate) => {
    const selectedMonth = new Date(selectedDate).getMonth();
    const selectedYear = new Date(selectedDate).getFullYear();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
    const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

    // Check if the joining date is within the selected month
    const isJoinedThisMonth =
      joiningDate >= firstDayOfMonth && joiningDate <= lastDayOfMonth;

    // If joined this month, calculate the number of days present from the joining date
    let daysPresent;
    if (isJoinedThisMonth) {
      daysPresent = lastDayOfMonth.getDate() - joiningDate.getDate() + 1;
    } else {
      // If not joined this month, assume full presence for calculation
      daysPresent = numDaysInMonth - unPaidLeaveDays;
    }

    return daysPresent;
  };
  // Use the dynamically extracted joining date
  let noOfDaysEmployeePresent = calculateDaysEmployeePresent(joiningDate);

  // Calculate the total payable days including extra days
  const totalAvailableDays =
    typeof noOfDaysEmployeePresent === "number" &&
    !isNaN(noOfDaysEmployeePresent) &&
    typeof extradayCount === "number" &&
    !isNaN(extradayCount)
      ? noOfDaysEmployeePresent + extradayCount
      : 0; // Default to 0 if any of the values are not valid numbers

  console.log("totalAvailableDays", totalAvailableDays);

  // Get Query for fetching overtime allowance in the organization
  const { data: overtime } = useQuery(
    ["overtime", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get/${organisationId}/overtime`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.data;
    }
  );
  let otamount = overtime && overtime?.allowanceAmount;
  let otparameter = overtime && overtime?.allowanceParameter;
  console.log("otamount", otamount);
  console.log("otparameter", otparameter);

  // to get the overtime hour of employee in specific month from machine punching
  const sd = selectedDate.startOf("month").format("YYYY-MM-DD");
  const ed = selectedDate.endOf("month").format("YYYY-MM-DD");
  console.log("sd", sd);
  console.log("ed", ed);
  const { data: empOverTimeData } = useQuery(
    ["empOverTimeHour", sd, ed],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/getOvertimeHour/${organisationId}/${userId}`,
        {
          params: {
            startDate: sd,
            endDate: ed,
          },
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data;
    }
  );
  // Destructure the employee overtime data
  const overtimeRecordCount = empOverTimeData?.overtimeRecordCount || 0;
  const totalOvertimeHours = empOverTimeData?.totalOvertimeHours || 0;

  console.log("overtimeRecordCount", overtimeRecordCount);
  console.log("totalOvertimeHours", totalOvertimeHours);

  // calculate overtime amount of employee in specific month
  // Initialize overtimeAllowance
  let totalOvertimeAllowance = 0;
  // Calculate the overtime allowance based on the parameter
  if (otparameter === "perDay") {
    // Calculate allowance per day (use the overtimeRecordCount as the number of overtime days)
    totalOvertimeAllowance = otamount * overtimeRecordCount;
  } else if (otparameter === "perHour") {
    // Calculate allowance per hour (use the totalOvertimeHours)
    totalOvertimeAllowance = otamount * totalOvertimeHours;
  }
  // Log the calculated overtime allowance
  console.log("Overtime Allowance:", totalOvertimeAllowance);

  // to get employee salary component data of employee
  const { data: salaryComponent, isFetching } = useQuery(
    ["salary-component", userId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get-salary-component/${userId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.data;
    }
  );

  // calculate the salary component for income
  const [incomeValues, setIncomeValues] = useState([]);
  useEffect(() => {
    const daysInMonth = numDaysInMonth;
    let updatedIncomeValues = [];

    // Calculate the salary component
    salaryComponent?.income?.forEach((item) => {
      const updatedValue = (item?.value / daysInMonth) * totalAvailableDays;

      const existingIndex = updatedIncomeValues.findIndex(
        (ele) => ele.name === item.name
      );

      if (existingIndex !== -1) {
        updatedIncomeValues[existingIndex] = {
          name: item?.name,
          value: Math.round(updatedValue),
        };
      } else {
        updatedIncomeValues.push({
          name: item?.name,
          value: Math.round(updatedValue),
        });
      }
    });

    // Check if shiftTotalAllowance is greater than 0 and if the name "Shift Allowance" does not already exist
    if (shiftTotalAllowance > 0) {
      const existingIndex = updatedIncomeValues.findIndex(
        (ele) => ele.name === "Shift Allowance"
      );

      if (existingIndex === -1) {
        // If "Shift Allowance" does not exist, add it to the array
        updatedIncomeValues.push({
          name: "Shift Allowance",
          value: shiftTotalAllowance,
        });
      } else {
        // If "Shift Allowance" already exists, update its value
        updatedIncomeValues[existingIndex].value = shiftTotalAllowance;
      }
    }

    // Add Remote Punch Allowance if applicable
    if (remotePunchAllowance > 0) {
      const existingIndex = updatedIncomeValues.findIndex(
        (ele) => ele.name === "Remote Punch Allowance"
      );

      if (existingIndex === -1) {
        // If "Remote Punch Allowance" does not exist, add it to the array
        updatedIncomeValues.push({
          name: "Remote Punch Allowance",
          value: remotePunchAllowance,
        });
      } else {
        // If "Remote Punch Allowance" already exists, update its value
        updatedIncomeValues[existingIndex].value = remotePunchAllowance;
      }
    }

    // Add overtime Allowance if applicable
    if (totalOvertimeAllowance > 0) {
      const existingIndex = updatedIncomeValues.findIndex(
        (ele) => ele.name === "Overtime Allowance"
      );

      if (existingIndex === -1) {
        // If "Overtime Allowance" does not exist, add it to the array
        updatedIncomeValues.push({
          name: "Overtime Allowance",
          value: totalOvertimeAllowance,
        });
      } else {
        // If "Overtime Allowance" already exists, update its value
        updatedIncomeValues[existingIndex].value = remotePunchAllowance;
      }
    }
    // Update the incomeValues state with the new array
    setIncomeValues(updatedIncomeValues);

    // eslint-disable-next-line
  }, [
    selectedDate,
    salaryComponent,
    totalAvailableDays,
    shiftTotalAllowance,
    remotePunchAllowance,
    totalOvertimeAllowance,
  ]);

  // get the PFsetup from organizaiton
  const { PfSetup } = useGetPfEsicSetup({
    organisationId,
  });

  // Initialize the state for set deduction value
  let pwd = availableEmployee?.pwd;

  // calculate the financial year
  const calculateFinancialYear = (date) => {
    const month = date?.month();
    const currentYear = date?.year();
    if (month < 3) {
      // January, February, March
      return `${currentYear - 1}-${currentYear}`;
    } else {
      return `${currentYear}-${currentYear + 1}`;
    }
  };
  const financialYear = calculateFinancialYear(dayjs(selectedDate));

  // to get the annual income tax
  const { data: annualIncomeTax } = useQuery(
    ["getIncomeTax", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/tds/getMyDeclaration/${financialYear}/${getTotalSalaryEmployee}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.getTotalTaxableIncome;
    }
  );

  // calculate monthly income tax based on annual income tax
  const monthlyIncomeTax =
    typeof annualIncomeTax === "number" && annualIncomeTax > 0
      ? annualIncomeTax / 12
      : "0";
  console.log("monthlyIncomeTax :", monthlyIncomeTax);

  // get the loan deduction amount from loan application data of employee
  let loanDeduction = 0;
  if (Array.isArray(empLoanAplicationInfo)) {
    const currentDate = new Date();
    // Filter loan applications that are currently active
    const loanDeductionApplications = empLoanAplicationInfo?.filter(
      (application) => {
        const loanDisbursementDate = new Date(
          application?.loanDisbursementDate
        );
        const loanCompletionDate = new Date(application?.loanCompletedDate);
        return (
          loanDisbursementDate <= currentDate &&
          currentDate <= loanCompletionDate
        );
      }
    );
    // Calculate the total loan deduction for active loans
    loanDeduction = loanDeductionApplications.reduce((total, application) => {
      // Check if the current application is within the loan disbursement and completion dates
      const loanDisbursementDate = new Date(application.loanDisbursementDate);
      const loanCompletionDate = new Date(application.loanCompletedDate);
      if (
        loanDisbursementDate <= currentDate &&
        currentDate <= loanCompletionDate
      ) {
        return total + parseFloat(application.totalDeduction || 0);
      }
      return total;
    }, 0);
  }
  loanDeduction = isNaN(loanDeduction) ? 0 : Math.round(loanDeduction);

  // calculate the deduction value
  const [deductionValues, setDeductionValues] = useState([]);
  const [employerContribution, setEmployerContribution] = useState(0);
  useEffect(() => {
    let basic = 0;
    let da = 0;

    // Loop through income array to find Basic and DA components
    incomeValues?.forEach((item) => {
      if (item.name === "Basic") {
        basic = item.value;
      }
      if (item.name === "DA") {
        da = item.value;
      }
    });

    const combinedBasicDA = basic + da;
    const basicDA = combinedBasicDA < 15000 ? combinedBasicDA : 15000;
    const employeePF = (basicDA * PfSetup?.EPF) / 100;

    const totalGrossSalary = incomeValues?.reduce((a, c) => a + c.value, 0);
    const empCtr = pwd
      ? totalGrossSalary <= 25000
        ? (totalGrossSalary * PfSetup?.ECP) / 100
        : 0
      : totalGrossSalary <= 21000
      ? (totalGrossSalary * PfSetup?.ECP) / 100
      : 0;

    const emlCtr = pwd
      ? totalGrossSalary <= 25000
        ? (totalGrossSalary * PfSetup?.ECS) / 100
        : 0
      : totalGrossSalary <= 21000
      ? (totalGrossSalary * PfSetup?.ECS) / 100
      : 0;

    // Safely reduce deductions, ensuring deduction array exists
    const updatedDeductions = salaryComponent?.deductions
      ? salaryComponent?.deductions?.reduce((acc, deduction) => {
          if (deduction.name === "PF") {
            acc.push({ ...deduction, value: employeePF });
          } else if (deduction.name === "ESIC" && empCtr > 0) {
            acc.push({ ...deduction, value: Math.round(empCtr) });
          } else {
            acc.push(deduction);
          }
          return acc;
        }, [])
      : [];

    // Process loan deductions if applicable
    const selectedDateObj = new Date(selectedDate);
    empLoanAplicationInfo?.forEach((loanInfo) => {
      const loanDisbursement = new Date(loanInfo?.loanDisbursementDate);
      const loanCompleted = new Date(loanInfo?.loanCompletedDate);

      if (
        loanDeduction > 0 &&
        selectedDateObj >= loanDisbursement &&
        selectedDateObj <= loanCompleted
      ) {
        const existingIndex = updatedDeductions?.findIndex(
          (ele) => ele.name === "Loan Deduction"
        );

        if (existingIndex !== -1) {
          // Update existing deduction
          updatedDeductions[existingIndex] = {
            name: "Loan Deduction",
            value: loanDeduction,
          };
        } else {
          // Push new loan deduction entry
          updatedDeductions.push({
            name: "Loan Deduction",
            value: loanDeduction,
          });
        }
      }
    });

    setDeductionValues(updatedDeductions);
    setEmployerContribution(emlCtr > 0 ? emlCtr : 0);

    // eslint-disable-next-line
  }, [
    salaryComponent,
    PfSetup,
    selectedDate,
    incomeValues,
    loanDeduction,
    empLoanAplicationInfo,
  ]);

  // calculate the total income (totalGrossSalary) , total deduction , totalNetAalary
  const [salary, setSalary] = useState({
    totalIncome: 0,
    totalDeduction: 0,
    totalNetSalary: 0,
  });
  // Calculate total income, total deduction, total net salary
  useEffect(() => {
    // Calculate income first, regardless of deductionValues
    const income = incomeValues?.reduce((a, c) => a + c.value, 0);

    // Calculate deductions based on deductionValues
    const deductions = deductionValues?.reduce((a, c) => a + c.value, 0);

    // Calculate total income - deductions
    const total = income - deductions;

    // Update the salary state
    setSalary({
      totalDeduction: Math.round(deductions),
      totalIncome: Math.round(income),
      totalNetSalary: Math.round(total),
    });

    // eslint-disable-next-line
  }, [deductionValues, incomeValues]);

  // submit the data
  const saveSalaryDetail = async () => {
    try {
      const currentYear = dayjs().format("YYYY");
      const currentMonth = dayjs().format("MM");
      const selectedYear = selectedDate.format("YYYY");
      const selectedMonth = selectedDate.format("MM");
      const employeeJoiningYear = dayjs(availableEmployee?.joining_date).format(
        "YYYY"
      );
      const employeeJoiningMonth = dayjs(
        availableEmployee?.joining_date
      ).format("MM");
      const nextMonth =
        parseInt(currentMonth) === 12 ? 1 : parseInt(currentMonth);

      if (
        parseInt(selectedYear) > parseInt(currentYear) ||
        (parseInt(selectedYear) === parseInt(currentYear) &&
          parseInt(selectedMonth) > parseInt(nextMonth))
      ) {
        handleAlert(
          true,
          "error",
          "Cannot calculate salary for future months or years"
        );
        return;
      }
      if (
        parseInt(selectedYear) < parseInt(employeeJoiningYear) ||
        (parseInt(selectedYear) === parseInt(employeeJoiningYear) &&
          parseInt(selectedMonth) < parseInt(employeeJoiningMonth))
      ) {
        handleAlert(
          true,
          "error",
          "Cannot calculate salary for months before employee's joining date"
        );
        return;
      }
      const data = {
        employeeId: userId,
        income: incomeValues,
        deductions: deductionValues,
        totalGrossSalary: salary?.totalIncome,
        totalDeduction: salary?.totalDeduction,
        totalNetSalary: salary?.totalNetSalary,
        emlCtr: employerContribution,
        numDaysInMonth,
        formattedDate,
        publicHolidaysCount,
        paidLeaveDays,
        unPaidLeaveDays,
        totalAvailableDays,
        month: selectedDate.format("M"),
        year: selectedDate.format("YYYY"),
        organizationId: organisationId,
      };
      console.log("data", data);
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/employeeSalary/add-salary/${userId}/${organisationId}`,
        data,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.data.success) {
        handleAlert(
          true,
          "success",
          "Monthly Salary Detail added Successfully"
        );
      }
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        handleAlert(
          true,
          "error",
          "Salary for this month and year already exists"
        );
      } else {
        console.error("Error adding salary details:", error);
        handleAlert(true, "error", "Failed to add salary details");
      }
    }
  };

  // download the pdf
  const exportPDF = async () => {
    const input = document.getElementById("App");
    html2canvas(input, {
      logging: true,
      letterRendering: 1,
      useCORS: true,
    }).then(async (canvas) => {
      let img = new Image();
      img.src = canvas.toDataURL("image/png");
      img.onload = function () {
        const pdf = new jsPDF("landscape", "mm", "a4");
        pdf.addImage(
          img,
          0,
          0,
          pdf.internal.pageSize.width,
          pdf.internal.pageSize.height
        );
        pdf.save("payslip.pdf");
      };
    });
  };

  // submit the data of payslip
  const handleSubmitClick = () => {
    setActiveButton("submit");
    saveSalaryDetail();
  };

  // download the payslip
  const handleDownloadClick = () => {
    setActiveButton("download");
    exportPDF();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-center mb-6">
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-700">
            Please select the month for calculate the salary.
          </h3>
          <input
            type="month"
            value={selectedDate.format("YYYY-MM")}
            onChange={handleDateChange}
            style={{ width: "500px" }}
            className="border border-gray-300 rounded-md p-2 mt-2"
          />
        </div>
      </div>

      {isFetching ? (
        <CircularProgress />
      ) : (
        <>
          <div id="App">
            <div className="flex items-center justify-between mb-6">
              <img
                src={availableEmployee?.organizationId?.logo_url || ""}
                alt="Company Logo"
                className="w-20 h-20 rounded-full"
              />
              <div className="ml-4">
                <p className="text-lg font-semibold flex items-center">
                  <span className=" mr-1">Organisation Name :</span>
                  <span style={{ whiteSpace: "pre-wrap" }}>
                    {availableEmployee?.organizationId?.orgName || ""}
                  </span>
                </p>
                <p className="text-lg flex items-center">
                  <span className=" mr-1">Location :</span>
                  <span>
                    {" "}
                    {availableEmployee?.organizationId?.location?.address || ""}
                  </span>
                </p>
                <p className="text-lg flex items-center">
                  <span className="mr-1">Contact No :</span>
                  <span>
                    {availableEmployee?.organizationId?.contact_number || ""}
                  </span>
                </p>
                <p className="text-lg flex items-center">
                  <span className="mr-1">Email :</span>
                  <span>{availableEmployee?.organizationId?.email || ""}</span>
                </p>
              </div>
            </div>

            <hr className="mb-6" />
            {/* 1st table */}
            <div>
              <table class="w-full border border-collapse">
                <thead>
                  <tr class="bg-blue-200">
                    <th class="px-4 py-2 border">Salary Slip</th>
                    <th class="border"></th>
                    <th class="px-4 py-2 border">Month</th>
                    <th class="px-4 py-2 border">{formattedDate}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="px-4 py-2 border">Employee Name:</td>
                    <td class="px-4 py-2 border">
                      {`${availableEmployee?.first_name} ${availableEmployee?.last_name}`}
                    </td>
                    <td class="px-4 py-2 border">Date Of Joining:</td>
                    <td class="px-4 py-2 border">
                      {availableEmployee?.joining_date
                        ? new Date(
                            availableEmployee?.joining_date
                          ).toLocaleDateString("en-GB")
                        : ""}
                    </td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 border">Designation:</td>
                    <td class="px-4 py-2 border">
                      {" "}
                      {(availableEmployee?.designation &&
                        availableEmployee?.designation.length > 0 &&
                        availableEmployee?.designation[0]?.designationName) ||
                        ""}
                    </td>
                    <td class="px-4 py-2 border">Unpaid Leaves:</td>
                    <td class="px-4 py-2 border">{unPaidLeaveDays}</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 border">Department Name:</td>
                    <td class="px-4 py-2 border">
                      {" "}
                      {(availableEmployee?.deptname &&
                        availableEmployee?.deptname.length > 0 &&
                        availableEmployee?.deptname[0]?.departmentName) ||
                        ""}
                    </td>
                    <td class="px-4 py-2 border">
                      No Of Working Days Attended:
                    </td>
                    <td class="px-4 py-2 border">{totalAvailableDays}</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 border">PAN No:</td>
                    <td class="px-4 py-2 border">
                      {availableEmployee?.pan_card_number}
                    </td>
                    <td class="px-4 py-2 border">Paid Leaves:</td>
                    <td class="px-4 py-2 border">{paidLeaveDays}</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 border">Employee Id:</td>
                    <td class="px-4 py-2 border">{availableEmployee?.empId}</td>
                    <td class="px-4 py-2 border">Public Holidays:</td>
                    <td class="px-4 py-2 border">{publicHolidaysCount}</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 border">Bank Account No:</td>
                    <td class="px-4 py-2 border">
                      {availableEmployee?.bank_account_no || ""}
                    </td>

                    <td class="px-4 py-2 border">No Of Days in Month:</td>
                    <td class="px-4 py-2 border">{numDaysInMonth}</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 border"></td>
                    <td class="px-4 py-2 border"></td>
                    {extradayCount > 0 && (
                      <>
                        <td className="px-4 py-2 border">
                          No Of Extra Days in Month:
                        </td>
                        <td className="px-4 py-2 border">{extradayCount}</td>
                      </>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 2nd table */}
            <div>
              <table class="w-full border border-collapse">
                <thead>
                  <tr class="bg-blue-200">
                    <th class="px-4 py-2 border">Income</th>
                    <th class="border"></th>
                    <th class="px-4 py-2 border">Deduction</th>
                    <th class="px-4 py-2 border"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="px-4 py-2 border">Particulars</td>
                    <td class="py-2 border">Amount</td>
                    <td class="py-2 border">Particulars</td>
                    <td class="py-2 border">Amount</td>
                  </tr>
                  {Array.from({
                    length: Math.max(
                      incomeValues?.length || 0,
                      deductionValues?.length || 0
                    ),
                  }).map((_, index) => {
                    return (
                      <tr key={index}>
                        {/* Income column */}
                        <td className="px-4 py-2 border">
                          {incomeValues?.[index]?.name || ""}
                        </td>
                        <td className="px-4 py-2 border">
                          {incomeValues?.[index]?.value || ""}
                        </td>
                        {/* Deduction column */}
                        <td className="px-4 py-2 border">
                          {deductionValues?.[index]?.name || ""}
                        </td>
                        <td className="px-4 py-2 border">
                          {deductionValues?.[index]?.value || ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* total gross salary and deduction */}
            <div>
              <table class="w-full border border-collapse">
                <thead class="border">
                  <tr class="bg-blue-200 border">
                    <th class="py-2 border">Total Gross Salary :</th>
                    <th class=" py-2 border"> {salary?.totalIncome || ""}</th>
                    <th class="py-2 border">Total Deduction :</th>
                    <th class="py-2 border"> {salary?.totalDeduction || ""}</th>
                  </tr>
                </thead>
                <tbody class="border"></tbody>
              </table>
            </div>

            {/* total net salary */}
            <div>
              <table class="w-full mt-10 border ">
                <thead>
                  <tr class="bg-blue-200">
                    <th class="px-4 py-2 ">Total Net Salary</th>
                    <th></th>
                    <th class="px-4 py-2">{salary?.totalNetSalary || ""}</th>
                    <th class="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>

          {/* submit the salary */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "20px",
              }}
            >
              <Button
                variant={activeButton === "submit" ? "contained" : "outlined"}
                onClick={handleSubmitClick}
                color="primary"
              >
                Submit
              </Button>
              <Button
                variant={activeButton === "download" ? "contained" : "outlined"}
                onClick={handleDownloadClick}
                color="primary"
              >
                Download PDF
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CalculateSalary;
