import React, { useContext, useState } from "react";
import { Search, West, RequestQuote } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import AdvanceSalaryApproval from "./AdvanceSalaryApproval";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import { useQuery, useQueryClient } from "react-query";

const AdvanceSalaryNotification = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  // state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const {
    data: getAdvanceSalaryData,
  } = useQuery(["getAdvanceSalaryData"], async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API}/route/pending-advance-salary-data`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data.data;
  },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getAdvanceSalary"] });
      }
    }
  );

  // function to select employee
  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  let filteredEmployees = [];

  if (Array.isArray(getAdvanceSalaryData)) {
    filteredEmployees = getAdvanceSalaryData.filter(
      (employee) =>
        employee?.userId?.first_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        employee?.userId?.last_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div className="w-full">
      <header className="text-xl w-full pt-6 border bg-white shadow-md p-4">
        <West className="mx-4 !text-xl" />
        Employee Advance Salary Request
      </header>
      <section className="min-h-[90vh] flex">
        <article className="w-[20%] overflow-auto max-h-[90vh] h-full bg-white border-gray-200">
          <div className="p-6 !py-2">
            <div className="space-y-2">
              <div
                className={`flex rounded-md items-center px-2 outline-none border-gray-200 border-[.5px] bg-white py-1 md:py-[6px]`}
              >
                <Search className="text-gray-700 md:text-lg !text-[1em]" />
                <input
                  type={"text"}
                  placeholder={"Search Employee"}
                  className={`border-none bg-white w-full outline-none px-2`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          {filteredEmployees && filteredEmployees.length > 0 && (
            <div>
              {filteredEmployees?.map((employee) => (
                <div
                  className={`px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50`}
                  key={employee?.userId?._id}
                  onClick={() => handleEmployeeClick(employee)}
                >
                  <Avatar src={employee?.avatarSrc} />
                  <div>
                    <h1 className="text-[1.2rem]">
                      {employee?.userId?.first_name}{" "}
                      {employee?.userId?.last_name}
                    </h1>

                    <h1 className={`text-sm text-gray-500`}>
                      {employee?.userId?.email}
                    </h1>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
        <div className="w-[80%]">
          {selectedEmployee ? (
            <AdvanceSalaryApproval employee={selectedEmployee} />
          ) : (
            <div className="p-4 space-y-1 flex items-center gap-3">
              <Avatar className="text-white !bg-blue-500">
                <RequestQuote />
              </Avatar>
              <div>
                <h1 className=" text-xl">Advance Salary Requests</h1>
                <p className="text-sm">
                  Here you would be able to approve or reject the advance salary
                  notifications
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdvanceSalaryNotification;