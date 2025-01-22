import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
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

const CashInModel = ({ handleClose, open, organisationId }) => {

    const { handleAlert } = useContext(TestContext);
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const queryClient = useQueryClient();
    const [error, setError] = useState();

    // Validation schema for the form
    const CashInSchema = z.object({
        cashIn: z.string().min(1, "Cash is required."),
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

    const AddCashIn = useMutation(
        (data) =>
            axios.post(
                `${import.meta.env.VITE_API}/route/add/assets/${organisationId}`,
                data,
                { headers: { Authorization: authToken } }
            ),
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["expense"] });
                handleClose();
                handleAlert(true, "success", "Cash In added successfully.");
                reset();
            },
            onError: () => {
                setError("An error occurred while adding the cash.");
            },
        }
    );

    const onSubmit = async (data) => {
        try {
            console.log("Form Data:", data);
            await AddCashIn.mutateAsync(data);
        } catch (error) {
            console.error(error);
            handleAlert(true, "error", "Failed to add the cash.");
            setError("Failed to add the cash.");
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
                    <h1 className="text-xl pl-2 font-semibold font-sans">Add Cash</h1>
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
                            name="note"
                            control={control}
                            type="text"
                            placeholder="Notes"
                            label="Notes"
                            errors={errors}
                            error={errors.note}
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

export default CashInModel;
