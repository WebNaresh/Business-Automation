import React, { useState } from 'react';
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
} from '@mui/material';
import CashInModel from './Components/CashInModel';
import CashOutModel from './Components/CashOutModel';
import { useParams } from 'react-router-dom';

const Expense = () => {
    // Temporary mock data
    const mockData = [
        {
            id: 1,
            date: '2025-01-22',
            note: 'Office Supplies',
            fileAttachment: 'office-supplies.pdf',
            cashInAmount: 500,
            cashOutAmount: 200,
        },
        {
            id: 2,
            date: '2025-01-21',
            note: 'Project Payment',
            fileAttachment: 'project-payment.pdf',
            cashInAmount: 1000,
            cashOutAmount: 0,
        },
        {
            id: 3,
            date: '2025-01-20',
            note: 'Travel Expense',
            fileAttachment: 'travel-expense.pdf',
            cashInAmount: 0,
            cashOutAmount: 300,
        },
        {
            id: 4,
            date: '2025-01-20',
            note: 'Travel Expense',
            fileAttachment: 'travel-expense.pdf',
            cashInAmount: 0,
            cashOutAmount: 300,
        },
        {
            id: 5,
            date: '2025-01-20',
            note: 'Travel Expense',
            fileAttachment: 'travel-expense.pdf',
            cashInAmount: 0,
            cashOutAmount: 300,
        },
    ];

    // Get organisationId
    const { organisationId } = useParams();
    console.log('organisationId:', organisationId);

    // for cash in
    const [openCashIn, setOpenCashInModel] = useState(false);
    const handleOpenCashInModel = () => {
        setOpenCashInModel(true);
    };
    const handleCloseCashInModel = () => {
        setOpenCashInModel(false);
    };

    // for cash out
    const [openCashOut, setOpenCashOutModel] = useState(false);
    const handleOpenCashOutModel = () => {
        setOpenCashOutModel(true);
    };
    const handleCloseCashOutModel = () => {
        setOpenCashOutModel(false);
    };

    return (
        <>
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
                            {/* Select for Period */}
                            <Select defaultValue="weekly" sx={{ width: 150 }}>
                                <MenuItem value="weekly">Weekly</MenuItem>
                                <MenuItem value="monthly">Monthly</MenuItem>
                                <MenuItem value="yearly">Yearly</MenuItem>
                                <MenuItem value="all">All</MenuItem>
                            </Select>

                            {/* Select for Type */}
                            <Select defaultValue="personal" sx={{ width: 150 }}>
                                <MenuItem value="personal">Personal</MenuItem>
                                <MenuItem value="official">Official</MenuItem>
                            </Select>

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
                                    variant="outlined"
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
                                <Button variant="outlined" color="warning">
                                    Export
                                </Button>
                            </Box>
                        </Box>

                        {/* Table Section */}
                        <TableContainer component={Paper} sx={{ mb: 3 }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Note</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>File Attachment</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Cash In Amount</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Cash Out Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {mockData.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            sx={{
                                                backgroundColor: item.id % 2 === 0 ? '#ffffff' : '#f9fafb',
                                                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                                            }}
                                        >
                                            <TableCell>{item.date}</TableCell>
                                            <TableCell>{item.note}</TableCell>
                                            <TableCell>{item.fileAttachment}</TableCell>
                                            <TableCell>{item.cashInAmount}</TableCell>
                                            <TableCell>{item.cashOutAmount}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Summary Section */}
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography variant="h6">Total Cash In</Typography>
                                    <Typography variant="h5" color="primary">1500</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography variant="h6">Total Cash Out</Typography>
                                    <Typography variant="h5" color="error">1100</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography variant="h6">Balance</Typography>
                                    <Typography variant="h5" color="success.main">400</Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                    {/* for add cash in */}
                    <CashInModel
                        handleClose={handleCloseCashInModel}
                        open={openCashIn}
                        organisationId={organisationId}
                    />
                    {/* for add cash out */}
                    <CashOutModel
                        handleClose={handleCloseCashOutModel}
                        open={openCashOut}
                        organisationId={organisationId}
                    />
                </article>
            </div>
        </>
    );
};

export default Expense;
