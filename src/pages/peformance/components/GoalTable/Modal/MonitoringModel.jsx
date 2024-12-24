import { zodResolver } from "@hookform/resolvers/zod";
import { AttachFile, Close, Paid } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../../../State/Function/Main";
import AuthInputFiled from "../../../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../../../hooks/Token/useAuth";

const MonitoringModel = ({ handleClose, open, options, id, performance }) => {
  const { handleAlert } = useContext(TestContext);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    overflow: "scroll",
    maxHeigh: "80vh",
    p: 4,
  };

  const authToken = useAuthToken();
  const zodSchema = z.object({
    goal: z.string(),
    comments: z.string(),
    attachment: z.any().optional(),
  });

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      declaration: undefined,
      message: undefined,
    },
    resolver: zodResolver(zodSchema),
  });

  useEffect(() => {
    if (!open) {
      reset({
        comments: undefined,
        attachment: undefined,
      });
    }
    //eslint-disable-next-line
  }, [open]);

  console.log(!!watch("attachment"));

  const queryClient = useQueryClient();
  const performanceSetup = useMutation(
    async (data) => {
      await axios.patch(
        `${import.meta.env.VITE_API}/route/performance/updateSingleGoal/${id._id}`,
        { data },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", "Performance setup created successfully");
        queryClient.invalidateQueries("orggoals");
        handleClose();
      },
    }
  );

  const { isFetching } = useQuery({
    queryKey: ["getGoalMonitoring", id],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API}/route/performance/getSingleGoals/${id._id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return data;
    },
    enabled: !!id,

    onSuccess: (data) => {
      setValue("goal", data?.goal);
    },
  });

  const onSubmit = async (data) => {
    if (data.attachment) {
      // const file = data.attachment;
      return false;
    }
    const goals = {
      assignee: { label: id.empId._id, value: id.empId._id },
      comments: data.comments,
      // attachment: data.attachment,
      status: "Monitoring Completed",
      isMonitoringCompleted: true,
    };

    performanceSetup.mutate(goals);
  };

  useQuery("employee", async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API}/route/employee/getEmployeeUnderManager`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return data;
  });

  // const empoptions = getGoal?.assignee?.map((emp) => ({
  //   value: emp._id,
  //   label: `${emp.first_name} ${emp.last_name}`,
  //   image: emp.user_logo_url,
  // }));

  return (
    <>
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
          <div className="flex justify-between py-4 items-center  px-4">
            <h1 id="modal-modal-title" className="text-xl pl-2">
              Montoring Form
            </h1>
            <IconButton onClick={handleClose}>
              <Close className="!text-[16px]" />
            </IconButton>
          </div>

          {isFetching ? (
            <CircularProgress />
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="px-6 max-h-[80vh] overflow-auto "
            >
              <AuthInputFiled
                name="goal"
                icon={Paid}
                control={control}
                readOnly={true}
                type="text"
                placeholder="goal"
                label="Goal Name"
                errors={errors}
                error={errors.goal}
              />
              {/* <AuthInputFiled
                name="assignee"
                icon={PersonOutline}
                control={control}
                type="empselect"
                isMulti={false}
                options={empoptions}
                placeholder="Assignee name"
                label="Select assignee name"
                errors={errors}
                error={errors.assignee}
              /> */}
              <AuthInputFiled
                name="comments"
                icon={Paid}
                control={control}
                type="texteditor"
                placeholder="100"
                label="Add Montioring Points"
                errors={errors}
                error={errors.comments}
              />
              <AuthInputFiled
                name="attachment"
                icon={AttachFile}
                control={control}
                // accept={"image/png,image/gif,image/jpeg,image/webp"}
                type="Typefile"
                placeholder="100"
                label="Add attachments"
                errors={errors}
                error={errors.attachment}
              />
              {!!watch("attachment") && (
                <img
                  src={URL.createObjectURL(watch("attachment"))}
                  alt="attachment"
                  className="!w-20 !h-20 block relative"
                />
              )}
              <div className="flex gap-4  mt-4 mr-4 justify-end">
                <Button
                  type="button"
                  onClick={handleClose}
                  color="error"
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
              </div>
            </form>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default MonitoringModel;
