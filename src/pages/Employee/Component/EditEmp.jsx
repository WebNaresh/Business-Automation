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
import {
    AccountBalance,
    AccountBox,
    ContactEmergency,
    Email,
    Person,
    TodayOutlined,
    Key,
    KeyOff,
} from "@mui/icons-material";
import { Controller } from "react-hook-form";
import { FormControlLabel, Radio, RadioGroup, } from "@mui/material";
import useEmpState from "../../../hooks/Employee-OnBoarding/useEmpState";
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
const isAtLeastNineteenYearsOld = (value) => {
    const currentDate = new Date();
    const dob = new Date(value);
    let differenceInYears = currentDate.getFullYear() - dob.getFullYear();
    const monthDiff = currentDate.getMonth() - dob.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && currentDate.getDate() < dob.getDate())
    ) {
        differenceInYears--;
    }

    return differenceInYears >= 19;
};

const EditEmp = ({ handleClose, open, organisationId, employeeId }) => {

    const { handleAlert } = useContext(TestContext);
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const queryClient = useQueryClient();
    const [error, setError] = useState();

    const {
        phone_number,
    } = useEmpState();
    
    // to define the scema using zod
    const EmployeeSchema = z.object({
        first_name: z
            .string()
            .min(1, { message: "Minimum 1 character required" })
            .max(15, { message: "Maximum 15 character allowed" })
            .regex(/^[a-zA-Z]+$/, { message: "Only characters allowed" }),
        last_name: z
            .string()
            .min(1, { message: "Minimum 1 character required" })
            .max(15, { message: "Maximum 15 character allowed" })
            .regex(/^[a-zA-Z]+$/, { message: "Only characters allowed" }),
        password: z
            .string()
            .min(8)
            .refine((value) => passwordRegex.test(value), {
                message:
                    "Password must be 8+ characters  with 1 number and 1 special character.",
            }),
        confirmPassword: z.string(),
        gender: z.string(),
        email: z.string().email(),
        phone_number: z
            .string()
            .max(10, { message: "Phone Number must be 10 digits" })
            .refine((value) => value.length === 10, {
                message: "Phone Number must be exactly 10 digits",
            }),
        address: z.string(),
        date_of_birth: z.string().refine(isAtLeastNineteenYearsOld, {
            message: "Employee must be at least 19 years old",
        }),
        adhar_card_number: z
            .string()
            .length(12, { message: "Aadhar number must be 12 digits." })
            .regex(/^(?:0|[1-9]\d*)$/, {
                message: "Aadhar number cannot be negative.",
            }),
        pan_card_number: z
            .string()
            .regex(/^([A-Z]){5}([0-9]){4}([A-Z]){1}$/, {
                message: "Invalid PAN No.",
            })
            .regex(/^[^*@]+$/, {
                message: "PAN No cannot contain special characters, e.g., *,#.",
            }),
        bank_account_no: z
            .string()
            .max(35, { message: "Only 35 numbers allowed" })
            .regex(/^\d*$/, {
                message: "Bank account number cannot be negative.",
            }),
        permanent_address: z.string().optional(),
        bank_name: z.string().optional(),
        ifsc_code: z.string().optional(),
        isContract: z.boolean().optional(),
    });


    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({
        defaultValues: {},
        resolver: zodResolver(EmployeeSchema),
    });

    // for getting the data existing employee and set the value
    const { isLoading } = useQuery(
        ["employeeId", employeeId],
        async () => {
            if (employeeId !== null && employeeId !== undefined) {
                const response = await axios.get(
                    `${import.meta.env.VITE_API}/route/employee/get/profile/${employeeId}`,
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );

                return response.data;
            }
        },
        {
            onSuccess: (data) => {
                if (data) {
                    console.log("data", data);
                    setValue("first_name", data.employee.first_name || "");
                    setValue("last_name", data.employee.last_name || "");
                    setValue(
                        "date_of_birth",
                        data.employee.date_of_birth
                            ? new Date(data.employee.date_of_birth)
                                .toISOString()
                                .split("T")[0]
                            : ""
                    );
                    setValue("email", data.employee.email || "");
                    setValue("gender", data.employee.gender || "");
                    setValue("phone_number", data.employee.phone_number || "");
                    setValue("address", data.employee.address || "");
                    setValue(
                        "adhar_card_number",
                        data.employee.adhar_card_number !== null &&
                            data.employee.adhar_card_number !== undefined
                            ? data.employee.adhar_card_number.toString()
                            : ""
                    );
                    setValue(
                        "pan_card_number",
                        data.employee.pan_card_number !== null &&
                            data.employee.pan_card_number !== undefined
                            ? data.employee.pan_card_number
                            : ""
                    );
                    setValue(
                        "bank_account_no",
                        data.employee.bank_account_no !== null &&
                            data.employee.bank_account_no !== undefined
                            ? data.employee.bank_account_no.toString()
                            : ""
                    );
                    setValue("bank_name", data.employee.bank_name || "");
                    setValue("ifsc_code", data.employee.ifsc_code || "");
                }
            },
        }
    );


    const update = useMutation(
        (data) =>
            axios.patch(
                `${import.meta.env.VITE_API}/route/employee/update/${organisationId}/${employeeId}`,
                data,
                { headers: { Authorization: authToken } }
            ),
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["add-emp"] });
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
                            name="first_name"
                            icon={Person}
                            control={control}
                            type="text"
                            placeholder="John"
                            label="First Name *"
                            errors={errors}
                            error={errors.first_name}
                            className="text-sm"
                        />

                        <AuthInputFiled
                            name="last_name"
                            icon={Person}
                            control={control}
                            type="text"
                            placeholder="Deo"
                            label="Last Name *"
                            errors={errors}
                            error={errors.last_name}
                            className="text-sm"
                        />
                        <AuthInputFiled
                            name="email"
                            icon={Email}
                            control={control}
                            type="text"
                            placeholder="abc@gmail.com"
                            label="Email *"
                            errors={errors}
                            error={errors.email}
                            className="text-sm"
                        />

                        <div className=" ">
                            <label
                                htmlFor={"gender"}
                                className={`${errors.gender && "text-red-500"
                                    }  text-gray-500  font-bold  text-sm `}
                            >
                                Gender *
                            </label>
                            <Controller
                                control={control}
                                name={"gender"}
                                id={"gender"}
                                render={({ field }) => (
                                    <>
                                        <div
                                            className={`flex items-center gap-5 rounded-md  px-2   bg-white py-1 md:py-[4px]`}
                                        >
                                            <RadioGroup
                                                row
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                {...field}
                                            >
                                                <FormControlLabel
                                                    value="female"
                                                    // control={<Radio />}
                                                    control={<Radio size="small" />}
                                                    label="Female"
                                                />
                                                <FormControlLabel
                                                    value="male"
                                                    // control={<Radio />}
                                                    control={<Radio size="small" />}
                                                    label="Male"
                                                />
                                                <FormControlLabel
                                                    value="transgender"
                                                    // control={<Radio />}
                                                    control={<Radio size="small" />}
                                                    label="Transgender"
                                                />
                                            </RadioGroup>
                                        </div>
                                    </>
                                )}
                            />
                        </div>

                        <AuthInputFiled
                            name="address"
                            icon={Person}
                            control={control}
                            // type="textarea"
                            type="text"
                            placeholder="Pune"
                            label="Current Address *"
                            errors={errors}
                            error={errors.address}
                            className="text-sm"
                        />

                        <AuthInputFiled
                            name="date_of_birth"
                            icon={TodayOutlined}
                            control={control}
                            type="date"
                            placeholder="dd-mm-yyyy"
                            label="Date Of Birth *"
                            errors={errors}
                            error={errors.date_of_birth}
                            className="text-sm"
                        />

                        <AuthInputFiled
                            name="adhar_card_number"
                            icon={AccountBox}
                            control={control}
                            type="number"
                            placeholder="Aadhar No"
                            label="Aadhar No *"
                            errors={errors}
                            error={errors.adhar_card_number}
                            className=" text-sm"
                        />
                        <AuthInputFiled
                            name="pan_card_number"
                            icon={AccountBox}
                            control={control}
                            type="text"
                            placeholder="PAN No"
                            label="PAN No *"
                            errors={errors}
                            error={errors.pan_card_number}
                            className=" text-sm"
                        />

                        <AuthInputFiled
                            name="phone_number"
                            icon={ContactEmergency}
                            control={control}
                            value={phone_number}
                            type="number"
                            placeholder="1234567890"
                            label="Contact No*"
                            errors={errors}
                            error={errors.phone_number}
                            className="text-sm"
                        />

                        <AuthInputFiled
                            name="bank_account_no"
                            icon={AccountBalance}
                            control={control}
                            type="number"
                            placeholder="Bank Account No"
                            label="Bank Account No*"
                            errors={errors}
                            error={errors.bank_account_no}
                            className="text-sm"
                        />
                        <AuthInputFiled
                            name="bank_name"
                            icon={AccountBalance}
                            control={control}
                            type="text"
                            placeholder="Bank Name"
                            label="Bank Name"
                            errors={errors}
                            error={errors.bank_name}
                            className="text-sm"
                        />
                        <AuthInputFiled
                            name="ifsc_code"
                            icon={AccountBalance}
                            control={control}
                            type="text"
                            placeholder="IFSC Code"
                            label="IFSC Code"
                            errors={errors}
                            error={errors.ifsc_code}
                            pattern="[A-Za-z\s]+"
                            className=" text-sm"
                        />
                        <AuthInputFiled
                            name={"isContract"}
                            placeholder={"Is Contract"}
                            label={"Is Contract"}
                            control={control}
                            type="checkbox"
                            errors={errors}
                            error={errors.isContract}
                            className="mt-2 pt-2 text-sm"
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

export default EditEmp;
