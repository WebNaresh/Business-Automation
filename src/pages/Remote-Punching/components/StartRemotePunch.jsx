import { PlayArrow } from "@mui/icons-material";
import { Button, Dialog, DialogContent, Fab } from "@mui/material";
import React, { useState } from "react";
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";
import StopRemotePunching from "./StopRemotePunching";
import useLocationMutation from "./useLocationMutation";

export default function StartRemotePunch() {
    const { start, setStart, setStartTime } = useSelfieStore();

    //get user image
    const { getUserImage } = useLocationMutation();

    //state
    const [open, setOpen] = useState(false);

    //handle operate function for face capture
    const handleOperate = () => {
        setOpen(false);
        getUserImage.mutate();
        setStartTime();
    };

    return (
        <>
            {!start ? (
                <Fab
                    onClick={() => setOpen(true)}
                    color="primary"
                    variant="extended"
                    className="!absolute bottom-12 right-12 !text-white"
                >
                    <PlayArrow sx={{ mr: 1 }} className={`animate-pulse text-white`} />
                    Start Remote Punch
                </Fab>
            ) : (
                <StopRemotePunching {...{ setStart }} />
            )}

            {/*confirmation dialog box*/}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent>
                    <div className="w-full text-center text-red-500">
                        <h1 className="font-semibold text-3xl">Confirm Action</h1>
                    </div>
                    <h1 className="text-lg mt-2">
                        Are you sure you want to start remote access?
                    </h1>
                    <div className="flex gap-4 mt-4">
                        <Button onClick={handleOperate} size="small" variant="contained">
                            Yes
                        </Button>
                        <Button
                            onClick={() => setOpen(false)}
                            variant="contained"
                            color="error"
                            size="small"
                        >
                            No
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}