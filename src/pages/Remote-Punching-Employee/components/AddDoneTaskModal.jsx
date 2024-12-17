import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import { TestContext } from "../../../State/Function/Main";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import UserProfile from '../../../hooks/UserData/useUser';
import AssignmentIcon from '@mui/icons-material/Assignment';

const AddDoneTaskModal = ({ taskData, onClose, userLocationData, punchObjectId }) => {

    const { handleAlert } = useContext(TestContext);
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const { organisationId } = useParams();
    const queryClient = useQueryClient();

    const { getCurrentUser } = UserProfile();
    const user = getCurrentUser();
    const employeeEmail = user?.email;

    const formSchema = z.object({
        taskName: z
            .object({
                label: z.string(),
                value: z.string(),
                taskId: z.string(),
            })
            .optional(),
        comments: z.string().min(3, { message: "required" }),
        status: z
            .object({
                label: z.string(),
                value: z.string(),
            })
            .optional(),
    });

    const { control, formState: { errors }, handleSubmit, reset } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            taskName: '',
            comments: '',
            status: '',
        },
    });

    useEffect(() => {
        if (taskData) {
            reset({
                taskName: taskData.taskName,
                comments: taskData.comments,
                status: taskData.status,
            });
        }
    }, [taskData, reset]);

    const onSubmit = (data) => {
        const updatedData = {
            taskName: data.taskName.label,
            comments: data.comments,
            status: data.status.value,
            latitude: userLocationData.latitude,
            longitude: userLocationData.longitude,
        };

        const taskId = data.taskName.taskId;
        const subtaskId = data.taskName.value;

        updateTaskStatus.mutate({ ...updatedData, taskId, subtaskId });
    };

    const updateTaskStatus = useMutation(
        async (data) => {
            await axios.patch(
                `${process.env.REACT_APP_API}/route/update-tasks-status/${organisationId}/${data.taskId}/${data.subtaskId}/${employeeEmail}`,
                {
                    status: data.status,
                    comments: data.comments,
                    location: {
                        lat: data.latitude,
                        long: data.longitude,
                    },
                    punchObjectId: punchObjectId
                },
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
        },
        {
            onSuccess: () => {
                handleAlert(true, "success", "Task status updated successfully.");
                onClose();
                queryClient.invalidateQueries("tasks");
            },
            onError: (err) => {
                handleAlert(true, "error", `Error: ${err.message}`);
            },
        }
    );

    const { data, error, isLoading } = useQuery(
        ["acceptTask", organisationId],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/set-remote-task/${organisationId}/accepted-tasks/${employeeEmail}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response;
        },
        { enabled: !!employeeEmail }
    );


    const options = data?.data?.tasks.flatMap(task =>
        task.acceptedSubtasks.map(subtask => ({
            value: subtask.subtaskId,
            label: subtask.subtaskName,
            taskId: task.taskId,
        }))
    ) || [];

    const statusData = [
        { value: "Completed", label: "Completed" },
        { value: "Progress", label: "Progress" },
    ];

    console.log("data", data);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-4 overflow-scroll h-[auto]"
        >
            <div className="w-full">
                <AuthInputFiled
                    name="taskName"
                    icon={AssignmentIcon}
                    control={control}
                    type="select"
                    placeholder="Select taskName"
                    label="Select Task"
                    errors={errors}
                    error={errors.taskName}
                    options={options}
                />

                <AuthInputFiled
                    name="comments"
                    control={control}
                    type="textarea"
                    placeholder="Enter comments"
                    label="Enter Comments*"
                    errors={errors}
                    error={errors.comments}
                />

                <AuthInputFiled
                    name="status"
                    icon={AssignmentIcon}
                    control={control}
                    type="select"
                    placeholder="Task status"
                    label="Task Status"
                    errors={errors}
                    error={errors.status}
                    options={statusData}
                />

                <div className="flex justify-end gap-2">
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                        Submit
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default AddDoneTaskModal;
