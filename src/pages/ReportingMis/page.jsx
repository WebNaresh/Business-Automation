import { West } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import ReportForm from "./components/MiniForm";

const ReportingMis = () => {
  const navigate = useNavigate();
  return (
    <section className=" min-h-[90vh]  h-auto  bg-gray-50 ">
      <header className="text-xl w-full pt-6 flex items-start gap-2 bg-white shadow-md   p-4">
        <IconButton onClick={() => navigate(-1)}>
          <West className=" !text-xl" />
        </IconButton>
        Reporting MIS
      </header>

      <div className="md:px-8 px-4 mt-10 space-y-4">
        <h1 className="text-2xl  !leading-3">Generate Report</h1>
        <p className="!mt-2 !p-0">
          Generate the excel report for attendence salary like data
        </p>
        <ReportForm />
      </div>
    </section>
  );
};

export default ReportingMis;
