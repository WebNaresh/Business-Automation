import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Container,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import { Button } from "@mui/material";
const EmployeeListToRole = () => {
  // to  define state, hook and import other function  if user needed
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

  // Update the fetch function to include all query parameters
  const fetchAvailableEmployee = async (page) => {
    try {
      const apiUrl = `${import.meta.env.VITE_API}/route/employee/get-paginated-emloyee/${organisationId}?page=${page}&nameSearch=${nameSearch}&deptSearch=${deptSearch}&locationSearch=${locationSearch}`;
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

  // to fetch the employee
  useEffect(() => {
    // Fetch employees whenever currentPage, nameSearch, deptSearch, or locationSearch changes
    fetchAvailableEmployee(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, nameSearch, deptSearch, locationSearch]);

  console.log("available employee", availableEmployee);

  // for pagination
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
      // If total pages are less than or equal to 5, show all pages
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

  // to navigate to other component
  const handleEditClick = (empId) => {
    navigate(`/organisation/${organisationId}/edit-employee/${empId}`);
  };


  const handleDeleteClick = () => {
    navigate(`/organisation/${organisationId}/employee-offboarding`);
  }; 

  const handleViewClick = (empId) => {
    navigate(`/organisation/${organisationId}/employee-view/${empId}`);
  };
  

  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
        <article className=" bg-white w-full h-max shadow-md rounded-sm border items-center mb-6">
          <Typography variant="h4" className=" text-center pl-10  mb-6 mt-6">
            Manage Employee
          </Typography>
          <p className="text-xs text-gray-600 pl-10 text-center">
            Edit employee data here by using edit button.
          </p>

          <div className="p-4 border-b-[.5px] flex flex-col md:flex-row items-center justify-between gap-3 w-full border-gray-300">
            <div className="flex items-center gap-3 mb-3 md:mb-0 w-full md:w-auto">
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
                  sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
                />
              </Tooltip>
            </div>

          </div>

          <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
            <table className="min-w-full bg-white  text-left !text-sm font-light">
              <thead className="bg-gray-200 font-medium">
                <tr>
                  <th className="pl-8 py-3">SR No</th>
                  <th className="pl-8 py-3">Employee ID</th>
                  <th className="pl-8 py-3">Employee Name</th>
                  <th className="pl-8 py-3">Email ID</th>
                  <th className="pl-8 py-3">Department</th>
                  <th className="pl-8 py-3">Designation</th>
                  <th className="pl-8 py-3">Shift</th>
                  <th className="pl-8 py-3">Status</th>
                  <th className="pl-8 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
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
                              location.city
                                .toLowerCase()
                                .includes(locationSearch)
                          ))
                      );
                    })
                    .map((item, id) => (
                      <tr className="!font-medium border-b" key={id}>
                        <td className="!text-left pl-8 py-3">{id + 1}</td>
                        <td className="py-3 pl-8">{item?.empId}</td>
                        <td className="py-3 pl-8">{item?.first_name}</td>
                        <td className="py-3 pl-8">{item?.email}</td>
                        <td className="py-3 pl-8 ">
                          {item?.deptname?.map((dept, index) => (
                            <span key={index}>{dept?.departmentName}</span>
                          ))}
                        </td>
                        <td className="py-3 pl-8 ">
                          {item?.deptname?.map((dept, index) => (
                            <span key={index}>{dept?.departmentName}</span>
                          ))}
                        </td>
                        <td className="py-3 pl-8"></td>
                        <td className="py-3 pl-8"></td>
                        <td className="pl-8 py-3">
                          <IconButton color="info">
                            <VisibilityOutlinedIcon onClick={() => handleViewClick(item._id)} />
                          </IconButton>
                          <IconButton color="primary" onClick={() => handleEditClick(item._id)}>
                            <EditOutlinedIcon />
                          </IconButton>
                          <IconButton color="error">
                            <DeleteOutlineIcon onClick={handleDeleteClick} />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
            <div className="flex items-center justify-center gap-2 py-3">
              <Button
                variant="outlined"
                onClick={prePage}
                disabled={currentPage === 1}
              >
                PREVIOUS
              </Button>
              {renderPagination()}
              <Button
                variant="outlined"
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                NEXT
              </Button>
            </div>
          </div>
        </article>
      </Container>
    </>
  );
};

export default EmployeeListToRole;
