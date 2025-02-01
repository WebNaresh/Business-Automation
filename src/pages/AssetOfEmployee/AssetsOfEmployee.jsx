import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Search, West } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { UseContext } from "../../State/UseState/UseContext";
import ViewAssetsOfEmployee from "./Components/ViewAssetsEmployee";
import ViewAssetsToMultiEmployee from "./Components/ViewAssetsToMultiEmployee";
import DefineAsset from "./Components/DefineAsset";
import { useQuery } from "react-query";

const AssetsOfEmployee = () => {
    const { organisationId } = useParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedAsset, setSelectedAsset] = useState(null); // State for the selected asset
    const [availableEmployee, setAvailableEmployee] = useState([]);
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];

    const fetchAvailableEmployee = async () => {
        try {
            const apiUrl = `${import.meta.env.VITE_API}/route/employee/get-paginated-emloyee/${organisationId}`;
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: authToken,
                },
            });
            setAvailableEmployee(response.data.employees);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAvailableEmployee();
    }, []);

    const filteredEmployeesRecord =
        availableEmployee && Array.isArray(availableEmployee)
            ? availableEmployee.filter(
                (employee) =>
                    employee?.first_name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    employee?.last_name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            )
            : [];

    const handleEmployeeClick = (employee, event) => {
        event.preventDefault();
        event.stopPropagation();
        setSelectedEmployee(employee);
    };



    const handleBackToAssets = () => {
        setSelectedAsset(null); // Reset asset selection to go back
    };

    const handleBackToEmployees = () => {
        setSelectedEmployee(null); // Reset employee selection to go back
    };

    const employeeId = selectedEmployee?._id;


    // Fetch uploaded document data of the employee
    const { data: defineAsset } = useQuery(
        ["defineAssset"],
        async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API}/route/get/assets`,

            );
            return response.data.assets;
        }
    );

    console.log("defineAsset", defineAsset);

    const handleAssetClick = (asset) => {
        setSelectedAsset(asset); // Set the clicked asset
    };

    console.log("selectedAsset", selectedAsset);


    const [open, setOpen] = React.useState(false);
    // for add
    const handleDefineAsset = (empId) => {
        setOpen(true);
        setEmpId(empId);
    };

    return (
        <div className="w-full">
            <header className="text-xl w-full pt-6 border bg-white shadow-md p-4">
                <West className="mx-4 !text-xl" />
                Assets Allocation to Employee
            </header>
            <section className="min-h-[90vh] flex">
                <article className="w-[30%] overflow-auto max-h-[80vh] h-full bg-white border-gray-200">
                    <div className="p-6 !py-2">
                        <div className="space-y-2">
                            <div
                                className={`flex rounded-md items-center px-2 outline-none border-gray-200 border-[.5px] bg-white py-1 md:py-[6px]`}
                            >
                                <Search className="text-gray-700 md:text-lg !text-[1em]" />
                                <input
                                    type={"text"}
                                    placeholder={"Search Employee"}
                                    className={`border-none bg-white w-full outline-none px-2`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    {filteredEmployeesRecord.length > 0 && (
                        <div>
                            {filteredEmployeesRecord?.map((employee) => (
                                <div
                                    className={`px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50`}
                                    key={employee?._id}
                                    onClick={(e) => handleEmployeeClick(employee, e)}
                                >
                                    <Avatar src={employee?.avatarSrc} />
                                    <div>
                                        <h1 className="text-[1.2rem]">
                                            {employee?.first_name}{" "}
                                            {employee?.last_name}
                                        </h1>
                                        <h1 className={`text-sm text-gray-500`}>
                                            {employee?.email}
                                        </h1>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </article>

                <div className="w-[80%] mx-auto">
                    {selectedAsset ? (
                        <ViewAssetsToMultiEmployee
                            asset={selectedAsset}
                            onBack={handleBackToAssets}

                        />
                    ) : selectedEmployee ? (
                        <ViewAssetsOfEmployee
                            key={selectedEmployee._id}
                            employee={selectedEmployee}
                            employeeId={employeeId}
                            onBack={handleBackToEmployees}
                        />
                    ) : (
                        <>
                            <div className="space-y-1 flex justify-between gap-3 mb-4 p-4">
                                <div>
                                    <h1 className="md:text-xl text-lg">Add Asset</h1>
                                    <p className="text-sm">
                                        Here you will be able to manage the asset of the organization.
                                    </p>
                                </div>
                                <div className="flex justify-center mt-4">
                                    {/* Add Asset button */}
                                    <button
                                        className="bg-[#174E63] text-white px-4 py-2 rounded-lg hover:bg-[#0F3A46] focus:outline-none"
                                        onClick={handleDefineAsset}
                                    >
                                        Add Asset
                                    </button>

                                </div>
                            </div>

                            <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
                                <ul className="flex-1">
                                    {defineAsset && defineAsset?.map((asset) => (
                                        <li
                                            key={asset.id}
                                            className="flex items-center justify-between py-3 my-2 border-b last:border-none cursor-pointer"
                                            onClick={() => handleAssetClick(asset.assetName)}
                                        >
                                            <div className="flex items-center gap-2 justify-center w-full">
                                                {/* Icon */}

                                                <span className="text-gray-800 font-medium text-center flex-1">{asset.assetName}</span>
                                                <span className="text-gray-800 font-medium text-center flex-1">  {asset?.createdAt ? new Date(asset.createdAt).toLocaleDateString('en-GB') : '-'}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                            </div>
                        </>


                    )}
                </div>

                <DefineAsset open={open} handleClose={() => setOpen(false)} />


            </section>
        </div>
    );
};

export default AssetsOfEmployee;
