import { Info, RequestQuote } from "@mui/icons-material";
import {
    Avatar, Container, IconButton, Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { UseContext } from "../../../State/UseState/UseContext";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddAssets from "./AddAssetModel";
import UpdateAssets from "./UpdateAssets";



const ViewAssetsOfEmployee = ({ employeeId }) => {
    const { organisationId } = useParams();
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const queryClient = useQueryClient();

    // Modal states and function
    const [open, setOpen] = React.useState(false);
    const [empId, setEmpId] = useState(null);

    // Fetch uploaded document data of the employee
    const { data: Assets } = useQuery(
        ["allocateAssets"],
        async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API}/route/get/allocate-assets/${employeeId}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data.allocations;
        }
    );

    console.log("Assets", Assets);



    // for add
    const handleAddProduct = (empId) => {
        setOpen(true);
        setEmpId(empId);
    };

    // for update
    const [updateAssetModel, setUpdateAssetModel] = useState(false);
    const [updateAssetId, setUpdateAssetId] = useState(null);

    const handleOpenupdateAssetModel = (assetId) => {
        setUpdateAssetModel(true);
        queryClient.invalidateQueries(["allocateAssets", assetId]);
        setUpdateAssetId(assetId);
    };

    const handleCloseupdateAssetModel = () => {
        setUpdateAssetModel(false);
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
                `${import.meta.env.VITE_API}/route/delete/allocate-assets/${id}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            ),
        {
            onSuccess: () => {
                // Invalidate and refetch the data after successful deletion
                queryClient.invalidateQueries("allocateAssets");
                handleAlert(true, "success", "Assets deleted successfully");
            },
            onError: () => {
                handleAlert(true, "error", "Failed to delete asset.");
            },
        }
    );


    return (
        <>
            <Container maxWidth="xl" className="bg-gray-50 min-h-screen py-8 px-4">
                <div className="space-y-1 flex items-center gap-3 mb-4">
                    <Avatar className="text-white !bg-blue-500">
                        <RequestQuote />
                    </Avatar>
                    <div>
                        <h1 className="md:text-xl text-lg">Assets Allocation</h1>
                        <p className="text-sm">
                            Here you will be able to view the assets of the employee.
                        </p>
                    </div>
                </div>

                {Assets?.length > 0 ? (
                    <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
                        <table className="min-w-full bg-white text-left !text-sm font-light">
                            <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                                <tr className="font-semibold">
                                    <th scope="col" className="!text-left pl-8 py-3">
                                        Sr. No
                                    </th>
                                    <th scope="col" className="px-3 py-3">
                                        Asset Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Asset Type
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Allocation Date
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Assets &&
                                    Assets.map((data, id) => (
                                        <tr className="!font-medium border-b" key={id}>
                                            <td className="!text-left pl-8 py-3">{id + 1}</td>
                                            <td className="!text-left  pl-6 py-2 ">
                                                {data?.assetName}
                                            </td>
                                            <td className="!text-left  pl-6 py-2 ">
                                                {data?.assetType}
                                            </td>
                                            <td className="!text-left  pl-6 py-2 ">
                                                {data?.allocationDate}
                                            </td>
                                            <td className="!text-left  pl-6 py-2 ">
                                                {data?.status}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-2">
                                                <IconButton
                                                    color="primary"
                                                    aria-label="edit"
                                                    onClick={() =>
                                                        handleOpenupdateAssetModel(
                                                            data?._id
                                                        )
                                                    }
                                                >
                                                    <EditOutlinedIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    aria-label="delete"
                                                    onClick={() =>
                                                        handleDeleteConfirmation(data?._id)
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
                        <article className="flex items-center mb-4 text-red-500 gap-2">
                            <Info className="!text-2xl" />
                            <h1 className="text-lg font-semibold">
                                No Assets Found For Employee.
                            </h1>
                        </article>
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => handleAddProduct(employeeId)}
                                className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
                            >
                                Add Assets
                            </button>
                        </div>
                    </section>

                )}
                <AddAssets empId={empId} organisationId={organisationId} open={open} handleClose={() => setOpen(false)} />



                {/* for update */}
                <UpdateAssets
                    handleClose={handleCloseupdateAssetModel}
                    organisationId={organisationId}
                    open={updateAssetModel}
                    assetId={updateAssetId}
                />

                {/* for delete */}
                <Dialog
                    open={deleteConfirmation !== null}
                    onClose={handleCloseConfirmation}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <p>
                            Please confirm your decision to delete this assets, as this action
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

            </Container>
        </>
    );
};

export default ViewAssetsOfEmployee;
