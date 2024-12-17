import { Add, Info } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import EmpTypeModal from "../../../components/Modal/EmployeeTypesModal/EmpTypeModal";
import Setup from "../Setup";
import EmployeeTypeSkeleton from "../components/EmployeeTypeSkeleton";

const EmployementTypes = () => { 
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"]; 
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const { organisationId } = useParams();

  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Modal states and function
  const [open, setOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);  
  const [empTypeId, setempTypeId] = useState(null);

  // const handleClickOpen = (scrollType) => () => {
  //   setOpen(true);
  //   setScroll(scrollType);
  // };

  const handleOpen = (scrollType) => {
    setOpen(true);
    setempTypeId(null);
  };

  const handleClose = () => {
    setOpen(false);
    setempTypeId(null);
    setEditModalOpen(false);
  };

  // Get Query
  const { data: empList, isLoading } = useQuery(
    ["empTypes", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employment-types-organisation/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    }
  );

  // Delete Query
  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };

  const handleEditModalOpen = (empTypeId) => {
    setEditModalOpen(true);
    queryClient.invalidateQueries(["shift", empTypeId]);
    setempTypeId(empTypeId);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    handleCloseConfirmation();
  };

  const deleteMutation = useMutation(
    (id) =>
      axios.delete(
        `${process.env.REACT_APP_API}/route/employment-types/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        // Invalidate and refetch the data after successful deletion
        queryClient.invalidateQueries("empTypes");
        handleAlert(true, "success", "An Employment Type deleted succesfully");
      },
    }
  );

  return (
    <>
      <section className="bg-gray-50 min-h-screen w-full">
        <Setup>
          <article>
            <div className="p-4  border-b-[.5px] flex  justify-between  gap-3 w-full border-gray-300">
              <div className="flex gap-3 ">
                <div className="mt-1">
                  <ManageAccountsOutlinedIcon />
                </div>
                <div>
                  <h1 className="!text-lg">Employment</h1>
                  <p className="text-xs text-gray-600">
                    Add type of employment here, for ex: Full-time, Part-time.
                  </p>
                </div>
              </div>
              <Button
                className="!font-semibold !bg-sky-500 flex items-center gap-2"
                onClick={() => handleOpen("paper")}
                variant="contained"
              >
                <Add />
                Add Employment
              </Button>
            </div>

            {isLoading ? (
              <EmployeeTypeSkeleton />
            ) : empList?.empTypes?.length > 0 ? (
              <div className="overflow-auto !p-0  border-[.5px] border-gray-200">
                <table className="min-w-full bg-white  text-left !text-sm font-light">
                  <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                    <tr className="!font-semibold ">
                      <th scope="col" className="!text-left pl-8 py-3 ">
                        Sr. No
                      </th>
                      <th scope="col" className="py-3 ">
                        Employment Title
                      </th>
                      <th scope="col" className="px-6 py-3 ">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {empList?.empTypes?.map((emptype, id) => (
                      <tr className="!font-medium border-b" key={id}>
                        <td className="!text-left pl-8 py-3 ">{id + 1}</td>
                        <td className="py-3 ">{emptype?.title}</td>
                        <td className="whitespace-nowrap px-6 py-2">
                          <IconButton
                            color="primary"
                            aria-label="edit"
                            onClick={() => handleEditModalOpen(emptype._id)}
                          >
                            <EditOutlinedIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            aria-label="delete"
                            onClick={() =>
                              handleDeleteConfirmation(emptype._id)
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
                  <h1 className="text-lg font-semibold">Add Employment</h1>
                </article>
                <p>No employment found. Please add types of employment.</p>
              </section>
            )}
          </article>
        </Setup>
      </section>

      {/* Delete Confirmation Dialog */}

      <EmpTypeModal id={organisationId} open={open} handleClose={handleClose} />
      <EmpTypeModal
        handleClose={handleClose}
        id={organisationId}
        open={editModalOpen}
        empTypeId={empTypeId}
      />

      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this employement type, as
            this action cannot be undone.
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
  
export default EmployementTypes;
