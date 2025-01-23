import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";


const style = {
    position: "absolute",
    height: "50vh",
    minHeight: "60vh",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    p: 4,
    overflow: "auto",
};

const UpdateModel = ({ handleClose, open, organisationId, id }) => {

    const { handleAlert } = useContext(TestContext);
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const queryClient = useQueryClient();
    const [error, setError] = useState(); 

    console.log("id" , id);
    

    // Validation schema for the form
    const CashInSchema = z.object({
        cashIn: z.string().min(1, "Cash is required."),
        cashOut: z.string().min(1, "Cash is required."),
        transactionCategory: z.string().optional(),
        note: z.string().optional(),
    });

    const {
        control,
        formState: { errors },
        handleSubmit,
        reset, 
    } = useForm({
        defaultValues: {},
        resolver: zodResolver(CashInSchema),
    });


    // Fetch existing asset details
    const { isLoading } = useQuery(
        ["expense", id],
        async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API}/route/get/get-one/${id}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data.data;
        },
        {
            enabled: !!id, // Only fetch if assetId exists
            onSuccess: (data) => {
                console.log("Fetched data:", data);
                reset({
                    cashIn: data?.cashIn !== undefined ? String(data.cashIn) : "",
                    cashOut: data?.cashOut !== undefined ? String(data.cashOut) : "",
                    transactionCategory: data?.transactionCategory || "",
                    note: data?.note || ""

                });
            },
            onError: () => {
                handleAlert(true, "error", "Failed to fetch asset details.");
            },
        }
    );

    const update = useMutation(
        (data) =>
            axios.patch(
                `${import.meta.env.VITE_API}/route/update/${id}`,
                data,
                { headers: { Authorization: authToken } }
            ),
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["expense"] });
                handleClose();
                handleAlert(true, "success", "Data updated successfully.");
                reset();
            },
            onError: () => {
                setError("An error occurred while update the data.");
            },
        }
    );

    const onSubmit = async (data) => {
        try {
            console.log("Form Data:", data);
            await update.mutateAsync(data);
        } catch (error) {
            console.error(error);
            handleAlert(true, "error", "Failed to update the data.");
            setError("Failed to update the data.");
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
                    <h1 className="text-xl pl-2 font-semibold font-sans">Update Cash</h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="px-5 space-y-4 mt-4">
                        <AuthInputFiled
                            name="cashIn"
                            control={control}
                            type="number"
                            placeholder="Cash In"
                            label="Cash In*"
                            errors={errors}
                            error={errors.cashIn}
                        />
                         <AuthInputFiled
                            name="cashOut"
                            control={control}
                            type="number"
                            placeholder="Cash Out"
                            label="Cash Out*"
                            errors={errors}
                            error={errors.cashOut}

                        />
                        <AuthInputFiled
                            name="note"
                            control={control}
                            type="text"
                            placeholder="Notes"
                            label="Notes"
                            errors={errors}
                            error={errors.note}
                        />
                        <AuthInputFiled
                            name="transactionCategory"
                            control={control}
                            type="text"
                            placeholder="Transaction Categorory"
                            label="Transaction Categorory"
                            errors={errors}
                            error={errors.transactionCategory}
                        />

                        <div className="flex gap-4 mt-4 justify-end">
                            <Button onClick={handleClose} color="error" variant="outlined">
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary">
                                Submit
                            </Button>
                        </div>
                    </div>
                </form>
            </Box>
        </Modal>
    );
};

export default UpdateModel;
