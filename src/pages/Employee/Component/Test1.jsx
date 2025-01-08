import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AccountBalance,
  AccountBox,
  ContactEmergency,
  Email,
  LocationOn,
  Person,
  TodayOutlined,
} from "@mui/icons-material";
import {
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import axios from "axios";
import { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import { z } from "zod";
import { UseContext } from "../../../State/UseState/UseContext";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useEmployeeState from "../../../hooks/Employee-OnBoarding/useEmployeeState";

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

const Test1 = ({ nextStep, isLastStep , prevStep }) => {
  // to define the state, import funciton and hook
  const {
    setStep1Data,
    first_name,
    last_name,
    email,
    gender,
    phone_number,
    address,
    citizenship,
    adhar_card_number,
    pan_card_number,
    bank_account_no,
    date_of_birth,
    pwd,
    uanNo,
    esicNo,
    height,
    weight,
    blood_group,
    voting_card_no,
    permanent_address,
    religion,
    smoking_habits,
    drinking_habits,
    sports_interest,
    favourite_book,
    favourite_travel_destination,
    disability_status,
    emergency_medical_condition,
    short_term_goal,
    long_term_goal,
    strength,
    weakness,
    bank_name,
    ifsc_code
  } = useEmployeeState();
  const { employeeId } = useParams();
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

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
    citizenship: z
      .string()
      .min(3, { message: "Minimum 3 characters required" })
      .regex(/^[a-zA-Z]+$/, { message: "Only characters allowed" }),
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
    pwd: z.boolean().optional(),
    uanNo: z
      .string()
      .refine((value) => value === "" || /^\d{12}$/.test(value), {
        message: "UAN number must be a 12-digit number",
      })
      .optional(),
    esicNo: z
      .string()
      .refine((value) => value === "" || /^\d{17}$/.test(value), {
        message: "ESIC number must be a 17-digit number",
      })
      .optional(),
    // Additional Fields
    height: z.string().optional(),
    weight: z.string().optional(),
    voting_card_no: z.string().optional(),
    blood_group: z.string().optional(),
    permanent_address: z.string().optional(),
    religion: z.string().optional(),
    smoking_habits: z.string().optional(),
    drinking_habits: z.string().optional(),
    sports_interest: z.string().optional(),
    favourite_book: z.string().optional(),
    favourite_travel_destination: z.string().optional(),
    disability_status: z.string().optional(),
    emergency_medical_condition: z.string().optional(),
    short_term_goal: z.string().optional(),
    long_term_goal: z.string().optional(),
    strength: z.string().optional(),
    weakness: z.string().optional(),
    bank_name: z.string().optional(),
    ifsc_code: z.string().optional(),
  });

  // use useForm
  const { control, formState, setValue, handleSubmit } = useForm({
    defaultValues: {
      first_name: first_name,
      last_name: last_name,
      date_of_birth: date_of_birth,
      email: email,
      gender: gender,
      phone_number: phone_number,
      address: address,
      citizenship: citizenship,
      adhar_card_number: adhar_card_number,
      pan_card_number: pan_card_number,
      bank_account_no: bank_account_no,
      pwd,
      uanNo: uanNo || undefined,
      esicNo: esicNo || undefined,
    },
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
          setValue("citizenship", data.employee.citizenship || "");
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
          setValue("uanNo", data.employee.uanNo || undefined);
          setValue("esicNo", data.employee.esicNo || undefined);
          setValue("pwd", data.employee.pwd || undefined);
          setValue("height", data.employee.height || "");
          setValue("weight", data.employee.weight || "");
          setValue("blood_group", data.employee.blood_group || "");
          setValue("voting_card_no", data.employee.voting_card_no || "");
          setValue("bank_name", data.employee.bank_name || "");
          setValue("ifsc_code", data.employee.ifsc_code || "");
          setValue("drinking_habits", data.employee.drinking_habits || "");
          setValue("sports_interest", data.employee.sports_interest || "");
          setValue("favourite_book", data.employee.favourite_book || "");
          setValue("favourite_travel_destination", data.employee.favourite_travel_destination || "");
          setValue("disability_status", data.employee.disability_status || "");
          setValue("emergency_medical_condition", data.employee.emergency_medical_condition || "");
          setValue("short_term_goal", data.employee.short_term_goal || "");
          setValue("long_term_goal", data.employee.long_term_goal || "");
          setValue("strength", data.employee.strength || "");
          setValue("weakness", data.employee.weakness || "");
         
        }
      },
    }
  );

  const { errors } = formState;
  // to define the onSumbit funciton
  const onSubmit = async (data) => {
    setStep1Data(data);
    nextStep();
  };

  return (
    <div className="w-full mt-4">
      <h1 className="text-2xl mb-4 font-bold">Personal Details</h1>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex  flex-1 space-y-2 flex-col"
          >
            <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-3">
              <AuthInputFiled
                name="first_name"
                icon={Person}
                control={control}
                type="text"
                placeholder="John"
                label="Employee First Name *"
                errors={errors}
                error={errors.first_name}
              />

              <AuthInputFiled
                name="last_name"
                icon={Person}
                control={control}
                type="text"
                placeholder="Doe"
                label="Employee Last Name *"
                errors={errors}
                error={errors.last_name}
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
              />
            </div>

            <AuthInputFiled
              name="email"
              icon={Email}
              control={control}
              type="text"
              placeholder="Employee Email"
              label="Employee Email *"
              errors={errors}
              error={errors.email}
            />

            <AuthInputFiled
              name="phone_number"
              icon={ContactEmergency}
              control={control}
              value={phone_number}
              type="text"
              placeholder="1234567890"
              label="Contact *"
              errors={errors}
              error={errors.phone_number}
            />

            <AuthInputFiled
              name="address"
              icon={Person}
              control={control}
              type="textarea"
              placeholder="Address"
              label="Current Address *"
              errors={errors}
              error={errors.address}
            />

            <AuthInputFiled
              name={"pwd"}
              placeholder={"Person with disability"}
              label={"Person with disability"}
              control={control}
              type="checkbox"
              errors={errors}
              error={errors.pwd}
            />

            <div className="space-y-1">
              <label
                htmlFor={"gender"}
                className={`${errors.gender && "text-red-500"
                  } text-gray-500 font-bold text-sm md:text-md`}
              >
                Gender *
              </label>
              <Controller
                control={control}
                name={"gender"}
                id={"gender"}
                render={({ field }) => (
                  <div
                    className={`flex items-center gap-5 rounded-md px-2 bg-white py-1 md:py-[6px]`}
                  >
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      {...field}
                    >
                      <FormControlLabel
                        value="female"
                        control={<Radio />}
                        label="Female"
                      />
                      <FormControlLabel
                        value="male"
                        control={<Radio />}
                        label="Male"
                      />
                      <FormControlLabel
                        value="transgender"
                        control={<Radio />}
                        label="Transgender"
                      />
                    </RadioGroup>
                  </div>
                )}
              />
              <div className="h-4 w-[200px] !z-50 !mb-1">
                <ErrorMessage
                  errors={errors}
                  name={"gender"}
                  render={({ message }) => (
                    <p className="text-sm mb-4 relative !bg-white text-red-500">
                      {message}
                    </p>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2">
              <AuthInputFiled
                name="adhar_card_number"
                icon={AccountBox}
                control={control}
                type="number"
                placeholder="Aadhar No"
                label="Employee Aadhar No *"
                errors={errors}
                error={errors.adhar_card_number}
              />
              <AuthInputFiled
                name="pan_card_number"
                icon={AccountBox}
                control={control}
                type="text"
                placeholder="Employee PAN No"
                label="Employee PAN No *"
                errors={errors}
                error={errors.pan_card_number}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2">
              <AuthInputFiled
                name="bank_account_no"
                icon={AccountBalance}
                control={control}
                type="number"
                placeholder="Bank Account No"
                label="Bank Account No*"
                errors={errors}
                error={errors.bank_account_no}
              />
              <AuthInputFiled
                name="citizenship"
                icon={LocationOn}
                control={control}
                type="text"
                placeholder="Citizenship Status"
                label="Citizenship Status *"
                errors={errors}
                error={errors.citizenship}
                pattern="[A-Za-z\s]+"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2">
              <AuthInputFiled
                name="uanNo"
                icon={AccountBalance}
                control={control}
                type="number"
                placeholder="UAN No"
                label="Employee UAN No"
                errors={errors}
                error={errors.uanNo}
              />
              <AuthInputFiled
                name="esicNo"
                icon={AccountBalance}
                control={control}
                type="text"
                placeholder="ESIC No"
                label="Employee ESIC No"
                errors={errors}
                error={errors.esicNo}
                pattern="[A-Za-z\s]+"
              />
            </div>

            <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">
              <AuthInputFiled
                name="height"
                icon={AccountBalance}
                control={control}
                type="text"
                placeholder="Height"
                label="Height"
                errors={errors}
                error={errors.height}
                className="text-sm
"
              />
              <AuthInputFiled
                name="weight"
                icon={AccountBalance}
                control={control}
                type="text"
                placeholder="Weight"
                label="Weight"
                errors={errors}
                error={errors.weight}
                pattern="[A-Za-z\s]+"
                className=" text-sm"
              />

              <AuthInputFiled
                name="blood_group"
                icon={LocationOn}
                control={control}
                type="text"
                placeholder="Blood Group"
                label="Blood Group"
                errors={errors}
                error={errors.blood_group}
                pattern="[A-Za-z\s]+"
                className="text-sm"
              />

            </div>


            <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">

              <AuthInputFiled
                name="voting_card_no"
                icon={AccountBalance}
                control={control}
                type="text"
                placeholder="Voting Card No"
                label="Voting Card No"
                errors={errors}
                error={errors.voting_card_no}
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
                className="text-sm
"
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
            </div>


            <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">
              <AuthInputFiled
                name="drinking_habits"
                icon={LocationOn}
                control={control}
                type="text"
                placeholder="Drinking Habbits"
                label="Drinking Habbits"
                errors={errors}
                error={errors.drinking_habits}
                pattern="[A-Za-z\s]+"
                className="text-sm"
              />

              <AuthInputFiled
                name="sports_interest"
                icon={AccountBalance}
                control={control}
                type="text"
                placeholder="Sport Interest"
                label="Sport Interest"
                errors={errors}
                error={errors.sports_interest}
                className="text-sm
"
              />
              <AuthInputFiled
                name="favourite_book"
                icon={AccountBalance}
                control={control}
                type="text"
                placeholder="Favourite Book"
                label="Favourite Book"
                errors={errors}
                error={errors.favourite_book}
                pattern="[A-Za-z\s]+"
                className=" text-sm"
              />
            </div>


            <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">
              <AuthInputFiled
                name="favourite_travel_destination"
                icon={LocationOn}
                control={control}
                type="text"
                placeholder="Favourite Travel Destination"
                label="Favourite Travel Destination"
                errors={errors}
                error={errors.favourite_travel_destination}
                pattern="[A-Za-z\s]+"
                className="text-sm"
              />

              <AuthInputFiled
                name="disability_status"
                icon={AccountBalance}
                control={control}
                type="text"
                placeholder="Disability Status"
                label="Disability Status"
                errors={errors}
                error={errors.disability_status}
                className="text-sm
"
              />
              <AuthInputFiled
                name="emergency_medical_condition"
                icon={AccountBalance}
                control={control}
                type="text"
                placeholder="Emergency Medical Condition"
                label="Emergency Medical Condition"
                errors={errors}
                error={errors.emergency_medical_condition}
                pattern="[A-Za-z\s]+"
                className=" text-sm"
              />
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-4">
              <AuthInputFiled
                name="short_term_goal"
                icon={LocationOn}
                control={control}
                type="text"
                placeholder="Short Term Goal"
                label="Short Term Goal"
                errors={errors}
                error={errors.short_term_goal}
                pattern="[A-Za-z\s]+"
                className="text-sm"
              />

              <AuthInputFiled
                name="long_term_goal"
                icon={AccountBalance}
                control={control}
                type="text"
                placeholder="Long Term Goal"
                label="Long Term Goal"
                errors={errors}
                error={errors.long_term_goal}
                className="text-sm
"
              />
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-4">
              <AuthInputFiled
                name="strength"
                icon={AccountBalance}
                control={control}
                type="text"
                placeholder="Strength"
                label="Strength"
                errors={errors}
                error={errors.strength}
                pattern="[A-Za-z\s]+"
                className=" text-sm"
              />
              <AuthInputFiled
                name="weakness"
                icon={LocationOn}
                control={control}
                type="text"
                placeholder="Weakness"
                label="Weakness"
                errors={errors}
                error={errors.weakness}
                pattern="[A-Za-z\s]+"
                className="text-sm"
              />
            </div>


            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLastStep}
                className="!w-max flex group justify-center px-6 gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
              >
                Next
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Test1;
