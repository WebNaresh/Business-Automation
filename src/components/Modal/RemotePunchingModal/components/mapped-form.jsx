import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useNotificationRemotePunching from "../../../../hooks/QueryHook/Remote-Punch/components/mutation";

const PunchMapModal = ({ items, idx, geoFence }) => {
  //hooks
  const navigate = useNavigate();
  const { organisationId } = useParams();
  //state
  const [openModal, setOpenModal] = useState(false);
  const [mReason, setMReason] = useState("");
  const [imageModalOpen, setImageModalOpen] = useState(false);

  //handle reject button function
  const handleRejectButtonClick = () => {
    setOpenModal(true);
  };

  const handleRejectSubmit = (id) => {
    RejectManagerMutation.mutate({ id, mReason });
    setOpenModal(false);
  };

  // handle modal close function
  const handleModalClose = () => {
    setOpenModal(false);
    setMReason(""); // Reset mReason state when modal is closed
  };

  const { notifyAccountantMutation, RejectManagerMutation } =
    useNotificationRemotePunching();

  //handle view route click
  const handleViewRouteClick = () => {
    const id = items._id;
    navigate(`/organisation/${organisationId}/remote/info/${id}`);
  };

  //handle image click
  const handleImageClick = () => {
    setImageModalOpen(true);
  };

  //handle image modal close
  const handleImageModalClose = () => {
    setImageModalOpen(false);
  };

  return (
    <div className="w-full">
      <div className="w-full h-auto bg-white flex p-4 pl-8 pr-8 justify-between items-center shadow-md mt-3">
        <div className="flex items-center">
          <div className="mr-9">
            <h1>
              {items.punchData[0].image === "" ? (
                <h1 className="font-semibold">Missed Punch Request</h1>
              ) : (
                <h1 className="font-semibold">Punch Request</h1>
              )}
            </h1>
            <div className="w-[150px]">
              {geoFence !== "geoFence" && (
                <div className="h-[100px] w-[100px]">
                  {items.punchData[0].image === "" ? (
                    <img
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                        borderRadius: "20%",
                      }}
                      src={items.employeeId.user_logo_url}
                      alt="img"
                    />
                  ) : (
                    <div className="h-[100px] w-[100px]">
                      <img
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                          borderRadius: "20%",
                          cursor: "pointer"
                        }}
                        src={items.punchData[0].image}
                        alt="img1"
                        onClick={handleImageClick}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="p-4">
            <h1>
              Date:{" "}
              {items?.createdAt && (
                <>{new Date(items?.createdAt).toLocaleDateString()} </>)
              }
            </h1>
            {items.punchData[0].image === "" ? (
              <h1>Miss Punch Requested : {items.punchData.length} times</h1>
            ) : geoFence === "geoFence" ? (
              <h1>Geo Fencing Restarted: {items.punchData.length} times</h1>
            ) : (
              <h1>Remote Punching Restarted: {items.punchData.length} times</h1>
            )}
          </div>
        </div>
        <div>
          <div>
            <Button
              variant="contained"
              size="small"
              onClick={handleViewRouteClick}
            >
              View Route
            </Button>
          </div>
          <div className="flex gap-3 mt-3">
            <Button
              onClick={() => notifyAccountantMutation.mutate(items._id)}
              variant="contained"
              size="small"
            >
              Accept
            </Button>
            <Button
              onClick={handleRejectButtonClick}
              variant="contained"
              color="error"
              size="small"
            >
              Reject
            </Button>

            {/*show modal for reject request*/}
            <Dialog open={openModal} fullWidth onClose={handleModalClose}>
              <DialogTitle>Enter Rejection Reason</DialogTitle>
              <DialogContent>
                <TextField
                  size="small"
                  autoFocus
                  className="!mt-2"
                  id="mReason"
                  label="Rejection Reason"
                  type="text"
                  fullWidth
                  value={mReason}
                  onChange={(e) => setMReason(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <div className="mb-2 flex gap-4">
                  <Button
                    onClick={handleModalClose}
                    color="error"
                    variant="contained"
                    size="small"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleRejectSubmit(items._id)}
                    color="primary"
                    variant="contained"
                    size="small"
                  >
                    Submit
                  </Button>
                </div>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={imageModalOpen} onClose={handleImageModalClose} maxWidth="md">
        <DialogContent>
          <img
            src={items.punchData[0].image}
            alt=""
            style={{ width: "100%", height: "auto" }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PunchMapModal;
