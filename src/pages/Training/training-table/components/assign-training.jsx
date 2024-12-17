import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarMonth, CalendarToday, Person } from "@mui/icons-material";
import { Box, Button, Modal } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import useTrainingDetailsMutation from "./mutation";

const trainingAssign = z.object({
  employeeId: z
    .array(z.string())
    .min(1, { message: "Select at least one employee" })
    .max(10, { message: "Select at most 10 employees" })
    .nonempty({ message: "Select at least one employee" }),
  startDate: z.string(),
  endDate: z.string(),
});

const AssignTraining = ({ open, setOpen, employees, doc }) => {
  const { control, formState, handleSubmit, watch } = useForm({
    defaultValues: {
      employeeId: [],
    },
    resolver: zodResolver(trainingAssign),
  });
  const { errors } = formState;
  const { assignEmployee } = useTrainingDetailsMutation();
  const onSubmit = (data) => {
    assignEmployee({ data, trainingId: doc?._id, close: () => setOpen(false) });
  };
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      keepMounted={false}
    >
      <Box className="border-none shadow-md outline-none rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] md:w-[70%] z-10 p-4 bg-white">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-end"
        >
          <AuthInputFiled
            className={""}
            name={"employeeId"}
            icon={Person}
            control={control}
            type="mutltiselect"
            placeholder={"e.g. Select Employee *"}
            label={` Select Employees *`}
            errors={errors}
            error={errors?.employeeId}
            options={employees}
          />
          <div className="grid grid-cols-2 w-full gap-2 mb-4">
            <AuthInputFiled
              className={""}
              name={"startDate"}
              icon={CalendarToday}
              control={control}
              type="date"
              placeholder={"e.g. Start Date *"}
              label={` Start Date *`}
              errors={errors}
              error={errors?.startDate}
              min={new Date().toISOString().split("T")[0]}
            />
            <AuthInputFiled
              className={""}
              name={"endDate"}
              icon={CalendarMonth}
              control={control}
              type="date"
              placeholder={"e.g. End Date *"}
              label={` End Date *`}
              errors={errors}
              error={errors?.endDate}
              min={watch("startDate")}
            />
          </div>
          <Button variant={"contained"} className="!w-fit" type="submit">
            Assign
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AssignTraining;
