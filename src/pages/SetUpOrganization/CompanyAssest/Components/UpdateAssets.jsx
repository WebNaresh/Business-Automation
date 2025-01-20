import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import { TestContext } from "../../../../State/Function/Main";
import { UseContext } from "../../../../State/UseState/UseContext";

const style = {
    position: "absolute",
    height: "80vh",
    minHeight: "80vh",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    p: 4,
    overflow: "auto",
};


const UpdateAssetModel = ({ handleClose, open, organisationId, assetId }) => {
    const { handleAlert } = useContext(TestContext);
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const queryClient = useQueryClient();
    const [error, setError] = useState();

    // Validation schema for the form
    const AssetSchema = z.object({
        assetName: z.string().min(1, "Asset name is required."),
        assetType: z.string().min(1, "Asset type is required."),
        description: z.string().optional(),
        purchaseDate: z.string().min(1, "Purchase date is required."),
        status: z.string().min(1, "Status is required."),
    });

    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({
        defaultValues: {
            assetName: "",
            assetType: "",
            description: "",
            purchaseDate: "",
            status: "Available",
        },
        resolver: zodResolver(AssetSchema),
    });

    // Fetch existing asset details
    const { data: assetData, isLoading } = useQuery(
        ["asset", assetId],
        () =>
            axios.get(`${import.meta.env.VITE_API}/route/get/one-assets/${assetId}`, {
                headers: {
                    Authorization: authToken,
                },
            }).then((res) => res.data.asset),
        {
            enabled: !!assetId,
            onSuccess: (data) => {
                console.log("data", data);

                reset({
                    assetName: data.assetName,
                    assetType: data.assetType,
                    description: data.description,
                    purchaseDate: data.purchaseDate ? new Date(data.purchaseDate).toISOString().split('T')[0] : '',
                    status: data.status,
                });

            },
        }
    );

    const UpdateAsset = useMutation(
        (data) =>
            axios.patch(
                `${import.meta.env.VITE_API}/route/update/assets/${assetId}`,
                data,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            ),
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["assets"] });
                handleClose();
                handleAlert(true, "success", "Asset updated successfully.");
            },
            onError: () => {
                setError("An error occurred while updating the asset.");
            },
        }
    );

    const onSubmit = async (data) => {
        try {
            const updatedData = {
                ...data,
                purchaseDate: data.purchaseDate || '', // Ensure purchaseDate is not null
            };
            await UpdateAsset.mutateAsync(updatedData);
        } catch (error) {
            console.error(error);
            handleAlert(true, "error", "Failed to update the asset.");
            setError("Failed to update the asset.");
        }
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
                className="border-none !z-10 !pt-0 !px-0 !w-[90%] lg:!w-[50%] md:!w-[60%] shadow-md outline-none rounded-md"
            >
                <div className="flex justify-between py-4 items-center px-4">
                    <h1 className="text-xl pl-2 font-semibold font-sans">Update Asset</h1>
                </div>

                {isLoading ? (
                    <div className="px-5 py-4">Loading asset details...</div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="px-5 space-y-4 mt-4">
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
                                placeholder="Type"
                                label="Type"
                                errors={errors}
                                error={errors.assetType}
                            />
                            <AuthInputFiled
                                name="description"
                                control={control}
                                type="text"
                                placeholder="Description"
                                label="Description"
                                errors={errors}
                                error={errors.description}
                            />
                            <AuthInputFiled
                                name="purchaseDate"
                                control={control}
                                type="date"
                                placeholder="Purchase Date"
                                label="Purchase Date *"
                                errors={errors}
                                error={errors.purchaseDate}
                            />
                           
                            <AuthInputFiled
                                name="status"
                                control={control}
                                type="text"
                                placeholder="Status"
                                label="Status"
                                errors={errors}
                                error={errors.status}
                            />


                            <div className="flex gap-4 mt-4 justify-end">
                                <Button onClick={handleClose} color="error" variant="outlined">
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" color="primary">
                                    Update
                                </Button>
                            </div>
                        </div>
                    </form>
                )}
            </Box>
        </Modal>
    );
};

export default UpdateAssetModel;
