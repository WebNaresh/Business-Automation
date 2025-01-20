import { zodResolver } from "@hookform/resolvers/zod";
import { Close } from "@mui/icons-material";
import { Box, IconButton, Modal } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
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

const UpdateAssets = ({ open, handleClose, assetId }) => {
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const { handleAlert } = useContext(TestContext);
    const queryClient = useQueryClient();

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
            allocationDate: new Date(),
        },
        resolver: zodResolver(AllocateAssetSchema),
    });

    // Fetch existing asset details
    const { isLoading } = useQuery(
        ["allocateAssets", assetId],
        async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API}/route/get/allocate-one-assets/${assetId}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data.allocation; // Assuming allocation is the correct field
        },
        {
            enabled: !!assetId, // Only fetch if assetId exists
            onSuccess: (data) => {
                console.log("Fetched data:", data);
                reset({
                    assetName: data?.assetName || "",
                    assetType: data?.assetType || "",
                    allocationDate: data?.allocationDate
                        ? new Date(data.allocationDate).toISOString().split('T')[0]
                        : "",
                });
            },
            onError: () => {
                handleAlert(true, "error", "Failed to fetch asset details.");
            },
        }
    );


    const updateAllocateAssets = useMutation(
        (data) =>
            axios.patch(
                `${import.meta.env.VITE_API}/route/update/allocate-asset/${assetId}`,
                data,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            ),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["allocateAssets"]);
                handleClose();
                handleAlert(true, "success", "Asset updated successfully.");
            },
            onError: () => {
                handleAlert(true, "error", "An error occurred while updating the asset.");
            },
        }
    );

    const onSubmit = (data) => {
        const formattedData = {
            ...data,
            allocationDate: data.allocationDate
                ? new Date(data.allocationDate).toISOString()
                : null,
        };
        updateAllocateAssets.mutate(formattedData);
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
                                        Edit Assets
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
                                    {isLoading ? "Loading..." : "Update"}
                                </button>
                            </form>
                        </div>
                    </article>
                </section>
            </Box>
        </Modal>
    );
};

export default UpdateAssets;
