import axios from "axios";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import useCalculateSalaryQuery from "../../hooks/CalculateSalaryHook/useCalculateSalaryQuery";
import { useQuery } from "react-query";
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
          `${import.meta.env.VITE_API}/route/employee/leaves/${year}/${month}/${userId}`,
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


  // to get holiday in the organization
  const fetchHoliday = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/route/holiday/get/${organisationId}`,
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


  // to fetch the remote punching count of employee in a specific month
  const fetchRemotePunchingCount = async (userId, startDate, endDate) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/route/remote-punch-count/${userId}?startDate=${startDate}&endDate=${endDate}`,
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
  // Calculate the total payable days including extra days
  const totalAvailableDays = Number.isFinite(noOfDaysEmployeePresent)
    ? noOfDaysEmployeePresent
    : 0;

  // to get employee salary component data of employee
  const { data: salaryComponent, isFetching } = useQuery(
    ["salary-component", userId],
    async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/route/get-salary-component/${userId}`,
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


    // Update the incomeValues state with the new array
    setIncomeValues(updatedIncomeValues);

    // eslint-disable-next-line
  }, [
    selectedDate,
    salaryComponent,
    totalAvailableDays,
    remotePunchAllowance,
    ,
  ]);

  // get the PFsetup from organizaiton
  const { PfSetup } = useGetPfEsicSetup({
    organisationId,
  });

  // Initialize the state for set deduction value
  let pwd = availableEmployee?.pwd;


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

    setDeductionValues(updatedDeductions);
    setEmployerContribution(emlCtr > 0 ? emlCtr : 0);

    // eslint-disable-next-line
  }, [
    salaryComponent,
    PfSetup,
    selectedDate,
    incomeValues,
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

      console.log({ currentYear, currentMonth, selectedYear, selectedMonth, employeeJoiningYear, employeeJoiningMonth });

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
        `${import.meta.env.VITE_API}/route/employeeSalary/add-salary/${userId}/${organisationId}`,
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
