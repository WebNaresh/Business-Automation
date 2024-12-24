// // // import React from 'react'
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import {
// //   Badge,
// //   CheckCircle,
// //   DriveFileRenameOutlineOutlined,
// //   Email,
// //   Fingerprint,
// //   Lock,
// //   PermContactCalendar,
// //   Phone,
// // } from "@mui/icons-material";
// // import { SvgIcon } from "@mui/material";
// // import axios from "axios";
// // import React, { useContext, useEffect, useState } from "react";
// // import { useForm } from "react-hook-form";
// // import { useMutation } from "react-query";
// // // import { useNavigate } from "react-router-dom";
// // import { z } from "zod";
// // import { TestContext } from "../../State/Function/Main";
// // import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
// // // import UserProfile from "../../hooks/UserData/useUser";
// // import useAuthentication from "../SignUp/useAuthentication";
// // const Signupvendor = () => {

// //   const { handleAlert } = useContext(TestContext);
// //   // const location = useLocation();
// //   const { countryCode } = useAuthentication();
// //   // state
// //   const [display, setdisplay] = useState(false);
// //   const [isVerified, setIsVerified] = useState(false);
// //   const [otp, setOTP] = useState("");
// //   const [time, setTime] = useState(1);
// //   const [isTimeVisible, setIsTimeVisible] = useState(false);
// //   const [readOnly, setReadOnly] = useState(false);
// //   const [visiblePassword, setVisiblePassword] = useState(false);
// //   const [visibleCPassword, setVisibleCPassword] = useState(false);
// //    const [isSecondPage, setIsSecondPage] = useState(false);
// //   const [ setUploadedFile] = useState(null);
// //   const [errorMessage, setErrorMessage] = useState("");
// //     // to get current user
// //   // const { getCurrentUser } = UserProfile();
// //     // const { countryCode } = useAuthentication();
// //   // const user = getCurrentUser();

// //     // navigate
// //   // const navigate = useNavigate("");

// //   // useEffect(() => {
// //   //   if (user?._id) {
// //   //     navigate(-1);
// //   //   }
// //   //   // eslint-disable-next-line
// //   // }, []);

// //   useEffect(() => {
// //     let interval;
// //     if (time > 0) {
// //       interval = setInterval(() => {
// //         setTime((prevTimer) => prevTimer - 1);
// //       }, 1000);
// //     } else {
// //       setIsTimeVisible(false);
// //     }

// //     // Clean up the interval when the component unmounts
// //     return () => clearInterval(interval);

// //     // eslint-disable-next-line
// //   }, [time, isTimeVisible]);


// //   const passwordRegex =
// //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// //   // define the validation using zod
// //   const SignUpSchema = z
// //     .object({
// //       first_name: z
// //         .string()
// //         .min(2, { message: "Minimum 2 character " })
// //         .max(15)
// //         .regex(/^[a-zA-Z]+$/, { message: "only character allow" }),

// //       last_name: z
// //         .string()
// //         .min(2)
// //         .max(15)
// //         .regex(/^[a-zA-Z]+$/),
// //       phone: z
// //         .string()
// //         .min(10, { message: "Phone Number must be 10 digit" })
// //         .regex(/^[0-9]+$/),
// //       email: z.string().email(),

// //       Vendor_company: z
// //       .string()
// //       .min(2)
// //       .max(30)
// //       .regex(/^[a-zA-Z]+$/),

// //       password: z
// //         .string()
// //         .min(8)
// //         .refine((value) => passwordRegex.test(value), {
// //           message:
// //             "Password must contain at least one number, one special character, and be at least 8 characters long",
// //         }),
// //       confirmPassword: z.string(),
// //       isChecked: z.boolean().refine((value) => value === true, {
// //         message: "Please accept the Terms and Conditions to sign up.",
// //       }),
// //     })
// //     .refine((data) => data.password === data.confirmPassword, {
// //       message: "Password does'nt   match",
// //       path: ["confirmPassword"],
// //     });

// //   // use useForm
// //   const {
// //     handleSubmit,
// //     control,
// //     getValues,
// //     watch,
// //     formState: { errors },
// //   } = useForm({
// //     resolver: zodResolver(SignUpSchema),
// //   });

// //   const number = watch("phone");
// //   // to define the onSubmit function


// //   const onSubmit = async (data) => {
// //     try {
// //       console.log("Form Data:", data);
// //       console.log("Is Second Page:", isSecondPage);
    
// //        alert("hi")
// //       // if (!isVerified) {
// //       //   handleAlert(true, "warning", "Please verify your phone number");
// //       //   return false;
// //       // }
// //       if (!isSecondPage) {
// //               setIsSecondPage(true);
// //          return;
// //            } 
    

// //       const response = await axios.post(
// //         `${import.meta.env.VITE_API}/route/employee/create`,
// //         data
// //       );
// //       handleAlert(true, "success", response.data.message);
// //       window.location.reload();
// //     } catch (error) {
// //       handleAlert(
// //         true,
// //         "error",
// //         error.response.data.message || "Failed to sign up. Please try again."
// //       );
// //     }
// //   };

// //   const OtpRequest = useMutation(
// //     (data) =>
// //       axios.post(`${import.meta.env.VITE_API}/route/employee/sendOtp`, {
// //         number: data,
// //         countryCode,
// //       }),
// //     {
// //       onSuccess: (data) => {
// //         handleAlert(
// //           true,
// //           "success",
// //           "OTP has been send successfully on your device"
// //         );
// //         setdisplay(true);
// //         setTime(1);
// //         setIsTimeVisible(true);
// //       },

// //       onError: (data) => {
// //         if (data?.response?.status === 500) {
// //           handleAlert(true, "warning", `${data?.response?.data?.message}`);
// //         }
// //         if (data?.response?.data?.success === false)
// //           handleAlert(true, "error", data?.response?.data?.message);
// //       },
// //     }
// //   );

// //     const VerifyOtpRequest = useMutation(
// //     (data) =>
// //       axios.post(`${import.meta.env.VITE_API}/route/employee/verifyOtp`, data),
// //     {
// //       onSuccess: (data) => {
// //         if (data?.data?.success === false) {
// //           handleAlert(true, "error", data?.data?.message);
// //         }

// //         if (data?.data?.success === true) {
// //           handleAlert(true, "success", `OTP verified successfully`);
// //           setdisplay(false);
// //           setIsVerified(true);
// //           setIsTimeVisible(false);
// //           setReadOnly(true);
// //         }
// //       },
// //     }
// //   );


// //     const phone = getValues("phone");

// //   const SendOtp = () => {
// //     OtpRequest.mutate(phone);
// //   };

// //   const VerifyOtp = () => {
// //     const data = { number: phone, otp };

// //     if (!otp || !number) {
// //       handleAlert(true, "warning", "Otp and number are required fields");
// //       return false;
// //     }
// //     VerifyOtpRequest.mutate(data);
// //   };

// //  const fileSizeLimit = 150 * 1024;
// //     const handleFileUpload = (e) => {
// //     const file = e.target.files[0];
// //     if(file&&file.size> fileSizeLimit) {
// //       setErrorMessage("File size exceeds the limit of 150kb.");
// //     } 
// //     if (file && (file.type === 'application/pdf' || file.type === 'image/jpeg')) {
// //       setUploadedFile(file);
// //       setErrorMessage("");
// //     } else {
// //       handleAlert(true, 'error', 'Only PDF or JPG files are allowed.');
// //     }
// //   };



// //   const handleFileUploadQR = (e) => {
// //     const file = e.target.files[0];
// //     if (file && (file.type === 'application/pdf' || file.type === 'image/jpeg')) {
// //       setUploadedFile(file);
// //     } else {
// //       handleAlert(true, 'error', 'Only PDF or JPG files are allowed.');
// //     }
// //   };




// //   return (
// //       <>
// //       <section className="flex  w-full">
// //         {/* Left Section */}
// //         <div className="!w-[40%]  md:justify-start lg:flex hidden text-white flex-col items-center justify-center lg:h-screen relative">
// //           <div className="bg__gradient  absolute inset-0 "></div>
// //           <ul className="circles">
// //             <li></li>
// //             <li></li>
// //             <li></li>
// //             <li></li>
// //             <li></li>
// //             <li></li>
// //             <li></li>
// //             <li></li>
// //             <li></li>
// //             <li></li>
// //           </ul>
// //           <div className="space-y-2 mb-8 flex-col flex items-center justify-center"></div>
// //         </div>

// //         {/* Right Section */}
// //         <article className="lg:!w-[60%] w-full h-auto bg-white min-h-screen  md:block flex items-center flex-col justify-center">
// //           <form
// //            onSubmit={handleSubmit(onSubmit)}
// //             autoComplete="off"
// //             className="flex   my-16 sm:!px-20 px-6 lg:w-[80%] w-full bg-white flex-col h-fit gap-1"
// //           >
// //             <div className="flex flex-col space-x-4 lg:items-start items-center">
// //               <div className="flex flex-col gap-1  w-full items-center justify-center space-y-1">
// //                 <img src="/logo.svg" className="h-[45px]" alt="logo" />
// //                 <h1 className="font-[600] text-center w-full text-3xl">
// //                   Register Vendor Account
// //                 </h1>
// //               </div>
// //             </div>

// //             {!isSecondPage && (
// //              <>
// //             <div className="mt-6 grid md:grid-cols-2 grid-cols-1 gap-2">
// //               {/* First Name */}
// //               <AuthInputFiled
// //                 name="first_name"
// //                 icon={PermContactCalendar}
// //                 control={control}
// //                 type="text"
// //                 placeholder="jhon"
// //                 label="First Name *"
// //                 maxLimit={15}
// //                 errors={errors}
// //                 error={errors.first_name}
// //               />
// //               <AuthInputFiled
// //                 name="middle_name"
// //                 icon={Badge}
// //                 control={control}
// //                 type="text"
// //                 placeholder="xyz"
// //                 label="Middle Name"
// //                 errors={errors}
// //                 maxLimit={15}
// //                 error={errors.middle_name}
// //               />
// //             </div>
// //             {/* Last Name */}
// //             <AuthInputFiled
// //               name="last_name"
// //               icon={DriveFileRenameOutlineOutlined}
// //               control={control}
// //               type="text"
// //               label="Last Name *"
// //               placeholder="Doe"
// //               errors={errors}
// //               maxLimit={15}
// //               error={errors.last_name}
// //             />
// //             {/* Phone Number */}
// //             <div className="flex sm:flex-row flex-col w-full sm:items-center items-start gap-0 sm:gap-2 sm:mb-0 mb-3">
// //               <div className="w-full">
// //                 <AuthInputFiled
// //                   name="phone"
// //                   icon={Phone}
// //                   readOnly={readOnly}
// //                   control={control}
// //                   label={"Phone Number *"}
// //                   type="contact"
// //                   errors={errors}
// //                   error={errors.phone}
// //                   placeholder={"1234567890"}
// //                 />
// //               </div>

// //               <>
// //                 {isVerified ? (
// //                   <>
// //                     <SvgIcon color="success">
// //                       <CheckCircle />
// //                     </SvgIcon>
// //                     Verified
// //                   </>
// //                 ) : (
// //                   <div className="w-[20%]">
// //                     <button
// //                       type="button"
// //                       disabled={
// //                         number?.length !== 10 || isTimeVisible ? true : false
// //                       }
// //                       onClick={SendOtp}
// //                       className={`w-max flex group justify-center gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-blue-500  ${
// //                         (number?.length !== 10 || isTimeVisible) &&
// //                         "bg-gray-400 text-gray-900"
// //                       }`}
// //                     >
// //                       Get OTP
// //                     </button>
// //                   </div>
// //                 )}

// //                 {isTimeVisible && (
// //                   <p>
// //                     Resend OTP {Math.floor(time / 60)}:
// //                     {(time % 60).toString().padStart(2, "0")}
// //                   </p>
// //                 )}
// //               </>
// //             </div>
// //             {display && (
// //               <div className="w-max flex items-center gap-2">
// //                 <div className="space-y-1">
// //                   <label className={`font-semibold text-gray-500 text-md`}>
// //                     Verify OTP
// //                   </label>
// //                   <div className="flex  rounded-md px-2 border-gray-200 border-[.5px] bg-white py-[6px]">
// //                     <Fingerprint className="text-gray-700" />
// //                     <input
// //                       type={"number"}
// //                       onChange={(e) => setOTP(e.target.value)}
// //                       placeholder={"1235"}
// //                       className="border-none bg-white w-full outline-none px-2"
// //                     />
// //                   </div>

// //                   <div className="h-4  !mb-1 "></div>
// //                 </div>

// //                 <button
// //                   type="button"
// //                   onClick={VerifyOtp}
// //                   className="w-max flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
// //                 >
// //                   Verify OTP
// //                 </button>
// //               </div>
// //             )}
// //             <AuthInputFiled
// //               name="email"
// //               icon={Email}
// //               control={control}
// //               type="email"
// //               placeholder="test@gmai..."
// //               label="Email Address *"
// //               errors={errors}
// //               error={errors.email}
// //             />

// //                {/* Vendor Compony Name */}
// //                <AuthInputFiled
// //               name="vendor_company"
// //               icon={DriveFileRenameOutlineOutlined}
// //               control={control}
// //               type="text"
// //               label=" Vendor Company Name *"
// //               placeholder="Doe"
// //               errors={errors}
// //               maxLimit={30}
// //               error={errors.vendor_company}
// //             />

// //             <div className="grid md:grid-cols-2 grid-cols-1  gap-2">
// //               <AuthInputFiled
// //                 name="password"
// //                 visible={visiblePassword}
// //                 setVisible={setVisiblePassword}
// //                 icon={Lock}
// //                 control={control}
// //                 type="password"
// //                 placeholder="****"
// //                 label="Password *"
// //                 errors={errors}
// //                 error={errors.password}
// //               />

// //               <AuthInputFiled
// //                 name="confirmPassword"
// //                 icon={Lock}
// //                 visible={visibleCPassword}
// //                 setVisible={setVisibleCPassword}
// //                 control={control}
// //                 type="password"
// //                 placeholder="****"
// //                 label="Confirm Password *"
// //                 errors={errors}
// //                 error={errors.confirmPassword}
// //               />
// //             </div>

// //             <div className="flex items-center ">
// //               <div className="w-max">
// //                 <AuthInputFiled
// //                   name="isChecked"
// //                   control={control}
// //                   type="checkbox"
// //                   label={`I accept the`}
// //                   errors={errors}
// //                   error={errors.isChecked}
// //                 />
// //               </div>
// //             </div>
// //             </>
// //            )}
  
// //          {/* Second Page Inputs */}
// // {isSecondPage && (
// //   <div className="p-6 bg-white rounded-lg shadow-md">
// //     {/* <h2 className="text-2xl font-semibold mb-4">Register Vendor Information</h2> */}

// //     <AuthInputFiled
// //       name="vendor_code"
// //       control={control}
// //       type="text"
// //       label="Vendor Code"
// //       errors={errors}
// //     />

// //     <div className="mt-4">
// //       <label className="block text-sm font-medium text-gray-700 mb-1">
// //         Upload Vendor Registration Documents
// //       </label>
// //       <input
// //         type="file"
// //         onChange={handleFileUpload}
// //         accept=".pdf, .jpeg, .jpg"
// //         className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50 hover:bg-gray-100 transition duration-200"
// //       />
// //        {errorMessage && (
// //               <p className="text-red-500 mt-2">{errorMessage}</p>
// //             )}
// //     </div>

// //     <AuthInputFiled
// //       name="payment_info"
// //       control={control}
// //       type="text"
// //       label="Payment Information (Bank/UPI ID)"
// //       errors={errors}
// //     />

// //     <div className="mt-4">
// //       <label className="block text-sm font-medium text-gray-700 mb-1">
// //         Upload Vendor QR Scanner Image
// //       </label>
// //       <input
// //         type="file"
// //         onChange={handleFileUploadQR}
// //         accept=".pdf, .jpeg, .jpg"
// //         className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50 hover:bg-gray-100 transition duration-200"
// //       />
// //     </div>

// //     <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
// //       Select Frequency of Uploading Menu Items
// //     </label>
// //     <select
// //       {...control.register("upload_frequency")}
// //       className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50 hover:bg-gray-100 transition duration-200"
// //     >
// //       <option value="">Select Frequency</option>
// //       <option value="daily">Daily</option>
// //       <option value="weekly">Weekly</option>
// //       <option value="monthly">Monthly</option>
// //       <option value="fortnightly">Fortnightly</option>
// //     </select>
// //   </div>
// // )}

// //           {/* Signup Button */}
// //           <div className="flex gap-5 mt-2 ml-10">
// //           <button type="submit" className="mt-4 bg-blue-500 text-white py-2 rounded-md text-center w-96">
// //           {isSecondPage ? "Complete Registration" : "Next"}
// // </button>

// //    </div>
// //        </form>
// //         </article>
// //       </section>
// //     </>
// //   );
// // };
// // export default Signupvendor


// import React from 'react'
// import { ErrorMessage } from '@hookform/error-message';
// import AuthInputFiled from '../../../components/InputFileds/AuthInputFiled';
// import { z } from "zod";
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useQuery } from "react-query";
// import { useParams } from "react-router";
// import { Controller, useForm } from "react-hook-form";
// import {
//   AccountBalance,
//   AccountBox,
//   ContactEmergency,
//   Email,
//   LocationOn,
//   Person,
//   TodayOutlined,
// } from "@mui/icons-material";
// import {
//   CircularProgress,
//   FormControlLabel,
//   Radio,
//   RadioGroup,
// } from "@mui/material";
// import { useContext } from 'react';
// import { UseContext } from '../../../State/UseState/UseContext';
// import useEmployeeState from '../../../hooks/Employee-OnBoarding/useEmployeeState';
// // import { UseContext } from '../../State/UseState/UseContext';


// const isAtLeastNineteenYearsOld = (value) => {
//   const currentDate = new Date();
//   const dob = new Date(value);
//   let differenceInYears = currentDate.getFullYear() - dob.getFullYear();
//   const monthDiff = currentDate.getMonth() - dob.getMonth();

//   if (
//     monthDiff < 0 ||
//     (monthDiff === 0 && currentDate.getDate() < dob.getDate())
//   ) {
//     differenceInYears--;
//   }

//   return differenceInYears >= 19;
// };




//   const Signupvendor = ({ nextStep, prevStep, isFirstStep, isLastStep }) => {
//   const {
//     setStep1Data,
//     first_name,
//     last_name,
//     email,
//     gender,
//     phone_number,
//     address,
//     citizenship,
//     adhar_card_number,
//     pan_card_number,
//     bank_account_no,
//     date_of_birth,
//     pwd,
//     uanNo,
//     esicNo,
//   } = useEmployeeState();
//   const { employeeId } = useParams();
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];


// // to define the scema using zod
// const EmployeeSchema = z.object({
//   first_name: z
//     .string()
//     .min(1, { message: "Minimum 1 character required" })
//     .max(15, { message: "Maximum 15 character allowed" })
//     .regex(/^[a-zA-Z]+$/, { message: "Only characters allowed" }),
//   last_name: z
//     .string()
//     .min(1, { message: "Minimum 1 character required" })
//     .max(15, { message: "Maximum 15 character allowed" })
//     .regex(/^[a-zA-Z]+$/, { message: "Only characters allowed" }),
//   gender: z.string(),
//   email: z.string().email(),
//   phone_number: z
//     .string()
//     .max(10, { message: "Phone Number must be 10 digits" })
//     .refine((value) => value.length === 10, {
//       message: "Phone Number must be exactly 10 digits",
//     }),
//   address: z.string(),
//   date_of_birth: z.string().refine(isAtLeastNineteenYearsOld, {
//     message: "Employee must be at least 19 years old",
//   }),
//   citizenship: z
//     .string()
//     .min(3, { message: "Minimum 3 characters required" })
//     .regex(/^[a-zA-Z]+$/, { message: "Only characters allowed" }),
//   adhar_card_number: z
//     .string()
//     .length(12, { message: "Aadhar number must be 12 digits." })
//     .regex(/^(?:0|[1-9]\d*)$/, {
//       message: "Aadhar number cannot be negative.",
//     }),
//   pan_card_number: z
//     .string()
//     .regex(/^([A-Z]){5}([0-9]){4}([A-Z]){1}$/, {
//       message: "Invalid PAN No.",
//     })
//     .regex(/^[^*@]+$/, {
//       message: "PAN No cannot contain special characters, e.g., *,#.",
//     }),
//   bank_account_no: z
//     .string()
//     .max(35, { message: "Only 35 numbers allowed" })
//     .regex(/^\d*$/, {
//       message: "Bank account number cannot be negative.",
//     }),
//   pwd: z.boolean().optional(),
//   uanNo: z
//     .string()
//     .refine((value) => value === "" || /^\d{12}$/.test(value), {
//       message: "UAN number must be a 12-digit number",
//     })
//     .optional(),
//   esicNo: z
//     .string()
//     .refine((value) => value === "" || /^\d{17}$/.test(value), {
//       message: "ESIC number must be a 17-digit number",
//     })
//     .optional(),
// });


//    // use useForm
//    const { control, formState, setValue, handleSubmit } = useForm({
//     defaultValues: {
//       first_name: first_name,
//       last_name: last_name,
//       date_of_birth: date_of_birth,
//       email: email,
//       gender: gender,
//       phone_number: phone_number,
//       address: address,
//       citizenship: citizenship,
//       adhar_card_number: adhar_card_number,
//       pan_card_number: pan_card_number,
//       bank_account_no: bank_account_no,
//       pwd,
//       uanNo: uanNo || undefined,
//       esicNo: esicNo || undefined,
//     },
//     resolver: zodResolver(EmployeeSchema),
//   });


  

//   const { errors } = formState;
//   // to define the onSumbit funciton
//   const onSubmit = async (data) => {
//     setStep1Data(data);
//     nextStep();
//   };
//   return (
//     <div className="w-full mt-4">
      
//     <h1 className="text-2xl mb-4 font-bold">Personal Details</h1>
//     {/* {isLoading ? ( */}
//        {/* <CircularProgress /> */}
//     {/* ) : ( */}
//       <>
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="w-full flex  flex-1 space-y-2 flex-col"
//         >
//           <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-3">
//             <AuthInputFiled
//               name="first_name"
//               icon={Person}
//               control={control}
//               type="text"
//               placeholder="John"
//               label="Employee First Name *"
//               errors={errors}
//               error={errors.first_name}
//             />

//             <AuthInputFiled
//               name="last_name"
//               icon={Person}
//               control={control}
//               type="text"
//               placeholder="Doe"
//               label="Employee Last Name *"
//               errors={errors}
//               error={errors.last_name}
//             />

//             <AuthInputFiled
//               name="date_of_birth"
//               icon={TodayOutlined}
//               control={control}
//               type="date"
//               placeholder="dd-mm-yyyy"
//               label="Date Of Birth *"
//               errors={errors}
//               error={errors.date_of_birth}
//             />
//           </div>

//           <AuthInputFiled
//             name="email"
//             icon={Email}
//             control={control}
//             type="text"
//             placeholder="Employee Email"
//             label="Employee Email *"
//             errors={errors}
//             error={errors.email}
//           />

//           <AuthInputFiled
//             name="phone_number"
//             icon={ContactEmergency}
//             control={control}
//             value={phone_number}
//             type="text"
//             placeholder="1234567890"
//             label="Contact *"
//             errors={errors}
//             error={errors.phone_number}
//           />

//           <AuthInputFiled
//             name="address"
//             icon={Person}
//             control={control}
//             type="textarea"
//             placeholder="Address"
//             label="Current Address *"
//             errors={errors}
//             error={errors.address}
//           />

//           <AuthInputFiled
//             name={"pwd"}
//             placeholder={"Person with disability"}
//             label={"Person with disability"}
//             control={control}
//             type="checkbox"
//             errors={errors}
//             error={errors.pwd}
//           />

//           <div className="space-y-1">
//             <label
//               htmlFor={"gender"}
//               className={`${errors.gender && "text-red-500"
//                 } text-gray-500 font-bold text-sm md:text-md`}
//             >
//               Gender *
//             </label>
//             <Controller
//               control={control}
//               name={"gender"}
//               id={"gender"}
//               render={({ field }) => (
//                 <div
//                   className={`flex items-center gap-5 rounded-md px-2 bg-white py-1 md:py-[6px]`}
//                 >
//                   <RadioGroup
//                     row
//                     aria-labelledby="demo-row-radio-buttons-group-label"
//                     {...field}
//                   >
//                     <FormControlLabel
//                       value="female"
//                       control={<Radio />}
//                       label="Female"
//                     />
//                     <FormControlLabel
//                       value="male"
//                       control={<Radio />}
//                       label="Male"
//                     />
//                     <FormControlLabel
//                       value="transgender"
//                       control={<Radio />}
//                       label="Transgender"
//                     />
//                   </RadioGroup>
//                 </div>
//               )}
//             />
//             <div className="h-4 w-[200px] !z-50 !mb-1">
//               <ErrorMessage
//                 errors={errors}
//                 name={"gender"}
//                 render={({ message }) => (
//                   <p className="text-sm mb-4 relative !bg-white text-red-500">
//                     {message}
//                   </p>
//                 )}
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2">
//             <AuthInputFiled
//               name="adhar_card_number"
//               icon={AccountBox}
//               control={control}
//               type="number"
//               placeholder="Aadhar No"
//               label="Employee Aadhar No *"
//               errors={errors}
//               error={errors.adhar_card_number}
//             />
//             <AuthInputFiled
//               name="pan_card_number"
//               icon={AccountBox}
//               control={control}
//               type="text"
//               placeholder="Employee PAN No"
//               label="Employee PAN No *"
//               errors={errors}
//               error={errors.pan_card_number}
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2">
//             <AuthInputFiled
//               name="bank_account_no"
//               icon={AccountBalance}
//               control={control}
//               type="number"
//               placeholder="Bank Account No"
//               label="Bank Account No*"
//               errors={errors}
//               error={errors.bank_account_no}
//             />
//             <AuthInputFiled
//               name="citizenship"
//               icon={LocationOn}
//               control={control}
//               type="text"
//               placeholder="Citizenship Status"
//               label="Citizenship Status *"
//               errors={errors}
//               error={errors.citizenship}
//               pattern="[A-Za-z\s]+"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2">
//             <AuthInputFiled
//               name="uanNo"
//               icon={AccountBalance}
//               control={control}
//               type="number"
//               placeholder="UAN No"
//               label="Employee UAN No"
//               errors={errors}
//               error={errors.uanNo}
//             />
//             <AuthInputFiled
//               name="esicNo"
//               icon={AccountBalance}
//               control={control}
//               type="text"
//               placeholder="ESIC No"
//               label="Employee ESIC No"
//               errors={errors}
//               error={errors.esicNo}
//               pattern="[A-Za-z\s]+"
//             />
//           </div>

//           <div className="flex justify-end">
//             <button
//               type="submit"
//               disabled={isLastStep}
//               className="!w-max flex group justify-center px-6 gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
//             >
//               Next
//             </button>
//           </div>
//         </form>
//       </>
    
//   </div>
// );
// };

// export default Signupvendor



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

const Signupvendor = ({ nextStep, prevStep, isFirstStep, isLastStep }) => {
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
  } = useEmpState();

  console.log("test");

  const EmployeeSchema = z.object({
    first_name: z
      .string()
      .min(1, { message: "Minimum 1 character required" })
      .max(15, { message: "Maximum 15 character allowed" })
      .regex(/^[a-zA-Z]+$/, { message: "Only character allowed" }),
    last_name: z
      .string()
      .min(1, { message: "Minimum 1 character required" })
      .max(15, { message: "Maximum 15 character allowed" })
      .regex(/^[a-zA-Z]+$/, { message: "Only character allowed" }),
    gender: z.string(),
    // email: z.string().email(),
    email: z
    .string()
    .email({ message: "Invalid email format" })
    .regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, {
      message: "Email must be in lowercase and should not contain capital letters",
    }),

    phone_number: z
      .string()
      // .max(10, { message: "Phone Number must be 10 digits" })
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
      .min(3, { message: "min 3 character required" })
      .regex(/^[a-zA-Z]+$/, { message: "Only character allowed" }),
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
        message: "A PAN No cannot contain a special character, e.g., *,#.",
      }),
    bank_account_no: z
      .string()
      .max(35, { message: "Only 35 numbers allowed" })
      .regex(/^\d*$/, {
        message: "Bank number cannot be negative.",
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
            placeholder="john"
            label="Employee First Name *"
            errors={errors}
            error={errors.first_name}
            className="text-sm" 
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
          placeholder="Employee Email"
          label="Employee  Email *"
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
          placeholder="Address"
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
            className={`${
              errors.gender && "text-red-500"
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
            label="Employee Aadhar No *"
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
            placeholder="Employee PAN No"
            label="Employee PAN No *"
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
        {/* <div className="grid grid-cols-1  md:grid-cols-2 w-full gap-2"> */}
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
        {/* </div> */}

        {/* <div className="grid grid-cols-1  md:grid-cols-2 w-full gap-2"> */}
          <AuthInputFiled
            name="uanNo"
            icon={AccountBalance}
            control={control}
            type="number"
            placeholder="UAN No"
            label="Employee UAN No"
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
            label="Employee ESIC No"
            errors={errors}
            error={errors.esicNo}
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
            className="flex justify-center px-4 py-1 text-md font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600" >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signupvendor;
