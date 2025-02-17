import { Close } from "@mui/icons-material";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";

const ViewEmployeeInProject = ({ open, handleClose, organisationId, projectId }) => {
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const { handleAlert } = useContext(TestContext);

    // Fetch employees in the project
    const { data: getData, isLoading, error } = useQuery(
        ["getData", projectId],
        async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API}/route/project/${projectId}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data.employees;
        },
        { enabled: !!projectId } // Only fetch if projectId is available
    );

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        overflow: "auto",
        maxHeight: "80vh",
        p: 4,
        width: "500px",
        borderRadius: "10px",
        boxShadow: 24,
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div className="flex justify-between items-center border-b pb-2">
                    <Typography variant="h6">Project Employees</Typography>
                    <IconButton onClick={handleClose}>
                        <Close />
                    </IconButton>
                </div>

                {/* Loading and Error Handling */}
                {isLoading && <Typography>Loading...</Typography>}
                {error && <Typography color="error">Error: {error.message}</Typography>}

                {/* Display Data */}
                <div className="mt-4">
                    {getData && getData.length > 0 ? (
                        getData.map((item) => (
                            <div key={item._id} className="border p-3 rounded-md my-2">
                                <Typography variant="subtitle1">
                                    <strong>Employee:</strong> {item.empId[0]?.label || "N/A"}
                                </Typography>
                                <Typography>
                                    <strong>Project:</strong> {item.project_name[0]?.label || "N/A"}
                                </Typography>
                                <Typography>
                                    <strong>Description:</strong> {item.project_description}
                                </Typography>
                                <Typography>
                                    <strong>Status:</strong> {item.status}
                                </Typography>
                                <Typography>
                                    <strong>Start Date:</strong>{" "}
                                    {new Date(item.start_date).toLocaleDateString()}
                                </Typography>
                                <Typography>
                                    <strong>End Date:</strong>{" "}
                                    {item.end_date ? new Date(item.end_date).toLocaleDateString() : "Ongoing"}
                                </Typography>
                            </div>
                        ))
                    ) : (
                        <Typography>No employees found for this project.</Typography>
                    )}
                </div>
            </Box>
        </Modal>
    );
};

export default ViewEmployeeInProject;
