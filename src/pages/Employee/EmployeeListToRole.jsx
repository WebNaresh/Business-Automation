import AddIcon from "@mui/icons-material/Add";
import BusinessIcon from "@mui/icons-material/Business";
import EditIcon from "@mui/icons-material/Edit"; // Changed from EditOutlinedIcon
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
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
} from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";

const EmployeeListToRole = () => {
  const navigate = useNavigate();
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [nameSearch, setNameSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [deptSearch, setDeptSearch] = useState("");
  const [availableEmployee, setAvailableEmployee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { organisationId } = useParams();

  const fetchAvailableEmployee = async (page) => {
    try {
      const apiUrl = `${
        import.meta.env.VITE_API
      }/route/employee/get-paginated-emloyee/${organisationId}?page=${page}&nameSearch=${nameSearch}&deptSearch=${deptSearch}&locationSearch=${locationSearch}`;
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
  }, [currentPage, nameSearch, deptSearch, locationSearch]);

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
    navigate(`/organisation/${organisationId}/add-employee`);
  };

  return (
    <div className="py-6 bg-gray-50 min-h-screen">
      <article className="bg-white w-full h-max shadow-lg rounded-lg border">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h4 className="text-2xl font-bold text-gray-800 mb-2">
              Employee Directory
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Tooltip
              title="No employees found"
              placement="top"
              open={availableEmployee.length < 1 && nameSearch !== ""}
            >
              <TextField
                onChange={(e) => setNameSearch(e.target.value)}
                placeholder="Search by name..."
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: <SearchIcon className="text-gray-400 mr-2" />,
                }}
              />
            </Tooltip>
            <TextField
              onChange={(e) => setDeptSearch(e.target.value)}
              placeholder="Search by department..."
              variant="outlined"
              size="small"
              fullWidth
              InputProps={{
                startAdornment: <BusinessIcon className="text-gray-400 mr-2" />,
              }}
            />
            <TextField
              onChange={(e) => setLocationSearch(e.target.value)}
              placeholder="Search by location..."
              variant="outlined"
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <LocationOnIcon className="text-gray-400 mr-2" />
                ),
              }}
            />
          </div>
        </div>

        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table sx={{ minWidth: 650 }} aria-label="employee table">
            <TableHead>
              <TableRow>
                <TableCell>Sr. No</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Employee Id</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Department</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {availableEmployee.length > 0 &&
                availableEmployee
                  .filter((item) => {
                    return (
                      (!nameSearch.toLowerCase() ||
                        (item.first_name !== null &&
                          item.first_name !== undefined &&
                          item.first_name
                            .toLowerCase()
                            .includes(nameSearch))) &&
                      (!deptSearch ||
                        (item.deptname !== null &&
                          item.deptname !== undefined &&
                          item.deptname.some(
                            (dept) =>
                              dept.departmentName !== null &&
                              dept.departmentName
                                .toLowerCase()
                                .includes(deptSearch.toLowerCase())
                          ))) &&
                      (!locationSearch.toLowerCase() ||
                        item.worklocation.some(
                          (location) =>
                            location &&
                            location.city !== null &&
                            location.city !== undefined &&
                            location.city.toLowerCase().includes(locationSearch)
                        ))
                    );
                  })
                  .map((item, id) => (
                    <TableRow
                      key={id}
                      sx={{
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
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleEditClick(item._id)}
                        >
                          <EditIcon /> {/* Changed from EditOutlinedIcon */}
                        </IconButton>
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
