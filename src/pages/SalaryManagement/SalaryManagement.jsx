import { Container, TextField, Tooltip, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import CreateSalaryModel from "../../components/Modal/CreateSalaryModel/CreateSalaryModel";
import SearchIcon from "@mui/icons-material/Search";
import { AttachMoney, Calculate } from '@mui/icons-material';
import useEmpOption from "../../hooks/Employee-OnBoarding/useEmpOption";

const SalaryManagement = () => {
  // state
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [nameSearch, setNameSearch] = useState("");
  const [availableEmployee, setAvailableEmployee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [numbers, setNumbers] = useState([]);
  const { organisationId } = useParams();
  const [incomeValues, setIncomeValues] = useState([]);
  const [deductionsValues, setDeductionsValues] = useState([]);
  const [department, setDepartment] = useState("");
  const [salarystructure, setSalarystructure] = useState("");
  const navigate = useNavigate();

  const {
    Departmentoptions,
    salaryTemplateoption
  } = useEmpOption({ organisationId });

  console.log("Departmentoptions", Departmentoptions);
  console.log("salaryTemplateoption", salaryTemplateoption);


  // get query for fetch the employee
  const fetchAvailableEmployee = async (page) => {
    try {
      const apiUrl = `${import.meta.env.VITE_API}/route/employee/get-paginated-emloyee/${organisationId}?page=${page}&department=${department}&salarystructure=${salarystructure}`;
      console.log("apiUrl", apiUrl);

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: authToken,
        },
      });
      setAvailableEmployee(response.data.employees);
      setCurrentPage(page);
      setTotalPages(response.data.totalPages || 1);
      // Generate an array of page numbers
      const numbersArray = Array.from(
        { length: response.data.totalPages || 1 },
        (_, index) => index + 1
      );
      setNumbers(numbersArray);
    } catch (error) {
      console.log(error);
      handleAlert(true, "error", "Failed to Fetch Employee");
    }
  };

  useEffect(() => {
    fetchAvailableEmployee(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, department, salarystructure]);

  // pagination
  const prePage = () => {
    if (currentPage !== 1) {
      fetchAvailableEmployee(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage !== totalPages) {
      fetchAvailableEmployee(currentPage + 1);
    }
  };

  const changePage = (id) => {
    fetchAvailableEmployee(id);
  };

  // Define the handler function
  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
  };

  // Define the handler function
  const handleSalaryTemplateChange = (e) => {
    setSalarystructure(e.target.value);
  };

  console.log("department", department);
  console.log("salarystructure", salarystructure);



  // modal for create salary
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);

  const handleCreateModalOpen = (id) => {
    setCreateModalOpen(true);
    setEmployeeId(id);
  };

  const handleClose = () => {
    setCreateModalOpen(false);
    setEmployeeId(null);
    setIncomeValues([]);
    setDeductionsValues([]);
  };

  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50 min-h-screen pt-12">
        <article className=" bg-white w-full h-max shadow-md rounded-sm border items-center">

          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h4 className="text-2xl font-bold text-gray-800 mb-2">
                Manage Salary
              </h4>
              <Typography variant="body2" className="text-center text-gray-600">
                Efficiently handle and oversee employee salary details.
              </Typography>
            </div>
          </div>
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-4 items-center">
              <Tooltip
                title="No employees found"
                placement="top"
                open={availableEmployee.length < 1 && nameSearch !== ""}
              >
                <TextField
                  onChange={(e) => setNameSearch(e.target.value)}
                  placeholder="Search"
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputProps={{
                    startAdornment: <SearchIcon className="text-gray-400 mr-2" />,
                  }}
                />
              </Tooltip>
              {/* Department Dropdown */}
              <FormControl variant="outlined" size="small" fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={department} // Ensure it's controlled
                  onChange={handleDepartmentChange}
                  label="Department"
                >
                  <MenuItem value="">All Departments</MenuItem>
                  {Departmentoptions?.map((dept) => (
                    <MenuItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Salary Template Dropdown */}
              <FormControl variant="outlined" size="small" fullWidth>
                <InputLabel>Salary Template</InputLabel>
                <Select
                  value={salarystructure}
                  onChange={handleSalaryTemplateChange}
                  label="Salary Template"
                >
                  <MenuItem value="">All Templates</MenuItem>
                  {salaryTemplateoption?.map((template) => (
                    <MenuItem key={template.value} value={template.value}>
                      {template.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>


          <div className="overflow-auto !p-0  border-[.5px] border-gray-200">
            <table className="min-w-full bg-white  text-left !text-sm font-light">
              <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                <tr className="!font-semibold">
                  <th scope="col" className="!text-left pl-8 py-3">
                    Sr. No
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    First Name
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Last Name
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Email
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Employee Id
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Department
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Salary Template
                  </th>
                  <th scope="col" className="px-6 py-3 ">
                    Manage Salary
                  </th>
                  <th scope="col" className="px-6 py-3 ">
                    Calculate Salary
                  </th>
                </tr>
              </thead>
              <tbody>
                {availableEmployee.length > 0 ? (
                  availableEmployee
                    .filter((item) => {
                      return (
                        (!nameSearch.toLowerCase() ||
                          (item.first_name !== null &&
                            item.first_name !== undefined &&
                            item.first_name
                              .toLowerCase()
                              .includes(nameSearch.toLowerCase())))
                      );
                    })
                    .map((item, id) => (
                      <tr className="!font-medium border-b" key={id}>
                        <td className="!text-left pl-8 py-3">{id + 1}</td>
                        <td className="py-3 pl-8">{item?.first_name}</td>
                        <td className="py-3 pl-8 ">{item?.last_name}</td>
                        <td className="py-3 pl-8">{item?.email}</td>
                        <td className="py-3 pl-8">{item?.empId}</td>
                        <td className="py-3 pl-9">
                          {item?.deptname?.map((dept, index) => (
                            <span key={index}>{dept?.departmentName}</span>
                          ))}
                        </td>
                        <td className="py-3 pl-9">
                          {item?.salarystructure?.name}
                        </td>
                        <td className="py-3 pl-12">
                          <button
                            type="submit"
                            onClick={() => handleCreateModalOpen(item._id)}
                          >
                            <AttachMoney sx={{ color: 'blue' }} />
                          </button>
                        </td>
                        <td className="py-3 pl-12">
                          <button
                            type="submit"
                            onClick={() =>
                              navigate(`/organisation/${id}/salary-calculate/${item._id}`)
                            }
                          >
                            <Calculate sx={{ color: 'green' }} />
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-red-500 text-lg font-bold">
                      No Employee Found
                    </td>
                  </tr>

                )}
              </tbody>

            </table>
            <nav
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "30px",
                marginBottom: "20px",
              }}
            >
              <ul
                style={{ display: "inline-block", marginRight: "5px" }}
                className="pagination"
              >
                <li
                  style={{ display: "inline-block", marginRight: "5px" }}
                  className="page-item"
                >
                  <button
                    style={{
                      color: "#007bff",
                      padding: "8px 12px",
                      border: "1px solid #007bff",
                      textDecoration: "none",
                      borderRadius: "4px",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    className="page-link"
                    onClick={prePage}
                  >
                    Prev
                  </button>
                </li>
                {/* Map through page numbers and generate pagination */}
                {numbers.map((n, i) => (
                  <li
                    key={i}
                    className={`page-item ${currentPage === n ? "active" : ""}`}
                    style={{
                      display: "inline-block",
                      marginRight: "5px",
                    }}
                  >
                    <a
                      href={`#${n}`}
                      style={{
                        color: currentPage === n ? "#fff" : "#007bff",
                        backgroundColor:
                          currentPage === n ? "#007bff" : "transparent",
                        padding: "8px 12px",
                        border: "1px solid #007bff",
                        textDecoration: "none",
                        borderRadius: "4px",
                        transition: "all 0.3s ease",
                      }}
                      className="page-link"
                      onClick={() => changePage(n)}
                    >
                      {n}
                    </a>
                  </li>
                ))}
                <li style={{ display: "inline-block" }} className="page-item">
                  <button
                    style={{
                      color: "#007bff",
                      padding: "8px 12px",
                      border: "1px solid #007bff",
                      textDecoration: "none",
                      borderRadius: "4px",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    className="page-link"
                    onClick={nextPage}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </article>
      </Container>

      {/* for create the salary modal */}
      <CreateSalaryModel
        id={organisationId}
        open={createModalOpen}
        handleClose={handleClose}
        empId={employeeId}
        incomeValues={incomeValues}
        setIncomeValues={setIncomeValues}
        deductionsValues={deductionsValues}
        setDeductionsValues={setDeductionsValues}
      />
    </>
  );
};

export default SalaryManagement;
