import React, { useState } from "react";
import { Search, West, RequestQuote } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import LoanMgtApproval from "./LoanMgtApproval";
import useLoanNotification from "../../hooks/QueryHook/notification/loan-notification/useLoanNotificaiton";

const LoanMgtNotification = () => {
  // to define the state, hook , import other function if needed
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { getEmployeeRequestLoanApplication } = useLoanNotification();

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  let filteredEmployees = [];

  if (Array.isArray(getEmployeeRequestLoanApplication)) {
    filteredEmployees = getEmployeeRequestLoanApplication.filter(
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
        Employee Loan Request
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
            <LoanMgtApproval employee={selectedEmployee} />
          ) : (
            <div className="p-4 space-y-1 flex items-center gap-3">
              <Avatar className="text-white !bg-blue-500">
                <RequestQuote />
              </Avatar>
              <div>
                <h1 className=" text-xl">Loan Requests</h1>
                <p className="text-sm">
                  Here you would be able to approve or reject the loan
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

export default LoanMgtNotification;
