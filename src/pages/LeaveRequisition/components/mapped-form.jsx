import { CalendarMonth, Delete, Edit, InfoOutlined } from "@mui/icons-material";
import {
  Alert,
  Badge,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Snackbar,
  Tooltip,
} from "@mui/material";
import { differenceInDays, format, parseISO } from "date-fns";
import moment from "moment";
import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useLeaveRequesationHook from "../../../hooks/QueryHook/Leave-Requsation/hook";
const localizer = momentLocalizer(moment);

const Mapped = ({
  item,
  index,
  subtractedLeaves,
  newAppliedLeaveEvents,
  setNewAppliedLeaveEvents,
  setCalendarOpen,
}) => {
  // to define the state, and import other function
  const { data, weekendDay, publicHoliday } = useLeaveRequesationHook();
  const [leavesTypes, setLeavesTypes] = useState(item?.leaveTypeDetailsId);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const removeItem = (idToRemove) => {
    const updatedAppliedLeaveEvents = newAppliedLeaveEvents.filter(
      (_, i) => i !== idToRemove
    );
    setNewAppliedLeaveEvents(updatedAppliedLeaveEvents);
  };

  let array = [];
  if (data?.leaveTypes) {
    array = [
      ...subtractedLeaves.filter((item) => item.count < 0),
      ...data?.leaveTypes.filter((item) => item.count > 0),
    ];
  }

  const handleChange = async (event) => {
    const selectedType = event.target.value;
    newAppliedLeaveEvents[index].leaveTypeDetailsId = selectedType;
    if (selectedType === newAppliedLeaveEvents[0].leaveTypeDetailsId) {
      // Check if selected type is Comp Off
      setLeavesTypes(selectedType);
      newAppliedLeaveEvents[index].leaveTypeDetailsId = selectedType;
      setNewAppliedLeaveEvents(newAppliedLeaveEvents);
      setShowCalendarModal(true);
    } else {
      setLeavesTypes(selectedType);
      newAppliedLeaveEvents[index].leaveTypeDetailsId = selectedType;
      setNewAppliedLeaveEvents(newAppliedLeaveEvents);
    }
  };

  // get the weekend and public holiday and display in calendar
  const dayPropGetter = (date) => {
    const dayOfWeek = moment(date).format("ddd"); // Get the day as short form (e.g., 'Sat', 'Sun')

    // Check if the day is in the weekendDay array
    const isWeekend = weekendDay.some((weekend) => weekend.day === dayOfWeek);

    // Check if the date is a public holiday
    const isPublicHoliday = publicHoliday.some((holiday) =>
      moment(holiday.date).isSame(date, "day")
    );

    if (isWeekend) {
      return {
        style: {
          backgroundColor: "#ffcccc", // Light red background for weekends
          color: "#ffffff", // White text for contrast
        },
      };
    }

    if (isPublicHoliday) {
      return {
        style: {
          backgroundColor: "#ffeb3b", // Yellow background for public holidays
          color: "#000000", // Black text for contrast
        },
      };
    }

    return {};
  };
  // to check whether selected date is either public holiday or weekend
  const handleSelectSlot = (slotInfo) => {
    const selectedDate = slotInfo.start;

    const isWeekend = weekendDay.some(
      (weekend) => moment(selectedDate).format("ddd") === weekend.day
    );

    const isPublicHoliday = publicHoliday.some((holiday) =>
      moment(holiday.date).isSame(selectedDate, "day")
    );

    // If the selected date is not a weekend or a public holiday, throw an error
    if (!isWeekend && !isPublicHoliday) {
      setErrorMessage(
        "Selected date is neither a holiday nor a weekend. Please contact HR."
      );
      setErrorOpen(true); // Open snackbar to show error
    } else {
      // Proceed to apply Comp Off leave
      setNewAppliedLeaveEvents((prevEvents) => [
        ...prevEvents,
        {
          title: "Comp Off",
          start: slotInfo.start,
          end: slotInfo.start,
          leaveTypeDetailsId: "compOff",
          color: "blue", // Add your preferred color
        },
      ]);
      setShowCalendarModal(false); // Close modal after selecting
    }
  };

  return (
    <div className="border bg-gray-50 border-gray-200 flex-col lg:flex-row group flex gap-4 lg:items-center justify-between items-start rounded-lg hover:bg-gray-100 border-b cursor-pointer">
      <div className="flex items-center gap-4 pt-3">
        <Badge
          badgeContent={
            <span>
              {differenceInDays(parseISO(item.end), parseISO(item.start))} day
            </span>
          }
          color="primary"
          variant="standard"
        >
          <Button
            variant="text"
            size="large"
            className="!rounded-full !h-15 !w-15 border-[2px] border-gray-700 !border-solid"
            color="info"
          >
            <CalendarMonth className=" !text-3xl" />
          </Button>
        </Badge>
        <div className="inline-grid m-auto items-center gap-2 text-gray-700 font-bold">
          <p className="text-md truncate">
            {differenceInDays(parseISO(item.end), parseISO(item.start)) !== 1
              ? `Selected dates from ${format(
                  new Date(item.start),
                  "do 'of' MMMM"
                )} to  ${moment(item.end)
                  .subtract(1, "days")
                  .format("Do of MMMM")}`
              : `Your selected date is ${format(
                  new Date(item.start),
                  "do 'of' MMMM"
                )}`}
          </p>
        </div>
      </div>
      <div className="flex lg:w-fit lg:justify-end justify-between w-full items-center gap-2">
        <FormControl sx={{ width: 180 }} size="small" fullWidth>
          <InputLabel id="demo-simple-select-label">Select Type</InputLabel>
          <Select
            required
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={leavesTypes}
            label="Select Type"
            onChange={handleChange}
          >
            {array?.map(
              (item, index) =>
                item.isActive &&
                item && (
                  <MenuItem
                    selected={leavesTypes === item.leaveTypeDetailsId}
                    id={index}
                    key={index}
                    value={item._id}
                  >
                    <div className="flex justify-between w-full">
                      <div>{item.leaveName}</div>
                      {item.leaveName === "Comp Off" && (
                        <Tooltip
                          title="Compensatory leave is a leave granted as compensation for hours of overtime or for working on holidays or weekends"
                          arrow
                        >
                          <InfoOutlined className="text-gray-500 ml-2" />
                        </Tooltip>
                      )}
                    </div>
                  </MenuItem>
                )
            )}
          </Select>
        </FormControl>
        <Button
          type="button"
          onClick={() => setCalendarOpen(true)}
          variant="outlined"
          className="!border-gray-300 group-hover:!border-gray-400"
        >
          <Edit className="text-gray-500" />
        </Button>
        <Button
          type="button"
          className="!border-gray-300"
          onClick={() => removeItem(index)}
          variant="outlined"
        >
          <Delete className="text-red-500" />
        </Button>
      </div>

      {/* Modal for selecting Comp Off date */}
      <Modal
        open={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Select Comp Off Date</h2>
          <Calendar
            localizer={localizer}
            selectable
            defaultView="month"
            views={["month"]}
            style={{ height: 400, width: "100%" }}
            dayPropGetter={dayPropGetter} // Function to style weekends and holidays
            events={newAppliedLeaveEvents} // Pass the events here
            onSelectSlot={handleSelectSlot} // Use the handleSelectSlot function
          />
          <Button
            variant="outlined"
            onClick={() => setShowCalendarModal(false)}
            style={{ marginTop: "10px" }}
          >
            Close
          </Button>
        </Box>
      </Modal>
      {/* Snackbar to show error messages */}
      <Snackbar
        open={errorOpen}
        autoHideDuration={6000}
        onClose={() => setErrorOpen(false)}
      >
        <Alert onClose={() => setErrorOpen(false)} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Mapped;
