import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";

const AssignModal = ({ open, openDialog, closeDialog, mutation }) => {
  return (
    <div>
      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to change your employment in the
            organisation. Be aware that changing your organisation will also
            switch your leaves and other data to the new organisation.
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeDialog}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => mutation.mutate()}
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AssignModal;
