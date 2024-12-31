//😎
import axios from "axios";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import React, { useState } from "react";
import { useQuery } from "react-query";
// import { useLocation } from 'react-router-dom';
import HeaderComponentPro from "../../components/header/HeaderComponentPro";
import useAuthToken from "../../hooks/Token/useAuth";
import UserProfile from "../../hooks/UserData/useUser";
import HRgraph from "./Components/Bar/HRgraph";
import LineGraph from "./Components/Bar/LineGraph";
import LeaveDisplayList from "./Components/List/LeaveDisplayList";
import PublicHolidayDisplayList from "./Components/List/PublicHolidayDisplayList";
import EmployeeLeavePie from "./Components/Pie/EmployeeLeavePie";
Chart.register(CategoryScale);

const Dashboard = () => {
  const authToken = useAuthToken();
  const { getCurrentUser } = UserProfile();
  const [selectedyear, setSelectedYear] = useState({
    value: new Date().getFullYear(),
    label: new Date().getFullYear(),
  });
  const user = getCurrentUser();
  const getSalaryTemplate = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API}/route/employeeSalary/viewpayslip/${
          user._id
        }/${user.organizationId}/${selectedyear.value}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: EmployeSalaryData } = useQuery(
    ["salary-template-employee", selectedyear],
    getSalaryTemplate
  );
  // const location = useLocation();

  return (
    <>
      <section className="p-2 mt-10 shadow-lg ">
        <HeaderComponentPro
          heading={" Dashboard"}
          oneLineInfo={
            "Get insights of Employee's data with interactive charts and reports"
          }
        />
        <div className="py-3 px-2 md:px-8 w-full">
          <div className="flex md:flex-row flex-col w-full justify-between gap-2">
            <div className="space-y-3 md:space-y-0 md:my-4 mb-1 flex md:gap-2 gap-1 flex-col md:!w-[60%] w-[100%] md:pb-2">
              {/* Employee Attandance */}
              <HRgraph />
              {/* Salary Overview */}
              hi
              <LineGraph
                salarydata={EmployeSalaryData?.employeeSalaryViaYear}
                selectedyear={selectedyear}
                setSelectedYear={setSelectedYear}
                employee={EmployeSalaryData?.employeeInfo}
              />
              {/* <SinglePayGraph /> */}
            </div>

            <div className="md:w-[40%] md:my-4 my-1 md:px-2 space-y-3 md:space-y-4">
              <EmployeeLeavePie />
              <PublicHolidayDisplayList />
              <LeaveDisplayList />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
