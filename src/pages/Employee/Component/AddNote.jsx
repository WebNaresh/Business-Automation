// import { zodResolver } from "@hookform/resolvers/zod";
// import { Close } from "@mui/icons-material";
// import { Box, IconButton, Modal } from "@mui/material";
// import axios from "axios";
// import React, { useContext } from "react";
// import { useForm } from "react-hook-form";
// import { useMutation } from "react-query";
// import { z } from "zod";
// import { TestContext } from "../../../State/Function/Main";
// import { UseContext } from "../../../State/UseState/UseContext";
// import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// import { Abc, AccessTime, Work } from "@mui/icons-material";
// import { TodayOutlined, } from "@mui/icons-material";

// const AddNote = ({ open, handleClose, empId, organisationId }) => {
//     const { cookies } = useContext(UseContext);
//     const authToken = cookies["aegis"];
//     const { handleAlert } = useContext(TestContext);


//     // Define schema using Zod for form validation
//     const NoteSchema = z.object({
//         notes: z.string().min(1, "Note is required"),
//         date: z.string(),
//         time: z
//             .string()
//             .min(1, "time is required"),
//     });

//     const {
//         handleSubmit,
//         control,
//         reset,
//         formState: { errors },
//     } = useForm({
//         defaultValues: {
//             notes: "",
//         },
//         resolver: zodResolver(NoteSchema),
//     });

//     const addNote = useMutation(
//         (data) => {
//             return axios.post(
//                 `${import.meta.env.VITE_API}/route/note/add-note/${empId}/${organisationId}`,
//                 data,
//                 {
//                     headers: {
//                         Authorization: authToken,
//                     },
//                 }
//             );
//         },
//         {
//             onSuccess: (response) => {
//                 handleAlert(true, "success", "Note added successfully");
//                 handleClose();
//                 reset();
//             },
//             onError: (error) => {
//                 handleAlert(
//                     true,
//                     "error",
//                     error?.response?.data?.message ?? "Server Error, please try again"
//                 );
//             },
//         }
//     );

//     const onSubmit = (data) => {
//         addNote.mutate(data);
//     };

//     const modalStyle = {
//         position: "absolute",
//         top: "50%",
//         left: "50%",
//         transform: "translate(-50%, -50%)",
//         bgcolor: "background.paper",
//         overflow: "auto",
//         maxHeight: "80vh",
//         p: 4,
//     };

//     return (
//         <Modal
//             open={open}
//             onClose={handleClose}
//             aria-labelledby="modal-modal-title"
//             aria-describedby="modal-modal-description"
//         >
//             <Box sx={modalStyle} className="border-none !z-10 !pt-0 !px-0 w-max shadow-md outline-none rounded-md">
//                 <section className="p-2 px-4 flex space-x-2 ">
//                     <article className="w-full rounded-md ">
//                         <div className="flex w-[500px] p-4 items-center flex-col gap-5 justify-center overflow-hidden bg-white">
//                             <div className="w-full">
//                                 <div className="flex items-center justify-between">
//                                     <h1 className="text-3xl text-gray-700 font-semibold tracking-tight">
//                                         Add Note
//                                     </h1>
//                                     <IconButton onClick={handleClose}>
//                                         <Close className="!text-lg" />
//                                     </IconButton>
//                                 </div>
//                             </div>
//                             <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
//                                 <AuthInputFiled
//                                     label="Note*"
//                                     name="notes"
//                                     control={control}
//                                     type="text"
//                                     placeholder="Note"
//                                     errors={errors}
//                                     error={errors.notes}
//                                     className="text-sm"
//                                 />
//                                 <AuthInputFiled
//                                     name="date"
//                                     icon={TodayOutlined}
//                                     control={control}
//                                     type="date"
//                                     placeholder="dd-mm-yyyy"
//                                     label="Date*"
//                                     errors={errors}
//                                     error={errors.date}
//                                 />
//                                 <AuthInputFiled
//                                     name="time"
//                                     icon={AccessTime}
//                                     control={control}
//                                     type="time"
//                                     placeholder="Enter Time"
//                                     label="Enter time *"
//                                     readOnly={false}
//                                     maxLimit={15}
//                                     errors={errors}
//                                     error={errors.time}
//                                 />
//                                 <div className="flex space-x-4 mt-4">
//                                     <button
//                                         type="submit"
//                                         className="py-2 rounded-md border font-bold w-full bg-blue-500 text-white"
//                                     >
//                                         Reminder
//                                     </button>
//                                     <button
//                                         type="submit"
//                                         className="py-2 rounded-md border font-bold w-full bg-blue-500 text-white"
//                                     >
//                                         Add
//                                     </button>
//                                 </div>
//                             </form>

//                         </div>
//                     </article>
//                 </section>
//             </Box>
//         </Modal>
//     );
// };

// export default AddNote;
import { zodResolver } from "@hookform/resolvers/zod";
import { Close } from "@mui/icons-material";
import { Box, IconButton, Modal, FormControlLabel, Checkbox } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import { AccessTime, TodayOutlined } from "@mui/icons-material";

const AddNote = ({ open, handleClose, empId, organisationId }) => {
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const { handleAlert } = useContext(TestContext);
    const [isReminder, setIsReminder] = useState(false);

    // Define schema using Zod for form validation
    const NoteSchema = z.object({
        notes: z.string().min(1, "Note is required"),
        description: z.string().optional(),
        date: z.string().optional(),
        time: z.string().optional(),
    });

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            notes: "",
            description: "",
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
            onSuccess: () => {
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

    const modalStyle = {
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
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle} className="border-none !z-10 !pt-0 !px-0 w-max shadow-md outline-none rounded-md">
                <section className="p-2 px-4 flex space-x-2">
                    <article className="w-full rounded-md">
                        <div className="flex w-[500px] p-4 items-center flex-col gap-5 justify-center overflow-hidden bg-white">
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
                                {/* Notes Field (Bold Label & Bold Input Text) */}
                                <AuthInputFiled
                                    label={<strong>Note*</strong>}
                                    name="notes"
                                    control={control}
                                    type="text"
                                    placeholder="Note"
                                    errors={errors}
                                    error={errors.notes}
                                    className="text-sm font-bold" // Ensures entered text is bold
                                    sx={{ input: { fontWeight: "bold" } }} // If using MUI, this ensures bold text inside the input
                                />

                                {/* Description Field */}
                                <AuthInputFiled
                                    label="Description"
                                    name="description"
                                    control={control}
                                    type="text"
                                    placeholder="Enter description"
                                    errors={errors}
                                    error={errors.description}
                                    className="text-sm"
                                />

                                {/* Is Reminder Checkbox */}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isReminder}
                                            onChange={(e) => setIsReminder(e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Set Reminder"
                                />

                                {/* Conditional Date & Time Fields */}
                                {isReminder && (
                                    <>
                                        <AuthInputFiled
                                            name="date"
                                            icon={TodayOutlined}
                                            control={control}
                                            type="date"
                                            placeholder="dd-mm-yyyy"
                                            label="Date"
                                            errors={errors}
                                            error={errors.date}
                                        />
                                        <AuthInputFiled
                                            name="time"
                                            icon={AccessTime}
                                            control={control}
                                            type="time"
                                            placeholder="Enter Time"
                                            label="Time"
                                            readOnly={false}
                                            maxLimit={15}
                                            errors={errors}
                                            error={errors.time}
                                        />
                                    </>
                                )}

                                <div className="flex space-x-4 mt-4">
                                    <button
                                        type="submit"
                                        className="py-2 rounded-md border font-bold w-full bg-[#174E63] text-white"
                                    >
                                        Submit
                                    </button>
                                </div>

                            </form>
                        </div>
                    </article>
                </section>
            </Box>
        </Modal>
    );
};

export default AddNote;
