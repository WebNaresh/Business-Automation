import { zodResolver } from "@hookform/resolvers/zod";
import { Close } from "@mui/icons-material";
import { Box, IconButton, Modal } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import { UseContext } from "../../../State/UseState/UseContext";
import { useEffect } from "react";

const UpdateNotes = ({ open, handleClose, note }) => {

    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const { handleAlert } = useContext(TestContext);


    const NoteSchema = z.object({
        notes: z.string(),
    });

    const { data: getNote } = useQuery(
        ["getNote"],
        async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API}/route/note/getone/${note._id}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data.notes;
        }
    );



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


    useEffect(() => {
        if (getNote) {
            reset({
                notes: getNote.notes || "",

            });
        }
    }, [getNote, reset]);

    const updateNote = useMutation(
        (data) => {
            return axios.patch(
                `${import.meta.env.VITE_API}/route/note/update/${noteId}`,
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
                handleAlert(true, "success", "Note update successfully");
                handleClose();
                reset();
                window.location.reload();
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
        updateNote.mutate(data);
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
                                        Edit Note
                                    </h1>
                                    <IconButton onClick={handleClose}>
                                        <Close className="!text-lg" />
                                    </IconButton>
                                </div>
                            </div>
                            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                                <AuthInputFiled
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

export default UpdateNotes;
