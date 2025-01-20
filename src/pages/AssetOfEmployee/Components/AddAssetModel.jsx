import { zodResolver } from "@hookform/resolvers/zod";
import { Close } from "@mui/icons-material";
import { Box, IconButton, Modal } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import { UseContext } from "../../../State/UseState/UseContext";

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

const AddAssets = ({ open, handleClose, empId, organisationId }) => {
    const { cookies } = useContext(UseContext);
    const authToken = cookies?.["aegis"];
    const { handleAlert } = useContext(TestContext);
    const queryClient = useQueryClient();

    if (!authToken) {
        console.error("Authorization token is missing");
    }

    const AllocateAssetSchema = z.object({
        assetName: z.string().min(1, "Asset name is required"),
        assetType: z.string().min(1, "Asset type is required"),
        allocationDate: z.string().optional(),
    });

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            assetName: "",
            assetType: "",
            allocationDate: new Date().toISOString().split("T")[0], // Default to today's date
        },
        resolver: zodResolver(AllocateAssetSchema),
    });

    const addAssetToEmp = useMutation(
        (data) =>
            axios.post(
                `${import.meta.env.VITE_API}/route/add/allocate-assets/${organisationId}/${empId}`,
                data,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            ),
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["allocateAssets"] });
                handleAlert(true, "success", "Asset added successfully.");
                handleClose();
                reset();
            },
            onError: (error) => {
                console.error("Error adding asset:", error);
                handleAlert(
                    true,
                    "error",
                    error?.response?.data?.message || "Server Error, please try again."
                );
            },
        }
    );

    const onSubmit = (data) => {
        console.log("Form Data Submitted:", data); // Debugging form data
        addAssetToEmp.mutate(data);
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
                <section className="p-2 px-4 flex space-x-2">
                    <article className="w-full rounded-md">
                        <div className="flex w-[500px] p-4 items-center flex-col gap-5 justify-center overflow-hidden bg-[white]">
                            <div className="w-full">
                                <div className="flex items-center justify-between">
                                    <h1 className="text-3xl text-gray-700 font-semibold tracking-tight">
                                        Allocate Asset
                                    </h1>
                                    <IconButton onClick={handleClose}>
                                        <Close className="!text-lg" />
                                    </IconButton>
                                </div>
                            </div>
                            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                                <AuthInputFiled
                                    name="assetName"
                                    control={control}
                                    type="text"
                                    placeholder="Asset Name"
                                    label="Asset Name *"
                                    errors={errors}
                                    error={errors.assetName}
                                />
                                <AuthInputFiled
                                    name="assetType"
                                    control={control}
                                    type="text"
                                    placeholder="Asset Type"
                                    label="Asset Type *"
                                    errors={errors}
                                    error={errors.assetType}
                                />
                                <AuthInputFiled
                                    name="allocationDate"
                                    control={control}
                                    type="date"
                                    label="Allocation Date"
                                    errors={errors}
                                    error={errors.allocationDate}
                                />
                                <button
                                    type="submit"
                                    className="py-2 rounded-md border font-bold w-full bg-blue-500 text-white mt-4"
                                >
                                    Allocate
                                </button>
                            </form>
                        </div>
                    </article>
                </section>
            </Box>
        </Modal>
    );
};

export default AddAssets;
