import { Info } from "@mui/icons-material";
import { Container, IconButton, } from "@mui/material";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { UseContext } from "../../../State/UseState/UseContext";
import AddProjectInOrg from "./AddProjectInOrg";
import EditProjectInOrg from "./EditProjectInOrg";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add"; // Import Add icon 
import AddProductModel from "./AddProductModel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Tooltip } from "@mui/material";
import ViewEmployeeInProject from "./ViewEmployeeInProject";

const ViewOrg = () => {
    const { organisationId } = useParams();
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];

    // Modal states and function
    const [open, setOpen] = React.useState(false);
    const [opens, setOpens] = React.useState(false);
    const [view, setView] = React.useState(false);
    const [projectId, setProjectId] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);


    // Fetch uploaded document data of the employee
    const { data: getProjectOrg } = useQuery(
        ["getProjectOrg"],
        async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API}/route/project/get-project/${organisationId}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data.projects;
        }
    );

    console.log("getProjectOrg", getProjectOrg);



    const handleAddProduct = () => {
        setOpen(true);
    };


    const handleEditProduct = (project) => {
        setEditMode(true);
        setSelectedProject(project);
    };


    const handleEditClose = () => {
        setEditMode(false);
        setSelectedProject(null);
    };

    const handleAddProjectToEmp = () => {
        setOpens(true);
    };

    const handleViewProject = (projectId) => {
        setView(true);
        setProjectId(projectId)
    };

    return (
        <>
            <Container maxWidth="xl" className="bg-gray-50 min-h-screen py-8 px-4">
                <div className="space-y-1 flex justify-between gap-3 mb-4">
                    <div>
                        <h1 className="md:text-xl text-lg">Project</h1>
                        <p className="text-sm">
                            Here you will be able to view the project in the organisation.
                        </p>
                    </div>
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={handleAddProduct}
                            className="bg-[#174E63] text-white px-6 py-2 rounded-md shadow-md hover:bg-[#133D4F] transition duration-200"
                        >
                            Add Project
                        </button>

                    </div>

                </div>

                {getProjectOrg?.length > 0 ? (
                    <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
                        <table className="min-w-full bg-white text-left !text-sm font-light">
                            <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                                <tr className="font-semibold">
                                    <th scope="col" className="!text-left pl-8 py-3">
                                        Sr. No
                                    </th>
                                    <th scope="col" className="px-3 py-3">
                                        Company Name
                                    </th>
                                    <th scope="col" className="px-3 py-3">
                                        Project Name
                                    </th>

                                    <th scope="col" className="px-3 py-3">
                                        Team Size
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {getProjectOrg &&
                                    getProjectOrg.map((data, id) => (
                                        <tr className="!font-medium border-b" key={id}>
                                            <td className="!text-left pl-8 py-3">{id + 1}</td>
                                            <td className="px-6 py-3">{data.project_name || "N/A"}</td>
                                            <td className="px-6 py-3">{data.company_name || "N/A"}</td>
                                            <td className="px-6 py-3">{data.team_size || "N/A"}</td>
                                            <Tooltip title="Edit Project" arrow>
                                                <IconButton
                                                    onClick={() => handleEditProduct(data)}
                                                    sx={{
                                                        backgroundColor: "#f1f5f9",
                                                        "&:hover": { backgroundColor: "#e2e8f0" },
                                                        mt: "15px",
                                                        marginLeft: "30px"
                                                    }}
                                                    size="small"
                                                >
                                                    <EditIcon sx={{ fontSize: "1.25rem", color: "#6366f1" }} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Assing project to employee" arrow>
                                                <IconButton
                                                    onClick={handleAddProjectToEmp}
                                                    sx={{
                                                        backgroundColor: "#f1f5f9",
                                                        "&:hover": { backgroundColor: "#e2e8f0" },
                                                        mt: "15px",
                                                        marginLeft: "30px"
                                                    }}
                                                    size="small"
                                                >
                                                    <AddIcon sx={{ fontSize: "1.25rem", color: "#6366f1" }} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="View employee in a project" arrow>
                                                <IconButton
                                                    onClick={() => handleViewProject(data._id)}
                                                    sx={{
                                                        backgroundColor: "#f1f5f9",
                                                        "&:hover": { backgroundColor: "#e2e8f0" },
                                                        mt: "15px",
                                                        marginLeft: "30px"
                                                    }}
                                                    size="small"
                                                >
                                                    <VisibilityIcon sx={{ fontSize: "1.25rem", color: "#6366f1" }} />
                                                </IconButton>
                                            </Tooltip>
                                        </tr>
                                    ))}
                            </tbody>


                        </table>
                    </div>
                ) : (
                    <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                        <article className="flex items-center mb-4 text-red-500 gap-2">
                            <Info className="!text-2xl" />
                            <h1 className="text-lg font-semibold">
                                No Project Found in organisation.Please add the project
                            </h1>
                        </article>
                    </section>

                )}


                <AddProjectInOrg organisationId={organisationId} open={open} handleClose={() => setOpen(false)} />
                <EditProjectInOrg project={selectedProject} organisationId={organisationId} open={editMode} handleClose={handleEditClose} />


                <AddProductModel organisationId={organisationId} open={opens} handleClose={() => setOpens(false)} />
                <ViewEmployeeInProject projectId={projectId} organisationId={organisationId} open={view} handleClose={() => setView(false)}/>


            </Container>
        </>
    );
};

export default ViewOrg;
