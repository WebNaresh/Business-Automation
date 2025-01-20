import { Add, Info } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import GroupIcon from "@mui/icons-material/Group";
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
import { UseContext } from "../../../State/UseState/UseContext";
import AddAssetsModel from "./Components/AddAssets";
import Setup from "../Setup";
import EmployeeTypeSkeleton from "../components/EmployeeTypeSkeleton";
import { TestContext } from "../../../State/Function/Main";
import UpdateAssetModel from "./Components/UpdateAssets";

const CompanyAssets = () => {
    //Hooks
    const { handleAlert } = useContext(TestContext);
    const queryClient = useQueryClient();

    //Get authToken
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];

    //Get organisationId
    const { organisationId } = useParams();
    console.log("organisationId././", organisationId);


    //for  Get Query
    const { data: Assets, isLoading } = useQuery(
        ["assets", organisationId],
        async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API}/route/get/assets/${organisationId}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data.assets;
        }
    );

    console.log("Assets", Assets);


    // for add
    const [openAssetModel, setOpenAssetModel] = useState(false);
    const handleOpenAssetModel = () => {
        setOpenAssetModel(true);
    };
    const handleCloseAssetModel = () => {
        setOpenAssetModel(false);
    };

    // for update
    const [updateAssetModel, setUpdateAssetModel] = useState(false);
    const [updateAssetId, setUpdateAssetId] = useState(null);

    const handleOpenupdateAssetModel = (assetId) => {
        setUpdateAssetModel(true);
        queryClient.invalidateQueries(["assets", assetId]);
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
                `${import.meta.env.VITE_API}/route/delete/assets/${assetId}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            ),
        {
            onSuccess: () => {
                // Invalidate and refetch the data after successful deletion
                queryClient.invalidateQueries("assets");
                handleAlert(true, "success", "Assets deleted successfully");
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
                                    <h1 className="!text-lg">Assets</h1>
                                    <p className="text-xs text-gray-600">
                                        Here you can manage assets.
                                    </p>
                                </div>
                            </div>
                            <br />
                        </div>
                        <div className="p-4  border-b-[.5px] flex  justify-between  gap-3 w-full border-gray-300">
                            <div className="flex gap-3 ">
                                <div className="mt-1">
                                    <EmailOutlinedIcon />
                                </div>
                                <div>
                                    <h1 className="!text-lg">Add Assets</h1>
                                </div>
                            </div>
                            <Button
                                variant="contained"
                                onClick={handleOpenAssetModel}
                            >
                                <Add />
                                <h1 className="!text-lg">Add Assets</h1>
                            </Button>
                        </div>
                        {isLoading ? (
                            <EmployeeTypeSkeleton />
                        ) : Assets?.length > 0 ? (
                            <div className="overflow-auto !p-0  border-[.5px] border-gray-200">
                                <table className="min-w-full bg-white  text-left !text-sm font-light">
                                    <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                                        <tr className="!font-semibold ">
                                            <th scope="col" className="!text-left pl-8 py-3 ">
                                                Sr. No
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 ">
                                                Type
                                            </th>
                                            <th scope="col" className="px-6 py-3 ">
                                                Detail
                                            </th>
                                            <th scope="col" className="px-6 py-3 ">
                                                Purchase Rate
                                            </th>
                                            <th scope="col" className="px-6 py-3 ">
                                                Expiry Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 ">
                                                Status
                                            </th>
                                            <th scope="col" className=" px-9 py-3 ">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(Assets) &&
                                            Assets?.map((asset, id) => (
                                                <tr className="!font-medium border-b" key={id}>
                                                    <td className="!text-left pl-8 py-2 ">{id + 1}</td>
                                                    <td className="!text-left  pl-6 py-2 ">
                                                        {asset?.assetName}
                                                    </td>
                                                    <td className="!text-left  pl-6 py-2 ">
                                                        {asset?.assetType}
                                                    </td>
                                                    <td className="!text-left  pl-6 py-2 ">
                                                        {asset?.description}
                                                    </td>
                                                    <td className="!text-left pl-6 py-2">
                                                        {new Date(asset?.purchaseDate).toLocaleDateString("en-GB")}
                                                    </td>

                                                    <td className="!text-left  pl-6 py-2 ">
                                                        {asset?.warrantyExpiryDate}
                                                    </td>
                                                    <td className="!text-left  pl-6 py-2 ">
                                                        {asset?.status}
                                                    </td>


                                                    <td className="whitespace-nowrap px-6 py-2">
                                                        <IconButton
                                                            color="primary"
                                                            aria-label="edit"
                                                            onClick={() =>
                                                                handleOpenupdateAssetModel(
                                                                    asset?._id
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
                                    <h1 className="text-lg font-semibold">Add Assets</h1>
                                </article>
                                <p>No assets found for organization. Please add the assets.</p>
                            </section>
                        )}
                    </article>
                </Setup>

                {/* for add */}
                <AddAssetsModel
                    handleClose={handleCloseAssetModel}
                    open={openAssetModel}
                    organisationId={organisationId}
                />
            </section>

            {/* for update */}
            <UpdateAssetModel
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
        </>
    );
};

export default CompanyAssets;
