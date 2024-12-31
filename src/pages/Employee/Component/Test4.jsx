import { CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import useEmployeeState from "../../../hooks/Employee-OnBoarding/useEmployeeState";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";

const Test4 = ({ prevStep }) => {
  // to define the state, hook and import other function
  const { employeeId } = useParams("");
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const creatorId = user._id;
  const navigate = useNavigate("");
  const { handleAlert } = useContext(TestContext);
  const authToken = useAuthToken();
  const { organisationId } = useParams("");

  const {
    first_name,
    last_name,
    email,
    phone_number,
    mgrempid,
    address,
    citizenship,
    adhar_card_number,
    pan_card_number,
    gender,
    password,
    bank_account_no,
    date_of_birth,
    designation,
    worklocation,
    deptname,
    employmentType,
    empId,
    joining_date,
    salarystructure,
    companyemail,
    shift_allocation,
    data,
    profile,
    emptyState,
    pwd,
    uanNo,
    esicNo,
    status,
    emergency_contact_no,
    emergency_contact_name,
    relationship_with_emergency_contact,
    height,
    weight,
    blood_group,
    voting_card_no,
    permanent_address,
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
    ifsc_code,
    current_ctc,
    exit_date,
    travel_requirement,
    id_card_no,
    company_assets
  } = useEmployeeState();

  // to define the handleSumbit function
  const handleSubmit = useMutation(
    () => {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => value !== null)
      );

      // Use filteredData in your component or wherever you need the data
      const userData = {
        first_name,
        last_name,
        email,
        profile,
        password,
        phone_number,
        address,
        citizenship,
        adhar_card_number,
        mgrempid: mgrempid?.value,
        pan_card_number,
        gender,
        bank_account_no,
        date_of_birth,
        empId,
        companyemail,
        joining_date,
        pwd,
        uanNo,
        esicNo,
        employeeStatus: status,
        emergency_contact_no,
        emergency_contact_name,
        relationship_with_emergency_contact,
        height,
        weight,
        blood_group,
        voting_card_no,
        permanent_address,
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
        ifsc_code,
        current_ctc,
        exit_date,
        travel_requirement,
        id_card_no,
        company_assets,
        //TODO This is additonal field data
        ...filteredData,
        designation: designation.value,
        worklocation: worklocation.value,
        deptname: deptname.value,
        employmentType: employmentType.value,
        salarystructure: salarystructure.value,
        shift_allocation: data.shift_allocation?.value || null,
        organizationId: organisationId,
        creatorId,
      };

      console.log("user data", userData);

      const response = axios.put(
        `${import.meta.env.VITE_API}/route/employee/update/${organisationId}/${employeeId}`,
        userData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      return response;
    },
    {
      onSuccess: (response) => {
        toast.success("Employee updated successfully");
        emptyState();
        navigate(`/organisation/${organisationId}/employee-list`);
      },
      onError: (error) => {
        handleAlert(
          "true",
          "error",
          error.response?.data.message ?? "Something went wrong"
        );
      },
    }
  );

  return (
    <>
      {handleSubmit.isLoading && (
        <div className="flex items-center justify-center fixed top-0 bottom-0 right-0 left-0  bg-black/20">
          <CircularProgress />
        </div>
      )}

      <div className="w-full mt-4">
        <h1 className="text-2xl mb-2 font-bold">Confirm Details</h1>

        <>
          <div className="md:p-3 py-1 ">
            <h1 className=" text-lg bg-gray-200 px-4 py-2 w-full  my-2">
              Personal Details
            </h1>
            <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ">
              <div className=" p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 w-full text-sm">Full Name</h1>
                <p className="w-full">
                  {first_name} {last_name}
                </p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">Personal Email</h1>
                <p className="">{email}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Contact</h1>
                <p className="">{phone_number}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <div className=" p-2 w-[30%] rounded-sm w-full">
                <h1 className="text-gray-500 text-sm">Gender</h1>
                <p className="">{gender}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">Date Of Birth</h1>
                <p className="">{date_of_birth}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">
                  Current Address
                </h1>
                <p className="">{address}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 justify-between">
              <div className=" p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">Aadhar No</h1>
                <p className="">{adhar_card_number}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">PAN card</h1>
                <p className="">{pan_card_number}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm w-full">
                <h1 className="text-gray-500 text-sm">Citizenship Status</h1>
                <p className="">{citizenship}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 justify-between">
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Bank Account</h1>
                <p className="">{bank_account_no}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">UAN Number</h1>
                <p className="">{uanNo ?? "-"}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">ESIC Number</h1>
                <p className="">{esicNo ?? "-"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 justify-between">
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Height</h1>
                <p className="">{height}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Weight</h1>
                <p className="">{weight ?? "-"}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Blood Group</h1>
                <p className="">{blood_group ?? "-"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:!grid-cols-3 md:!grid-cols-3 justify-between">
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Voting Card No</h1>
                <p className="">{voting_card_no}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Bank Name</h1>
                <p className="">{bank_name ?? "-"}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">IFSC Code</h1>
                <p className="">{ifsc_code ?? "-"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 justify-between">
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Drinking Habbits</h1>
                <p className="">{drinking_habits}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Sport Interest</h1>
                <p className="">{sports_interest ?? "-"}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Favourite Book</h1>
                <p className="">{favourite_book ?? "-"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 justify-between">
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Favourite Travel Destination</h1>
                <p className="">{favourite_travel_destination}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Disability Status</h1>
                <p className="">{disability_status ?? "-"}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Emergency Medical Condition</h1>
                <p className="">{emergency_medical_condition ?? "-"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 justify-between">
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Short Term Goal</h1>
                <p className="">{short_term_goal}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Long Term Goal</h1>
                <p className="">{long_term_goal ?? "-"}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Petmanent Address</h1>
                <p className="">{permanent_address ?? "-"}</p>
              </div>

            </div>


            <div className="grid grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 justify-between">
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Strength</h1>
                <p className="">{strength ?? "-"}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Weakness</h1>
                <p className="">{weakness ?? "-"}</p>
              </div>

              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Smoking Habbits</h1>
                <p className="">{smoking_habits ?? "-"}</p>
              </div>

            </div>
          </div>


          <h1 className=" text-lg bg-gray-200 px-4 py-2 w-full  my-2">
            Family Details
          </h1>

          <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ">
            <div className=" p-2 w-[30%] rounded-sm ">
              <h1 className="text-gray-500 w-full text-sm">Emergency Contact No</h1>
              <p className="w-full">
                {emergency_contact_no}
              </p>
            </div>
            <div className="p-2 w-[30%] rounded-sm ">
              <h1 className="text-gray-500 text-sm w-full">Emergency Contact Name</h1>
              <p className="">{emergency_contact_name}</p>
            </div>
            <div className="p-2 w-[30%] rounded-sm ">
              <h1 className="text-gray-500 text-sm">Relationship with Emeregency Contact</h1>
              <p className="">{relationship_with_emergency_contact}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <div className=" p-2 w-[30%] rounded-sm w-full">
              <h1 className="text-gray-500 text-sm">Parent Name</h1>
              <p className="">{parent_name}</p>
            </div>
            <div className="p-2 w-[30%] rounded-sm ">
              <h1 className="text-gray-500 text-sm w-full">Spouse Name</h1>
              <p className="">{spouse_name}</p>
            </div>
            <div className="p-2 w-[30%] rounded-sm ">
              <h1 className="text-gray-500 text-sm w-full">
                Father First Name
              </h1>
              <p className="">{father_first_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 justify-between">
            <div className=" p-2 w-[30%] rounded-sm ">
              <h1 className="text-gray-500 text-sm w-full">Father Middal Name</h1>
              <p className="">{father_middal_name}</p>
            </div>
            <div className="p-2 w-[30%] rounded-sm ">
              <h1 className="text-gray-500 text-sm w-full">Father Last Name
              </h1>
              <p className="">{father_last_name}</p>
            </div>
            <div className="p-2 w-[30%] rounded-sm w-full">
              <h1 className="text-gray-500 text-sm">Father Occupation
              </h1>
              <p className="">{father_occupation}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 justify-between">
            <div className="p-2 w-[30%] rounded-sm ">
              <h1 className="text-gray-500 text-sm">Mother First Name</h1>
              <p className="">{mother_first_name}</p>
            </div>
            <div className="p-2 w-[30%] rounded-sm ">
              <h1 className="text-gray-500 text-sm">Mother Middal Name</h1>
              <p className="">{mother_middal_name ?? "-"}</p>
            </div>
            <div className="p-2 w-[30%] rounded-sm ">
              <h1 className="text-gray-500 text-sm">Mother Last Name</h1>
              <p className="">{mother_middal_name ?? "-"}</p>
            </div>
          </div>
          <h1 className=" text-lg bg-gray-200 px-4 py-2 w-full  my-2">
            Official  Details
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-between">
            <div className=" p-2 rounded-sm w-full">
              <h1 className="text-gray-500 text-sm">Employee No</h1>
              <p className="">{empId}</p>
            </div>
            <div className="p-2 rounded-sm ">
              <h1 className="text-gray-500 text-sm w-full">Profile</h1>
              <p className="">{profile?.map((item) => item) ?? "-"}</p>
            </div>
            <div className="p-2 rounded-sm w-full">
              <h1 className="text-gray-500 text-sm">Company Email</h1>
              <p className="">{companyemail}</p>
            </div>

            <div className=" p-2 rounded-sm ">
              <h1 className="text-gray-500 text-sm w-full">
                Date Of Joining
              </h1>
              <p className="">{joining_date}</p>
            </div>
            <div className="p-2 rounded-sm ">
              <h1 className="text-gray-500 text-sm w-full">Department</h1>
              <p className="">{deptname?.label}</p>
            </div>
            <div className="p-2 rounded-sm ">
              <h1 className="text-gray-500 text-sm w-full">Designation</h1>
              <p className="">{designation?.label}</p>
            </div>


            <div className=" p-2 rounded-sm ">
              <h1 className="text-gray-500 text-sm w-full">Shift</h1>
              <p className="">{shift_allocation?.label}</p>
            </div>
            <div className="p-2 rounded-sm ">

            </div>
            <div className="p-2 rounded-sm ">
              <h1 className="text-gray-500 text-sm w-full">Location</h1>
              <p className="">{worklocation?.label}</p>
            </div>



            <div className=" p-2 rounded-sm">
              <h1 className="text-gray-500 w-full text-sm">
                Employment Types
              </h1>
              <p className="">{employmentType?.label}</p>
            </div>
            <div className="p-2 rounded-sm ">
              <h1 className="text-gray-500 text-sm w-full">
                Salary Template
              </h1>
              <p className="">
                {typeof salarystructure === "object" &&
                  salarystructure?.label}
              </p>
            </div>



            <div className=" p-2 rounded-sm ">
              <h1 className="text-gray-500 text-sm w-full">
                Current CTC
              </h1>
              <p className="">{current_ctc}</p>
            </div>
            <div className="p-2 rounded-sm ">
              <h1 className="text-gray-500 text-sm w-full">Exit Date</h1>
              <p className="">{exit_date}</p>
            </div>
            <div className="p-2 rounded-sm ">
              <h1 className="text-gray-500 text-sm w-full">Travel Requirement</h1>
              <p className="">{travel_requirement}</p>
            </div>



            <div className=" p-2 rounded-sm ">
              <h1 className="text-gray-500 text-sm w-full">
                ID Card No
              </h1>
              <p className="">{id_card_no}</p>
            </div>
            <div className="p-2 rounded-sm ">
              <h1 className="text-gray-500 text-sm w-full">Company Assets</h1>
              <p className="">{company_assets}</p>
            </div>

          </div>


          {data &&
            typeof data === "object" &&
            Object.entries(data).length > 0 && (
              <>
                <h1 className=" text-lg bg-gray-200 px-4 py-2 w-full  my-2">
                  Additional Details
                </h1>
                <div className="grid grid-cols-3 justify-between">
                  {Object.entries(data)?.map(([key, value]) => (
                    <div className="p-2 rounded-sm ">
                      <h1 className="text-gray-500 text-sm">{key}</h1>
                      <p className="">{value ? value : "-"}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
        </>
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
            onClick={() => handleSubmit.mutate()}
            className="!w-max flex group justify-center px-6  gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default Test4;



