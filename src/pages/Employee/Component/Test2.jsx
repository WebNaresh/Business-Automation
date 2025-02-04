import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddBusiness,
  Badge,
  ContactMail,
  LocationCity,
  MonetizationOn,
  PersonAddAlt,
  PersonPin,
  TodayOutlined,
  Work,
  Today,
  AccountBalance,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { UseContext } from "../../../State/UseState/UseContext";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useEmpOption from "../../../hooks/Employee-OnBoarding/useEmpOption";
import useEmployeeState from "../../../hooks/Employee-OnBoarding/useEmployeeState";

const Test2 = ({ isLastStep, nextStep, prevStep }) => {
  // to define the state, hook and other function
  const organisationId = useParams("");
  const { employeeId } = useParams("");
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const {
    designation,
    profile,
    worklocation,
    deptname,
    employmentType,
    empId,
    mgrempid,
    joining_date,
    salarystructure,
    companyemail,
    setStep2Data,
    shift_allocation,
    date_of_birth,
    status,
    current_ctc,
    incentive,
    health_insurance,
    exit_date,
    travel_expenses_allowance,
    travel_requirement,
    id_card_no,
    company_assets
  } = useEmployeeState();

  // to get the data from organization like department , location data
  const {
    Departmentoptions,
    Manageroptions,
    RolesOptions,
    Shiftoptions,
    locationoption,
    salaryTemplateoption,
    empTypesoption,
    Designationoption,
  } = useEmpOption(organisationId);

  const isAtLeastNineteenYearsOld = (value) => {
    const dob = new Date(value);
    const birth = moment(date_of_birth, "YYYY-MM-DD");
    const currentValue = moment(dob, "YYYY-MM-DD");
    const differenceInDOB = currentValue.diff(birth, "years");
    return differenceInDOB >= 19;
  };

  // to define the schema using zod
  const EmployeeSchema = z
    .object({
      designation: z.object({
        label: z.string(),
        value: z.string(),
      }),
      worklocation: z.object({
        label: z.string(),
        value: z.string(),
      }),
      deptname: z.object({
        label: z.string(),
        value: z.string(),
      }),
      employmentType: z.object({
        label: z.string(),
        value: z.string(),
      }),
      empId: z
        .string()
        .min(1, { message: "Employee code is required" })
        .max(25, { message: "Employee code is not greater than 25 character" }),
      mgrempid: z
        .object({
          label: z.string().optional(),
          value: z.string().optional(),
        })
        .optional(),
      joining_date: z
        .string()
        .refine(isAtLeastNineteenYearsOld, {
          message: "Employee must be at least 19 years old",
        })
        .refine(
          (value) => {
            const joiningDate = moment(value, "YYYY-MM-DD");
            const currentDate = moment();
            return joiningDate.isSameOrBefore(currentDate);
          },
          {
            message: "Joining date cannot be in the future",
          }
        ),
      salarystructure: z.object({
        label: z.string(),
        value: z.string(),
      }),
      status: z
        .string(),
      companyemail: z.string().email(),
      profile: z.any(),
      shift_allocation: z.object({
        label: z.string(),
        value: z.string(),
      }),
      current_ctc: z
        .string()
        .optional(),

      incentive: z
        .string()
        .optional(),

      health_insurance: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, { message: "Health Insurance must be a valid number" })
        .optional(),
      exit_date: z
        .string()
        .optional()
        .refine(
          (value) => {
            if (value) {
              const exitDate = moment(value, "YYYY-MM-DD");
              const currentDate = moment();
              return exitDate.isSameOrBefore(currentDate);
            }
            return true;
          },
          { message: "Exit date cannot be in the future" }
        ),

      travel_expenses_allowance: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, { message: "Travel expenses allowance must be a valid number" })
        .optional(),
      travel_requirement: z
        .string()
        .optional(),

      id_card_no: z
        .string()
        .optional(),

      company_assets: z.string().optional(),

    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password don't match",
      path: ["confirmPassword"],
    });


  // use useForm
  const { control, formState, handleSubmit, setValue } = useForm({
    defaultValues: {
      designation: designation,
      profile: profile,
      worklocation: worklocation,
      deptname: deptname,
      employmentType: employmentType,
      empId: empId,
      mgrempid: mgrempid,
      joining_date: joining_date,
      salarystructure: salarystructure,
      companyemail: companyemail,
      shift_allocation: shift_allocation,
      status: status,
    },
    resolver: zodResolver(EmployeeSchema),
  });

  // fetch the data of existing employee and set the value
  const { isFetching } = useQuery(
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
          console.log("dataemp", data.employee);
          setValue("empId", data.employee.empId || "");
          setValue("status", data.employee.employeeStatus || "");
          setValue("companyemail", data.employee.companyemail || "");
          const joiningDate = new Date(data.employee.joining_date);
          if (!isNaN(joiningDate.getTime())) {
            setValue(
              "joining_date",
              joiningDate.toISOString().split("T")[0] || ""
            );
          } else {
            console.error("Invalid joining date:", data.employee.joining_date);
            setValue("joining_date", "");
          }
          const designation =
            data.employee?.designation &&
            data.employee?.designation?.find(
              (item) =>
                item?.value === data.employee?.designation?.item?._id || ""
            );
          if (designation) {
            setValue("designation", {
              label: designation.designationName,
              value: designation._id,
            });
          }

          const deptname =
            data.employee?.deptname &&
            data.employee?.deptname?.find(
              (item) => item?.value === data.employee?.deptname?.item?._id
            );
          if (deptname) {
            setValue("deptname", {
              label: deptname.departmentName,
              value: deptname._id,
            });
          }

          const worklocation =
            data.employee?.worklocation &&
            data.employee?.worklocation?.find(
              (item) => item?.value === data.employee?.worklocation?.item?._id
            );
          if (worklocation) {
            setValue("worklocation", {
              label: worklocation.city,
              value: worklocation._id,
            });
          }

          const employmentType = data.employee?.employmentType;
          if (employmentType) {
            setValue("employmentType", {
              label: employmentType.title,
              value: employmentType._id,
            });
          }

          const salaryTemplate = data.employee?.salarystructure;
          if (salaryTemplate) {
            setValue("salarystructure", {
              label: salaryTemplate.name,
              value: salaryTemplate._id,
            });
          }
          setValue("shift_allocation", {
            label:
              (
                data.employee?.shift_allocation &&
                Shiftoptions &&
                Shiftoptions.find(
                  (val) => val.value === data.employee.shift_allocation
                )
              )?.label || "",
            value: data.employee.shift_allocation || "",
          });

          if (data.employee.mgrempid) {
            Manageroptions.find(
              (option) => option.value === data.employee.mgrempid
            );
          }

          const checkManager = Manageroptions?.find(
            (opt) => opt.value === data.employee.mgrempid
          );

          if (checkManager?.label && data.employee.mgrempid) {
            setValue("mgrempid", {
              label: checkManager?.label ? checkManager?.label : "",
              value: data.employee.mgrempid ? data.employee.mgrempid : "",
            });
          } else {
            setValue("mgrempid", undefined);
          }

          if (data.employee.profile) {
            const profileLabel = data?.employee?.profile
              ?.filter((role) => role !== "Employee")
              .map((ev) => ({
                label: ev,
                value: ev,
              }));
            setValue("profile", profileLabel);
          } 
          setValue("current_ctc", data.employee.current_ctc || "");
        }
      },
    }
  );

  const { errors } = formState;
  // to define the onSubmit function
  const onsubmit = (data) => {
    setStep2Data(data);
    nextStep();
  };

  return (
    <div className="w-full mt-4">
      <h1 className="text-2xl mb-4 font-bold">Company Info</h1>
      {isFetching ? (
        <CircularProgress />
      ) : (
        <>
          <form
            onSubmit={handleSubmit(onsubmit)}
            className="w-full flex space-y-2  flex-1 flex-col"
          >
            <div className="grid grid-cols-1  md:grid-cols-2 w-full gap-3">
              <AuthInputFiled
                name="empId"
                icon={Work}
                control={control}
                type="text"
                placeholder="Employee Code"
                label="Employee Code *"
                errors={errors}
                error={errors.empId}
              />
              <AuthInputFiled
                name="status"
                icon={Work}
                control={control}
                type="text"
                placeholder="Status"
                label="Status"
                errors={errors}
                error={errors.status}
                className="text-sm"
              />
            </div>
            <div className="grid grid-cols-1  md:grid-cols-3 w-full gap-3">
              <AuthInputFiled
                name="deptname"
                value={deptname}
                icon={AddBusiness}
                control={control}
                type="select"
                placeholder="Department"
                label="Select Department  *"
                errors={errors}
                error={errors.deptname}
                options={Departmentoptions}
              />
              <AuthInputFiled
                name="mgrempid"
                value={mgrempid}
                icon={PersonAddAlt}
                control={control}
                type="select"
                placeholder="Manager"
                label="Select Manager"
                errors={errors}
                error={errors.mgrempid}
                options={Manageroptions}
                isClearable={true}
              />
              <AuthInputFiled
                name="profile"
                icon={PersonPin}
                control={control}
                type="multiselect"
                value={profile}
                placeholder="Role"
                label="Select Role "
                errors={errors}
                error={errors.profile}
                options={RolesOptions}
              />
            </div>

            <div className="grid grid-cols-1  md:grid-cols-2 w-full gap-3">
              <AuthInputFiled
                name="companyemail"
                icon={ContactMail}
                control={control}
                type="text"
                placeholder="Email"
                label="Company Email *"
                errors={errors}
                error={errors.companyemail}
                wrapperMessage={"Note this email is used for login credentails"}
              />
              <AuthInputFiled
                name="joining_date"
                icon={TodayOutlined}
                control={control}
                type="date"
                placeholder="dd-mm-yyyy"
                label="Date of Joining *"
                errors={errors}
                error={errors.joining_date}
              />
            </div>

            <div className="grid grid-cols-1  md:grid-cols-2 w-full gap-3">
              <AuthInputFiled
                name="designation"
                icon={Work}
                control={control}
                value={designation}
                placeholder="Designation"
                label="Select Designation *"
                type="select"
                options={Designationoption}
                errors={errors}
                error={errors.designation}
              />
              <AuthInputFiled
                name="shift_allocation"
                value={shift_allocation}
                icon={Today}
                control={control}
                type="select"
                options={Shiftoptions}
                placeholder="Shift"
                label="Select Shift "
                errors={errors}
                error={errors.shift_allocation}
              />
            </div>
            <div className="grid grid-cols-1  md:grid-cols-2 w-full gap-3">

              <AuthInputFiled
                name="worklocation"
                value={worklocation}
                icon={LocationCity}
                control={control}
                type="select"
                placeholder="Location"
                label="Select Location *"
                options={locationoption}
                errors={errors}
                error={errors.worklocation}
              />
            </div>
            <div className="grid grid-cols-1  md:grid-cols-2 w-full gap-3">
              <AuthInputFiled
                value={employmentType}
                name="employmentType"
                icon={Badge}
                control={control}
                type="select"
                placeholder="Employment Type "
                label="Select Employment Type *"
                options={empTypesoption}
                errors={errors}
                error={errors.employmentType}
              />
              <AuthInputFiled
                name="salarystructure"
                value={salarystructure}
                icon={MonetizationOn}
                control={control}
                type="select"
                placeholder="Salary Temp"
                label="Select Salary Template *"
                options={salaryTemplateoption}
                errors={errors}
                error={errors.salarystructure}
              />
            </div>

            <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">
              <AuthInputFiled
                name="current_ctc"
                icon={Work}
                control={control}
                type="text"
                placeholder="Current CTC"
                label="Current CTC"
                errors={errors}
                error={errors.current_ctc}
                pattern="[A-Za-z\s]+"
                className="text-sm"
              />
              <AuthInputFiled
                name="exit_date"
                icon={Work}
                control={control}
                type="date"
                placeholder="Exit Date"
                label="Exit Date"
                errors={errors}
                error={errors.exit_date}
                pattern="[A-Za-z\s]+"
                className="text-sm"
              />
              <AuthInputFiled
                name="travel_requirement"
                icon={AccountBalance}
                control={control}
                type="text"
                placeholder="Travel Requirement"
                label="Travel Requirement"
                errors={errors}
                error={errors.travel_requirement}
                pattern="[A-Za-z\s]+"
                className=" text-sm"
              />
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-4">

              <AuthInputFiled
                name="id_card_no"
                icon={AccountBalance}
                control={control}
                type="text"
                placeholder="Travel Expenses Allowance"
                label="Travel Expenses Allowance"
                errors={errors}
                error={errors.id_card_no}
                className="text-sm
"
              />
              <AuthInputFiled
                name="company_assets"
                icon={AccountBalance}
                control={control}
                type="text"
                placeholder="Company Assets"
                label="Company Assets"
                errors={errors}
                error={errors.company_assets}
                pattern="[A-Za-z\s]+"
                className=" text-sm"
              />
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
        </>
      )}
    </div>
  );
};

export default Test2;
