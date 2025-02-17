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



const ViewEmployeeProject = ({ employeeId }) => {
    const { organisationId } = useParams();
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];


    // Fetch uploaded document data of the employee
    const { data: getProjectOfEmployee } = useQuery(
        ["get-projectss"],
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



    return (
        <>
            <Container maxWidth="xl" className="bg-gray-50 min-h-screen py-8 px-4">
                <div className="space-y-1 flex justify-between gap-3 mb-4">
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
                                </tr>
                            </thead>
                            <tbody>
                                {getProjectOfEmployee &&
                                    getProjectOfEmployee.map((data, id) => (
                                        <tr className="!font-medium border-b" key={id}>
                                            <td className="!text-left pl-8 py-3">{id + 1}</td>
                                            <td className="px-6 py-3">
                                                {data.project_name.length > 0
                                                    ? data.project_name.map((project, index) => (
                                                        <span key={index}>
                                                            {project.label}
                                                            {index !== data.project_name.length - 1 && ", "}
                                                        </span>
                                                    ))
                                                    : "N/A"}
                                            </td>
                                            <td className="px-6 py-3">
                                                {new Date(data.start_date).toLocaleDateString("en-US") || "N/A"}
                                            </td>
                                            <td className="px-6 py-3">
                                                {new Date(data.end_date).toLocaleDateString("en-US") || "N/A"}
                                            </td>
                                            <td className="px-6 py-3">{data.status || "N/A"}</td>
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
                                No Project Found For Employee.Please allocate the project
                            </h1>
                        </article>
                    </section>

                )}
            </Container>
        </>
    );
};

export default ViewEmployeeProject;
