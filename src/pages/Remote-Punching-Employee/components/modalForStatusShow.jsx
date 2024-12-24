import axios from 'axios';
import React, { useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";
import { Button } from '@mui/material';
import ExcelJS from 'exceljs';

const ModalForStatusShow = ({ taskData }) => {
    console.log("taskData", taskData);

    const { organisationId } = useParams();
    const navigate = useNavigate();
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];

    // Get employee data for the "to" field
    const { data: employees } = useQuery(
        ["employee", organisationId],
        async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API}/route/employee/${organisationId}/get-emloyee`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data.employees;
        }
    );

    if (!taskData) {
        return <div>No task data available.</div>;
    }

    const handleComplete = (email, punchObjectId) => {
        const employee = employees.find(emp => emp.email === email);
        console.log("employsdasdsaee", punchObjectId);

        if (employee) {
            navigate(`/organisation/${organisationId}/remote-task/${employee._id}/${punchObjectId}`);
        } else {
            console.error("Employee not found");
        }
    }

    const generateExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Task Data');

        // Add title and description to the top of the sheet
        worksheet.mergeCells('A1:D1');
        worksheet.getCell('A1').value = `Title: ${taskData.title}`;
        worksheet.getCell('A1').font = { bold: true };
        worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'left' };

        worksheet.mergeCells('A2:D2');
        worksheet.getCell('A2').value = `Description: ${taskData.description}`;
        worksheet.getCell('A2').font = { bold: true };
        worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'left' };

        // Adjust row height for title and description
        worksheet.getRow(1).height = 30;
        worksheet.getRow(2).height = 30;

        // Add a blank row to separate title/description from data
        worksheet.addRow([]);

        // Add column headers
        const headerRow = worksheet.addRow(['Task', 'Email', 'Status', 'Comments']);
        headerRow.font = { bold: true }; // Make column headers bold
        worksheet.columns = [
            { width: 30 },
            { width: 30 },
            { width: 20 },
            { width: 50 },
        ];

        // Add data rows
        taskData.taskName.forEach(taskItem => {
            taskData.to.forEach(email => {
                const acceptedByEntry = taskItem.acceptedBy.find(
                    entry => entry.employeeEmail === email.value
                );

                worksheet.addRow([
                    taskItem.taskName,
                    email.label,
                    acceptedByEntry
                        ? acceptedByEntry.status
                            ? acceptedByEntry.status === "Completed"
                                ? 'Completed'
                                : acceptedByEntry.status
                            : acceptedByEntry.accepted
                                ? 'Accept'
                                : 'Reject'
                        : 'Assigned',
                    acceptedByEntry ? acceptedByEntry.comments : '',
                ]);
            });
        });

        // Generate Excel file and trigger download
        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'task_data.xlsx';
            link.click();
            window.URL.revokeObjectURL(url);
        });
    };

    return (
        <div className="overflow-auto">
            <div>
                <h2 className="text-2xl mb-2">{taskData?.title}</h2>
                <p className="text-sm text-muted-foreground">
                    {taskData?.description}
                </p><br />

            </div>
            <table className="w-full table-auto border border-collapse min-w-full bg-white text-left !text-sm font-light">
                <thead className="border-b bg-gray-100 font-bold">
                    <tr className="!font-semibold">
                        <th scope="col" className="py-3 text-sm px-2">Task</th>
                        <th scope="col" className="py-3 text-sm px-2">Email</th>
                        <th scope="col" className="!text-left px-2 w-max py-3 text-sm">Status</th>
                        <th scope="col" className="!text-left px-2 w-max py-3 text-sm">Comments</th>
                    </tr>
                </thead>
                <tbody>
                    {taskData.taskName.map((taskItem) =>
                        taskData.to.map((email) => {
                            const acceptedByEntry = taskItem.acceptedBy.find(
                                (entry) => entry.employeeEmail === email.value
                            );
                            return (
                                <tr className="border-b" key={`${taskItem._id}-${email.value}`}>
                                    <td className="py-3 px-2">{taskItem.taskName}</td>
                                    <td className="py-3 px-2">{email.label}</td>
                                    <td className="py-3 px-2 " >
                                        {acceptedByEntry
                                            ? acceptedByEntry.status
                                                ? acceptedByEntry.status === "Completed"
                                                    ? <Button sx={{ textTransform: "none" }} onClick={() => handleComplete(email.value, acceptedByEntry?.punchObjectId)}>Completed</Button>
                                                    : acceptedByEntry.status
                                                : acceptedByEntry.accepted
                                                    ? 'Accept'
                                                    : 'Reject'
                                            : 'Assigned'}
                                    </td>
                                    <td className="py-3 px-2">
                                        {acceptedByEntry ? acceptedByEntry.comments : ''}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table><br />
            <div className='flex justify-end'>
                <Button sx={{ display: "flex", justifyContent: "right" }} variant="contained" onClick={generateExcel}>
                    Download Excel
                </Button>
            </div>
        </div>
    );
};

export default ModalForStatusShow;
