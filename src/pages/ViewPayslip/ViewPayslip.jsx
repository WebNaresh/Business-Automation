import Alert from "@mui/material/Alert";
import axios from "axios";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { UseContext } from "../../State/UseState/UseContext";
import UserProfile from "../../hooks/UserData/useUser";
import { CircularProgress, Tooltip, Modal, Box } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import html2pdf from "html2pdf.js";

const ViewPayslip = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const employeeId = user._id;
  const organisationId = user.organizationId;
  const currentDate = dayjs();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [employeeInfo, setEmployeeInfo] = useState("");
  const [organisationInfo, setOrganisationInfo] = useState("");
  const [salaryInfo, setSalaryInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDateChange = (event) => {
    setSelectedDate(dayjs(event.target.value));
  };

  const monthFromSelectedDate = selectedDate.format("M");
  const yearFromSelectedDate = selectedDate.format("YYYY");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API}/route/employeeSalary/viewpayslip/${employeeId}/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setEmployeeInfo(response.data.employeeInfo);
      setOrganisationInfo(response.data.organizationInfo);
      setSalaryInfo(response.data.salaryDetails);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
    // eslint-disable-next-line
  }, []);

  const pulseAnimation = {
    animation: "pulse 1.5s infinite",
  };
  const filteredSalaryInfo = salaryInfo.find((info) => {
    return (
      info.month === parseInt(monthFromSelectedDate) &&
      info.year === parseInt(yearFromSelectedDate)
    );
  });
  const handleDownloadClick = () => {
    const element = document.getElementById("App"); // Ya ID la refer kara jithe tumcha content aahe
    const opt = {
      margin: 1,
      filename: "payslip.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }, // A4 size setup
    };

    html2pdf().from(element).set(opt).save();
  };

  // eslint-disable-next-line no-unused-vars
  const handleOpenModal = (content) => {
    setModalContent(content);
    setOpen(true);
  };
  const handleCloseModal = () => setOpen(false);

  return (
    <>
      {/* Upper part */}
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">
              Select the month for your Payslip Statement
            </h3>
            <input
              type="month"
              value={selectedDate.format("YYYY-MM")}
              onChange={handleDateChange}
              className="border border-gray-300 rounded-lg p-3 text-gray-700 w-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
              placeholder="Select Month"
            />
          </div>
        </div>
      </div>

      {/* Bottom part */}
      <div className="container mx-auto p-6 !bg-white">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress />
          </div>
        ) : employeeInfo && organisationInfo ? (
          // main
          <div className="!bg-white shadow-lg rounded-lg p-6 border border-gray-300">
            <div id="App" className="p-7">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-6 border-b pb-4">
                <div>
                  <img
                    src={organisationInfo?.logo_url}
                    alt={organisationInfo?.logo_url}
                    className="w-24 h-24 rounded-full border border-gray-300 shadow-md"
                  />
                </div>

                <div className="mt-4 md:mt-0 md:ml-4 text-center md:text-left">
                  <p className="text-xl font-semibold text-gray-800">
                    Organisation:{" "}
                    <span className="font-normal">
                      {organisationInfo?.orgName}
                    </span>
                  </p>
                  <p className="text-lg text-gray-600">
                    Location:{" "}
                    <span className="font-normal">
                      {organisationInfo?.location?.address}
                    </span>
                  </p>
                  <p className="text-lg text-gray-600">
                    Contact No:{" "}
                    <span className="font-normal">
                      {organisationInfo?.contact_number}
                    </span>
                  </p>
                  <p className="text-lg text-gray-600">
                    Email:{" "}
                    <span className="font-normal">
                      {organisationInfo?.email}
                    </span>
                  </p>
                </div>
              </div>

              {/* First Table */}
              <div className="mb-6 overflow-x-auto">
                <table className="w-full border border-gray-300 border-collapse">
                  <thead className="bg-blue-100 text-gray-800">
                    <tr>
                      <th className="px-4 py-2 border">Salary Slip</th>
                      <th className="border"></th>
                      <th className="px-4 py-2 border">Month</th>
                      <th className="px-4 py-2 border">
                        {filteredSalaryInfo?.formattedDate || ""}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border text-gray-700">
                        Employee Name:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {`${employeeInfo?.first_name} ${employeeInfo?.last_name}`}
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        Date Of Joining:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {employeeInfo?.joining_date
                          ? new Date(
                              employeeInfo.joining_date
                            ).toLocaleDateString("en-GB")
                          : ""}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border text-gray-700">
                        Designation:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {employeeInfo?.designation?.[0]?.designationName || ""}
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        Unpaid Leaves:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {filteredSalaryInfo?.unPaidLeaveDays ?? "0"}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border text-gray-700">
                        Department Name:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {employeeInfo?.deptname?.[0]?.departmentName || ""}
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        No of Working Days Attended:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {filteredSalaryInfo?.noOfDaysEmployeePresent || ""}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border text-gray-700">
                        PAN No:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {employeeInfo?.pan_card_number}
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        Paid Leaves:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {filteredSalaryInfo?.paidLeaveDays ?? "0"}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border text-gray-700">
                        Bank Account No:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {employeeInfo?.bank_account_no || ""}
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        Public Holidays:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {filteredSalaryInfo?.publicHolidaysCount ?? "0"}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border text-gray-700">
                        Employee Id:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {employeeInfo?.empId || ""}
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        No of Days in Month:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {filteredSalaryInfo?.numDaysInMonth ?? "0"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Income and Deduction Table */}
              <div className="mb-6 overflow-x-auto">
                <table className="w-full border border-gray-300 border-collapse">
                  <thead className="bg-gray-300 text-gray-800">
                    <tr>
                      <th className=" px-4 py-2 border">Income</th>
                      <th className="border"></th>
                      <th className="px-4 py-2 border">Deduction</th>
                      <th className="border"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border text-gray-700">
                        Particulars
                      </td>
                      <td className="py-2 border text-gray-700">Amount</td>
                      <td className="py-2 border text-gray-700">Particulars</td>
                      <td className="py-2 border text-gray-700">Amount</td>
                    </tr>
                    {Array.from({
                      length: Math.max(
                        filteredSalaryInfo?.income?.length || 0,
                        filteredSalaryInfo?.deductions?.length || 0
                      ),
                    }).map((_, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border text-gray-700">
                          {filteredSalaryInfo?.income?.[index]?.name || ""}
                        </td>
                        <td className="px-4 py-2 border text-gray-700">
                          {filteredSalaryInfo?.income?.[index]?.value || ""}
                        </td>
                        <td className="px-4 py-2 border text-gray-700">
                          {filteredSalaryInfo?.deductions?.[index]?.name || ""}
                        </td>
                        <td className="px-4 py-2 border text-gray-700">
                          {filteredSalaryInfo?.deductions?.[index]?.value || ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="mb-6 overflow-x-auto">
                <table className="w-full border border-gray-300 border-collapse">
                  <thead className="bg-blue-100 text-gray-800">
                    <tr>
                      <th className="px-4 py-2 border">Total Gross Salary:</th>
                      <th className="px-4 py-2 border text-gray-700">
                        {filteredSalaryInfo?.totalGrossSalary || ""}
                      </th>
                      <th className="px-4 py-2 border">Total Deduction:</th>
                      <th className="px-4 py-2 border text-gray-700">
                        {filteredSalaryInfo?.totalDeduction || ""}
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>

              <div className="mb-6 overflow-x-auto">
                <table className="w-full mt-6 border border-gray-300 border-collapse">
                  <thead className="bg-gray-300 text-gray-800">
                    <tr>
                      <th className="  px-4 py-2 border">Total Net Salary</th>
                      <th></th>
                      <th className="px-4 py-2 border text-gray-700">
                        {filteredSalaryInfo?.totalNetSalary || ""}
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
            {/* Download Button */}
            <div className="flex justify-center mt-6">
              <Tooltip title="Download your payslip as a PDF" arrow>
                <button
                  onClick={handleDownloadClick}
                  className="relative px-6 py-3 rounded-lg bg-blue-600 text-white text-lg font-semibold shadow-md hover:bg-blue-700 transition duration-200 flex items-center justify-center"
                >
                  <span className="mr-2">Download PDF</span>
                  <FontAwesomeIcon
                    icon={faDownload}
                    style={pulseAnimation}
                    className="w-5 h-5"
                  />
                </button>
              </Tooltip>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center mt-12">
            <img
              src="/payslip.jpg"
              style={{ height: "400px", marginBottom: "20px" }}
              alt="No payslip available"
            />
            <Alert
              severity="error"
              sx={{
                width: "100%",
                maxWidth: "600px",
                textAlign: "center",
              }}
            >
              Please select the month for which you need the payslip statement.
            </Alert>
          </div>
        )}
      </div>

      {/* Modal for additional information */}
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "90%" : "60%",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <h2 id="modal-title" className="text-xl font-semibold mb-4">
            {modalContent.title}
          </h2>
          <p id="modal-description">{modalContent.description}</p>
        </Box>
      </Modal>
    </>
  );
};

export default ViewPayslip;
