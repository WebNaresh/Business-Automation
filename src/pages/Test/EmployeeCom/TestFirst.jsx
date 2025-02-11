import { zodResolver } from "@hookform/resolvers/zod";
import {
  AccountBalance,
  LocationOn,
} from "@mui/icons-material";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useEmpState from "../../../hooks/Employee-OnBoarding/useEmpState";
import { Close } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";

export const isAtLeastNineteenYearsOld = (value) => {
  const currentDate = new Date();
  const dob = new Date(value);
  let differenceInYears = currentDate.getFullYear() - dob.getFullYear();
  const monthDiff = currentDate.getMonth() - dob.getMonth();

  // If the birth month is after the current month, reduce the age by 1
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && currentDate.getDate() < dob.getDate())
  ) {
    differenceInYears--;
  }

  return differenceInYears >= 19;
};

const TestFirst = ({ nextStep, isLastStep, prevStep }) => {
  const {
    setStep1Data,

  } = useEmpState();


  const EmployeeSchema = z.object({
    // Additional Fields
    emergency_contact_no: z.string().regex(/^\d{10}$/, { message: "Emergency contact must be 10 digits" }).optional(),
    emergency_contact_name: z.string().min(1, { message: "Emergency contact name is required" }).optional(),
    relationship_with_emergency_contact: z.string().optional(),
    alternate_contact_no: z.string().regex(/^\d{10}$/, { message: "Alternate contact must be 10 digits" }).optional(),
    parent_name: z.string().optional(),
    spouse_name: z.string().optional(),
    father_first_name: z.string().optional(),
    father_middal_name: z.string().optional(),
    father_last_name: z.string().optional(),
    father_occupation: z.string().optional(),
    mother_first_name: z.string().optional(),
    mother_middal_name: z.string().optional(),
    mother_last_name: z.string().optional(),
    mother_occupation: z.string().optional(),
    sibling_details: z
      .array(
        z.object({
          name: z.string(),
          occupation: z.string(),
          age: z.string(),
        })
      )
      .optional(),

  });

  const { control, formState, handleSubmit } = useForm({
    defaultValues: {},
    resolver: zodResolver(EmployeeSchema),
  });

  const { errors } = formState;

  console.log("errors", errors);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sibling_details",

  });


  const onSubmit = async (data) => {
    // Convert the email to lowercase
    const processedData = {
      ...data,
    };

    console.log(`🚀 ~ processedData:`, processedData);
    setStep1Data(processedData);
    nextStep();
  };



  return (
    <div className="w-full mt-1">
      <h1 className="text-2xl mb-3 font-bold">Family Details</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex  flex-1 space-y-1 flex-col"
      >
        <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">
          <AuthInputFiled
            name="emergency_contact_no"
            icon={LocationOn}
            control={control}
            type="number"
            placeholder="Emergency Contact No"
            label="Emergency Contact No"
            errors={errors}
            error={errors.emergency_contact_no}
            pattern="[A-Za-z\s]+"
            className="text-sm"
          />
          <AuthInputFiled
            name="emergency_contact_name"
            icon={AccountBalance}
            control={control}
            type="text"
            placeholder="Emergency Contact Name"
            label="Emergency Contact Name"
            errors={errors}
            error={errors.emergency_contact_name}
            className="text-sm"
          />
          <AuthInputFiled
            name="relationship_with_emergency_contact"
            icon={AccountBalance}
            control={control}
            type="text"
            placeholder="Relationship with Emeregency Contact"
            label="Relationship with Emeregency Contact"
            errors={errors}
            error={errors.relationship_with_emergency_contact}
            pattern="[A-Za-z\s]+"
            className=" text-sm"
          />
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-4">
          <AuthInputFiled
            name="parent_name"
            icon={LocationOn}
            control={control}
            type="text"
            placeholder="Parent Name"
            label="Parent Name"
            errors={errors}
            error={errors.parent_name}
            pattern="[A-Za-z\s]+"
            className="text-sm"
          />
          <AuthInputFiled
            name="spouse_name"
            icon={AccountBalance}
            control={control}
            type="text"
            placeholder="Spouse Name"
            label="Spouse Name"
            errors={errors}
            error={errors.spouse_name}
            className="text-sm"
          />
        </div>
        <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">
          <AuthInputFiled
            name="father_first_name"
            icon={LocationOn}
            control={control}
            type="text"
            placeholder="Father First Name"
            label="Father First Name"
            errors={errors}
            error={errors.father_first_name}
            pattern="[A-Za-z\s]+"
            className="text-sm"
          />
          <AuthInputFiled
            name="father_middal_name"
            icon={AccountBalance}
            control={control}
            type="text"
            placeholder="Father Middal Name"
            label="Father Middal Name"
            errors={errors}
            error={errors.father_middal_name}
            className="text-sm"
          />
          <AuthInputFiled
            name="father_last_name"
            icon={AccountBalance}
            control={control}
            type="text"
            placeholder="Father Last Name"
            label="Father Last Name"
            errors={errors}
            error={errors.father_last_name}
            pattern="[A-Za-z\s]+"
            className=" text-sm"
          />
        </div>

        <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">
          <AuthInputFiled
            name="mother_first_name"
            icon={LocationOn}
            control={control}
            type="text"
            placeholder="Mother First Name"
            label="Mother First Name"
            errors={errors}
            error={errors.mother_first_name}
            pattern="[A-Za-z\s]+"
            className="text-sm"
          />
          <AuthInputFiled
            name="mother_middal_name"
            icon={AccountBalance}
            control={control}
            type="text"
            placeholder="Mother Middal Name"
            label="Mother Middal Name"
            errors={errors}
            error={errors.mother_middal_name}
            className="text-sm"
          />
          <AuthInputFiled
            name="mother_last_name"
            icon={AccountBalance}
            control={control}
            type="text"
            placeholder="Mother Last Name"
            label="Mother Last Name"
            errors={errors}
            error={errors.mother_last_name}
            pattern="[A-Za-z\s]+"
            className=" text-sm"
          />
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-4">
          <AuthInputFiled
            name="father_occupation"
            icon={LocationOn}
            control={control}
            type="text"
            placeholder="Father Occupation"
            label="Father Occupation"
            errors={errors}
            error={errors.father_occupation}
            pattern="[A-Za-z\s]+"
            className="text-sm"
          />
          <AuthInputFiled
            name="mother_occupation"
            icon={AccountBalance}
            control={control}
            type="text"
            placeholder="Mother Occupation"
            label="Mother Occupation"
            errors={errors}
            error={errors.mother_occupation}
            className="text-sm"
          />
        </div>
        <div className="w-full mt-4">
          <h2 className="text-lg font-semibold">Sibling Details</h2>
          {fields.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-2 mt-2"
            >
              <AuthInputFiled
                name={`sibling_details.${index}.name`}
                control={control}
                type="text"
                placeholder="Name"
                errors={errors}
                error={errors.sibling_details?.[index]?.name}
                className="text-sm"
              />
              <AuthInputFiled
                name={`sibling_details.${index}.occupation`}
                control={control}
                type="text"
                placeholder="Occupation"
                errors={errors}
                error={errors.sibling_details?.[index]?.occupation}
                className="text-sm"
              />
              <AuthInputFiled
                name={`sibling_details.${index}.age`}
                control={control}
                type="text"
                placeholder="Age"
                errors={errors}
                error={errors.sibling_details?.[index]?.age}
                className="text-sm"
              />
              <IconButton
                onClick={() => remove(index)}
                size="small"
                color="error"
              >
                <Close />
              </IconButton>
            </div>
          ))}
          <Button
            variant="outlined"
            onClick={() => append({ name: "", role: "" })}
            className="mt-2"
          >
            Add Sibling
          </Button>
        </div>
        <div className="flex items-end w-full justify-between">
          <button
            type="button"
            onClick={() => {
              prevStep();
            }}
            className="!w-max flex group justify-center px-6  gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
          >
            Prev
          </button>
          <button
            type="submit"
            disabled={isLastStep}
            className="!w-max flex group justify-center px-6  gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestFirst;
