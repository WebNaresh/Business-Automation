import { Warning } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Zoom,
} from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";

const DepartmentList = () => {
  // to define the state, import the funciton ,
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams();
  const queryClient = useQueryClient();
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const navigate = useNavigate();
  const [previewData, setPreviewData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  // fetch department list
  const fetchDepartmentList = async () => {
    try {
      const response = await axios.get(
        // `${import.meta.env.VITE_API}/route/department/get/${organisationId}`,
        `${import.meta.env.VITE_API}/route/department/get/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.departments;
    } catch (error) {
      console.error(error);
    }
  };

  const { data: deptList, isLoading } = useQuery(
    "department",
    fetchDepartmentList
  );
  console.log(`🚀 ~ file: DepartmentList.jsx:62 ~ deptList:`, deptList);

  // for edit
  // to navigate to other component
  const handleEditClick = (deptId) => {
    navigate(`/organisation/${organisationId}/edit-department/${deptId}`);
  };

  // Add this handler function
  const handleViewClick = (deptId) => {
    navigate(`/organisation/${organisationId}/view-department/${deptId}`);
  };

  // Add this handler function
  const handleAddDepartment = () => {
    navigate(`/organisation/${organisationId}/add-department`);
  };

  // Delete Query for deleting Single Department
  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    queryClient.invalidateQueries("department");
    setDeleteConfirmation(null);
  };

  const deleteMutation = useMutation(
    (id) =>
      axios.delete(
        `${
          import.meta.env.VITE_API
        }/route/department/delete/${organisationId}/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        // Invalidate and refetch the data after successful deletion
        queryClient.invalidateQueries("department");
        handleAlert(true, "success", "Department deleted succesfully");
      },
    }
  );

  const handleMouseEnter = (event, department) => {
    setPreviewData(department);
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setPreviewData(null);
    setAnchorEl(null);
  };

  const DepartmentPreview = () => (
    <Box
      sx={{
        position: "absolute",
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "16px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        minWidth: "200px",
        zIndex: 1000,
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
        {previewData?.departmentName}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Location: {previewData?.departmentLocation?.city || "Not specified"}
      </Typography>
    </Box>
  );

  const TableRowSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton animation="wave" width={30} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" width={200} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" width={150} />
      </TableCell>
      <TableCell>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Skeleton
            animation="wave"
            variant="circular"
            width={30}
            height={30}
          />
          <Skeleton
            animation="wave"
            variant="circular"
            width={30}
            height={30}
          />
          <Skeleton
            animation="wave"
            variant="circular"
            width={30}
            height={30}
          />
        </Box>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {isLoading ? (
        <div className="w-full m-auto h-full">
          <div className="flex flex-col gap-4 p-6 items-start">
            <div className="w-full flex justify-between items-center">
              <div>
                <Skeleton animation="wave" width={250} height={40} />
                <Skeleton animation="wave" width={200} height={20} />
              </div>
              <Skeleton animation="wave" width={150} height={40} />
            </div>
            <TableContainer
              component={Paper}
              sx={{
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
              }}
            >
              <Table sx={{ minWidth: 650 }} className="border">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                    <TableCell>Sr. No</TableCell>
                    <TableCell>Department Name</TableCell>
                    <TableCell>Department Location</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...Array(5)].map((_, index) => (
                    <TableRowSkeleton key={index} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      ) : (
        <>
          {!isLoading && deptList?.length === 0 ? (
            <div className="w-full h-full">
              <Typography
                variant="h5"
                className="text-center !mt-5 text-red-600"
              >
                <Warning />{" "}
                <span className="!mt-3">
                  {" "}
                  No departments added, please add department first.
                </span>
              </Typography>
            </div>
          ) : (
            <div className="w-full m-auto h-full">
              <div className="flex flex-col gap-4 p-6 items-start">
                <div className="w-full flex justify-between items-center">
                  <div>
                    <Typography
                      variant="h4"
                      sx={{
                        textAlign: "center",
                        marginBottom: "8px",
                        fontWeight: 600,
                        color: "#1F2937", // Dark gray color
                      }}
                    >
                      Manage Department
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6B7280", // Medium gray color
                      }}
                    >
                      Manage your departments here.
                    </Typography>
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddDepartment}
                    sx={{
                      textTransform: "none",
                      borderRadius: "8px",
                      boxShadow: "none",
                    }}
                  >
                    Add Department
                  </Button>
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
                          "Sr. No",
                          "Department Name",
                          "Count of Department",
                          "Department Location",
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
                      {deptList?.map((department, id) => (
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
                          onMouseEnter={(e) => handleMouseEnter(e, department)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <TableCell
                            sx={{
                              padding: "16px 24px",
                              color: "#64748b",
                              fontSize: "0.875rem",
                            }}
                          >
                            {id + 1}
                          </TableCell>
                          <TableCell
                            sx={{
                              padding: "16px 24px",
                              color: "#1e293b",
                              fontSize: "0.875rem",
                              fontWeight: 500,
                            }}
                          >
                            {department?.departmentName || ""}
                          </TableCell>

                          <TableCell
                            sx={{
                              padding: "16px 24px",
                              color: "#64748b",
                              fontSize: "0.875rem",
                            }}
                          >
                            {department?.employeeCount || 0}
                          </TableCell>
                          <TableCell
                            sx={{
                              padding: "16px 24px",
                              color: "#64748b",
                              fontSize: "0.875rem",
                            }}
                          >
                            {department?.departmentLocation?.city || ""}
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
                                onClick={() => handleViewClick(department._id)}
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
                                onClick={() => handleEditClick(department._id)}
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
                                onClick={() =>
                                  handleDeleteConfirmation(department?._id)
                                }
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
          )}
        </>
      )}
      {/* this dialogue for deleting single department*/}
      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: "12px",
            padding: "8px",
            maxWidth: "400px",
          },
        }}
        TransitionComponent={Zoom}
      >
        <DialogTitle
          id="delete-dialog-title"
          sx={{
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#1F2937",
            pb: 1,
          }}
        >
          Delete Department
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Typography
            id="delete-dialog-description"
            sx={{
              color: "#4B5563",
              fontSize: "0.95rem",
              lineHeight: 1.5,
            }}
          >
            Are you sure you want to delete this department? This action cannot
            be undone and all associated data will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button
            onClick={handleCloseConfirmation}
            variant="outlined"
            sx={{
              textTransform: "none",
              borderRadius: "6px",
              mr: 1,
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(deleteConfirmation)}
            variant="contained"
            color="error"
            sx={{
              textTransform: "none",
              borderRadius: "6px",
              px: 3,
              "&:hover": {
                backgroundColor: "#DC2626",
              },
            }}
          >
            Delete Department
          </Button>
        </DialogActions>
      </Dialog>
      {previewData && anchorEl && (
        <Zoom in={Boolean(previewData)}>
          <div
            style={{
              position: "fixed",
              left: anchorEl.getBoundingClientRect().right + 10,
              top: anchorEl.getBoundingClientRect().top,
            }}
          >
            <DepartmentPreview />
          </div>
        </Zoom>
      )}
    </>
  );
};

export default DepartmentList;
