import { zodResolver } from "@hookform/resolvers/zod";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import NotesIcon from "@mui/icons-material/Notes";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useDepartmentState from "../../../hooks/DepartmentHook/useDepartmentState";

const Step2 = ({ isLastStep, nextStep, prevStep }) => {
  // to define the state
  const {
    dept_cost_center_name,
    dept_cost_center_description,
    dept_id,
    dept_cost_center_id,
    setStep2Data,
  } = useDepartmentState();
 

  // to define the schema using zod
  const DepartmentSchema = z.object({
    dept_cost_center_name: z.string().optional(),
    dept_cost_center_description: z.string().optional(),
    dept_id: z.string(),
    dept_cost_center_id: z.string(),
  });
  
  // to define the useForm from react-hook-form
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      dept_cost_center_name: dept_cost_center_name,
      dept_cost_center_description: dept_cost_center_description,
      dept_id: dept_id,
      dept_cost_center_id: dept_cost_center_id,
    },
    resolver: zodResolver(DepartmentSchema),
  });

  const { errors } = formState;

  // to define the onSubmit funciton
  const onsubmit = (data) => {
    setStep2Data(data);
    nextStep();
  };

  return (
    <div className="w-full mt-4 px-2 sm:px-4 lg:px-6">
      <h1 className="text-xl mb-4 font-bold">Cost Center Info</h1>

      <form
        onSubmit={handleSubmit(onsubmit)}
        className="w-full flex flex-col space-y-4"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AuthInputFiled
            name="dept_cost_center_name"
            icon={MonetizationOnIcon}
            control={control}
            type="text"
            placeholder="Department Cost Center Name"
            label="Department Cost Center Name"
            errors={errors}
            error={errors.dept_cost_center_name}
          />
          <AuthInputFiled
            name="dept_cost_center_description"
            icon={NotesIcon}
            control={control}
            type="text"
            placeholder="Department Cost Center Description"
            label="Department Cost Center Description"
            errors={errors}
            error={errors.dept_cost_center_description}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AuthInputFiled
            name="dept_id"
            icon={FormatListNumberedIcon}
            control={control}
            type="text"
            placeholder="Department ID"
            label="Department ID *"
            errors={errors}
            error={errors.dept_id}
          />
          <AuthInputFiled
            name="dept_cost_center_id"
            icon={FormatListNumberedIcon}
            control={control}
            type="text"
            placeholder="Department Cost Center Id"
            label="Department Cost Center ID *"
            errors={errors}
            error={errors.dept_cost_center_id}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              prevStep();
            }}
            className="w-full sm:w-auto flex justify-center px-4 py-2 rounded-md text-md font-semibold text-white bg-blue-500 hover:bg-blue-700 focus:outline-none"
          >
            Prev
          </button>
          <button
            type="submit"
            disabled={isLastStep}
            className="w-full sm:w-auto flex justify-center px-4 py-2 rounded-md text-md font-semibold text-white bg-blue-500 hover:bg-blue-700 focus:outline-none"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2;
