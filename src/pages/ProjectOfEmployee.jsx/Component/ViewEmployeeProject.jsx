import { Info, RequestQuote } from "@mui/icons-material";
import { Avatar, Container, IconButton, } from "@mui/material";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { UseContext } from "../../../State/UseState/UseContext";
import { IoAddOutline } from "react-icons/io5";
import AddProductModel from "../Component/AddProductModel";
import EditProject from "./EditProjectModel";
import EditIcon from "@mui/icons-material/Edit";
import UpdateNotes from "../../Employee/Component/UpdateNotes";


const ViewEmployeeProject = ({ employeeId }) => {
    const { organisationId } = useParams();
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];

    // Modal states and function
    const [open, setOpen] = React.useState(false);
    const [empId, setEmpId] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);


    // Fetch uploaded document data of the employee
    const { data: getProjectOfEmployee } = useQuery(
        ["getProjectOfEmployee"],
        async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API}/route/project/get/${employeeId}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data.projects;
        }
    );

    console.log("getProjectOfEmployee", getProjectOfEmployee);


    // for add
    const handleAddProduct = (empId) => {
        setOpen(true);
        setEmpId(empId);
    };

    // for eidt
    const handleEditProduct = (projectId) => {
        setEditMode(true);
        setSelectedProject(projectId);
    };

    // for edit close 
    const handleEditClose = () => {
        setEditMode(false);
        setSelectedProject(null);
    };

    return (
        <>
            <Container maxWidth="xl" className="bg-gray-50 min-h-screen py-8 px-4">
                <div className="space-y-1 flex items-center gap-3 mb-4">
                    <Avatar className="text-white !bg-blue-500">
                        <RequestQuote />
                    </Avatar>
                    <div>
                        <h1 className="md:text-xl text-lg">Project Allocation</h1>
                        <p className="text-sm">
                            Here you will be able to view the project of the employee.
                        </p>
                    </div>
                </div>

                {getProjectOfEmployee?.length > 0 ? (
                    <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
                        <table className="min-w-full bg-white text-left !text-sm font-light">
                            <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                                <tr className="font-semibold">
                                    <th scope="col" className="!text-left pl-8 py-3">
                                        Sr. No
                                    </th>
                                    <th scope="col" className="px-3 py-3">
                                        Project Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Start Date
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        End Date
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Team Size
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Team Member
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {getProjectOfEmployee &&
                                    getProjectOfEmployee.map((data, id) => (
                                        <tr className="!font-medium border-b" key={id}>
                                            <td className="!text-left pl-8 py-3">{id + 1}</td>
                                            <td className="px-6 py-3">{data.project_name || "N/A"}</td>

                                            <td className="px-6 py-3">
                                                {new Date(data.start_date).toLocaleDateString("en-US") || "N/A"}
                                            </td>
                                            <td className="px-6 py-3">
                                                {new Date(data.end_date).toLocaleDateString("en-US") || "N/A"}
                                            </td>
                                            <td className="px-6 py-3">{data.status || "N/A"}</td>
                                            <td className="px-6 py-3">{data.team_size || "N/A"}</td>
                                            <td className="px-6 py-3">
                                                {data.team_members?.length > 0 ? (
                                                    <ul className="list-disc pl-5">
                                                        {data.team_members.map((member, index) => (
                                                            <li key={index}>
                                                                {member.name} ({member.role})
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    "No Team Members"
                                                )}
                                            </td>
                                            <IconButton onClick={() => handleAddProduct(data.empId)} sx={{ backgroundColor: "#f1f5f9", "&:hover": { backgroundColor: "#d1fae5" }, mt: "15px" }} size="small">
                                                <IoAddOutline sx={{ fontSize: "1.25rem", color: "#10b981" }} />
                                            </IconButton>
                                            <IconButton onClick={() => handleEditProduct(data._id)} sx={{ backgroundColor: "#f1f5f9", "&:hover": { backgroundColor: "#e2e8f0" }, mt: "15px" }} size="small">
                                                <EditIcon sx={{ fontSize: "1.25rem", color: "#6366f1" }} />
                                            </IconButton>
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
                                No Project Found For Employee.
                            </h1>
                        </article>
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => handleAddProduct(employeeId)}
                                className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
                            >
                                Add Project
                            </button>
                        </div>
                    </section>

                )}


                <AddProductModel empId={empId} organisationId={organisationId} open={open} handleClose={() => setOpen(false)} />
                <UpdateNotes projectId={selectedProject} organisationId={organisationId} open={editMode} handleClose={handleEditClose} />

            </Container>
        </>
    );
};

export default ViewEmployeeProject;
