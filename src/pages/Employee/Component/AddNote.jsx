import { zodResolver } from "@hookform/resolvers/zod";
import { Close } from "@mui/icons-material";
import { Box, IconButton, Modal, Button } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import { UseContext } from "../../../State/UseState/UseContext";


const AddNote = ({ open, handleClose, empId, organisationId }) => {

    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const { handleAlert } = useContext(TestContext);

    console.log("empId", empId);
    console.log("organisationId", organisationId);


    // Define schema using Zod for form validation
    const NoteSchema = z.object({
        notes: z.string(),
    });

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            notes: "",

        },
        resolver: zodResolver(NoteSchema),
    });



    const addNote = useMutation(
        (data) => {
            return axios.post(
                `${import.meta.env.VITE_API}/route/note/add-note/${empId}/${organisationId}`,
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
                handleAlert(true, "success", "Note added successfully");
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
        addNote.mutate(data);
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
                                        Add Note
                                    </h1>
                                    <IconButton onClick={handleClose}>
                                        <Close className="!text-lg" />
                                    </IconButton>
                                </div>
                            </div>
                            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                                <AuthInputFiled
                                    label="Note*"
                                    name="notes"
                                    control={control}
                                    type="text"
                                    placeholder="Note"
                                    errors={errors}
                                    error={errors.notes}
                                    className="text-sm"
                                />
                                <button
                                    type="submit"
                                    className="py-2 rounded-md border font-bold w-full bg-blue-500 text-white mt-4"
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

export default AddNote;
