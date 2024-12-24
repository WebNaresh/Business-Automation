import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UseContext } from "../../../State/UseState/UseContext";
import useGetUser from "../../../hooks/Token/useUser";
import UserProfile from "../../../hooks/UserData/useUser";

const DataTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [data1, setData1] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [managerArray, setManagerArray] = useState([]);
  const [initialEmployeeData, setInitialEmployeeData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState("");
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  const [selectedMDocId, setSelectedMDocId] = useState("");
  const [managerIds, setManagerIds] = useState([]);
  const [showManagerSelect, setShowManagerSelect] = useState(false); // State to track checkbox status
  const { setAppAlert } = useContext(UseContext);
  const [selectAll, setSelectAll] = useState(false);
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const authToken = useGetUser().authToken;

  const handleSelectAllClick = async (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);

    if (checked) {
      const allEmployeeIds = employeeData.map((employee) => employee._id);
      setSelectedEmployeeIds(allEmployeeIds);

      try {
        const managerIdPromises = allEmployeeIds.map(async (empId) => {
          try {
            const managerResponse = await axios.get(
              `${import.meta.env.VITE_API}/route/org/getManager/${empId}`,
              {
                headers: {
                  Authorization: authToken,
                },
              }
            );
            return managerResponse.data.id;
          } catch (error) {
            console.error("Error fetching manager for employee", empId, error);
            return null;
          }
        });

        const managerIds = await Promise.all(managerIdPromises);
        console.log("Manager IDs for selected employees:", managerIds);

        setManagerIds(managerIds);
      } catch (error) {
        console.error("Error fetching manager IDs:", error);
      }
    } else {
      setSelectedEmployeeIds([]);
      setManagerIds([]);
    }
  };

  useEffect(() => {
    console.log(selectedEmployeeIds);
    console.log(managerIds);
    // eslint-disable-next-line
  }, [selectedEmployeeIds]);

  const handleEmployeeSelection = async (event, id) => {
    const selectedIndex = selectedEmployeeIds.indexOf(id);
    let newSelected = [...selectedEmployeeIds];

    if (selectedIndex === -1) {
      newSelected.push(id);
    } else {
      newSelected.splice(selectedIndex, 1);
    }

    setSelectedEmployeeIds(newSelected);
    setSelectAll(newSelected.length === employeeData.length);
    console.log("Selected Employee IDs:", newSelected);

    try {
      const managerIdPromises = newSelected.map(async (empId) => {
        try {
          const managerResponse = await axios.get(
            `${import.meta.env.VITE_API}/route/org/getManager/${empId}`,
            {
              headers: {
                Authorization: authToken,
              },
            }
          );
          return managerResponse.data.id;
        } catch (error) {
          console.error("Error fetching manager for employee", empId, error);
          return null;
        }
      });

      const managerIds = await Promise.all(managerIdPromises);
      console.log("Manager IDs for selected employees:", managerIds);

      setManagerIds(managerIds);
    } catch (error) {
      console.error("Error fetching manager IDs:", error);
    }
  };

  const isSelected = (id) => selectedEmployeeIds.indexOf(id) !== -1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (role === "HR") {
          response = await axios.get(
            `${import.meta.env.VITE_API}/route/organization/getOneOrgHr`,
            {
              headers: { Authorization: authToken },
            }
          );
          setData1(response.data.orgData);
        }
        response = await axios.get(
          `${import.meta.env.VITE_API}/route/organization/getall`,
          {
            headers: { Authorization: authToken },
          }
        );
        setData1(response.data.orgData);
      } catch (error) {
        console.error("Error fetching organizations: ", error);
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, [authToken]);

  console.log("this is the data1", data1);

  useEffect(() => {
    (async () => {
      const resp = await axios.get(
        `${import.meta.env.VITE_API}/route/org/getmanagers`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log("manager", resp.data.filteredManagers);
      setManagerArray(resp.data.filteredManagers);
    })();
    // eslint-disable-next-line
  }, []);

  const fetchEmployees = async (orgId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/route/employee/get/${orgId}`,
        {
          headers: { Authorization: authToken },
        }
      );
      setEmployeeData(response.data.employees);
      setInitialEmployeeData(response.data.employees);
    } catch (error) {
      console.error("Error fetching employees: ", error);
    }
  };

  const fetchDepartments = async (orgId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/route/department/getall/${orgId}`,
        {
          headers: { Authorization: authToken },
        }
      );
      setDepartments(response.data.getOrgs);
    } catch (error) {
      console.error("Error fetching departments: ", error);
    }
  };

  useEffect(() => {
    if (selectedOrganizationId) {
      fetchEmployees(selectedOrganizationId);
      fetchDepartments(selectedOrganizationId);
    }

    // eslint-disable-next-line
  }, [selectedOrganizationId, authToken]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/route/org/getdocs`,
          {
            headers: { Authorization: authToken },
          }
        );
        setDocuments(response.data.doc);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchDocuments();
  }, [authToken]);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredEmployees = initialEmployeeData.filter((employee) => {
      return (
        employee.first_name.toLowerCase().includes(query) ||
        employee.last_name.toLowerCase().includes(query)
      );
    });
    setEmployeeData(filteredEmployees);
  };

  const handleOrganizationChange = (event) => {
    const orgId = event.target.value;
    setSelectedOrganizationId(orgId);
    fetchDepartments(orgId);
    setSelectedDepartmentId("");
  };

  const handleDepartmentChange = (event) => {
    const deptId = event.target.value;
    setSelectedDepartmentId(deptId);
    const filteredEmployees = initialEmployeeData.filter((employee) => {
      return employee.deptname[0] === deptId;
    });
    setEmployeeData(filteredEmployees);
  };

  const handleDocumentChange = (event) => {
    const docId = event.target.value;
    setSelectedDocumentId(docId);
    console.log("Selected Document ID:", docId);
  };
  const handleDocumentChange2 = (event) => {
    const mDocId = event.target.value;
    setSelectedMDocId(mDocId);
    console.log("Selected MDocument ID:", mDocId);
    setEmployeeData(managerArray[mDocId].reporteeIds);
  };

  const handleSendButtonClick = async () => {
    try {
      const employeeIds = selectedEmployeeIds.map((id) => {
        const managerId = managerIds[selectedEmployeeIds.indexOf(id)];
        return {
          empId: id,
          mId: managerId ? managerId : null,
          status: managerId ? false : true,
        };
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API}/route/org/updatearr/${selectedDocumentId}`,
        {
          employeeId: employeeIds,
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(response);
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Document is sent successfully",
      });
    } catch (error) {
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Please select the document first",
      });
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div className="flex gap-4">
        <FormControl size="small" style={{ width: 200 }}>
          <FormControlLabel
            className="!text-xs"
            control={
              <Checkbox
                checked={showManagerSelect}
                onChange={() => setShowManagerSelect(!showManagerSelect)}
                color="primary"
              />
            }
            label="Downcast"
          />
        </FormControl>

        {data1.length > 0 && (
          <FormControl size="small" style={{ width: 200 }}>
            <InputLabel id="organization-label">Select Organization</InputLabel>
            <Select
              label="Select organization"
              name="type"
              onChange={handleOrganizationChange}
            >
              {data1.map((org) => (
                <MenuItem key={org._id} value={org._id}>
                  {org.orgName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <FormControl size="small" style={{ width: 200 }}>
          <InputLabel id="department-label">Select Department</InputLabel>
          <Select
            label="Select department"
            name="type"
            onChange={handleDepartmentChange}
            value={selectedDepartmentId}
          >
            {departments.length === 0 ? (
              <MenuItem value="">No Departments Found</MenuItem>
            ) : (
              departments.map((dept) => (
                <MenuItem key={dept._id} value={dept._id}>
                  {dept.departmentName}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <TextField
          label="Search Employee"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
        />

        {/* Select field for documents */}
        <FormControl size="small" style={{ width: 200 }}>
          <InputLabel id="document-label">Select Document</InputLabel>
          <Select
            label="Select document"
            name="document"
            onChange={handleDocumentChange}
            value={selectedDocumentId}
          >
            {documents.map((doc) => (
              <MenuItem key={doc._id} value={doc._id}>
                {doc.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {showManagerSelect && (
          <FormControl size="small" style={{ width: 200 }}>
            <InputLabel id="document-label">Select Manager</InputLabel>
            <Select
              label="Select Manager"
              name="document"
              onChange={handleDocumentChange2}
              value={selectedMDocId}
            >
              {managerArray?.map((doc, idx) => (
                <MenuItem key={doc._id} value={idx}>
                  {doc.managerId?.first_name &&
                    doc.managerId?.last_name &&
                    doc.managerId?.first_name + " " + doc.managerId?.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>
      <div style={{ width: "100%", overflowY: "auto", maxHeight: "450px" }}>
        {employeeData.length === 0 ? (
          <p className="text-center font-semibold">no employee available</p>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectAll}
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  <TableCell>Sr.No</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employeeData.map((employee, idx) => {
                  const isItemSelected = isSelected(employee._id);
                  return (
                    <TableRow
                      key={employee._id}
                      hover
                      onClick={(event) =>
                        handleEmployeeSelection(event, employee._id)
                      }
                      role="checkbox"
                      aria-checked={isItemSelected}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} />
                      </TableCell>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{employee.first_name}</TableCell>
                      <TableCell>{employee.last_name}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <div style={{ position: "absolute", bottom: -30, width: "100%" }}>
          {employeeData.length === 0 ? (
            ""
          ) : (
            <Button
              size="small"
              onClick={handleSendButtonClick}
              variant="contained"
              style={{ float: "left" }}
            >
              Send
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTable;
