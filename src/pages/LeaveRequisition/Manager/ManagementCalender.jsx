import {
  CalendarMonth,
  DeleteOutlined,
  EditOutlined,
  Person,
  West,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { format } from "date-fns";
import moment from "moment";
import React, { useContext, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import { CustomOption } from "../../../components/InputFileds/AuthInputFiled";
import useLeaveTable from "../../../hooks/Leave/useLeaveTable";
import { TestContext } from "../../../State/Function/Main";
import usePublicHoliday from "../../SetUpOrganization/PublicHolidayPage/usePublicHoliday";
import DeleteModal from "../components/DeleteModal";
import SideBalenceTable from "../components/SideBalenceTable";
import SideLeaveTable from "../components/SideLeaveTable";
import SkeletonLeave from "../components/skeletonComponent";
import useCreateLeaveRequest from "../hooks/useCreateLeaveRequest";
import useCustomStates from "../hooks/useCustomStates";
import useGetWeekends from "../hooks/useGetWeekends";
import useManagerCalender from "./useManagerCalender";

const ManagementCalender = () => {
  const localizer = momentLocalizer(moment);
  const { organisationId } = useParams("");
  // const [employee, setEmployee] = useState("");
  const [openDelete, setOpenDelete] = useState(null);

  const { handleAlert } = useContext(TestContext);
  const {
    newAppliedLeaveEvents,
    setNewAppliedLeaveEvents,
    selectedLeave,
    setSelectedLeave,
    selectEvent,
    changeTable,
    employee,
    setEmployee,
    setIsUpdate,
    isUpdate,
    updateLeaveType,
    setUpdateLeaveType,
  } = useCustomStates();
  const { withOutLeaves } = useLeaveTable();
  const { updateLeaveMutation } = useCreateLeaveRequest(employee);
  const { filteredHolidayWithStartAndEnd, allPublicHoliday } =
    usePublicHoliday(organisationId);

  const {
    EmployeeLeaves,
    leaveTableData,
    employeeData,
    employeeLoading,
    isFetching,
    isLoading,
  } = useManagerCalender({ employee, organisationId });

  let newLeave = [];

  if (
    Array.isArray(leaveTableData?.leaveTypes) &&
    withOutLeaves?.LeaveTypedEdited
  ) {
    newLeave = [
      ...leaveTableData?.leaveTypes
        ?.filter((item) => item?.count > 0)
        ?.map((leave) => ({
          value: leave?._id,
          label: leave?.leaveName,
        })),
      ...withOutLeaves?.LeaveTypedEdited?.filter(
        (item) => item?.leaveName !== "Public Holiday" && item?.count < 0
      )?.map((leave) => ({
        value: leave?._id,
        label: leave?.leaveName,
      })),
    ];
  }

  const increaseEndDateByOneDay = (events) => {
    return events.map((event) => ({
      ...event,
      end: moment(event.end).add(1, "days").toDate(),
    }));
  };

  let combinedEvents = [];

  const currentYearLeavesWithIncreasedEndDate = increaseEndDateByOneDay(
    EmployeeLeaves?.currentYearLeaves || []
  );
  const newAppliedLeaveEventsWithIncreasedEndDate = increaseEndDateByOneDay(
    newAppliedLeaveEvents || []
  );

  // Combine the arrays
  combinedEvents = [
    ...currentYearLeavesWithIncreasedEndDate,
    ...newAppliedLeaveEventsWithIncreasedEndDate,
    ...allPublicHoliday,
  ];

  const handleSelectSlot = async ({ start, end }) => {
    const selectedStartDate = moment(start).startOf("day");
    const selectedEndDate = moment(end).startOf("day").subtract(1, "days");

    const currentDate = moment(selectedStartDate);

    const includedDays = weekends.days?.days?.map((day) => day.day);
    while (currentDate.isSameOrBefore(selectedEndDate)) {
      const currentDay = currentDate.format("ddd");
      if (includedDays.includes(currentDay)) {
        return handleAlert(
          true,
          "warning",
          `You cannot select ${currentDay} for leave`
        );
      }
      currentDate.add(1, "day");
    }

    const isOverlap = combinedEvents.some((range) => {
      const rangeStart = range.start;
      const rangeEnd = moment(range.end).startOf("day").subtract(1, "days");

      // Check if selected start date is between any existing range
      const isStartBetween = selectedStartDate.isBetween(
        rangeStart,
        rangeEnd,
        undefined,
        "[)"
      );

      // Check if selected end date is between any existing range
      const isEndBetween = selectedEndDate.isBetween(
        rangeStart,
        rangeEnd,
        undefined,
        "(]"
      );

      // Check if selected start and end date overlaps with any existing range

      const isOverlap =
        selectedStartDate.isSameOrBefore(rangeEnd) &&
        selectedEndDate.isSameOrAfter(rangeStart);
      // Return true if any overlap is found
      return isStartBetween || isEndBetween || isOverlap;
    });

    if (isOverlap) {
      return handleAlert(
        true,
        "warning",
        "You have already selected this leave"
      );
    } else {
      const newLeave = {
        title: selectEvent ? "Updated Leave" : "Selected Leave",
        start: new Date(selectedStartDate).toISOString(),
        end: new Date(selectedEndDate).toISOString(),
        color: selectEvent ? "black" : "blue",
        leaveTypeDetailsId: "",
        _id: selectedLeave?._id ? selectedLeave?._id : null,
      };

      setNewAppliedLeaveEvents(newLeave);
      setSelectedLeave(selectEvent ? null : newLeave);
      // setselectEvent(false);
    }
    // setCalLoader(false);
  };

  console.log("test one ", newAppliedLeaveEvents);

  const { weekends } = useGetWeekends();

  const dayPropGetter = (date) => {
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });

    // Check if the current day is in the data? array
    const isDisabled = weekends?.days?.days?.some((day) => {
      return day.day === dayOfWeek;
    });
    if (isDisabled) {
      return {
        style: {
          pointerEvents: "none",
          backgroundColor: "#f7bfbf",
        },
      };
    }

    return {};
  };

  const handleSelectEvent = (event) => {
    const selectedEndDate = moment(event?.end)
      .startOf("day")
      .subtract(1, "days");
    setSelectedLeave({
      ...event,
      end: new Date(selectedEndDate).toISOString(),
    });
  };

  return (
    <div>
      <header className="text-xl w-full pt-6 bg-white border-b   p-4">
        <Link to={-1}>
          <West className="mx-4 !text-xl" />
        </Link>
        Employee Attendance
      </header>

      {/* Top Bar */}

      <section className="p-4 md:px-8 px-2 bg-gray-50 md:min-h-[80vh] h-full  ">
        <div class=" gap-1  ">
          <h2 class=" text-2xl tracking-tight">View Employee Attendence</h2>
          <p class="text-sm text-muted-foreground">
            Here you can view your employee attendance
          </p>
        </div>

        <div className="my-4 flex md:flex-row flex-col justify-between gap-4 items-end">
          <div className="md:w-[30%] w-full">
            <div className={`space-y-1 min-w-[15vw] `}>
              <label className={` font-semibold text-gray-500 text-lg`}>
                Select Employee
              </label>
              <div
                className={`flex rounded-md px-2 bg-white border-gray-200 border-[.5px] items-center`}
              >
                <Person className="text-gray-700 md:text-lg !text-[1em]" />
                <Select
                  aria-errormessage=""
                  placeholder={"Assignee"}
                  isClearable
                  styles={{
                    control: (styles) => ({
                      ...styles,
                      borderWidth: "0px",
                      boxShadow: "none",
                    }),
                  }}
                  className={` bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
                  components={{
                    Option: CustomOption,
                    IndicatorSeparator: () => null,
                  }}
                  options={employeeData?.map((emp) => ({
                    value: emp._id,
                    label: `${emp.first_name} ${emp.last_name}`,
                    image: emp.user_logo_url,
                  }))}
                  value={employeeData?.find((val) => val.value === employee)}
                  onChange={(value) => {
                    setEmployee(value?.value);
                    setSelectedLeave({});
                    setIsUpdate(false);
                  }}
                />
              </div>
            </div>
          </div>

          {selectedLeave?.title !== "Selected Leave" &&
          Object.keys(selectedLeave).length > 0 ? (
            <div className="flex  md:flex-row flex-col gap-2 p-1 px-4 w-full md:w-[70%] bg-blue-50 justify-between border rounded-md items-center">
              <h1 className="text-lg font-bold leading-none text-gray-700">
                Modify {selectedLeave?.title} request from{" "}
                {format(new Date(selectedLeave?.start), "PP")} to{" "}
                {format(new Date(selectedLeave?.end), "PP")}
              </h1>
              <div className="flex md:flex-row flex-col gap-2 items-center ">
                {isUpdate ? (
                  <>
                    <div
                      className={`flex rounded-md px-2 bg-white border-gray-200 border-[.5px] items-center`}
                    >
                      <CalendarMonth className="text-gray-700 md:text-lg !text-[1em]" />
                      <Select
                        // value={selectedValues[id] || null}
                        placeholder={"Select leave type"}
                        isClearable
                        styles={{
                          control: (styles) => ({
                            ...styles,
                            borderWidth: "0px",
                            boxShadow: "none",
                            zIndex: 10000000,
                          }),

                          menu: (styles) => ({
                            ...styles,
                            maxHeight: "250px",
                            overflowY: "auto",
                            zIndex: 10000000,
                          }),
                          menuList: (styles) => ({
                            ...styles,
                            zIndex: 10000000,
                            maxHeight: "250px", // Adjust the max maxHeght of the menu
                            overflowY: "auto",
                          }),
                        }}
                        className={` bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
                        components={{
                          IndicatorSeparator: () => null,
                        }}
                        options={newLeave}
                        onChange={(leave) => {
                          setUpdateLeaveType(leave);
                          // handleChange(leave, id);
                          //   setEmployee(value?.value);
                        }}
                      />
                    </div>
                    <div className="gap-1 flex items-center">
                      <button
                        type="button"
                        onClick={() => setIsUpdate(false)}
                        className="w-max flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1  text-sm font-semibold hover:!text-white !text-red-500 hover:bg-red-300 focus-visible:outline-red-500"
                      >
                        cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newLeave = {
                            title: updateLeaveType?.label,
                            start: new Date(selectedLeave?.start).toISOString(),
                            end: moment(selectedLeave?.end),
                            color: "black",
                            leaveTypeDetailsId: updateLeaveType?.value,
                            _id: selectedLeave?._id,
                          };

                          updateLeaveMutation.mutate(newLeave);
                          // setIsUpdate(false);
                          // setSelectedLeave({});
                        }}
                        className="w-max flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1  text-sm font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
                      >
                        Submit
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex gap-1">
                    <IconButton
                      onClick={() => setOpenDelete(selectedLeave?._id)}
                    >
                      <DeleteOutlined color="error" />
                    </IconButton>
                    <IconButton onClick={() => setIsUpdate(true)}>
                      <EditOutlined color="primary" />
                    </IconButton>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>

        {isFetching || isLoading ? (
          <SkeletonLeave />
        ) : !EmployeeLeaves ? (
          <div className="flex items-center flex-col gap-2 justify-center">
            <img src="/calendar1.png" className="h-[250px]" alt="none" />
            <div>
              <h1 className="text-4xl text-gray-700   font-semibold  tracking-tight">
                {employeeLoading ? "Loading..." : "Select Employee!"}
              </h1>
              <h1 className="text-sm text-gray-700   font-semibold  tracking-tight">
                {employeeLoading
                  ? ""
                  : !employee
                  ? "Please Select Employee to view the data"
                  : "No data found for this selected employee about attendance"}
              </h1>
            </div>
          </div>
        ) : (
          <section className="w-full  h-auto mb-4 flex md:flex-row flex-col gap-4 ">
            <div className="md:hidden block">
              <SideBalenceTable leaveTableData={leaveTableData} />
            </div>
            <div className="md:block hidden w-[30%]">
              {newAppliedLeaveEvents?.length > 0 && !changeTable ? (
                <SideLeaveTable leaveTableData={leaveTableData} />
              ) : (
                <SideBalenceTable leaveTableData={leaveTableData} />
              )}
            </div>
            <div className="manager-cal md:w-[70%]  w-full md:p-4 p-0 bg-white rounded-md border flex items-center justify-center ">
              <Calendar
                localizer={localizer}
                datePropGetter={selectedLeave}
                eventPropGetter={(event) => {
                  let backgroundColor = "blue";

                  if (event?.status) {
                    switch (event.status) {
                      case "Pending":
                        backgroundColor = "orange";
                        break;
                      case "Rejected":
                        backgroundColor = "red";
                        break;
                      case "Approved":
                        backgroundColor = "green";
                        break;
                      default:
                        backgroundColor = "blue";
                        break;
                    }
                  }
                  if (event.color) {
                    backgroundColor = event.color;
                  }

                  return {
                    style: {
                      backgroundColor,
                    },
                  };
                }}
                views={["month"]}
                selectable
                events={[
                  ...currentYearLeavesWithIncreasedEndDate,
                  ...newAppliedLeaveEventsWithIncreasedEndDate,
                  ...allPublicHoliday,
                  ...filteredHolidayWithStartAndEnd,
                ]}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                dayPropGetter={dayPropGetter}
                startAccessor="start"
                endAccessor="end"
                style={{
                  height: "75vh",

                  width: "100%",
                  border: "none",
                  background: "#fff",
                }}
              />
            </div>
          </section>
        )}

        {newAppliedLeaveEvents?.length > 0 ? (
          <div className="md:hidden block">
            <SideLeaveTable leaveTableData={leaveTableData} />
          </div>
        ) : (
          <></>
        )}
      </section>

      <DeleteModal
        open={openDelete}
        handleClose={() => setOpenDelete(null)}
        subtitle={"Delete employee attedance"}
      />
    </div>
  );
};

export default ManagementCalender;
