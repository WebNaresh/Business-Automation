import {
  Container, TextField, Tooltip, Typography, FormControl, InputLabel, Select, MenuItem, Avatar,
  Box, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from "@mui/material";
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
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pageNumbers = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage > 3) {
        pageNumbers.push(1);
        pageNumbers.push("...");
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push("...");
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers.map((number, index) => (
      <Button
        key={index}
        variant={number === currentPage ? "contained" : "outlined"}
        color="primary"
        onClick={() => typeof number === "number" && changePage(number)}
        disabled={number === "..."}
      >
        {number}
      </Button>
    ));
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


          <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
            <Table sx={{ minWidth: 650 }} aria-label="employee table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Sr. No</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Employee Id</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Salary Template</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Manage Salary</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Calculate Salary</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {availableEmployee.length > 0 &&
                  availableEmployee
                    .filter((item) => {
                      return (
                        !nameSearch.toLowerCase() ||
                        (item.first_name &&
                          item.first_name.toLowerCase().includes(nameSearch))
                      );
                    })
                    .map((item, id) => (
                      <TableRow
                        key={id}
                        sx={{
                          backgroundColor: id % 2 === 0 ? "#ffffff" : "#f9fafb",
                          "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                        }}
                      >
                        <TableCell>{id + 1}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <Avatar
                              src={item?.photoUrl || "/default-avatar.png"}
                              alt={item?.first_name || "Employee"}
                              sx={{ width: 40, height: 40 }}
                            />
                            {`${item?.first_name ?? ""} ${item?.last_name ?? ""}`.trim() || "-"}
                          </Box>
                        </TableCell>
                        <TableCell>{item?.email}</TableCell>
                        <TableCell>{item?.empId}</TableCell>
                        <TableCell>
                          {item?.deptname?.map((dept, index) => (
                            <span key={index}>{dept?.departmentName}</span>
                          ))}
                        </TableCell>
                        <TableCell>
                          {item?.salarystructure?.name}
                        </TableCell>
                        <TableCell>
                          <button
                            type="submit"
                            onClick={() => handleCreateModalOpen(item._id)}
                          >
                            <AttachMoney sx={{ color: 'blue' }} />
                          </button>
                        </TableCell>
                        <TableCell>
                          <button
                            type="submit"
                            onClick={() =>
                              navigate(`/organisation/${organisationId}/salary-calculate/${item._id}`)
                            }
                          >
                            <Calculate sx={{ color: 'green' }} />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 border-t border-gray-200">
            <Button
              variant="contained"
              onClick={prePage}
              disabled={currentPage === 1}
              className="text-sm"
            >
              Previous
            </Button>
            {renderPagination()}
            <Button
              variant="contained"
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="text-sm"
            >
              Next
            </Button>
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
