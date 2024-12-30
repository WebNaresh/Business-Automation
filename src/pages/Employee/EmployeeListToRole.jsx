import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import PrintIcon from "@mui/icons-material/Print";
import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Box,
  Select, MenuItem, FormControl, InputLabel
} from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import * as XLSX from "xlsx";
import useEmpOption from "@/hooks/Employee-OnBoarding/useEmpOption";
import AuthInputFiled from "@/components/InputFileds/AuthInputFiled";
import useEmpState from "@/hooks/Employee-OnBoarding/useEmpState";


const EmployeeListToRole = () => {
  const navigate = useNavigate();
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [nameSearch, setNameSearch] = useState("");
  const [availableEmployee, setAvailableEmployee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { organisationId } = useParams();




  const {
    Departmentoptions,
  } = useEmpOption(organisationId);

  const fetchAvailableEmployee = async (page) => {
    try {
      const apiUrl = `${import.meta.env.VITE_API
        }/route/employee/get-paginated-emloyee/${organisationId}?page=${page}&nameSearch=${nameSearch}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: authToken,
        },
      });
      setAvailableEmployee(response.data.employees);
      setCurrentPage(page);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAvailableEmployee(currentPage);
  }, [currentPage, nameSearch,]);

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

  const handleEditClick = (empId) => {
    navigate(`/organisation/${organisationId}/edit-employee/${empId}`);
  };

  const handleAddEmployee = () => {
    navigate(`/organisation/${organisationId}/employee-onboarding`);
  };


  const handleDeleteClick = () => {
    navigate(`/organisation/${organisationId}/employee-offboarding`);
  };

  const handleViewClick = (empId) => {
    navigate(`/organisation/${organisationId}/employee-view/${empId}`);
  };


  // 📊 Handle Export to Excel
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      availableEmployee.map((item, index) => ({
        "Sr. No": index + 1,
        "First Name": item.first_name || "-",
        "Last Name": item.last_name || "-",
        "Email": item.email || "-",
        "Employee Id": item.empId || "-",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "employee_list.xlsx");
  };

  // 🖨️ Handle Export to PDF
  const handleExportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Employee List", 14, 10);
    autoTable(doc, {
      head: [["Sr. No", "First Name", "Last Name", "Email", "Employee Id"]],
      body: availableEmployee.map((item, index) => [
        index + 1,
        item.first_name || "-",
        item.last_name || "-",
        item.email || "-",
        item.empId || "-",
      ]),
    });
    doc.save("employee_list.pdf");
  };

  return (
    <div className="py-6 bg-gray-50 min-h-screen">
      <article className="bg-white w-full h-max shadow-lg rounded-lg border">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h4 className="text-2xl font-bold text-gray-800 mb-2">
              Manage Employee
            </h4>
            <Typography variant="body2" className="text-center text-gray-600">
              Manage and edit employee information using the controls below
            </Typography>
          </div>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddEmployee}
          >
            Add Employee
          </Button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-4 items-center">
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

            <FormControl size="small" fullWidth>
              <InputLabel>Filter by Department</InputLabel>
              <Select
                label="Filter by Department"
              >
                <MenuItem value="">All Departments</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Engineering">Engineering</MenuItem>
                <MenuItem value="Sales">Sales</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              size="small"
              startIcon={<PrintIcon />}
              sx={{
                backgroundColor: "#d32f2f",
                "&:hover": { backgroundColor: "#b71c1c" },
                textTransform: "none",
              }}
            >
              Export PDF
            </Button>

            <Button
              variant="contained"
              size="small"
              startIcon={<PrintIcon />}
              sx={{
                backgroundColor: "#388e3c",
                "&:hover": { backgroundColor: "#2e7d32" },
                textTransform: "none",
              }}
              onClick={handleExportToExcel}
            >
              Export Excel
            </Button>
          </div>
        </div>


        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table sx={{ minWidth: 650 }} aria-label="employee table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Sr. No</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>First Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Last Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Employee Id</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {availableEmployee.length > 0 &&
                availableEmployee
                  .filter((item) => {
                    return (
                      (!nameSearch.toLowerCase() ||
                        (item.first_name &&
                          item.first_name
                            .toLowerCase()
                            .includes(nameSearch)))
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
                      <TableCell>{item?.first_name}</TableCell>
                      <TableCell>{item?.last_name}</TableCell>
                      <TableCell>{item?.email}</TableCell>
                      <TableCell>{item?.empId}</TableCell>
                      <TableCell>
                        {item?.worklocation?.map((location, index) => (
                          <span key={index}>{location?.city}</span>
                        ))}
                      </TableCell>
                      <TableCell>
                        {item?.deptname?.map((dept, index) => (
                          <span key={index}>{dept?.departmentName}</span>
                        ))}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "16px 24px",
                        }}
                      >
                        <Box
                          className="action-buttons"
                          sx={{
                            display: "flex",
                            gap: "8px",
                            opacity: 0.7,
                            transition: "opacity 0.2s ease",
                          }}
                        >
                          <IconButton
                            onClick={() => handleViewClick(item._id)}
                            sx={{
                              backgroundColor: "#f1f5f9",
                              "&:hover": { backgroundColor: "#e2e8f0" },
                            }}
                            size="small"
                          >
                            <VisibilityIcon
                              sx={{ fontSize: "1.25rem", color: "#0ea5e9" }}
                            />
                          </IconButton>
                          <IconButton
                            onClick={() => handleEditClick(item._id)}
                            sx={{
                              backgroundColor: "#f1f5f9",
                              "&:hover": { backgroundColor: "#e2e8f0" },
                            }}
                            size="small"
                          >
                            <EditIcon
                              sx={{ fontSize: "1.25rem", color: "#6366f1" }}
                            />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteClick(item._id)}
                            sx={{
                              backgroundColor: "#f1f5f9",
                              "&:hover": { backgroundColor: "#fee2e2" },
                            }}
                            size="small"
                          >
                            <DeleteIcon
                              sx={{ fontSize: "1.25rem", color: "#ef4444" }}
                            />
                          </IconButton>
                        </Box>
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
    </div>
  );
};

export default EmployeeListToRole;
