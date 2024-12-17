import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { useState } from "react";
import ReusableModal from "../../components/Modal/component";
import HeaderBackComponent from "../../components/header/component";
import RemotePunchingTaskForm from "./components/RemotePunchingTaskForm";
import GetAddedTask from "./components/GetAddedTask";

const AddRemotePunchingTask = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <HeaderBackComponent
                heading={"Remote Punching Task"}
                oneLineInfo={`You can assign remote puching task`}
            />
            <div className="px-6 text-Brand-washed-blue/brand-washed-blue-10 py-4 ">
                <div className="flex justify-end items-center mb-3">
                    <Button
                        className="!h-fit gap-2 !w-fit "
                        variant="contained"
                        size="medium"
                        onClick={() => {
                            setOpen(true);
                        }}
                    >
                        <Add />Add task to employee
                    </Button>
                </div>
                <div>
                    <GetAddedTask />
                </div>
                <ReusableModal
                    className="h-[600px]"
                    open={open}
                    heading={"Add Remote Punching Task"}
                    subHeading={"Here you can add remote punching task"}
                    onClose={() => setOpen(false)}
                >
                    <RemotePunchingTaskForm onClose={() => setOpen(false)} />
                </ReusableModal>
            </div>
        </>
    );
};

export default AddRemotePunchingTask;
