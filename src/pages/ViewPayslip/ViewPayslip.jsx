import React, { useContext, useState } from "react";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import { RequestQuote, Search, West } from "@mui/icons-material";
import { Avatar, CircularProgress } from "@mui/material";
import { useQuery } from "react-query";
import { Link, useParams, useNavigate } from "react-router-dom";
import PayslipModel from "./PayslipModel"; // Import PayslipModel component
import Button from "@mui/material/Button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ViewPaySlip = () => {
  const { organisationId } = useParams();
  const { cookies } = useContext(UseContext);
  const navigate = useNavigate();
  const authToken = cookies["aegis"];

  const [searchTerm, setSearchTerm] = useState(""); // State to store search input
  const [selectedEmployee, setSelectedEmployee] = useState(null); // State for selected employee

  const { data, isFetching, isLoading } = useQuery(
    ["employee", organisationId],
    async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/route/employee/get-paginated-emloyee/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data?.employees || [];
    }
  );

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee); // Set the selected employee
  };

  // Filter employees based on the search term
  const filteredEmployees = data?.filter((employee) =>
    `${employee?.first_name} ${employee?.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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
  const handleDownloadClick = () => {
    setActiveButton("download");
    exportPDF();
  };

  return (
    <div className="flex flex-col">
      <header className="text-xl w-full pt-6 border flex justify-between bg-white shadow-md p-4">
        <div>
          <span className="cursor-pointer" onClick={() => navigate(-1)}>
            <West className="mx-4 !text-xl" />
          </span>
          <div className="inline">Employee Payslip</div>
        </div>
      </header>

      <section className="min-h-[90vh] flex">
        {/* Employee List Section */}
        <article className="md:w-[25%] w-[200px] overflow-auto max-h-[90vh] h-full bg-white border-gray-200">
          <div className="p-6 !py-2">
            <div className="space-y-2">
              <div className="flex rounded-md items-center px-2 border-gray-200 border-[.5px] bg-white py-1 md:py-[6px]">
                <Search className="text-gray-700 md:text-lg !text-[1em]" />
                <input
                  type="text"
                  placeholder="Search Employee"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-none bg-white w-full outline-none md:px-2 px-0"
                />
              </div>
            </div>
          </div>

          {/* Employee List */}
          {isFetching ? (
            <div className="flex justify-center items-center my-4">
              <CircularProgress />
            </div>
          ) : (
            filteredEmployees?.length === 0 ? (
              <div className="flex flex-col items-center">
                <img
                  src="/payslip.jpg"
                  style={{ height: "400px" }}
                  alt="No payslip available"
                />
                <h3>No Employee Found</h3>
              </div>
            ) : (
              filteredEmployees?.map((employee, idx) => (
                <Link
                  key={idx}
                  onClick={() => handleEmployeeClick(employee)}
                  className="px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50"
                >
                  <Avatar />
                  <div>
                    <h1 className="md:text-[1.2rem] text-sm">
                      {employee?.first_name} {employee?.last_name}
                    </h1>
                    <h1 className="md:text-sm text-xs text-gray-500">
                      {employee?.email}
                    </h1>
                  </div>
                </Link>
              ))
            )
          )}
        </article>

        {/* Payslip Section */}
        <article className="w-[75%] min-h-[90vh] border-l-[.5px] bg-gray-50">
          {isLoading ? (
            <div className="flex items-center justify-center my-2">
              <CircularProgress />
            </div>
          ) : data?.length > 0 ? (
            <>
              {selectedEmployee ? (
                <PayslipModel
                  employeeId={selectedEmployee}
                  organisationId={organisationId}
                />
              ) : (
                <div className="flex flex-col items-center  mt-10">
                  <img
                    src="/payslip.jpg"
                    style={{ height: "80%", width: "80%" }}
                    alt="No payslip available"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center">
              <img
                src="/payslip.jpg"
                style={{ height: "400px" }}
                alt="No payslip available"
              />
            </div>
          )}
        </article>

      </section>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%"  , marginTop : "20px" , marginLeft : "30%"}}>
        <Button
          variant="contained"
          onClick={handleDownloadClick}
          color="primary"
        >
          Download PDF
        </Button>
      </div>

    </div>
  );
};

export default ViewPaySlip;
