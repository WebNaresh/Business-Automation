import { zodResolver } from "@hookform/resolvers/zod";
import { Business, Person } from "@mui/icons-material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NotesIcon from "@mui/icons-material/Notes";
import React from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useDepartmentState from "../../../hooks/DepartmentHook/useDepartmentState";
import useDeptOption from "../../../hooks/DepartmentHook/useDeptOption";

const Step1 = ({ nextStep, isLastStep }) => {
  // state
  const organisationId = useParams();
  const {
    DepartmentLocationOptions,
    DepartmentHeadOptions,
    DelegateDepartmentHeadOptions,
  } = useDeptOption(organisationId);
  const {
    setStep1Data,
    dept_name,
    dept_description,
    dept_location,
    dept_head_name,
    dept_delegate_head_name,
  } = useDepartmentState();

  // to define the schema using zod
  const DepartmentSchema = z.object({
    dept_name: z
      .string()
      .min(2, { message: "Minimum two characters required" }),
    dept_description: z.string().optional(),
    dept_location: z.object({
      label: z.string(),
      value: z.string(),
    }),
    dept_head_name: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .optional(),
    dept_delegate_head_name: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .optional(),
  });

  // use useForm
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      dept_name: dept_name,
      dept_description: dept_description,
      dept_location: dept_location,
      dept_head_name: dept_head_name,
      dept_delegate_head_name: dept_delegate_head_name,
    },
    resolver: zodResolver(DepartmentSchema),
  });
  const { errors } = formState;

  // to define the onSubmit funciton
  const onSubmit = async (data) => {
    setStep1Data(data);
    nextStep();
  };

  return (
    <div className="w-full mt-4 px-2 sm:px-4 lg:px-6">
      <h1 className="text-xl mb-4 font-bold">Department Details</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col space-y-4"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AuthInputFiled
            name="dept_name"
            icon={Business}
            control={control}
            type="text"
            placeholder="Department Name"
            label="Department Name *"
            errors={errors}
            error={errors.dept_name}
          />
          <AuthInputFiled
            name="dept_location"
            value={dept_location}
            icon={LocationOnIcon}
            control={control}
            type="select"
            placeholder="Department Location"
            label="Select Department Location*"
            errors={errors}
            error={errors.dept_location}
            options={DepartmentLocationOptions}
          />
        </div>

        <AuthInputFiled
          name="dept_description"
          icon={NotesIcon}
          control={control}
          type="textarea"
          placeholder="Department Description"
          label="Department Description"
          errors={errors}
          error={errors.dept_description}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AuthInputFiled
            name="dept_head_name"
            value={dept_head_name}
            icon={Person}
            control={control}
            type="select"
            placeholder="Department Head"
            label="Select Department Head"
            errors={errors}
            error={errors.dept_head_name}
            options={DepartmentHeadOptions}
          />
          <AuthInputFiled
            name="dept_delegate_head_name"
            value={dept_delegate_head_name}
            icon={Person}
            control={control}
            type="select"
            placeholder="Delegate Department Head"
            label="Select Delegate Department Head"
            errors={errors}
            error={errors.dept_delegate_head_name}
            options={DelegateDepartmentHeadOptions}
          />
        </div>

        <div className="flex justify-end">
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

export default Step1;
