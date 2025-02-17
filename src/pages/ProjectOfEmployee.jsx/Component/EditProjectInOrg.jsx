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

const EditProjectInOrg = ({ open, handleClose, project, organisationId }) => {

    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const { handleAlert } = useContext(TestContext);

    console.log("project", project);
    console.log("organisationId", organisationId);


    const projectId = project?._id;


    // Define schema using Zod for form validation
    const ProjectSchema = z.object({
        project_name: z.string().min(1, "Project name is required"),
        company_name: z.string().optional(),
        team_size: z.string().optional(),
    });

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            project_name: "",
        },
        resolver: zodResolver(ProjectSchema),
    });


    // Inside your component
    useEffect(() => {
        if (project) {
            // Map fetched data to form fields if necessary
            reset({
                project_name: project.project_name || "",
                company_name: project.company_name || "",
                team_size: project.team_size || "",
            });
        }
    }, [project, reset]);



    const updateProject = useMutation(
        (data) => {
            return axios.patch(
                `${import.meta.env.VITE_API}/route/project/update-project/${organisationId}/${projectId}`,
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
                queryClient.invalidateQueries({ queryKey: ["getProjectOrg"] });
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
                                    label="Company Name *"
                                    name="company_name"
                                    control={control}
                                    type="text"
                                    placeholder="Company Name"
                                    errors={errors}
                                    error={errors.company_name}
                                    className="text-sm"
                                />
                                <AuthInputFiled
                                    label="Team Size *"
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

export default EditProjectInOrg;
