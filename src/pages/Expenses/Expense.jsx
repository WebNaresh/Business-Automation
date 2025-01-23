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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handleCategoryChange = (event) => setCategory(event.target.value);
    const handleTimePeriodChange = (event) => setTimePeriod(event.target.value);

    console.log("category", category);
    console.log("timePeriod", timePeriod);

    // Fetch existing asset details
    const { isLoading, data, isError } = useQuery(
        ["expense"],
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


    //  pagination
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




    return (
        <div className="py-6 bg-gray-50 min-h-screen mt-4 mb-6 ml-10 mr-10">
            <article className="bg-white w-full h-max shadow-lg rounded-lg border">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
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
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                        <FormControl sx={{ width: 200 }}>
                            <InputLabel id="time-period-label">Select Period</InputLabel>
                            <Select
                                labelId="time-period-label"
                                value={timePeriod}
                                onChange={handleTimePeriodChange}
                                label="Select Period"
                            >
                                <MenuItem value="weekly">Weekly</MenuItem>
                                <MenuItem value="monthly">Monthly</MenuItem>
                                <MenuItem value="yearly">Yearly</MenuItem>
                                <MenuItem value="all">All</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl sx={{ width: 200 }}>
                            <InputLabel id="category-label">Type</InputLabel>
                            <Select
                                labelId="category-label"
                                value={category}
                                onChange={handleCategoryChange}
                                label="Type"
                            >
                                <MenuItem value="personal">Personal</MenuItem>
                                <MenuItem value="official">Official</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Buttons */}
                        <Box>
                            <Button
                                variant="contained"
                                color="success"
                                sx={{ mr: 2 }}
                                onClick={handleOpenCashInModel}
                            >
                                Cash In
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleOpenCashOutModel}
                            >
                                Cash Out
                            </Button>
                        </Box>

                        <Box>
                            <Button variant="contained" color="info" sx={{ mr: 2 }}>
                                Import
                            </Button>
                            <Button variant="contained" color="warning">
                                Export
                            </Button>
                        </Box>
                    </Box>

                    {/* Table Section */}
                    <TableContainer component={Paper} sx={{ mb: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Sr No</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Note</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Cash In</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Cash Out</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Balance</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : isError ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" color="error">
                                            Error fetching data.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data && data.map((item, id) => (
                                        <TableRow
                                            key={item.id}
                                            sx={{
                                                backgroundColor: item.id % 2 === 0 ? '#ffffff' : '#f9fafb',
                                                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                                            }}
                                        >
                                            <TableCell>{id + 1}</TableCell>
                                            <TableCell>
                                                {new Date(item?.transactionDate).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(item?.transactionTime).toLocaleTimeString(undefined, {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                })}
                                            </TableCell>
                                            <TableCell>{item?.note}</TableCell>
                                            <TableCell>{item.transactionCategory}</TableCell>
                                            <TableCell>{item.cashIn}</TableCell>
                                            <TableCell>{item.cashOut}</TableCell>
                                            <TableCell>{item.balance}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    color="primary"
                                                    aria-label="edit"
                                                    onClick={() => handleUpdateOpen(item?._id)}
                                                >
                                                    <EditOutlinedIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    aria-label="delete"
                                                    onClick={() => handleDeleteConfirmation(item?._id)}
                                                >
                                                    <DeleteOutlineIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
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

                    {/* Summary Section */}
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    textAlign: 'center',
                                    borderRadius: 2,
                                    bgcolor: 'success.light',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Total Cash In
                                </Typography>
                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
                                >
                                    {totalCashIn?.toLocaleString('en-IN', {
                                        style: 'currency',
                                        currency: 'INR',
                                    }) || '₹0'}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    textAlign: 'center',
                                    borderRadius: 2,
                                    bgcolor: 'error.light',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Total Cash Out
                                </Typography>
                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
                                >
                                    {totalCashOut?.toLocaleString('en-IN', {
                                        style: 'currency',
                                        currency: 'INR',
                                    }) || '₹0'}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    textAlign: 'center',
                                    borderRadius: 2,
                                    bgcolor: 'orange',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Balance
                                </Typography>
                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
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
