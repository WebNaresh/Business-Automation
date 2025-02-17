// export default Expense;
import React, { useContext, useState } from 'react';
import {
    Box,
    Select,
    MenuItem,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import CashInModel from './Components/CashInModel';
import CashOutModel from './Components/CashOutModel';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useMutation, useQuery } from 'react-query';
import { UseContext } from '../../State/UseState/UseContext';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import UpdateModel from './Components/UpdateModel';

const Expense = () => {
    const { organisationId } = useParams();
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const [category, setCategory] = useState('');
    const [timePeriod, setTimePeriod] = useState('all');
    const [openCashIn, setOpenCashInModel] = useState(false);
    const [openCashOut, setOpenCashOutModel] = useState(false);


    const handleCategoryChange = (event) => setCategory(event.target.value);
    const handleTimePeriodChange = (event) => setTimePeriod(event.target.value);

    console.log("category", category);
    console.log("timePeriod", timePeriod);

    // Fetch existing asset details
    const { isLoading, data, isError } = useQuery(
        ["expense", category, timePeriod],
        async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API}/route/get/get-all-data/${organisationId}?category=${category}&timePeriod=${timePeriod}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data.data;
        },
    );

    console.log("data", data);

    const handleOpenCashInModel = () => setOpenCashInModel(true);
    const handleCloseCashInModel = () => setOpenCashInModel(false);
    const handleOpenCashOutModel = () => setOpenCashOutModel(true);
    const handleCloseCashOutModel = () => setOpenCashOutModel(false);

    // Compute total cash in, cash out, and balance
    const totalCashIn = data?.reduce((sum, item) => {
        const cashIn = isNaN(Number(item.cashIn)) ? 0 : Number(item.cashIn);
        return sum + cashIn;
    }, 0) || 0;

    const totalCashOut = data?.reduce((sum, item) => {
        const cashOut = isNaN(Number(item.cashOut)) ? 0 : Number(item.cashOut);
        return sum + cashOut;
    }, 0) || 0;

    const balance = totalCashIn - totalCashOut;

    // for update
    const [updateData, setUpdateData] = useState(false);
    const [updateId, setUpdateId] = useState(null);

    const handleUpdateOpen = (ids) => {
        setUpdateData(true);
        setUpdateId(ids);
    };

    const handleCloseOpen = () => {
        setUpdateData(false);
    };

    // for delete
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);

    const handleDeleteConfirmation = (id) => {
        setDeleteConfirmation(id);
    };

    const handleCloseConfirmation = () => {
        setDeleteConfirmation(null);
    };

    const handleDelete = (id) => {
        deleteMutation.mutate(id);
        handleCloseConfirmation();
    };

    const deleteMutation = useMutation(
        (id) =>
            axios.delete(
                `${import.meta.env.VITE_API}/route/delete/${id}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            ),
        {
            onSuccess: () => {
                // Invalidate and refetch the data after successful deletion
                queryClient.invalidateQueries("expense");
                handleAlert(true, "success", "Data deleted successfully");
            },
            onError: () => {
                handleAlert(true, "error", "Failed to delete data.");
            },
        }
    );


    return (
        <div className="py-6 bg-gray-50 min-h-screen  mb-6 ml-10 mr-10">
            <article className="bg-white w-full h-max shadow-lg rounded-lg border">
                <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h4 className="text-2xl font-bold text-gray-800 mb-2">
                            Manage Expenses
                        </h4>
                        <Typography variant="body2" className="text-center text-gray-600">
                            Manage and edit the expenses.
                        </Typography>
                    </div>
                </div>
                <Box p={3}>
                    {/* Header Section */}
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-around"
                        mb={4}
                        flexWrap="wrap"
                        gap={3}
                        sx={{ backgroundColor: '#3E3E3E', p: 2 }} // Background color applied here
                    >

                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography sx={{ color: "white", fontSize: "14px", minWidth: "100px" }}>
                                Select Period:
                            </Typography>
                            <FormControl sx={{ minWidth: 200, height: "36px" }}>
                                <Select
                                    value={timePeriod}
                                    onChange={handleTimePeriodChange}
                                    sx={{
                                        color: 'white',
                                        backgroundColor: '#555',
                                        height: "36px",
                                        fontSize: "14px",
                                        '& .MuiOutlinedInput-root': {
                                            height: "36px",
                                            minHeight: "36px",
                                            padding: "4px 10px",
                                            '& fieldset': {
                                                borderColor: '#777',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#aaa',
                                            },
                                            '& .MuiSelect-select': {
                                                padding: "4px 10px",
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="weekly" sx={{ fontSize: "14px", padding: "4px 10px", minHeight: "32px" }}>Weekly</MenuItem>
                                    <MenuItem value="monthly" sx={{ fontSize: "14px", padding: "4px 10px", minHeight: "32px" }}>Monthly</MenuItem>
                                    <MenuItem value="yearly" sx={{ fontSize: "14px", padding: "4px 10px", minHeight: "32px" }}>Yearly</MenuItem>
                                    <MenuItem value="all" sx={{ fontSize: "14px", padding: "4px 10px", minHeight: "32px" }}>All</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>



                        <FormControl sx={{ minWidth: 250, height: "36px" }}>
                            <InputLabel id="category-label" sx={{ color: 'white', fontSize: "14px", top: "-6px" }}>Type</InputLabel>
                            <Select
                                labelId="category-label"
                                value={category}
                                onChange={handleCategoryChange}
                                label="Type"
                                sx={{
                                    color: 'white',
                                    backgroundColor: '#555',
                                    height: "36px", // Reduced height
                                    fontSize: "14px", // Smaller text
                                    '& .MuiOutlinedInput-root': {
                                        height: "36px", // Ensure consistent height
                                        minHeight: "36px",
                                        padding: "4px 10px", // Adjust padding for a compact look
                                        '& fieldset': {
                                            borderColor: '#777',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#aaa',
                                        },
                                        '& .MuiSelect-select': {
                                            padding: "4px 10px", // Reduce padding inside select
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="personal" sx={{ fontSize: "14px", padding: "4px 10px", minHeight: "32px" }}>Personal</MenuItem>
                                <MenuItem value="official" sx={{ fontSize: "14px", padding: "4px 10px", minHeight: "32px" }}>Official</MenuItem>
                            </Select>
                        </FormControl>


                        <Box display="flex" gap={2}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleOpenCashInModel}
                                sx={{ height: "35px", minHeight: "35px", padding: "4px 12px", fontSize: "14px" }}
                            >
                                Cash In
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleOpenCashOutModel}
                                sx={{ height: "35px", minHeight: "35px", padding: "4px 12px", fontSize: "14px" }}
                            >
                                Cash Out
                            </Button>
                        </Box>

                        <Box display="flex" gap={2}>
                            <Button variant="contained" color="info" sx={{ height: "35px", minHeight: "35px", padding: "4px 12px", fontSize: "14px" }}>
                                Import
                            </Button>
                            <Button variant="contained" color="warning" sx={{ height: "35px", minHeight: "35px", padding: "4px 12px", fontSize: "14px" }}>
                                Export
                            </Button>
                        </Box>
                    </Box>

                    {/* Table Section */}
                    <div
                        style={{
                            maxHeight: "50vh",
                            overflowY: "auto",
                            paddingRight: "10px",
                        }}
                    >
                        <TableContainer component={Paper} sx={{ mb: 3, maxHeight: "500px", overflow: "auto" }}>
                            <Table stickyHeader>
                                <TableHead sx={{ position: "sticky", top: 0, backgroundColor: "#f3f4f6", zIndex: 1000 }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: "#f3f4f6" }}>Sr No</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: "#f3f4f6" }}>Date</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: "#f3f4f6" }}>Time</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: "#f3f4f6" }}>Note</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: "#f3f4f6" }}>Type</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: "#f3f4f6" }}>Cash In</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: "#f3f4f6" }}>Cash Out</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: "#f3f4f6" }}>Balance</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: "#f3f4f6" }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={9} align="center">Loading...</TableCell>
                                        </TableRow>
                                    ) : isError ? (
                                        <TableRow>
                                            <TableCell colSpan={9} align="center" color="error">Error fetching data.</TableCell>
                                        </TableRow>
                                    ) : (
                                        data && data.map((item, id) => (
                                            <TableRow
                                                key={item.id}
                                                sx={{
                                                    height: "40px", // Set the row height
                                                    backgroundColor: item.id % 2 === 0 ? '#ffffff' : '#f9fafb',
                                                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                                                }}
                                            >
                                                <TableCell sx={{ padding: "4px 8px" }}>{id + 1}</TableCell>
                                                <TableCell sx={{ padding: "4px 8px" }}>
                                                    {new Date(item?.transactionDate).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </TableCell>
                                                <TableCell sx={{ padding: "4px 8px" }}>
                                                    {new Date(item?.transactionTime).toLocaleTimeString(undefined, {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit',
                                                    })}
                                                </TableCell>
                                                <TableCell sx={{ padding: "4px 8px" }}>{item?.note}</TableCell>
                                                <TableCell sx={{ padding: "4px 8px" }}>{item.transactionCategory}</TableCell>
                                                <TableCell sx={{ padding: "4px 8px" }}>{item.cashIn}</TableCell>
                                                <TableCell sx={{ padding: "4px 8px" }}>{item.cashOut}</TableCell>
                                                <TableCell sx={{ padding: "4px 8px" }}>{item.balance}</TableCell>
                                                <TableCell sx={{ padding: "4px 8px" }}>
                                                    <IconButton
                                                        color="primary"
                                                        aria-label="edit"
                                                        onClick={() => handleUpdateOpen(item?._id)}
                                                        sx={{ padding: "2px" }} // Reduce padding for a smaller button
                                                    >
                                                        <EditOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        color="error"
                                                        aria-label="delete"
                                                        onClick={() => handleDeleteConfirmation(item?._id)}
                                                        sx={{ padding: "2px" }}
                                                    >
                                                        <DeleteOutlineIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>

                            </Table>
                        </TableContainer>
                    </div>


                    {/* Summary Section */}
                    <Grid
                        container
                        spacing={4}
                        sx={{
                            position: 'static', // Keeps the position static
                            zIndex: 1, // Ensures it stays above any other content if needed
                        }}
                    >
                        <Grid item xs={12} sm={6} md={4}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    textAlign: 'center',
                                    borderRadius: 3,
                                    backgroundColor: '#d1fae5', // Light green
                                }}
                            >
                                <Typography variant="h6" color="textPrimary" gutterBottom>
                                    Total Cash In
                                </Typography>
                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                    color="success.main"
                                >
                                    {totalCashIn?.toLocaleString('en-IN', {
                                        style: 'currency',
                                        currency: 'INR',
                                    }) || '₹0'}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    textAlign: 'center',
                                    borderRadius: 3,
                                    backgroundColor: '#ffe4e6', // Light red
                                }}
                            >
                                <Typography variant="h6" color="textPrimary" gutterBottom>
                                    Total Cash Out
                                </Typography>
                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                    color="error.main"
                                >
                                    {totalCashOut?.toLocaleString('en-IN', {
                                        style: 'currency',
                                        currency: 'INR',
                                    }) || '₹0'}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    textAlign: 'center',
                                    borderRadius: 3,
                                    backgroundColor: '#fef3c7', // Light yellow
                                }}
                            >
                                <Typography variant="h6" color="textPrimary" gutterBottom>
                                    Balance
                                </Typography>
                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                    color="warning.main"
                                >
                                    {balance?.toLocaleString('en-IN', {
                                        style: 'currency',
                                        currency: 'INR',
                                    }) || '₹0'}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>


                    <Dialog
                        open={deleteConfirmation !== null}
                        onClose={handleCloseConfirmation}
                    >
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogContent>
                            <p>
                                Please confirm your decision to delete this employement type, as
                                this action cannot be undone.
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
                </Box>
            </article>

            {/* Cash In Model */}
            <CashInModel
                open={openCashIn}
                handleClose={handleCloseCashInModel}
                organisationId={organisationId}
            />

            {/* Cash Out Model */}
            <CashOutModel
                open={openCashOut}
                handleClose={handleCloseCashOutModel}
                organisationId={organisationId}
            />

            {/* Update Model */}
            <UpdateModel
                open={updateData}
                handleClose={handleCloseOpen}
                id={updateId}
                organisationId={organisationId}
            />
        </div>
    );
};

export default Expense;
