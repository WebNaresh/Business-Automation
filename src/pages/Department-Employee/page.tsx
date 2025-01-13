import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Avatar
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

type Props = {};

const DepartmentEmployee = (props: Props) => {
  const [previewData, setPreviewData] = useState<Employee | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLTableRowElement | null>(null);
  const params = useParams<{
    organisationId: string;
    departmentId: string;
  }>();
  const { data: department_data } = useQuery({
    queryKey: [
      "department-employee",
      params.organisationId,
      params.departmentId,
    ],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/route/get-employee/from-department/${params.organisationId
        }/${params.departmentId}`
      );

      console.log(`🚀 ~ file: page.tsx:45 ~ response:`, response);

      return response.data.data;
    },
    initialData: [],
  });

  interface Employee {
    _id: string;
    first_name: string;
    last_name: string;
    designation: {
      _id: string;
      designationName: string;
    }[];
    email: string;
    phone_number: string;
  }

  interface MouseEvent {
    currentTarget: EventTarget & HTMLTableRowElement;
  }

  const handleMouseEnter = (event: MouseEvent, employee: Employee) => {
    setPreviewData(employee);
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setPreviewData(null);
    setAnchorEl(null);
  };

  const handleEditClick = (_id: string): void => {
    // Navigate to the edit employee page with the employee ID
    window.location.href = `/edit-employee/${_id}`;
  };

  return (
    <div className="w-full m-auto h-full">
      <div className="flex flex-col gap-4 p-6 items-start">
        <div className="w-full flex justify-between items-center">
          <div>
            <h4 className="text-2xl font-bold text-gray-800 mb-2">
              Manage Department Employee
            </h4>
            <Typography variant="body2" className="text-center text-gray-600">
              Manage and edit employee information in the department.
            </Typography>
          </div>
        </div>
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid #f1f5f9",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Profile",
                  "Full Name",
                  "Designation",
                  "Official Mail ID",
                  "Official Contact No",
                  "Actions",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      backgroundColor: "#f8fafc",
                      borderBottom: "2px solid #e2e8f0",
                      color: "#1e293b",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      padding: "16px 24px",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {department_data?.map((employee: Employee, id: number) => (
                <TableRow
                  key={id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                      "& .action-buttons": {
                        opacity: 1,
                      },
                    },
                    transition: "all 0.2s ease",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => handleMouseEnter(e, employee)}
                  onMouseLeave={handleMouseLeave}
                >
                  <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Avatar
                            src={"/default-avatar.png"}
                            alt={employee?.first_name || "Employee"}
                            sx={{ width: 40, height: 40 }}
                          />
                          
                        </Box>
                      </TableCell>
                  <TableCell
                    sx={{
                      padding: "16px 24px",
                      color: "#1e293b",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    {`${employee.first_name} ${employee.last_name}`}
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: "16px 24px",
                      color: "#64748b",
                      fontSize: "0.875rem",
                    }}
                  >
                    {employee.designation
                      .map((designation) => designation.designationName)
                      .join(", ")}
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: "16px 24px",
                      color: "#64748b",
                      fontSize: "0.875rem",
                    }}
                  >
                    {employee.email}
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: "16px 24px",
                      color: "#64748b",
                      fontSize: "0.875rem",
                    }}
                  >
                    {employee.phone_number}
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
                        onClick={() => handleEditClick(employee._id)}
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
      </div>
    </div>
  );
};

export default DepartmentEmployee;
