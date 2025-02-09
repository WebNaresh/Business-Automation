import { Info, RequestQuote } from "@mui/icons-material";
import { Avatar, Container, Button } from "@mui/material";
import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { UseContext } from "../../../State/UseState/UseContext";
import ViewRecordModel from "./ViewRecordModel";
import PreviewIcon from "@mui/icons-material/Preview";

const ApprovedRejectDoc = ({ employeeId, organisationId }) => {
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const queryClient = useQueryClient();

    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleOpen = (file) => {
        setSelectedFile(file);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedFile(null);
    };

    // Fetch employee's uploaded documents
    const { data: getRecordOneEmployee } = useQuery(
        ["getRecordOneEmployee"],
        async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API}/route/emp/get-pending-document/${employeeId}/${organisationId}`,
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


    const handleApprovalReject = async (documentId, status) => {
        try {
            console.log("documentId", documentId);

            const response = await axios.put(
                `${import.meta.env.VITE_API}/route/organization/user-document-accept/reject/${documentId}`,
                { action: status },
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            console.log(response);
            queryClient.invalidateQueries("getRecordOneEmployee");
        } catch (error) {
            console.error("Error updating document status:", error);
            handleAlert(true, "error", "Something went wrong");
        }
    };

    return (
        <>
            <Container maxWidth="xl" className="bg-gray-50 min-h-screen py-8 px-4">
                <div className="space-y-1 flex items-center gap-3 mb-4">
                    <Avatar className="text-white !bg-blue-500">
                        <RequestQuote />
                    </Avatar>
                    <div>
                        <h1 className="md:text-xl text-lg">View Record of Employee</h1>
                        <p className="text-sm">Approve or reject the uploaded document of the employee.</p>
                    </div>
                </div>

                {getRecordOneEmployee?.files?.length > 0 ? (
                    <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
                        <table className="min-w-full bg-white text-left !text-sm font-light">
                            <thead className="border-b bg-gray-200 font-medium">
                                <tr className="font-semibold">
                                    <th className="pl-8 py-3">Sr. No</th>
                                    <th className="px-6 py-3">File Name</th>
                                    <th className="px-6 py-3">Document</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getRecordOneEmployee.files.map((file, id) => (
                                    <tr className="border-b" key={id}>
                                        <td className="pl-8 py-3">{id + 1}</td>
                                        <td className="pl-6 py-3">{file.fileName}</td>
                                        <td className="pl-6 py-3">{file.selectedValue}</td>
                                        <td className="pl-6 py-3 flex gap-2">
                                            <button className="text-blue-500 hover:underline" onClick={() => handleOpen(file.fileName)}>
                                                <PreviewIcon />
                                            </button>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                onClick={() => handleApprovalReject(getRecordOneEmployee._id, "accept")}>
                                                Accept
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                onClick={() => handleApprovalReject(getRecordOneEmployee._id, "reject")}>
                                                Reject
                                            </Button>
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
                            <h1 className="text-lg font-semibold">No Uploaded Document Found.</h1>
                        </article>
                        <p>Please ask the employee to upload the document.</p>
                    </section>
                )}

                {/* Modal to preview the document */}
                <ViewRecordModel file={selectedFile} onClose={handleClose} open={open} />
            </Container>
        </>
    );
};

export default ApprovedRejectDoc;
