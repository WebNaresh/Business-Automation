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
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useEmpState from "../../../hooks/Employee-OnBoarding/useEmpState";

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

const TestFirst = ({ nextStep, prevStep, isFirstStep, isLastStep }) => {
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
    emergency_contact_no,
    emergency_contact_name,
    relationship_with_emergency_contact,
    alternate_contact_no,
    height,
    weight,
    blood_group,
    voting_card_no,
    permanent_address,
    religion,
    parent_name,
    spouse_name,
    father_first_name,
    father_middal_name,
    father_last_name,
    father_occupation,
    mother_first_name,
    mother_middal_name,
    mother_last_name,
    mother_occupation,
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
  } = useEmpState();

  console.log("test");

  const EmployeeSchema = z.object({
    first_name: z
      .string()
      .min(1, { message: "Minimum 1 character required" })
      .max(15, { message: "Maximum 15 characters allowed" })
      .regex(/^[a-zA-Z]+$/, { message: "Only letters allowed" }),
    last_name: z
      .string()
      .min(1, { message: "Minimum 1 character required" })
      .max(15, { message: "Maximum 15 characters allowed" })
      .regex(/^[a-zA-Z]+$/, { message: "Only letters allowed" }),
    gender: z.string(),
    email: z
      .string()
      .email({ message: "Invalid email format" })
      .regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, {
        message: "Email must be in lowercase and should not contain capital letters",
      }),
    phone_number: z
      .string()
      .regex(/^\d*$/, {
        message: "Phone Number must be non-negative and contain only digits",
      })
      .refine((value) => value.length === 10 || value.length === 0, {
        message: "Phone Number must be exactly 10 digits or empty",
      }),
    address: z.string(),
    date_of_birth: z.string().refine(isAtLeastNineteenYearsOld, {
      message: "Employee must be at least 19 years old",
    }),
    citizenship: z
      .string()
      .min(3, { message: "Minimum 3 characters required" })
      .regex(/^[a-zA-Z]+$/, { message: "Only letters allowed" }),
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
    emergency_contact_no: z.string().regex(/^\d{10}$/, { message: "Emergency contact must be 10 digits" }).optional(),
    emergency_contact_name: z.string().min(1, { message: "Emergency contact name is required" }).optional(),
    relationship_with_emergency_contact: z.string().optional(),
    alternate_contact_no: z.string().regex(/^\d{10}$/, { message: "Alternate contact must be 10 digits" }).optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    voting_card_no: z.string().optional(),
    blood_group: z.string().optional(),
    permanent_address: z.string().optional(),
    religion: z.string().optional(),
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
    ifsc_code: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, { message: "Invalid IFSC code" }).optional(),

  });


  const { control, formState, handleSubmit } = useForm({
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
      uanNo: uanNo ? uanNo : undefined,
      esicNo: esicNo ? esicNo : undefined,
    },
    resolver: zodResolver(EmployeeSchema),
  });

  const { errors } = formState;

  console.log("errors", errors);


  // const onSubmit = async (data) => {
  //   console.log(`🚀 ~ data:`, data);
  //   setStep1Data(data);
  //   nextStep();
  // };

  const onSubmit = async (data) => {
    // Convert the email to lowercase
    const processedData = {
      ...data,
      email: data.email.toLowerCase(), // Ensure the email is in lowercase
    };

    console.log(`🚀 ~ processedData:`, processedData);
    setStep1Data(processedData);
    nextStep();
  };



  return (
    <div className="w-full mt-1">
      <h1 className="text-2xl mb-3 font-bold">Personal Details</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex  flex-1 space-y-1 flex-col"
      >

        <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">
          <AuthInputFiled
            name="first_name"
            icon={Person}
            control={control}
            type="text"
            placeholder="John"
            label="First Name *"
            errors={errors}
            error={errors.first_name}
            className="text-sm"
          />

          <AuthInputFiled
            name="last_name"
            icon={Person}
            control={control}
            type="text"
            placeholder="Deo"
            label="Last Name *"
            errors={errors}
            error={errors.last_name}
            className="text-sm"
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
            className="text-sm"
          />
        </div>
        <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">
          <AuthInputFiled
            name="email"
            icon={Email}
            control={control}
            type="text"
            placeholder="abc@gmail.com"
            label="Email *"
            errors={errors}
            error={errors.email}
            className="text-sm"
          />

          <AuthInputFiled
            name="phone_number"
            icon={ContactEmergency}
            control={control}
            value={phone_number}
            type="number"
            placeholder="1234567890"
            label="Contact *"
            errors={errors}
            error={errors.phone_number}
            className="text-sm"
          />

          <AuthInputFiled
            name="address"
            icon={Person}
            control={control}
            // type="textarea"
            type="text"
            placeholder="Pune"
            label="Current Address *"
            errors={errors}
            error={errors.address}
            className="text-sm"
          />
        </div>

        <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">
          <div className=" ">
            <label
              htmlFor={"gender"}
              className={`${errors.gender && "text-red-500"
                }  text-gray-500  font-bold  text-sm `}
            >
              Gender *
            </label>
            <Controller
              control={control}
              name={"gender"}
              id={"gender"}
              render={({ field }) => (
                <>
                  <div
                    className={`flex items-center gap-5 rounded-md  px-2   bg-white py-1 md:py-[4px]`}
                  >
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      {...field}
                    >
                      <FormControlLabel
                        value="female"
                        // control={<Radio />}
                        control={<Radio size="small" />}
                        label="Female"
                      />
                      <FormControlLabel
                        value="male"
                        // control={<Radio />}
                        control={<Radio size="small" />}
                        label="Male"
                      />
                      <FormControlLabel
                        value="transgender"
                        // control={<Radio />}
                        control={<Radio size="small" />}
                        label="Transgender"
                      />
                    </RadioGroup>
                  </div>
                </>
              )}
            />
            <div className="h-4 w-[200px]  !z-50   !mb-1">
              <ErrorMessage
                errors={errors}
                name={"gender"}
                render={({ message }) => (
                  <p className="text-sm mb-4 relative !bg-white  text-red-500">
                    {message}
                  </p>
                )}
              />
            </div>
          </div>

          <AuthInputFiled
            name={"pwd"}
            placeholder={"Person with disability"}
            label={"Person with disability"}
            control={control}
            type="checkbox"
            errors={errors}
            error={errors.pwd}
            className="mt-2 pt-2 text-sm
          "
          />
        </div>
        <div className="grid grid-cols-1  md:grid-cols-3 w-full gap-4">
          <AuthInputFiled
            name="adhar_card_number"
            icon={AccountBox}
            control={control}
            type="number"
            placeholder="Aadhar No"
            label="Aadhar No *"
            errors={errors}
            error={errors.adhar_card_number}
            className=" text-sm
          "
          />
          <AuthInputFiled
            name="pan_card_number"
            icon={AccountBox}
            control={control}
            type="text"
            placeholder="PAN No"
            label="PAN No *"
            errors={errors}
            error={errors.pan_card_number}
            className=" text-sm
          "
          />

          <AuthInputFiled
            name="bank_account_no"
            icon={AccountBalance}
            control={control}
            type="number"
            placeholder="Bank Account No"
            label="Bank Account No*"
            errors={errors}
            error={errors.bank_account_no}
            className="text-sm
          "
          />
        </div>
        <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">

          <AuthInputFiled
            name="citizenship"
            icon={LocationOn}
            control={control}
            type="text"
            placeholder="Citizenship Status."
            label="Citizenship Status. *"
            errors={errors}
            error={errors.citizenship}
            pattern="[A-Za-z\s]+"
            className=" text-sm
          "
          />

          <AuthInputFiled
            name="uanNo"
            icon={AccountBalance}
            control={control}
            type="number"
            placeholder="UAN No"
            label="UAN No"
            errors={errors}
            error={errors.uanNo}
            className="text-sm
          "
          />
          <AuthInputFiled
            name="esicNo"
            icon={AccountBalance}
            control={control}
            type="text"
            placeholder="ESIC No"
            label="ESIC No"
            errors={errors}
            error={errors.esicNo}
            pattern="[A-Za-z\s]+"
            className=" text-sm"
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
            className="text-sm
         "
          />
          <AuthInputFiled
            name="relationship_with_emergency_contact"
            icon={AccountBalance}
            control={control}
            type="text"
            placeholder="Relationship with Emergency Contact"
            label="Relationship with Emergency Contact"
            errors={errors}
            error={errors.relationship_with_emergency_contact}
            pattern="[A-Za-z\s]+"
            className=" text-sm"
          />
        </div>

        <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">

          <AuthInputFiled
            name="alternate_contact_no"
            icon={LocationOn}
            control={control}
            type="number"
            placeholder="Alternate Contact No"
            label="Alternate Contact No"
            errors={errors}
            error={errors.alternate_contact_no}
            pattern="[A-Za-z\s]+"
            className="text-sm"
          />
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
            name="permanent_address"
            icon={AccountBalance}
            control={control}
            type="text"
            placeholder="Permanent Address"
            label="Permanent Address"
            errors={errors}
            error={errors.permanent_address}
            pattern="[A-Za-z\s]+"
            className=" text-sm"
          />
        </div>

        <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">

        </div>
        <h1 className="text-2xl mb-3 font-bold">Family Details</h1>

        <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">

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
            className="text-sm
"
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
            className="text-sm
"
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
            className="text-sm
"
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

        <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">
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
            className="text-sm
"
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

        <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">
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
        </div>


        {/* <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">
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
        </div> */}

        <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">
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


        <div className="flex justify-end  ">
          <button
            type="submit"
            disabled={isLastStep}
            // className="!w-max flex group justify-center
            // px-6 gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
            className="flex justify-center px-4 py-1 text-md font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestFirst;
