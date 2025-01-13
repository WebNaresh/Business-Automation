import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
    Grid,
    Box,
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
    FormControl, InputLabel, Select, MenuItem, Avatar
} from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { UseContext } from "../../State/UseState/UseContext";
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // If you're using the autotable plugin
import useEmpOption from "../../hooks/Employee-OnBoarding/useEmpOption";
import { Card, CardContent, CardActions, } from "@mui/material";

const DisplayEmpCard = () => {
    const navigate = useNavigate();
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const [nameSearch, setNameSearch] = useState("");
    const [availableEmployee, setAvailableEmployee] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [department, setDepartment] = useState("");
    const { organisationId } = useParams();

    const {
        Departmentoptions,
    } = useEmpOption({ organisationId });

    const fetchAvailableEmployee = async (page) => {
        try {
            const apiUrl = `${import.meta.env.VITE_API}/route/employee/get-paginated-emloyee/${organisationId}?page=${page}&department=${department}`;
            console.log("apiUrl", apiUrl);
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
    }, [currentPage, nameSearch, department]);

    console.log("available emp", availableEmployee);


    const prePage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const nextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const changePage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Define the handler function
    const handleDepartmentChange = (e) => {
        setDepartment(e.target.value);
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

    const handleGridViewClick = () => {
        navigate(`/organisation/${organisationId}/display-emp-card`);
    };

    const handleTableViewClick = () => {
        navigate(`/organisation/${organisationId}/employee-list`);
    };


    // 📊 Handle Export to Excel
    const handleExportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            availableEmployee.map((item, index) => ({
                "Sr. No": index + 1,
                "First Name": item.first_name || "-",
                "Last Name": item.last_name || "-",
                Email: item.email || "-",
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
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        {/* Search Bar */}
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
                                value={department}
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

                        {/* Grid/List Toggle Button */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                                border: "1px solid #e5e7eb",
                                borderRadius: "6px",
                                overflow: "hidden",
                            }}
                        >
                            <IconButton
                                sx={{
                                    backgroundColor: "transparent",
                                    "&:hover": { backgroundColor: "#e2e8f0" },
                                    width: "50%",
                                    borderRadius: 0,
                                    padding: "8px",
                                }}
                                onClick={handleTableViewClick}
                            >
                                <PrintIcon sx={{
                                    color: "#64748b",
                                    fontSize: "20px"
                                }} />
                            </IconButton>
                            <IconButton
                                sx={{
                                    backgroundColor: "transparent",
                                    "&:hover": { backgroundColor: "#e2e8f0" },
                                    width: "50%",
                                    borderRadius: 0,
                                    padding: "8px",
                                }}
                                onClick={handleGridViewClick}
                            >
                                <PrintIcon sx={{
                                    color: "#64748b",
                                    fontSize: "20px"
                                }} />
                            </IconButton>
                        </Box>

                        {/* Export PDF Button */}
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<PrintIcon />}
                            sx={{
                                backgroundColor: "#d32f2f",
                                "&:hover": { backgroundColor: "#b71c1c" },
                                textTransform: "none",
                                width: "100%",
                            }}
                            onClick={handleExportToPDF}
                        >
                            Export PDF
                        </Button>

                        {/* Export Excel Button */}
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<PrintIcon />}
                            sx={{
                                backgroundColor: "#388e3c",
                                "&:hover": { backgroundColor: "#2e7d32" },
                                textTransform: "none",
                                width: "100%",
                            }}
                            onClick={handleExportToExcel}
                        >
                            Export Excel
                        </Button>


                    </div>
                </div>
                <Grid container spacing={2} >
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
                                <Grid item xs={12} sm={4} md={4} key={id}>
                                    <Card
                                        sx={{
                                            marginTop: "20px",
                                            display: "flex",
                                            flexDirection: "column",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Added shadow effect
                                            borderRadius: "8px",
                                            border: "1px solid #e5e7eb", // Border around the card
                                            transition: "transform 0.3s, box-shadow 0.3s", // Smooth transition for hover effect
                                            "&:hover": {
                                                boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)", // Darker shadow on hover
                                                transform: "translateY(-5px)", // Lift the card slightly on hover
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Avatar
                                                src={item?.photoUrl || "/default-avatar.png"}
                                                alt={item?.first_name || "Employee"}
                                                sx={{
                                                    width: 50,
                                                    height: 50,
                                                    bgcolor: item?.photoUrl ? 'transparent' : '#9ca3af', // Fallback color when the image is missing
                                                    backgroundColor: item?.photoUrl ? 'transparent' : `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color fallback
                                                }}
                                            >
                                                {!item?.photoUrl && item?.first_name?.charAt(0).toUpperCase()}  {/* Show the first letter of the name when no image */}
                                            </Avatar>

                                            <Box>
                                                <Typography variant="h6">
                                                    {`${item?.first_name ?? ""} ${item?.last_name ?? ""}`.trim() || "-"}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {item?.email}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Employee Id: {item?.empId}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Location: {item?.worklocation?.map((location) => location?.city).join(", ") || "-"}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Department: {item?.deptname?.map((dept) => dept?.departmentName).join(", ") || "-"}
                                                </Typography>
                                            </Box>
                                        </CardContent>

                                        <CardActions sx={{ paddingLeft: 2 }}>
                                            <Box sx={{ display: "flex", gap: 2 }}>
                                                <IconButton
                                                    onClick={() => handleViewClick(item._id)}
                                                    sx={{
                                                        backgroundColor: "#f1f5f9",
                                                        "&:hover": { backgroundColor: "#e2e8f0" },
                                                    }}
                                                    size="small"
                                                >
                                                    <VisibilityIcon sx={{ fontSize: "1.25rem", color: "#0ea5e9" }} />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleEditClick(item._id)}
                                                    sx={{
                                                        backgroundColor: "#f1f5f9",
                                                        "&:hover": { backgroundColor: "#e2e8f0" },
                                                    }}
                                                    size="small"
                                                >
                                                    <EditIcon sx={{ fontSize: "1.25rem", color: "#6366f1" }} />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleDeleteClick(item._id)}
                                                    sx={{
                                                        backgroundColor: "#f1f5f9",
                                                        "&:hover": { backgroundColor: "#fee2e2" },
                                                    }}
                                                    size="small"
                                                >
                                                    <DeleteIcon sx={{ fontSize: "1.25rem", color: "#ef4444" }} />
                                                </IconButton>
                                            </Box>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                </Grid>


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

export default DisplayEmpCard;
