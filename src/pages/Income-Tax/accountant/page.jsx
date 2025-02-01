import { West } from "@mui/icons-material";
import React from "react";
import { Link } from "react-router-dom";
import EmployeeInvestmentTable from "./EmployeeTable";

const EmployeeInvestmentPage = () => {
  return (
    <>
      <header className="text-lg w-full pt-6 bg-white border  p-4">
        <Link to={-1}>
          <West className="mx-4 !text-xl" />
        </Link>
        Income Tax
      </header>

      <section className="px-8 py-4  justify-between  min-h-[85vh] bg-gray-50">
        <headers className="flex items-center justify-between bg-[#3E3E3E] text-white p-4 rounded-md">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="md:text-2xl tracking-tight">
                TDS Declarations done by individuals
              </h2>
              <p className="text-sm text-white">
                Accountant can view and download the declaration document from here
              </p>
            </div>
          </div>
        </headers>
        <div className=" mt-4  pb-4  gap-8">
          <EmployeeInvestmentTable />
        </div>
      </section>
    </>
  );
};

export default EmployeeInvestmentPage;
