import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useState } from "react";
import EditShiftModal from "./shift-edit-model";

const ShiftRow = ({ index, items, editMutate, deleteMutation }) => {
  console.log(
    `🚀 ~ file: shift-row.jsx:18 ~ { index, items, editMutate, deleteMutation }:`,
    { index, items, editMutate, deleteMutation }
  );
  const [open, setOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const convertTo12HourFormat = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const newDate = dayjs().hour(parseInt(hours)).minute(parseInt(minutes));
    return newDate.format("h:mm A");
  };
  return (
    <tr id={index} className={`${"bg-white"} border-b dark:border-neutral-500`}>
      <td className="whitespace-nowrap px-6 py-2 font-medium">{index + 1}</td>
      <td className="whitespace-nowrap px-6 py-2">{items?.shiftName}</td>
      <td className="whitespace-nowrap px-6 py-2">{items?.workingFrom}</td>
      <td className="whitespace-nowrap font-semibold px-6 py-2">
        <Chip
          size="small"
          variant="outlined"
          label={convertTo12HourFormat(items?.startTime)}
        />
      </td>
      <td className="whitespace-nowrap font-semibold px-6 py-2">
        <Chip
          variant="outlined"
          size="small"
          label={convertTo12HourFormat(items?.endTime)}
        />
      </td>
      <td className="whitespace-nowrap px-6 py-2">{items?.allowance}</td>

      <td className="flex items-start !text-left px-6 py-2">
        <AvatarGroup max={6}>
          {items?.selectedDays.map((item) => (
            <Avatar
              src="dsadsa"
              key={item}
              className="!text-xs !bg-sky-500 !text-white "
              sx={{
                width: 30,
                height: 30,
              }}
            >
              {item.slice(0, 3)}
            </Avatar>
          ))}
        </AvatarGroup>
      </td>

      <td className="whitespace-nowrap px-6 py-2">
        <IconButton
          color="primary"
          aria-label="edit"
          onClick={() => setOpen(true)}
        >
          <EditOutlined />
        </IconButton>
        <IconButton
          color="error"
          aria-label="delete"
          onClick={() => setDeleteConfirmation(true)}
        >
          <DeleteOutline />
        </IconButton>
      </td>
      <EditShiftModal
        open={open}
        handleClose={() => setOpen(false)}
        editMutate={editMutate}
        items={items}
      />
      <Dialog
        open={deleteConfirmation}
        onClose={() => setDeleteConfirmation(true)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete the shift, as this action
            cannot be undone.
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteConfirmation(false)}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() =>
              deleteMutation({
                id: items?._id,
                onClose: () => setDeleteConfirmation(false),
              })
            }
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </tr>
  );
};

export default ShiftRow;
