import { Add, Info, MoreHoriz } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Popover,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import SalaryInputFieldsModal from "../../../components/Modal/SalaryInputFields/SalaryInputFieldsModal";
import Setup from "../Setup";
import SkeletonSalaryInput from "./SkeletonSalaryInput";

const SalaryInput = () => {
  const { organisationId } = useParams();
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);

  const [open, setOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [salaryInputId, setempTypeId] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  // Handle PopOver
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openPop = Boolean(anchorEl) && selectedTemplate !== null;
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const Popid = openPop ? "simple-popover" : undefined;
  const handleOpen = () => {
    setOpen(true);
    setempTypeId(null);
  };

  const handleClose = () => {
    setOpen(false);
    setempTypeId(null);
    setEditModalOpen(false);
  };

  const handleEditModalOpen = (salaryInputId) => {
    setEditModalOpen(true);
    queryClient.invalidateQueries(["shift", salaryInputId]);
    setempTypeId(salaryInputId);
  };

  const handlePopClick = (event, template) => {
    setAnchorEl(event.currentTarget);
    setSelectedTemplate(template);
  };

  const handlePopClose = () => {
    setAnchorEl(null);
    // setSelectedTemplate(null);
  };

  // Delete Query
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

  // Delete Query
  const deleteMutation = useMutation(
    (id) =>
      axios.delete(`${import.meta.env.VITE_API}/route/salary-template/${id}`, {
        headers: {
          Authorization: authToken,
        },
      }),
    {
      onSuccess: () => {
        // Invalidate and refetch the data after successful deletion
        queryClient.invalidateQueries("salaryTemplates");
        handleAlert(true, "success", "Salary Template  deleted succesfully.");
      },
    }
  );

  // Get Query
  const { data: salaryTemplate, isLoading } = useQuery(
    ["salaryTemplates", organisationId],
    async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/route/salary-template-org/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    }
  );

  return (
    <>
      <section className="bg-gray-50 overflow-hidden min-h-screen w-full">
        <Setup>
          <article className=" bg-white  w-full h-max  rounded-sm  items-center">
            <div className="p-4  border-b-[.5px] flex  justify-between  gap-3 w-full border-gray-300">
              <div className="flex gap-3 ">
                <div className="mt-1">
                  <MonetizationOnOutlinedIcon />
                </div>
                <div>
                  <h1 className="!text-lg">Salary Template</h1>
                  <p className="text-xs text-gray-600">
                    Create the salary template here.
                  </p>
                </div>
              </div>
              <Button onClick={handleOpen} variant="contained">
                <Add />
                Add salary template
              </Button>
            </div>

            {isLoading ? (
              <SkeletonSalaryInput />
            ) : salaryTemplate?.salaryTemplates?.length > 0 ? (
              <div className="overflow-auto   border-[.5px] border-gray-200">
                <table className="min-w-full bg-white px-4  text-left !text-sm font-light">
                  <thead className="bg-gray-200  !font-medium ">
                    <tr className="!font-semibold ">
                      <th scope="col" className="!text-left px-6 py-3 ">
                        Sr. No
                      </th>
                      <th className="py-3 ">Template Name</th>
                      <th className="px-6 py-3 ">Template Description</th>
                      <th className="px-6 py-3 ">Employment Type</th>
                      <th className="px-6 py-3 ">Salary Structure</th>
                      <th className="px-6 py-3 ">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaryTemplate?.salaryTemplates?.map((item, id) => (
                      <tr
                        className={`
                      ${id % 2 === 0 && "bg-[white]"} 
                      !font-medium border-b`}
                        key={id}
                      >
                        <td className="py-3 px-6">{id + 1}</td>
                        <td>{item.name}</td>
                        <td className="px-6 truncate w-[200px]">
                          <h1 className="truncate w-[200px]">
                            {!item?.desc ? "No description" : item.desc}
                          </h1>
                        </td>
                        <td className="px-6">{item?.empType?.title}</td>
                        <td className="px-6">
                          <Tooltip title="Click to get Salary structure">
                            <IconButton
                              aria-describedby={Popid}
                              onClick={(event) => handlePopClick(event, item)}
                            >
                              <MoreHoriz className="!text-[19px] text-black" />
                            </IconButton>
                          </Tooltip>
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                          <IconButton
                            color="primary"
                            aria-label="edit"
                            onClick={() => handleEditModalOpen(item._id)}
                          >
                            <EditOutlinedIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            aria-label="delete"
                            onClick={() => handleDeleteConfirmation(item._id)}
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
                  <h1 className="text-lg font-semibold">Add Salary Template</h1>
                </article>
                <p>No salary template found .Please add a salary template.</p>
              </section>
            )}
          </article>
        </Setup>
      </section>

      <Popover
        id={Popid}
        open={openPop}
        className="!p-4"
        anchorEl={anchorEl}
        PaperProps={{
          className: "!p-4 rounded-md",
        }}
        onClose={handlePopClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div className="overflow-auto h-auto max-h-[60vh]">
          <h1 className="pb-4 text-lg">Salary Structure</h1>
          <table className="min-w-full bg-white  text-left !text-sm font-light">
            <thead className="border-b bg-gray-100 border-[.5px] border-gray-300  font-medium dark:border-neutral-500">
              <tr>
                <th scope="col" className="!text-left px-3 py-3 ">
                  Salary Component
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedTemplate?.salaryStructure.map((row, id) => (
                <tr
                  key={id}
                  className="px-2 !border border-gray-300 !py-4 !space-x-4 gap-4 w-full"
                >
                  <td className="w-[40%] py-4 pl-2">{row.salaryComponent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Popover>

      <SalaryInputFieldsModal
        id={organisationId}
        open={open}
        handleClose={handleClose}
      />
      <SalaryInputFieldsModal
        id={organisationId}
        open={editModalOpen}
        handleClose={handleClose}
        salaryId={salaryInputId}
      />

      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this salary template, as this
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

export default SalaryInput;
