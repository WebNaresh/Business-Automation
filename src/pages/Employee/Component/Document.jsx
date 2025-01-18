import React, { useContext, useState } from 'react';
import { UseContext } from '../../../State/UseState/UseContext';
import { Info, RequestQuote } from "@mui/icons-material";
import { Avatar, Container, } from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import ViewRecordModel from '../../DocumentManagement/components/ViewRecordModel'; // Import your modal
import PreviewIcon from '@mui/icons-material/Preview';

export function Document({ empId, organisationId }) {
    console.log("empId", empId);
    console.log("organisationId", organisationId);

    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    // State to manage modal open/close and selected file
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleOpen = (file) => {
        setSelectedFile(file); // Set the file to be previewed
        setOpen(true); // Open the modal
    };

    const handleClose = () => {
        setOpen(false); // Close the modal
        setSelectedFile(null); // Reset the selected file
    };

    // Fetch uploaded document data of the employee
    const { data: getRecordOneEmployee } = useQuery(
        ["getRecordOneEmployee"],
        async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API}/route/emp/get-document/${empId}/${organisationId}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data.data;
        }
    );

    console.log("getRecordOneEmployee", getRecordOneEmployee);



    return (
        <>
            <Container maxWidth="xl" className="bg-gray-50 min-h-screen py-8 px-4">
                <div className="space-y-1 flex items-center gap-3 mb-4">
                    <Avatar className="text-white !bg-blue-500">
                        <RequestQuote />
                    </Avatar>
                    <div>
                        <h1 className="md:text-xl text-lg">View Record of Employee</h1>
                        <p className="text-sm">
                            Here you will be able to view the uploaded record of the employee.
                        </p>
                    </div>
                </div>

                {getRecordOneEmployee?.files?.length > 0 ? (
                    <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
                        <table className="min-w-full bg-white text-left !text-sm font-light">
                            <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                                <tr className="font-semibold">
                                    <th scope="col" className="!text-left pl-8 py-3">
                                        Sr. No
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        File Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Selected Value
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {getRecordOneEmployee.files.map((file, id) => (
                                    <tr className="!font-medium border-b" key={id}>
                                        <td className="!text-left pl-8 py-3">{id + 1}</td>
                                        <td className="!text-left pl-6 py-3">{file.fileName}</td>
                                        <td className="!text-left pl-6 py-3">
                                            {file.selectedValue}
                                        </td>
                                        <td className="!text-left pl-6 py-3">
                                            <button
                                                className="text-blue-500 hover:underline"
                                                onClick={() => handleOpen(file.fileName)}
                                            >
                                                <PreviewIcon />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                        <article className="flex items-center mb-1 text-red-500 gap-2">
                            <Info className="!text-2xl" />
                            <h1 className="text-lg font-semibold">
                                No Uploaded Document Found.
                            </h1>
                        </article>
                        <p>Please ask the employee to upload the document.</p>
                    </section>
                )}

                {/* Modal to preview the document */}

                <ViewRecordModel
                    file={selectedFile}
                    onClose={handleClose}
                    open={open}
                />
            </Container>
        </>
    );
}
