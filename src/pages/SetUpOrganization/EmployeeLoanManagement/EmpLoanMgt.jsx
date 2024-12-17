import { Add, Info } from "@mui/icons-material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
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
import AddLoanTypeModal from "../../../components/Modal/LoanTypeModal/AddLoanTypeModal";
import EditLoanTypeModal from "../../../components/Modal/LoanTypeModal/EditLoanTypeModal";
import Setup from "../Setup";
import EmployeeTypeSkeleton from "../components/EmployeeTypeSkeleton";
const EmpLoanMgt = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams();
  const queryClient = useQueryClient();
  //for  Get Query
  const { data: getEmployeeLoan, isLoading } = useQuery(
    ["loanType", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-loan-type`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );
  console.log(getEmployeeLoan);
  // for add
  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleAddModalOpen = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
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
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/${id}/delete-loan-type`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        // Invalidate and refetch the data after successful deletion
        queryClient.invalidateQueries("loanType");
        handleAlert(true, "success", "Loan type deleted successfully");
      },
    }
  );

  // for update
  const [editLoanModalOpen, setEditLoanModalOpen] = useState(false);
  const [loanId, setLoanId] = useState(null);

  const handleEditModalOpen = (loanId) => {
    setEditLoanModalOpen(true);
    queryClient.invalidateQueries(["loanType", loanId]);
    setLoanId(loanId);
  };
  const handleEditModalClose = () => {
    setEditLoanModalOpen(false);
  };
  return (
    <>
      <section className="bg-gray-50 min-h-screen w-full">
        <Setup>
          <article>
            <div className="p-4  border-b-[.5px] flex  justify-between  gap-3 w-full border-gray-300">
              <div className="flex gap-3 ">
                <div className="mt-1">
                  <CreditCardIcon />
                </div>
                <div>
                  <h1 className="!text-lg">Loan Management</h1>
                  <p className="text-xs text-gray-600">
                    Manage the loan of employee here.
                  </p>
                </div>
              </div>
              <Button
                className="!font-semibold !bg-sky-500 flex items-center gap-2"
                variant="contained"
                onClick={handleAddModalOpen}
              >
                <Add />
                Add Loan Type
              </Button>
            </div>
            {isLoading ? (
              <EmployeeTypeSkeleton />
            ) : getEmployeeLoan?.length > 0 ? (
              <div className="overflow-auto !p-0  border-[.5px] border-gray-200">
                <table className="min-w-full bg-white  text-left !text-sm font-light">
                  <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                    <tr className="!font-semibold ">
                      <th scope="col" className="!text-left pl-8 py-3 ">
                        Sr. No
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Loan Name
                      </th>
                      <th scope="col" className="px-6 py-3 ">
                        Minimum Loan Value
                      </th>
                      <th scope="col" className="px-6 py-3 ">
                        Maximum Loan value
                      </th>

                      <th scope="col" className="px-6 py-3 ">
                        Rate of interest in %
                      </th>
                      <th scope="col" className=" px-9 py-3 ">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getEmployeeLoan?.map((empLoan, id) => (
                      <tr className="!font-medium border-b" key={id}>
                        <td className="!text-left pl-8 py-3 ">{id + 1}</td>
                        <td className="!text-left  pl-6 py-3 ">
                          {empLoan?.loanName}
                        </td>
                        <td className="!text-left pl-6 py-3 ">
                          {empLoan?.loanValue}
                        </td>
                        <td className="!text-left pl-6 py-3 ">
                          {empLoan?.maxLoanValue}
                        </td>

                        <td className="!text-left  pl-8 py-3 ">
                          {empLoan?.rateOfInterest}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                          <IconButton
                            color="primary"
                            aria-label="edit"
                            onClick={() => handleEditModalOpen(empLoan?._id)}
                          >
                            <EditOutlinedIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            aria-label="delete"
                            onClick={() =>
                              handleDeleteConfirmation(empLoan?._id)
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
                  <h1 className="text-lg font-semibold">Add Loan Type</h1>
                </article>
                <p>No loan type found. Please add the loan type.</p>
              </section>
            )}
          </article>
        </Setup>

        {/* for add */}
        <AddLoanTypeModal
          handleClose={handleAddModalClose}
          open={addModalOpen}
          organisationId={organisationId}
        />
      </section>

      {/* for update */}
      <EditLoanTypeModal
        handleClose={handleEditModalClose}
        organisationId={organisationId}
        open={editLoanModalOpen}
        loanId={loanId}
      />
      {/* for delete */}
      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this loan type, as this
            action cannot be undone.
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

export default EmpLoanMgt;
