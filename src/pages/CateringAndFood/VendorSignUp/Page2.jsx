// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   AddBusiness,
//   Badge,
//   ClosedCaption,
//   ContactMail,
//   Key,
//   KeyOff,
//   LocationCity,
//   MonetizationOn,
//   PersonAddAlt,
//   PersonPin,
//   Today,
//   TodayOutlined,
//   Work,
// } from "@mui/icons-material";
// import moment from "moment";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useParams } from "react-router-dom";
// import { z } from "zod";
// import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// import useEmpOption from "../../../hooks/Employee-OnBoarding/useEmpOption";
// import useEmpState from "../../../hooks/Employee-OnBoarding/useEmpState";
// import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";

// const Page2 = ({ isLastStep, nextStep, prevStep }) => {
//   // state , hook and other if user needed
//   const passwordRegex =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//   const [visiblePassword, setVisiblePassword] = useState(false);
//   const [visibleCPassword, setVisibleCPassword] = useState(false);
//   const organisationId = useParams("");

//   const {
//     Departmentoptions,
//     onBoardManageroptions,
//     RolesOptions,
//     Shiftoptions,
//     locationoption,
//     cosnotoptions,
//     salaryTemplateoption,
//     empTypesoption,
//     Designationoption,
//   } = useEmpOption(organisationId);

//   console.log("department opeion", Departmentoptions);

//   const {
//     confirmPassword,
//     designation,
//     profile,
//     worklocation,
//     deptname,
//     employmentType,
//     empId,
//     mgrempid,
//     joining_date,
//     salarystructure,
//     dept_cost_center_no,
//     companyemail,
//     setStep2Data,
//     password,
//     shift_allocation,
//     date_of_birth,
//   } = useEmpState();

//   const isAtLeastNineteenYearsOld = (value) => {
//     const dob = new Date(value);
//     const birth = moment(date_of_birth, "YYYY-MM-DD");
//     const currentValue = moment(dob, "YYYY-MM-DD");
//     const differenceInDOB = currentValue.diff(birth, "years");

//     return differenceInDOB >= 19;
//   };

//   const { data } = useSubscriptionGet(organisationId);

//   // employee schema using zod
//   const EmployeeSchema = z
//     .object({
//       password: z
//         .string()
//         .min(8)
//         .refine((value) => passwordRegex.test(value), {
//           message:
//             // "Password must contain at least one number, one special character, and be at least 8 characters long",
//             "Password must be 8+ characters  with 1 number and 1 special character.",
//         }),
//       confirmPassword: z.string(),
//       designation: z.object({
//         label: z.string(),
//         value: z.string(),
//       }),
//       worklocation: z.object({
//         label: z.string(),
//         value: z.string(),
//       }),
//       deptname: z.object({
//         label: z.string(),
//         value: z.string(),
//       }),
//       employmentType: z.object({
//         label: z.string(),
//         value: z.string(),
//       }),
//       empId: z
//         .string()
//         .min(1, { message: "Employee code is required" })
//         .max(25, { message: "Employee code is not greater than 25 character" }),
//       mgrempid: z
//         .object({
//           label: z.string().optional(),
//           value: z.string().optional(),
//         })
//         .optional()
//         .nullable(),
//       joining_date: z
//         .string()
//         .refine(isAtLeastNineteenYearsOld, {
//           message: "Employee must be at least 19 years old",
//         })
//         .refine(
//           (value) => {
//             const joiningDate = moment(value, "YYYY-MM-DD");
//             console.log(`🚀 ~ joiningDate:`, joiningDate);
//             const orgDate = moment(
//               data?.organisation?.foundation_date,
//               "YYYY-MM-DD"
//             );
//             console.log(`🚀 ~ orgDate:`, orgDate, joiningDate);
//             return orgDate.isBefore(joiningDate);
//           },
//           {
//             message:
//               "Joining date cannot be before the organisation's foundation date",
//           }
//         )
//         .refine(
//           (value) => {
//             const joiningDate = moment(value, "YYYY-MM-DD"); // replace 'YYYY-MM-DD' with your date format
//             const currentDate = moment();
//             return joiningDate.isSameOrBefore(currentDate);
//           },
//           {
//             message: "Joining date cannot be in the future",
//           }
//         ),
//       salarystructure: z.object({
//         label: z.string(),
//         value: z.string(),
//       }),
//       dept_cost_center_no: z.object({
//         label: z.string(),
//         value: z.string(),
//       }),

//       companyemail: z.string().email(),
//       profile: z.string().array().optional(),
//       shift_allocation: z
//         .object({
//           label: z.string().optional(),
//           value: z.string().optional(),
//         })
//         .optional()
//         .nullable(),
//     })
//     .refine((data) => data.password === data.confirmPassword, {
//       message: "Password don't match",
//       path: ["confirmPassword"],
//     });

//   // to define the useForm
//   const { control, formState, handleSubmit } = useForm({
//     defaultValues: {
//       confirmPassword: confirmPassword,
//       password: password,
//       designation: designation,
//       profile: profile,
//       worklocation: worklocation,
//       deptname: deptname,
//       employmentType: employmentType,
//       empId: empId,
//       mgrempid: mgrempid,
//       joining_date: joining_date,
//       salarystructure: salarystructure,
//       dept_cost_center_no: dept_cost_center_no,
//       companyemail: companyemail,
//       // shift_allocation: shift_allocation ,
//     },
//     resolver: zodResolver(EmployeeSchema),
//   });

//   const { errors } = formState;
//   // to define the onSubmit
//   const onsubmit = (data) => {
//     setStep2Data(data);
//     nextStep();
//   };

//   const handleFileUpload = () => {};

//   const handleFileUploadQR = () => {};

//   return (
//     <div className="w-full mt-1">
//       <h1 className="text-2xl mb-3 font-bold">Company Info</h1>

//       <form
//         onSubmit={handleSubmit(onsubmit)}
//         className="w-full flex space-y-1  flex-1 flex-col"
//       >
//         <div className="grid grid-cols-1  md:grid-cols-3 w-full gap-4">
//           <AuthInputFiled
//             name="empId"
//             icon={Work}
//             control={control}
//             type="text"
//             placeholder="Employee Code"
//             label="Vendor Code *"
//             errors={errors}
//             error={errors.empId}
//             className="text-sm"
//           />
//           <AuthInputFiled
//             name="companyemail"
//             icon={ContactMail}
//             control={control}
//             type="text"
//             placeholder="Email"
//             label="Vendor company name *"
//             errors={errors}
//             error={errors.companyemail}
//             className="text-sm"
//             wrapperMessage={"Note this email is used for login credentails"}
//           />
//         </div>

//         <div className="mt-4 mb-4">
//           <label className="grid grid-cols-1  md:grid-cols-3 w-full gap-4">
//             Upload Vendor Registration Documents
//           </label>
//           <input
//             type="file"
//             onChange={handleFileUpload}
//             accept=".pdf, .jpeg, .jpg"
//             className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50 hover:bg-gray-100 transition duration-200"
//           />
//           {/* {errorMessage && (
//               <p className="text-red-500 mt-2">{errorMessage}</p>
//             )} */}
//         </div>

//         <AuthInputFiled
//           name="payment_info"
//           control={control}
//           type="text"
//           label="Payment Information (UPI ID)"
//           errors={errors}
//         />

//         <div className="mt-4 pb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Upload Vendor QR Scanner Image
//           </label>
//           <input
//             type="file"
//             onChange={handleFileUploadQR}
//             accept=".pdf, .jpeg, .jpg"
//             className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50 hover:bg-gray-100 transition duration-200"
//           />
//         </div>

//         <label className="block text-sm font-medium text-gray-700 mt-4 mb-4">
//           Select Frequency of Uploading Menu Items
//         </label>
//         <select
//           {...control.register("upload_frequency")}
//           className="mt-1  block w-full border border-gray-300 rounded-md p-2 bg-gray-50 hover:bg-gray-100 transition duration-200"
//         >
//           <option value="">Select Frequency</option>
//           <option value="daily">Daily</option>
//           <option value="weekly">Weekly</option>
//           <option value="monthly">Monthly</option>
//           <option value="fortnightly">Fortnightly</option>
//         </select>

//         <div className="grid grid-cols-1  md:grid-cols-3 w-full gap-4">
//           <AuthInputFiled
//             name="password"
//             visible={visiblePassword}
//             setVisible={setVisiblePassword}
//             icon={Key}
//             control={control}
//             type="password"
//             placeholder=""
//             label="Password *"
//             errors={errors}
//             error={errors.password}
//             className="text-sm"
//           />
//           <AuthInputFiled
//             name="confirmPassword"
//             visible={visibleCPassword}
//             setVisible={setVisibleCPassword}
//             icon={KeyOff}
//             control={control}
//             type="password"
//             placeholder=""
//             label="Confirm Password *"
//             errors={errors}
//             error={errors.confirmPassword}
//             className="text-sm"
//           />
//         </div>

//         <div className="flex items-end w-full justify-between">
//           <button
//             type="button"
//             onClick={() => {
//               prevStep();
//             }}
//             className="!w-max flex group justify-center px-6  gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
//           >
//             Prev
//           </button>
//           <button
//             type="submit"
//             disabled={isLastStep}
//             className="!w-max flex group justify-center px-6  gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
//           >
//             Next
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Page2;

// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useParams } from "react-router-dom";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import moment from "moment";
// import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// import useEmpOption from "../../../hooks/Employee-OnBoarding/useEmpOption";
// import useEmpState from "../../../hooks/Employee-OnBoarding/useEmpState";
// import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
// import { Work, ContactMail, Key, KeyOff } from "@mui/icons-material";

// const Page2 = ({ isLastStep, nextStep, prevStep }) => {
//   const passwordRegex =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//   const [visiblePassword, setVisiblePassword] = useState(false);
//   const [visibleCPassword, setVisibleCPassword] = useState(false);
//   const [selectedDocumentType, setSelectedDocumentType] = useState("");
//   const [uploadedFile, setUploadedFile] = useState(null);

//   const organisationId = useParams("");

//   const {
//     Departmentoptions,
//     onBoardManageroptions,
//     RolesOptions,
//     Shiftoptions,
//     locationoption,
//     cosnotoptions,
//     salaryTemplateoption,
//     empTypesoption,
//     Designationoption,
//   } = useEmpOption(organisationId);
//   const {
//     confirmPassword,
//     designation,
//     profile,
//     worklocation,
//     deptname,
//     employmentType,
//     empId,
//     mgrempid,
//     joining_date,
//     salarystructure,
//     dept_cost_center_no,
//     companyemail,
//     setStep2Data,
//     password,
//     shift_allocation,
//     date_of_birth,
//   } = useEmpState();

//   const isAtLeastNineteenYearsOld = (value) => {
//     const dob = new Date(value);
//     const birth = moment(date_of_birth, "YYYY-MM-DD");
//     const currentValue = moment(dob, "YYYY-MM-DD");
//     return currentValue.diff(birth, "years") >= 19;
//   };

//   const { data } = useSubscriptionGet(organisationId);

//   const EmployeeSchema = z
//     .object({
//       password: z
//         .string()
//         .min(8)
//         .refine((value) => passwordRegex.test(value), {
//           message:
//             "Password must be 8+ characters with 1 number and 1 special character.",
//         }),
//       confirmPassword: z.string(),
//       designation: z.object({ label: z.string(), value: z.string() }),
//       worklocation: z.object({ label: z.string(), value: z.string() }),
//       deptname: z.object({ label: z.string(), value: z.string() }),
//       employmentType: z.object({ label: z.string(), value: z.string() }),
//       empId: z
//         .string()
//         .min(1, { message: "Employee code is required" })
//         .max(25, { message: "Employee code cannot exceed 25 characters." }),
//       mgrempid: z
//         .object({ label: z.string().optional(), value: z.string().optional() })
//         .optional()
//         .nullable(),
//       joining_date: z
//         .string()
//         .refine(isAtLeastNineteenYearsOld, {
//           message: "Employee must be at least 19 years old",
//         })
//         .refine(
//           (value) =>
//             moment(data?.organisation?.foundation_date, "YYYY-MM-DD").isBefore(
//               moment(value, "YYYY-MM-DD")
//             ),
//           {
//             message:
//               "Joining date cannot be before the organisation's foundation date",
//           }
//         )
//         .refine(
//           (value) => moment(value, "YYYY-MM-DD").isSameOrBefore(moment()),
//           { message: "Joining date cannot be in the future" }
//         ),
//       salarystructure: z.object({ label: z.string(), value: z.string() }),
//       dept_cost_center_no: z.object({ label: z.string(), value: z.string() }),
//       companyemail: z.string().email(),
//       profile: z.string().array().optional(),
//       shift_allocation: z
//         .object({ label: z.string().optional(), value: z.string().optional() })
//         .optional()
//         .nullable(),
//     })
//     .refine((data) => data.password === data.confirmPassword, {
//       message: "Passwords don't match",
//       path: ["confirmPassword"],
//     });

//   const { control, formState, handleSubmit } = useForm({
//     defaultValues: {
//       confirmPassword,
//       password,
//       designation,
//       profile,
//       worklocation,
//       deptname,
//       employmentType,
//       empId,
//       mgrempid,
//       joining_date,
//       salarystructure,
//       dept_cost_center_no,
//       companyemail,
//     },
//     resolver: zodResolver(EmployeeSchema),
//   });

//   const { errors } = formState;

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     setUploadedFile(file);
//   };

//   const onSubmit = (data) => {
//     console.log("Form data:", { ...data, uploadedFile, selectedDocumentType });
//     setStep2Data(data);
//     nextStep();
//   };

//   return (
//     <div className="w-full mt-1">
//       <h1 className="text-2xl mb-3 font-bold">Company Info</h1>
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="w-full flex flex-col space-y-4"
//       >
//         <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4">
//           <AuthInputFiled
//             name="empId"
//             icon={Work}
//             control={control}
//             type="text"
//             placeholder="Employee Code"
//             label="Vendor Code *"
//             errors={errors}
//             error={errors.empId}
//             className="text-sm"
//           />
//           <AuthInputFiled
//             name="companyemail"
//             icon={ContactMail}
//             control={control}
//             type="text"
//             placeholder="Email"
//             label="Vendor Company Name *"
//             errors={errors}
//             error={errors.companyemail}
//             className="text-sm"
//             wrapperMessage="Note this email is used for login credentials"
//           />
//         </div>

//         <div className="mt-4 mb-4">
//           <label className="block mb-1">Select Document Type</label>
//           <select
//             value={selectedDocumentType}
//             onChange={(e) => setSelectedDocumentType(e.target.value)}
//             className="block w-full border border-gray-300 rounded-md p-2 bg-gray-50 hover:bg-gray-100 transition duration-200"
//           >
//             <option value="">Select Document</option>
//             <option value="pan_card">PAN Card</option>
//             <option value="aadhar_card">Aadhar Card</option>
//             <option value="food_catering_license">Food Catering License</option>
//             <option value="bank_account">Bank Account</option>
//           </select>
//         </div>

//         <div className="mt-4 mb-4">
//           <label className="block">Upload Document</label>
//           <input
//             type="file"
//             onChange={handleFileUpload}
//             accept=".pdf, .jpeg, .jpg"
//             className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50 hover:bg-gray-100 transition duration-200"
//           />
//           {uploadedFile && (
//             <p className="mt-2 text-green-600">{uploadedFile.name} uploaded.</p>
//           )}
//         </div>

//         <AuthInputFiled
//           name="payment_info"
//           control={control}
//           type="text"
//           label="Payment Information (UPI ID)"
//           errors={errors}
//         />

//         <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4">
//           <AuthInputFiled
//             name="password"
//             visible={visiblePassword}
//             setVisible={setVisiblePassword}
//             icon={Key}
//             control={control}
//             type="password"
//             label="Password *"
//             errors={errors}
//             error={errors.password}
//             className="text-sm"
//           />
//           <AuthInputFiled
//             name="confirmPassword"
//             visible={visibleCPassword}
//             setVisible={setVisibleCPassword}
//             icon={KeyOff}
//             control={control}
//             type="password"
//             label="Confirm Password *"
//             errors={errors}
//             error={errors.confirmPassword}
//             className="text-sm"
//           />
//         </div>

//         <div className="flex items-end justify-between w-full">
//           <button
//             type="button"
//             onClick={prevStep}
//             className="flex items-center justify-center px-6 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 rounded-md"
//           >
//             Prev
//           </button>
//           <button
//             type="submit"
//             disabled={isLastStep}
//             className="flex items-center justify-center px-6 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 rounded-md"
//           >
//             Next
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Page2;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
// import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// import moment from "moment";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// import useEmpOption from "../../../hooks/Employee-OnBoarding/useEmpOption";
import useEmpState from "../../../hooks/Employee-OnBoarding/useEmpState";
// import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
import { Work, ContactMail, Key, KeyOff } from "@mui/icons-material";

const Page2 = ({ isLastStep, nextStep, prevStep }) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleCPassword, setVisibleCPassword] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // const organisationId = useParams("");

  // const {
  // s
  // } = useEmpOption(organisationId);
  const {
    confirmPassword,
    designation,
    profile,
   
    companyname,
    setStep2Data,
    password,
   
  } = useEmpState();

 
  // const { data } = useSubscriptionGet(organisationId);

  const EmployeeSchema = z
    .object({
      password: z
        .string()
        .min(8)
        .refine((value) => passwordRegex.test(value), {
          message:
            "Password must be 8+ characters with 1 number and 1 special character.",
        }),
      confirmPassword: z.string(),

      empId: z
        .string()
        .min(1, { message: "Employee code is required" })
        .max(25, { message: "Employee code cannot exceed 25 characters." }),
      mgrempid: z
        .object({ label: z.string().optional(), value: z.string().optional() })
        .optional()
        .nullable(),

      companyname: z.string(),
      profile: z.string().array().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      confirmPassword,
      password,
      designation,
      profile,
      companyname,
    },
    resolver: zodResolver(EmployeeSchema),
  });

  const { errors } = formState;

  const handleFileUpload = (e) => {
    const filesArray = Array.from(e.target.files);
    setUploadedFiles((prevFiles) => [...prevFiles, ...filesArray]);
  };

  const onSubmit = (data) => {
    console.log("Form data:", { ...data, uploadedFiles, selectedDocumentType });
    setStep2Data(data);
    nextStep();
  };

  return (
    <div className="w-full mt-1">
      <h1 className="text-2xl mb-3 font-bold">Company Info</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4">
          <AuthInputFiled
            name="empId"
            icon={Work}
            control={control}
            type="text"
            placeholder="Employee Code"
            label="Vendor Code *"
            errors={errors}
            error={errors.empId}
            className="text-sm"
          />
          <AuthInputFiled
            name="companyname"
            icon={ContactMail}
            control={control}
            type="text"
            placeholder="Company Name"
            label="Vendor Company Name *"
            errors={errors}
            error={errors.companyemail}
            className="text-sm"
            wrapperMessage="Note this email is used for login credentials"
          />
        </div>

        <div className="mt-4 mb-4">
          <label className="block mb-1">Select Document Type</label>
          <select
            value={selectedDocumentType}
            onChange={(e) => setSelectedDocumentType(e.target.value)}
            className="block w-full border border-gray-300 rounded-md p-2 bg-gray-50 hover:bg-gray-100 transition duration-200"
          >
            <option value="">Select Document</option>
            <option value="pan_card">PAN Card</option>
            <option value="aadhar_card">Aadhar Card</option>
            <option value="food_catering_license">Food Catering License</option>
            <option value="bank_account">Bank Account</option>
          </select>
        </div>

        <div className="mt-4 mb-4">
          <label className="block">Upload Document(s)</label>
          <input
            type="file"
            onChange={handleFileUpload}
            accept=".pdf, .jpeg, .jpg"
            multiple
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50 hover:bg-gray-100 transition duration-200"
          />
          {uploadedFiles.length > 0 && (
            <div className="mt-2 text-green-600">
              <p>{uploadedFiles.length} file(s) uploaded:</p>
              <ul>
                {uploadedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <AuthInputFiled
          name="payment_info"
          control={control}
          type="text"
          label="Payment Information (UPI ID)"
          errors={errors}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4">
          <AuthInputFiled
            name="password"
            visible={visiblePassword}
            setVisible={setVisiblePassword}
            icon={Key}
            control={control}
            type="password"
            label="Password *"
            errors={errors}
            error={errors.password}
            className="text-sm"
          />
          <AuthInputFiled
            name="confirmPassword"
            visible={visibleCPassword}
            setVisible={setVisibleCPassword}
            icon={KeyOff}
            control={control}
            type="password"
            label="Confirm Password *"
            errors={errors}
            error={errors.confirmPassword}
            className="text-sm"
          />
        </div>

        <div className="flex items-end justify-between w-full">
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center justify-center px-6 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 rounded-md"
          >
            Prev
          </button>
          <button
            type="submit"
            disabled={isLastStep}
            className="flex items-center justify-center px-6 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 rounded-md"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page2;
