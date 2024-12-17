import { Delete, GetApp, Publish } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
const DeleteEmployee = () => {
  // to define the state, hook and other if user neeed
  const { handleAlert } = useContext(TestContext);
  const { setAppAlert, cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const [nameSearch, setNameSearch] = useState("");
  const [deptSearch, setDeptSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [availableEmployee, setAvailableEmployee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [deleteMultiEmpConfirmation, setDeleteMultiEmpConfirmation] =
    useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showConfirmationExcel, setShowConfirmationExcel] = useState(false);
  const { organisationId } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);

  // pull the employee data
  const fetchAvailableEmployee = async (page) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API}/route/employee/get-paginated-emloyee/${organisationId}?page=${page}`;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // function for previous button , next button and current button of pagination
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

  // Delete Query for deleting single Employee
  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    setAvailableEmployee((prevEmployees) =>
      prevEmployees.filter((employee) => employee._id !== id)
    );
    setDeleteConfirmation(null);
  };
  const deleteMutation = useMutation(
    (id) =>
      axios.delete(`${process.env.REACT_APP_API}/route/employee/delete/${id}`, {
        headers: {
          Authorization: authToken,
        },
      }),
    {
      onSuccess: () => {
        // Invalidate and refetch the data after successful deletion
        queryClient.invalidateQueries("employee");
        handleAlert(true, "success", "Employee deleted succesfully");
      },
    }
  );

  // Delete Query for deleting Multiple Employee
  const handleEmployeeSelection = (id) => {
    const selectedIndex = selectedEmployees.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = [...selectedEmployees, id];
    } else {
      newSelected = selectedEmployees.filter((employeeId) => employeeId !== id);
    }
    setSelectedEmployees(newSelected);
  };

  const handleDeleteMultiple = () => {
    // Check if any employees are selected
    if (selectedEmployees.length === 0) {
      handleAlert(true, "error", "Please select employees to delete");
      return;
    }
    // Display confirmation dialog for deleting multiple employees
    setDeleteMultiEmpConfirmation(true);
  };

  // Handle confirmation of deleting multiple employees
  const confirmDeleteMultiple = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/route/employee/delete-multiple`,
        {
          headers: {
            Authorization: authToken,
          },
          data: { ids: selectedEmployees },
        }
      );
      console.log(response);
      queryClient.invalidateQueries("employee");
      handleAlert(true, "success", "Employees deleted successfully");
      // Filter the available employees, removing the deleted ones
      setAvailableEmployee((prevEmployees) =>
        prevEmployees.filter(
          (employee) => !selectedEmployees.includes(employee._id)
        )
      );
      // Reset selectedEmployees after successful deletion
      setSelectedEmployees([]);
    } catch (error) {
      handleAlert(true, "error", "Failed to delete employees");
    } finally {
      setDeleteMultiEmpConfirmation(false);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // deleting the employee from excel sheet
  // generate excel sheet
  const generateExcel = () => {
    try {
      const wb = XLSX.utils.book_new();
      const wsData = [
        [
          "Employee Id",
          "First Name",
          "Last Name",
          "Email",
          "Phone Number",
          "Profile",
        ],
      ];
      // Add Employee information to the worksheet data
      availableEmployee.forEach((employee) => {
        wsData.push([
          employee._id, // Assuming _id is the Employee Id
          employee.first_name,
          employee.last_name,
          employee.email,
          employee.phone_number,
          employee.profile.join(", "), // Join profile array into a string
        ]);
      });
      // Create a worksheet and add data to workbook
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      const columnWidths = [
        { wch: 30 }, // Employee Id
        { wch: 20 }, // First Name
        { wch: 20 }, // Last Name
        { wch: 35 }, // Email
        { wch: 15 }, // Phone Number
        { wch: 35 }, // Profile
      ];
      ws["!cols"] = columnWidths;
      XLSX.utils.book_append_sheet(wb, ws, "EmployeeSheet");
      // Save workbook to a file
      XLSX.writeFile(wb, "EmployeeDataTemplate.xlsx");
    } catch (error) {
      console.error("Error generating Excel:", error);
    }
  };

  const handleFileInputChange = (e) => {
    // Update the state with the selected file
    setSelectedFile(e.target.files[0]);
  };

  // delete query for deleting multiple employee from excel
  const handleDeleteFromExcel = async () => {
    try {
      const fileInput = document.getElementById("fileInput");
      const file = fileInput.files[0];
      if (!file) {
        console.error("Please upload an excel file.");
        setAppAlert({
          alert: true,
          type: "error",
          msg: "Please upload an Excel file.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = async function (e) {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const ws = workbook.Sheets["EmployeeSheet"];
          const deleteColumnIndex = XLSX.utils.decode_range(ws["!ref"]).e.c;

          if (deleteColumnIndex === undefined) {
            setAppAlert({
              alert: true,
              type: "error",
              msg: "Delete column not found in the excel sheet.",
            });
            return;
          }

          const employeesToDelete = [];
          for (
            let row = 1;
            row <= XLSX.utils.decode_range(ws["!ref"]).e.r;
            row++
          ) {
            const deleteCommand =
              ws[XLSX.utils.encode_cell({ r: row, c: deleteColumnIndex })];
            if (
              deleteCommand &&
              deleteCommand.v &&
              deleteCommand.v.toLowerCase() === "delete"
            ) {
              const employeeIdToDelete =
                ws[XLSX.utils.encode_cell({ r: row, c: 0 })].v;

              const employeeToDelete = availableEmployee.find(
                (emp) => emp._id === employeeIdToDelete
              );
              if (employeeToDelete) {
                employeesToDelete.push(employeeToDelete);
              }
            }
          }

          if (employeesToDelete.length === 0) {
            setAppAlert({
              alert: true,
              type: "error",
              msg: "Failed to delete employee from Excel. Please try again.",
            });
            setShowConfirmationExcel(false);
            return;
          }

          for (const employee of employeesToDelete) {
            try {
              await axios.delete(
                `${process.env.REACT_APP_API}/route/employee/delete/${employee._id}`,
                { headers: { Authorization: authToken } }
              );

              setAvailableEmployee((prevEmployees) =>
                prevEmployees.filter((emp) => emp._id !== employee._id)
              );

              setAppAlert({
                alert: true,
                type: "success",
                msg: "Employee deleted from the Excel sheet.",
              });
            } catch (error) {
              console.error("Error deleting employee:", error);
              setAppAlert({
                alert: true,
                type: "error",
                msg: "Failed to delete employee from excel. Please try again.",
              });
            }
          }
          handleClose();
          setShowConfirmationExcel(false);
        } catch (error) {
          console.error("Error processing Excel data:", error);
          setAppAlert({
            alert: true,
            type: "error",
            msg: "Error processing Excel data.",
          });
          setShowConfirmationExcel(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error handling Excel delete:", error);
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Error handling Excel delete.",
      });
      setShowConfirmationExcel(false);
    }
  };

  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
        <article className=" bg-white w-full h-max shadow-md rounded-sm border items-center">
          <Typography variant="h4" className="text-center mb-6 mt-2">
            Employee Offboarding
          </Typography>
          <p className="text-xs text-gray-600 text-center">
            Delete employee data here by using delete button.
          </p>

          <div className="p-4 border-b-[.5px] flex flex-col md:flex-row items-center justify-between gap-3 w-full border-gray-300">
            <div className="flex items-center gap-3 mb-3 md:mb-0 w-full md:w-auto">
              <TextField
                onChange={(e) => setNameSearch(e.target.value)}
                placeholder="Search Employee Name...."
                variant="outlined"
                size="small"
                sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
              />
            </div>
            <div className="flex items-center gap-3 mb-3 md:mb-0 w-full md:w-auto">
              <TextField
                onChange={(e) => setDeptSearch(e.target.value)}
                placeholder="Search Department Name...."
                variant="outlined"
                size="small"
                sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <TextField
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Search Location ...."
                variant="outlined"
                size="small"
                sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
              />
            </div>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-3 md:mb-0">
              <div className="flex-grow flex-shrink-0">
                <Tooltip
                  title={
                    <span>
                      To perform bulk deletion:
                      <ol>
                        <li>Generate an Excel file with employee data.</li>
                        <li>
                          Write "delete" in front of user IDs in the Excel
                          sheet.
                        </li>
                        <li>Save the file and upload it.</li>
                        <li>
                          Click on the delete button to execute bulk deletion.
                        </li>
                      </ol>
                    </span>
                  }
                  arrow
                >
                  <div>
                    <Button
                      className="w-full !font-semibold !bg-sky-500 flex items-center gap-2"
                      variant="contained"
                      onClick={handleMenuClick}
                    >
                      Bulk Delete
                    </Button>
                  </div>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={generateExcel}>
                    <GetApp style={{ color: "blue", marginRight: "10px" }} />{" "}
                    Generate Excel
                  </MenuItem>
                  <MenuItem>
                    <label
                      htmlFor="fileInput"
                      className="flex items-center gap-2"
                    >
                      <Publish
                        style={{ color: "green", marginRight: "10px" }}
                      />{" "}
                      <span>
                        {selectedFile ? selectedFile.name : "Choose File"}
                      </span>
                      <input
                        type="file"
                        accept=".xlsx, .xls"
                        id="fileInput"
                        className="w-full rounded opacity-0 absolute inset-0"
                        style={{ zIndex: -1 }}
                        onChange={handleFileInputChange}
                      />
                    </label>
                  </MenuItem>
                  <MenuItem onClick={() => setShowConfirmationExcel(true)}>
                    <Delete style={{ color: "red", marginRight: "10px" }} />{" "}
                    Delete
                  </MenuItem>
                </Menu>
              </div>

              {/* Delete Button */}
              <div className="flex-grow-0 flex-shrink-0">
                <Tooltip title="Check at least one checkbox to delete" arrow>
                  <div>
                    <Button
                      className="w-full !font-semibold !bg-sky-500 flex items-center gap-2"
                      variant="contained"
                      onClick={handleDeleteMultiple}
                    >
                      Delete
                    </Button>
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>

          <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
            <table className="min-w-full bg-white text-left !text-sm font-light">
              <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                <tr className="!font-semibold">
                  <th scope="col" className="!text-left pl-8 py-3">
                    Employee Selection
                  </th>
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
                    Location
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {availableEmployee
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
                    <tr className="!font-medium border-b" key={id}>
                      <td className="!text-left pl-8 py-3">
                        <Checkbox
                          checked={selectedEmployees.indexOf(item?._id) !== -1}
                          onChange={() => handleEmployeeSelection(item?._id)}
                        />
                      </td>
                      <td className="!text-left pl-8 py-3">{id + 1}</td>
                      <td className="py-3 pl-8">{item?.first_name}</td>
                      <td className="py-3 pl-8">{item?.last_name}</td>
                      <td className="py-3 pl-8">{item?.email}</td>
                      <td className="py-3 pl-8">{item?.empId}</td>
                      <td className="py-3 pl-8">
                        {item?.worklocation?.map((location, index) => (
                          <span key={index}>{location?.city}</span>
                        ))}
                      </td>
                      <td className="py-3 pl-8">
                        {item?.deptname?.map((dept, index) => {
                          return (
                            <span key={index}>{dept?.departmentName}</span>
                          );
                        })}
                      </td>
                      <td className="whitespace-nowrap px-6 py-2">
                        <IconButton
                          color="error"
                          aria-label="delete"
                          onClick={() => handleDeleteConfirmation(item?._id)}
                        >
                          <DeleteOutlineIcon />
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

      {/* this dialogue for deleting single employee */}
      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this employee, as this action
            cannot be undone.
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmation}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleDelete(deleteConfirmation)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* This Dialogue for delting Multiple Employe */}
      <Dialog
        open={deleteMultiEmpConfirmation}
        onClose={() => setDeleteMultiEmpConfirmation(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this selected employee, as
            this action cannot be undone.
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteMultiEmpConfirmation(false)}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={confirmDeleteMultiple}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* This Dialogue for delting Multiple Employe from excel sheet*/}
      <Dialog
        open={showConfirmationExcel}
        onClose={() => setShowConfirmationExcel(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this employee, as this action
            cannot be undone.
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowConfirmationExcel(false)}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleDeleteFromExcel}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteEmployee;
