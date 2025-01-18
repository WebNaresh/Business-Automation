import { zodResolver } from "@hookform/resolvers/zod";
import { Close } from "@mui/icons-material";
import { Box, IconButton, Modal, Button } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import { UseContext } from "../../../State/UseState/UseContext";
import { useEffect } from "react";

const EditProject = ({ open, handleClose, projectId, organisationId }) => {

    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const { handleAlert } = useContext(TestContext);

    console.log("projectId", projectId);



    // Define schema using Zod for form validation
    const ProjectSchema = z.object({
        project_name: z.string().min(1, "Project name is required"),
        project_description: z.string().optional(),

        start_date: z.string().min(1, "Start date is required"),
        end_date: z.string().optional(),
        status: z.string().min(1, "Status is required"),
        team_size: z.string().min(1, "Team size must be at least 1"),
        team_members: z
            .array(
                z.object({
                    name: z.string().min(1, "Team member name is required"),
                    role: z.string().min(1, "Role is required"),
                })
            )
            .optional(),
    });


    const { data: getProject } = useQuery(
        ["getProject"],
        async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API}/route/project/getone/${projectId}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data.project;
        }
    );

    console.log("dd", getProject);

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            project_name: "",
            project_description: "",

            start_date: "",
            end_date: "",
            status: "",
            team_size: 1,
            team_members: [{ name: "", role: "" }],
        },
        resolver: zodResolver(ProjectSchema),
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "team_members",
    });


    // Inside your component
    useEffect(() => {
        if (getProject) {
            // Map fetched data to form fields if necessary
            reset({
                project_name: getProject.project_name || "",
                project_description: getProject.project_description || "",

                start_date: getProject.start_date ? getProject.start_date.split("T")[0] : "",
                end_date: getProject.end_date ? getProject.end_date.split("T")[0] : "",
                status: getProject.status || "",
                team_size: getProject.team_size || "1",
                team_members: getProject.team_members || [{ name: "", role: "" }],
            });
        }
    }, [getProject, reset]);



    const updateProject = useMutation(
        (data) => {
            return axios.patch(
                `${import.meta.env.VITE_API}/route/project/update/${projectId}`,
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
                handleAlert(true, "success", "Project update successfully");
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
        updateProject.mutate(data);
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
                                        Edit Project
                                    </h1>
                                    <IconButton onClick={handleClose}>
                                        <Close className="!text-lg" />
                                    </IconButton>
                                </div>
                            </div>
                            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                                <AuthInputFiled
                                    name="project_name"
                                    control={control}
                                    type="text"
                                    placeholder="Project Name"
                                    errors={errors}
                                    error={errors.project_name}
                                    className="text-sm"
                                />
                                <AuthInputFiled
                                    name="project_description"
                                    control={control}
                                    type="text"
                                    placeholder="Project Description"
                                    errors={errors}
                                    error={errors.project_description}
                                    className="text-sm"
                                />

                                <AuthInputFiled
                                    name="start_date"
                                    control={control}
                                    type="date"
                                    placeholder="Start Date"
                                    errors={errors}
                                    error={errors.start_date}
                                    className="text-sm"
                                />
                                <AuthInputFiled
                                    name="end_date"
                                    control={control}
                                    type="date"
                                    placeholder="End Date"
                                    errors={errors}
                                    error={errors.end_date}
                                    className="text-sm"
                                />
                                <AuthInputFiled
                                    name="status"
                                    control={control}
                                    type="text"
                                    placeholder="Status"
                                    errors={errors}
                                    error={errors.status}
                                    className="text-sm"
                                />
                                <AuthInputFiled
                                    name="team_size"
                                    control={control}
                                    type="text"
                                    placeholder="Team Size"
                                    errors={errors}
                                    error={errors.team_size}
                                    className="text-sm"
                                />
                                <div className="w-full mt-4">
                                    <h2 className="text-lg font-semibold">Team Members</h2>
                                    {fields.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-2 mt-2"
                                        >
                                            <AuthInputFiled
                                                name={`team_members.${index}.name`}
                                                control={control}
                                                type="text"
                                                placeholder="Team Member Name"
                                                errors={errors}
                                                error={errors.team_members?.[index]?.name}
                                                className="text-sm"
                                            />
                                            <AuthInputFiled
                                                name={`team_members.${index}.role`}
                                                control={control}
                                                type="text"
                                                placeholder="Role"
                                                errors={errors}
                                                error={errors.team_members?.[index]?.role}
                                                className="text-sm"
                                            />
                                            <IconButton
                                                onClick={() => remove(index)}
                                                size="small"
                                                color="error"
                                            >
                                                <Close />
                                            </IconButton>
                                        </div>
                                    ))}
                                    <Button
                                        variant="outlined"
                                        onClick={() => append({ name: "", role: "" })}
                                        className="mt-2"
                                    >
                                        Add Team Member
                                    </Button>
                                </div>
                                <button
                                    type="submit"
                                    className="py-2 rounded-md border font-bold w-full bg-blue-500 text-white mt-4"
                                >
                                    Update
                                </button>
                            </form>
                        </div>
                    </article>
                </section>
            </Box>
        </Modal>
    );
};

export default EditProject;
