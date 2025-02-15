import { zodResolver } from "@hookform/resolvers/zod";
import { Close } from "@mui/icons-material";
import { Box, IconButton, Modal, } from "@mui/material";
import axios from "axios";
import React, { useContext, } from "react";
import { useForm, } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import { UseContext } from "../../../State/UseState/UseContext";
import { Email } from "@mui/icons-material";

const AddProductModel = ({ open, handleClose, empId, organisationId }) => {

    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const { handleAlert } = useContext(TestContext);

    //for  Get Query to get employee email of organization
    const { data: employee } = useQuery(
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
    const employeeId = employee
        ? employee.map((emp) => ({
            label: emp.first_name,
            value: emp._id,
        }))
        : [];

    // Fetch uploaded document data of the employee
    const { data: getProjectOrg } = useQuery(
        ["getorgproject"],
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

    const project = getProjectOrg
        ? getProjectOrg.map((project) => ({
            label: project.project_name,
            value: project._id,
        }))
        : [];

    const ProjectSchema = z.object({
        project_name: z.array(
            z.object({
                label: z.string(),
                value: z.string(),
            })
        ),
        project_description: z.string().optional(),
        start_date: z.string().min(1, "Start date is required"),
        end_date: z.string().optional(),
        status: z.string().min(1, "Status is required"),
        team_size: z.string().min(1, "Team size must be at least 1"),
        empId: z.array(
            z.object({
                label: z.string(),
                value: z.string(),
            })
        ),
    });


    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            project_name: [],  // Ensure this is an array
            project_description: "",
            start_date: "",
            end_date: "",
            status: "",
            team_size: "1",
            empId: [],  // Ensure this is an array
        },
        resolver: zodResolver(ProjectSchema),
    });

    console.log("error", errors);


    const addProduct = useMutation(
        (data) => {
            return axios.post(
                `${import.meta.env.VITE_API}/route/project/allocate-project-to-emp/${organisationId}`,
                data,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
        },
        {
            onSuccess: (response) => {
                handleAlert(true, "success", "Project added successfully");
                handleClose();
                reset();

            },
            onError: (error) => {
                handleAlert(
                    true,
                    "error",
                    error?.response?.data?.message ?? "Server Error, please try again"
                );
            },
        }
    );

    const onSubmit = (data) => {
        console.log("Raw Data:", data);
        addProduct.mutate(data);
    };
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        overflow: "auto",
        maxHeight: "80vh",
        p: 4,
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                sx={style}
                className="border-none !z-10 !pt-0 !px-0 w-max shadow-md outline-none rounded-md"
            >
                <section className="p-2 px-4 flex space-x-2 ">
                    <article className="w-full rounded-md ">
                        <div className="flex w-[500px] p-4 items-center flex-col gap-5 justify-center overflow-hidden bg-[white] ">
                            <div className="w-full">
                                <div className="flex items-center justify-between">
                                    <h1 className="text-3xl text-gray-700 font-semibold tracking-tight">
                                        Add Project
                                    </h1>
                                    <IconButton onClick={handleClose}>
                                        <Close className="!text-lg" />
                                    </IconButton>
                                </div>
                            </div>
                            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                                <AuthInputFiled
                                    name="project_name"
                                    icon={Email}
                                    control={control}
                                    type="autocomplete"
                                    placeholder="Project Name"
                                    label="Project Name"
                                    readOnly={false}
                                    maxLimit={15}
                                    errors={errors}
                                    error={errors.project_name}
                                    optionlist={project ? project : []}
                                />

                                <AuthInputFiled
                                    label="Project Description *"
                                    name="project_description"
                                    control={control}
                                    type="text"
                                    placeholder="Project Description"
                                    errors={errors}
                                    error={errors.project_description}
                                    className="text-sm"
                                />

                                <AuthInputFiled
                                    name="empId"
                                    icon={Email}
                                    control={control}
                                    type="autocomplete"
                                    placeholder="Employee"
                                    label="Employee"
                                    readOnly={false}
                                    maxLimit={15}
                                    errors={errors}
                                    error={errors.empId}
                                    optionlist={employeeId ? employeeId : []}
                                />

                                <AuthInputFiled
                                    label="Start Date*"
                                    name="start_date"
                                    control={control}
                                    type="date"
                                    placeholder="Start Date"
                                    errors={errors}
                                    error={errors.start_date}
                                    className="text-sm"
                                />
                                <AuthInputFiled
                                    label="End Date*"
                                    name="end_date"
                                    control={control}
                                    type="date"
                                    placeholder="End Date"
                                    errors={errors}
                                    error={errors.end_date}
                                    className="text-sm"
                                />
                                <AuthInputFiled
                                    label="Status*"
                                    name="status"
                                    control={control}
                                    type="text"
                                    placeholder="Status"
                                    errors={errors}
                                    error={errors.status}
                                    className="text-sm"
                                />
                                <AuthInputFiled
                                    label="Team Size*"
                                    name="team_size"
                                    control={control}
                                    type="text"
                                    placeholder="Team Size"
                                    errors={errors}
                                    error={errors.team_size}
                                    className="text-sm"
                                />
                                <button
                                    type="submit"
                                    className="py-2 rounded-md border font-bold w-full bg-[#174E63] text-white mt-4"
                                >
                                    Add
                                </button>

                            </form>
                        </div>
                    </article>
                </section>
            </Box>
        </Modal>
    );
};

export default AddProductModel;
