import { Add, Info } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import AddCommunicationModal from "../../../components/Modal/CommunicationModal/AddCommunicationModal";
import EditCommunicationModal from "../../../components/Modal/CommunicationModal/EditCommunicationModal";
import Setup from "../Setup";
import EmployeeTypeSkeleton from "../components/EmployeeTypeSkeleton";
import useGetCommunicationPermission from "../../EmployeeSurvey/useContext/Permission";
import GroupIcon from '@mui/icons-material/Group';

const EmpCommunication = () => {
  //Hooks
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();

  //Get authToken
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  //Get organisationId
  const { organisationId } = useParams();
  console.log("organisationId././", organisationId);
  //Get Communication Permission 
  const { data, surveyPermission, setSurveyPermission } = useGetCommunicationPermission(organisationId)

  useEffect(() => {
    if (data !== undefined) {
      setSurveyPermission(data?.surveyPermission ?? false);
    }
    //eslint-disable-next-line
  }, [data]);

  // Add Communication Permission
  const mutationPermission = useMutation(
    async (isChecked) => {
      await axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/employee-survey-permission`,
        { surveyPermission: isChecked },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("survey-permission");
        handleAlert(true, "success", data === undefined ? "Survey permission saved successfully" : "Survey permission updated successfully");
        window.location.Reload()
      },
    }
  );

  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setSurveyPermission(isChecked);
    mutationPermission.mutate(isChecked);
  };

  //for  Get Query
  const { data: getCommunication, isLoading } = useQuery(
    ["emailCommunication", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-communication`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );


  // for add
  const [openCommunciationModal, setOpenCommunicationModal] = useState(false);
  const handleOpenCommunicationModal = () => {
    setOpenCommunicationModal(true);
  };
  const handleCloseCommunicationModal = () => {
    setOpenCommunicationModal(false);
  };

  // for update
  const [editCommunicationModal, setEditCommunicationModal] = useState(false);
  const [editCommunicationId, setEditCommunicationId] = useState(null);

  const handleOpenEditCommunicationModal = (communicationId) => {
    setEditCommunicationModal(true);
    queryClient.invalidateQueries(["communicationId", communicationId]);
    setEditCommunicationId(communicationId);
  };

  const handleCloseEditCommunicationModal = () => {
    setEditCommunicationModal(false);
  };

  // for delete
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    handleCloseConfirmation();
  };

  const deleteMutation = useMutation(
    (id) =>
      axios.delete(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/${id}/delete-communication`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        // Invalidate and refetch the data after successful deletion
        queryClient.invalidateQueries("emailCommunication");
        handleAlert(true, "success", "Email deleted successfully");
      },
    }
  );

  return (
    <>
      <section className="bg-gray-50 min-h-screen w-full">
        <Setup>
          <article>
            <div className="p-4 border-b-[.5px]  border-gray-300">
              <div className="flex gap-3 ">
                <div className="mt-1">
                  <GroupIcon />
                </div>
                <div>
                  <h1 className="!text-lg">Communication</h1>
                  <p className="text-xs text-gray-600">
                    Here you can manage organisational communication as well as employee surveys.
                  </p>
                </div>
              </div><br />
              <div className="pl-9">
                <label htmlFor="surveyPermission" className="flex items-center">
                  <input
                    type="checkbox"
                    id="surveyPermission"
                    name="surveyPermission"
                    className="form-checkbox h-5 w-5 text-blue-500"
                    checked={surveyPermission}
                    onChange={handleCheckboxChange}
                  />
                  <p className="ml-2">Employee Survey</p><br />
                </label>
                <p className="text-xs text-gray-600">
                  By enabling this checkbox you are allowing to create employee surveys.
                </p>
              </div>
            </div>
            <div className="p-4  border-b-[.5px] flex  justify-between  gap-3 w-full border-gray-300">
              <div className="flex gap-3 ">
                <div className="mt-1">
                  <EmailOutlinedIcon />
                </div>
                <div>
                  <h1 className="!text-lg">Add Email</h1>
                  <p className="text-xs text-gray-600">
                    Add the required email for communication.
                  </p>
                </div>
              </div>
              <Button
                className="!font-semibold !bg-sky-500 flex items-center gap-2"
                variant="contained"
                onClick={handleOpenCommunicationModal}
              >
                <Add />
                <h1 className="!text-lg">Add Email</h1>
              </Button>
            </div>
            {isLoading ? (
              <EmployeeTypeSkeleton />
            ) : getCommunication?.length > 0 ? (
              <div className="overflow-auto !p-0  border-[.5px] border-gray-200">
                <table className="min-w-full bg-white  text-left !text-sm font-light">
                  <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                    <tr className="!font-semibold ">
                      <th scope="col" className="!text-left pl-8 py-3 ">
                        Sr. No
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 ">
                        Communication Type
                      </th>
                      <th scope="col" className=" px-9 py-3 ">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(getCommunication) &&
                      getCommunication?.map((communciation, id) => (
                        <tr className="!font-medium border-b" key={id}>
                          <td className="!text-left pl-8 py-2 ">{id + 1}</td>
                          <td className="!text-left  pl-6 py-2 ">
                            {communciation?.email}
                          </td>
                          <td className="!text-left pl-6 py-3">
                            {communciation?.communication.join(",  ")}
                          </td>

                          <td className="whitespace-nowrap px-6 py-2">
                            <IconButton
                              color="primary"
                              aria-label="edit"
                              onClick={() =>
                                handleOpenEditCommunicationModal(
                                  communciation?._id
                                )
                              }
                            >
                              <EditOutlinedIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              aria-label="delete"
                              onClick={() =>
                                handleDeleteConfirmation(communciation?._id)
                              }
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                <article className="flex items-center mb-1 text-red-500 gap-2">
                  <Info className="!text-2xl" />
                  <h1 className="text-lg font-semibold">Add Email</h1>
                </article>
                <p>No email found for communication. Please add the email.</p>
              </section>
            )}
          </article>
        </Setup>

        {/* for add */}
        <AddCommunicationModal
          handleClose={handleCloseCommunicationModal}
          open={openCommunciationModal}
          organisationId={organisationId}
        />
      </section>

      {/* for update */}
      <EditCommunicationModal
        handleClose={handleCloseEditCommunicationModal}
        organisationId={organisationId}
        open={editCommunicationModal}
        editCommunicationId={editCommunicationId}
      />

      {/* for delete */}
      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this email, as this action
            cannot be undone.
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmation}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleDelete(deleteConfirmation)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmpCommunication;
