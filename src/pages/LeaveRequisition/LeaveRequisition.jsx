import { CalendarMonth } from "@mui/icons-material";
import { Badge, Button, Skeleton } from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "tailwindcss/tailwind.css";
import AppDatePicker from "../../components/date-picker/date-picker";
import HeaderBackComponent2 from "../../components/header/HeaderBackComponent2";
import useLeaveData from "../../hooks/Leave/useLeaveData";
import LeaveTable from "./components/LeaveTabel";
import Mapped from "./components/mapped-form";
import { useQuery } from "react-query";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import { useParams } from "react-router";
import CalenderAnimation from "../../assets/CalenderAnimation.gif";
import CAppDatePicker from "../../components/date-picker/Cdate-picker";
import UserProfile from "../../hooks/UserData/useUser";

const LeaveRequisition = () => {
  const {
    data,
    shiftData,
    setCalendarOpen,
    isLoading,
    handleSubmit,
    handleInputChange,
    newAppliedLeaveEvents,
    setNewAppliedLeaveEvents,
    isCalendarOpen,
    handleUpdateFunction,
    selectEvent,
    setSelectedLeave,
    selectedLeave,
    setselectEvent,
    deleteLeaveMutation,
    calLoader,
    setCalLoader,
  } = useLeaveData();

  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams();

  const user = UserProfile().getCurrentUser();
  console.log("Thsii is user", user);

  // Fetch department data
  const { data: machinePunchingRecord, isLoading: isMachineLoading } = useQuery(
    ["machinePunching", organisationId],
    async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/route/availableRecords`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data.data[0].availableRecords;
    }
  );

  // Manage loading state for selected dates
  const [isDataLoading, setIsDataLoading] = useState(true);
  console.log(isDataLoading);

  // Manage visibility of CAppDatePicker
  const [isCAppDatePickerVisible, setIsCAppDatePickerVisible] = useState(true);
  // Update loading state when data is ready
  useEffect(() => {
    if (newAppliedLeaveEvents.length > 0 || !isMachineLoading) {
      setIsDataLoading(false);
    }
  }, [newAppliedLeaveEvents, isMachineLoading]);

  useEffect(() => {
    if (
      newAppliedLeaveEvents.length <= 0 &&
      Array.isArray(newAppliedLeaveEvents)
    ) {
      setIsCAppDatePickerVisible(true);
    }
  }, [newAppliedLeaveEvents]);

  return (
    <section className="">
      <HeaderBackComponent2
        heading={"Attendance & Leave Management"}
        oneLineInfo={
          "Track your attendance and submit your leave requests here for timely approval and efficient management"
        }
      />

      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        {/* Left side - Leave Table */}
        <div className="flex flex-col lg:w-[20%] gap-4">
          {/* Calendar & Actions - Select Date */}
          <div className="flex flex-col bg-gray-50 shadow-md rounded-lg p-2">
            {isLoading ? (
              <div className="flex items-center">
                <Badge
                  badgeContent={"loading"}
                  color="primary"
                  variant="standard"
                >
                  <Button
                    disabled
                    variant="contained"
                    size="large"
                    className="!rounded-full !h-16 !w-16 group-hover:!text-white !text-black"
                    color="info"
                  >
                    <CalendarMonth className="!text-4xl text-gray-600" />
                  </Button>
                </Badge>
                <div className="ml-2">
                  <Skeleton variant="text" width={150} height={20} />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Badge badgeContent={"Click"} color="warning">
                  <Button
                    disabled={isLoading}
                    onClick={handleInputChange}
                    size="large"
                    className="!rounded-full !h-16 !w-20 group-hover:!text-white !text-black"
                    color="info"
                  >
                    <img
                      src={CalenderAnimation}
                      alt="Calendar Animation"
                      className="!w-16 !h-20 object-cover"
                    />
                  </Button>
                </Badge>
                <p className="ml-6 pl-5 text-gray-600 font-semibold mb-2 text-lg">
                  Select Date
                  <div className="h-max grid gap-4 space-y-2 py-3">
                    <Button
                      //  disabled={isLoading && isCAppDatePickerVisible }
                      disabled={isLoading || isCAppDatePickerVisible}
                      onClick={() => setCalendarOpen(true)}
                      variant="contained"
                      size="small"
                      className="text-center w-fit"
                    >
                      {!isLoading ? "Apply" : "Wait Calendar is Loading"}
                    </Button>
                  </div>
                </p>
              </div>
            )}
          </div>

          {/* left Side- Leave Table */}
          <div className="bg-gray-100 shadow-md rounded-md p-2 pb-7">
            <LeaveTable />
          </div>
        </div>

        {/* Right side - Date Picker & Selected Dates */}
        <div className="flex flex-col lg:w-[80%] bg-gray-50  rounded-md ">
          {/* Render Date Picker */}
          {isCAppDatePickerVisible ? (
            <CAppDatePicker
              data={data}
              shiftData={shiftData}
              machinePunchingRecord={machinePunchingRecord}
              handleUpdateFunction={handleUpdateFunction}
              selectEvent={selectEvent}
              setselectEvent={setselectEvent}
              setCalendarOpen={setCalendarOpen}
              setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
              selectedLeave={selectedLeave}
              setSelectedLeave={setSelectedLeave}
              newAppliedLeaveEvents={newAppliedLeaveEvents}
              isCalendarOpen={isCalendarOpen}
              deleteLeaveMutation={deleteLeaveMutation}
              calLoader={calLoader}
              setCalLoader={setCalLoader}
              setIsCAppDatePickerVisible={setIsCAppDatePickerVisible}
            />
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                className="space-y-2 bg-white py-3 px-8 shadow-lg rounded-lg"
              >
                <h1 className="text-gray-400 font-semibold text-md">
                  Selected Dates
                </h1>
                <div className="space-y-4">
                  {newAppliedLeaveEvents.map((item, index) => (
                    <Mapped
                      key={index}
                      setCalendarOpen={setCalendarOpen}
                      subtractedLeaves={data?.LeaveTypedEdited}
                      item={item}
                      index={index}
                      newAppliedLeaveEvents={newAppliedLeaveEvents}
                      setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
                    />
                  ))}
                  <div className="w-full flex justify-center my-1">
                    <Button
                      type="submit"
                      variant="contained"
                      className="font-bold"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </form>

              <AppDatePicker
                data={data}
                shiftData={shiftData}
                machinePunchingRecord={machinePunchingRecord}
                handleUpdateFunction={handleUpdateFunction}
                selectEvent={selectEvent}
                setselectEvent={setselectEvent}
                setCalendarOpen={setCalendarOpen}
                setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
                selectedLeave={selectedLeave}
                setSelectedLeave={setSelectedLeave}
                newAppliedLeaveEvents={newAppliedLeaveEvents}
                isCalendarOpen={isCalendarOpen}
                deleteLeaveMutation={deleteLeaveMutation}
                calLoader={calLoader}
                setCalLoader={setCalLoader}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default LeaveRequisition;
