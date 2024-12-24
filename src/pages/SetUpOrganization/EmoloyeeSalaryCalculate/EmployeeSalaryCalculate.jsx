import { Add, Info } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
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
import CreateEmpSalCalDayModel from "../../../components/Modal/EmployeeSalaryDayModal/CreateEmpSalCalDay";
import EmpSalaryDayModal from "../../../components/Modal/EmployeeSalaryDayModal/EmpSalaryDayModal";
import Setup from "../Setup";
import EmployeeTypeSkeleton from "../components/EmployeeTypeSkeleton";

const EmployeeSalaryCalculateDay = () => {
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams();
  const queryClient = useQueryClient();
  // state for delete the employee salary calculate day
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  // Modal states and function for edit
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [empSalCalId, setEmpSalCalId] = useState(null);
  // Modal states and function for create
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // for update the emp sal cal day
  const handleEditModalOpen = (empSalCalId) => {
    setEditModalOpen(true);
    queryClient.invalidateQueries(["empsal", empSalCalId]);
    setEmpSalCalId(empSalCalId);
  };

  const handleClose = () => {
    setEmpSalCalId(null);
    setEditModalOpen(false);
  };

  // for create the emp sal cal day
  const handleCreateModalOpen = () => {
    setCreateModalOpen(true);
  };
  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
  };

  // pull the emp salary cal day
  const { data: empSalCalData, isLoading } = useQuery(
    ["empSalaryCalData", organisationId],
    async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/route/employee-salary-cal-day/get/${organisationId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return response.data;
      } catch (error) {
        throw new Error(
          error.response.data.message ||
            "Failed to fetch Employee Salary Calculation Data"
        );
      }
    }
  );

  // Delete Query for deleting the employee code
  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };

  // Delete Query for deleting the employee code
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    setDeleteConfirmation(null);
    // Manually update the query data to reflect the deletion
    queryClient.setQueryData(
      ["empSalaryCalData", organisationId],
      (prevData) => {
        // Filter out the deleted employee salary calculation day
        const updatedData = prevData.empSalaryCalDayData.filter(
          (empSalCal) => empSalCal._id !== id
        );
        return { ...prevData, empSalaryCalDayData: updatedData };
      }
    );
    // Clear the alert message after 3000 milliseconds (3 seconds)
    setTimeout(() => {
      handleAlert(false, "success", "");
    }, 3000);
  };

  const deleteMutation = useMutation(
    (id) =>
      axios.delete(
        `${import.meta.env.VITE_API}/route/delete/employee-computation-day/${organisationId}/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        handleAlert(
          true,
          "success",
          " Salary computation day deleted succesfully."
        );
      },
    }
  );

  return (
    <>
      <section className="bg-gray-50 min-h-screen w-full">
        <Setup>
          <article>
            <div className="p-4  border-b-[.5px] flex  justify-between  gap-3 w-full border-gray-300">
              <div className="flex  gap-3 ">
                <div className="mt-1">
                  <EventNoteOutlinedIcon />
                </div>
                <div>
                  <h1 className="!text-lg"> Salary Computation Day</h1>
                  <p className="text-xs text-gray-600">
                    Set the day when salary calculations will done by system and
                    will be visible to your employees.
                  </p>
                </div>
              </div>
              <Button
                className="!font-semibold !bg-sky-500 flex items-center gap-2"
                variant="contained"
                onClick={handleCreateModalOpen}
              >
                <Add />
                Add Compute Day
              </Button>
            </div>

            {isLoading ? (
              <EmployeeTypeSkeleton />
            ) : empSalCalData?.empSalaryCalDayData?.length > 0 ? (
              <div className="overflow-auto !p-0  border-[.5px] border-gray-200">
                <table className="min-w-full bg-white  text-left !text-sm font-light">
                  <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                    <tr className="!font-semibold ">
                      <th scope="col" className="!text-left pl-8 py-3 ">
                        Sr. No
                      </th>
                      <th scope="col" className="py-3 ">
                        Salary Computation Day
                      </th>
                      <th scope="col" className="px-6 py-3 ">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {empSalCalData?.empSalaryCalDayData?.map(
                      (empSalCal, id) => (
                        <tr className="!font-medium border-b" key={id}>
                          <td className="!text-left pl-8 py-3 ">{id + 1}</td>
                          <td className="py-3 ">{empSalCal.selectedDay}</td>
                          <td className="whitespace-nowrap px-6 py-2">
                            <IconButton
                              color="primary"
                              aria-label="edit"
                              onClick={() => handleEditModalOpen(empSalCal._id)}
                            >
                              <EditOutlinedIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              aria-label="delete"
                              onClick={() =>
                                handleDeleteConfirmation(empSalCal._id)
                              }
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                <article className="flex items-center mb-1 text-red-500 gap-2">
                  <Info className="!text-2xl" />
                  <h1 className="text-lg font-semibold">
                    Add Salary Computation Day
                  </h1>
                </article>
                <p>
                  No salary computation day found. Please add the salary
                  computation day
                </p>
              </section>
            )}
          </article>
        </Setup>
      </section>

      {/* this dialogue for delete the employee code */}
      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this salary computation day,
            as this action cannot be undone.
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

      {/* for create */}
      <CreateEmpSalCalDayModel
        handleClose={handleCreateModalClose}
        open={createModalOpen}
        id={organisationId}
      />

      {/* for update */}
      <EmpSalaryDayModal
        handleClose={handleClose}
        id={organisationId}
        open={editModalOpen}
        empSalCalId={empSalCalId}
      />
    </>
  );
};

export default EmployeeSalaryCalculateDay;
