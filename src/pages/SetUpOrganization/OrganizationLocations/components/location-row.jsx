import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import React from "react";
import LocationEdit from "./location-edit";

const LocationRow = ({
  location,
  index,
  deleteLocationMutation,
  updateLocationMutation,
}) => {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  return (
    <tr
      key={index}
      className={` bg-white border-b dark:border-neutral-500 !font-medium`}
    >
      <td className="py-2 px-3">{index + 1}</td>
      <td className="py-2 px-3">{location.continent}</td>
      <td className="py-2 px-3">{location.country}</td>
      <td className="py-2 px-3">{location.state}</td>
      <td className="py-2 px-3">{location.city}</td>
      <td className="py-2 px-3">{location.shortName}</td>
      <td className="py-2 px-3">
        {`${location.addressLine1} ${
          location.addressLine2 !== undefined ? location.addressLine2 : ""
        } ${location.pinCode}`}
      </td>
      <td className="whitespace-nowrap px-3 py-2">
        <IconButton
          color="primary"
          aria-label="edit"
          onClick={() => setEditOpen(true)}
        >
          <EditOutlined />
        </IconButton>
        <IconButton
          onClick={() => {
            setConfirmOpen(true);
          }}
          color="error"
          aria-label="delete"
        >
          <DeleteOutline />
        </IconButton>
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <p>
              Please confirm your decision to delete this location, as this
              action cannot be undone.
            </p>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setConfirmOpen(false)}
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
                deleteLocationMutation({
                  locationId: location?._id,
                  onClose: () => setConfirmOpen(false),
                })
              }
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <LocationEdit
          open={editOpen}
          onClose={() => setEditOpen(false)}
          defaultValues={location}
          updateLocationMutation={updateLocationMutation}
        />
      </td>
    </tr>
  );
};

export default LocationRow;
