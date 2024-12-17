import { Add, Info } from "@mui/icons-material";
import WorkOffOutlinedIcon from "@mui/icons-material/WorkOffOutlined";
import { Button } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";
import CreteLeaveTypeModal from "../../../components/Modal/LeaveTypeModal/create-leve-type-modal";
import Setup from "../Setup";
import LeaveTypeEditBox from "./components/leave-type-layoutbox";
import SkeletonForLeaveTypes from "./components/skeleton-for-leavetype";
const LeaveTypes = ({ open, handleClose, id }) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [confirmOpen, setConfirmOpen] = useState(false);
  const queryClient = useQueryClient();
  const params = useParams();

  const { data, isLoading } = useQuery(
    "leaveTypes",
    async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/leave-types-details/get`,
        { organisationId: params.organisationId },
        config
      );
      return response.data.data;
    },
    {
      onSuccess: (newData) => {
        // Update the query cache with the new data
        queryClient.setQueryData("leaveTypes", newData);
      },
    }
  );
  console.log("data", data);

  const handleCreateLeave = () => {
    setConfirmOpen(true);
  };

  return (
    <section className="bg-gray-50 min-h-screen w-full">
      <Setup>
        <div className=" lg:w-[100%] w-full h-full bg-white   shadow-xl  rounded-sm">
          <div className="p-4  border-b-[.5px] flex   gap-3 w-full border-gray-300 justify-between">
            <div className="flex gap-3">
              <div className="mt-1">
                <WorkOffOutlinedIcon />
              </div>
              <div>
                <h1 className="!text-lg">Leaves</h1>
                <p className="text-xs text-gray-600">
                  Create multiple types of leaves which will applicable to all
                  employees. Ex: Casual leaves, Sick leaves.
                </p>
              </div>
            </div>
            <Button
              className="!bg-[#0ea5e9]"
              variant="contained"
              onClick={handleCreateLeave}
            >
              <Add />
              Add Leave
            </Button>
          </div>
          {data && data.length > 0 ? (
            <div className="overflow-y-scroll">
              <table className="min-w-full bg-white text-left text-sm font-light">
                <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                  <tr className="!font-medium shadow-lg">
                    <th scope="col" className="px-6 py-3 ">
                      Sr. No
                    </th>
                    <th scope="col" className="px-6 py-3 ">
                      Leave Name
                    </th>
                    <th scope="col" className="px-6 py-3 ">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 ">
                      Color
                    </th>
                    <th scope="col" className="px-6 py-3 ">
                      Count
                    </th>
                    <th scope="col" className="px-6 py-3 ">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <SkeletonForLeaveTypes />
                  ) : (
                    <>
                      {data &&
                        data.map((leaveType, index) => (
                          <LeaveTypeEditBox
                            key={index}
                            leaveType={leaveType}
                            index={index}
                          />
                        ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="!text-2xl" />
                <h1 className="text-lg font-semibold">Add Leave </h1>
              </article>
              <p>No leave found. Please add types of leave</p>
            </section>
          )}
        </div>
      </Setup>
      <CreteLeaveTypeModal
        open={confirmOpen}
        handleClose={() => {
          setConfirmOpen(false);
        }}
      />
    </section>
  );
};

export default LeaveTypes;
