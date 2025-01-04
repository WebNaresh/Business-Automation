import React from "react";
import { useParams } from "react-router-dom";
import UserProfile from "../../hooks/UserData/useUser";
import EmployeeListToRole from "./EmployeeListToRole";
import EmployeeListToEmployee from "./EmployeeListtoEmployee";

const Employee = () => {
  // define the state, get function hook
  const { organisationId } = useParams();
  const { useGetCurrentRole, getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const role = useGetCurrentRole();

  // Determine which component to render based on the role
  const renderEmployeeComponent = () => {
    if (
      role === "Super-Admin" ||
      role === "Delegate-Super-Admin" ||
      role === "HR" ||
      role === "Department-Head" ||
      role === "Delegate-Department-Head"
    ) {
      return <EmployeeListToRole organisationId={organisationId} />;
    }
    return null;
  };

  return (
    <div className="bg-gray-50 min-h-screen">{renderEmployeeComponent()}</div>
  );
};

export default Employee;
