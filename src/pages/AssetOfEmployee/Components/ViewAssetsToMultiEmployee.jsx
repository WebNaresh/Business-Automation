import React, { useContext } from "react";
import { West } from "@mui/icons-material";
import { useQuery, } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";
import axios from "axios";
import { Info, } from "@mui/icons-material";

const ViewAssetsToMultiEmployee = ({ asset, onBack }) => {


    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];

    console.log("asset", asset);

    console.log("asset", asset);



    // Fetch uploaded document data of the employee
    const { data: Assets } = useQuery(
        ["allocateAssets", asset], // Include asset as part of the query key
        async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API}/route/get/employees-by-asset`,
                {
                    params: {
                        assetName: asset, // Send asset name as query parameter
                    },
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data.data;
        }
    );


    console.log("Assets", Assets);


    const handleBackClick = () => {
        if (onBack) {
            onBack();
        }
    };



    return (
        <>
            <div className="w-full p-4 bg-white shadow-md">
                <header className="flex items-center gap-4 mb-4">
                    <button
                        onClick={handleBackClick}
                        className="flex items-center px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                    >
                        <West className="mr-2" />
                        Back
                    </button>
                    <h1 className="text-xl font-bold">View Assets for {asset}</h1>
                </header>
                {Assets?.length > 0 ? (
                    <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
                        <table className="min-w-full bg-white text-left !text-sm font-light">
                            <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                                <tr className="font-semibold">
                                    <th scope="col" className="!text-left pl-8 py-3">
                                        Sr. No
                                    </th>
                                    <th scope="col" className="px-3 py-3">
                                        Employee Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Asset Detail
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Allocation Date
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        HandOver Date
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Assets &&
                                    Assets.map((data, id) => (
                                        <tr className="!font-medium border-b" key={id}>
                                            <td className="!text-left pl-8 py-3">{id + 1}</td>
                                            <td className="!text-left  pl-6 py-2 ">
                                                {data?.empId ? `${data.empId.first_name} ${data.empId.last_name}` : '-'}
                                            </td>
                                            <td className="!text-left  pl-6 py-2 ">
                                                {data?.assetType}
                                            </td>
                                            <td className="!text-left pl-6 py-2">
                                                {new Date(data?.allocationDate).toLocaleDateString('en-GB')}
                                            </td>
                                            <td className="!text-left pl-6 py-2">
                                                {data?.handOverDate ? new Date(data.handOverDate).toLocaleDateString('en-GB') : '-'}
                                            </td>

                                            <td className="!text-left  pl-6 py-2 ">
                                                {data?.status}
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
                    </section>
                )}

            </div>
        </>
    );
};

export default ViewAssetsToMultiEmployee;
