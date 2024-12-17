import React, { useState } from "react";
import { Search, West, RequestQuote } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import useDepartmentNotification from "../../hooks/QueryHook/notification/department-notification/hook";
import DepartmentApproval from "./DepartmentApproval";

const DepartmentNotification = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { getDepartmnetData } = useDepartmentNotification();

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };
  const handleApprovalCompletion = () => {
    setSelectedEmployee(null);
  };

  let filteredEmployees = [];

  if (Array.isArray(getDepartmnetData)) {
    filteredEmployees = getDepartmnetData.filter(
      (creator) =>
        creator?.creator?.first_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        creator?.creator?.last_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div className="w-full">
      <header className="text-xl w-full pt-6 border bg-white shadow-md p-4">
        <West className="mx-4 !text-xl" />
        Add Department Requests
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
                  key={employee?.creator?._id}
                  onClick={() => handleEmployeeClick(employee)}
                >
                  <Avatar src={employee?.avatarSrc} />
                  <div>
                    <h1 className="text-[1.2rem]">
                      {employee?.creator?.first_name}{" "}
                      {employee?.creator?.last_name}
                    </h1>

                    <h1 className={`text-sm text-gray-500`}>
                      {employee?.creator?.email}
                    </h1>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
        <div className="w-[80%]">
          {selectedEmployee ? (
            <DepartmentApproval
              employee={selectedEmployee}
              onApprovalCompletion={handleApprovalCompletion}
            />
          ) : (
            <div className="p-4 space-y-1 flex items-center gap-3">
              <Avatar className="text-white !bg-blue-500">
                <RequestQuote />
              </Avatar>
              <div>
                <h1 className=" text-xl">Add Department Requests</h1>
                <p className="text-sm">
                  Here you would be able to approve or reject the add department
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

export default DepartmentNotification;
