import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import 'jspdf-autotable';
import { Search, West } from "@mui/icons-material";
import { Avatar, } from "@mui/material";
import { UseContext } from "../../State/UseState/UseContext";
import ViewAssetsOfEmployee from "./Components/ViewAssetsEmployee";

const AssetsOfEmployee = () => {
    const { organisationId } = useParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [availableEmployee, setAvailableEmployee] = useState([]);
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];

    const fetchAvailableEmployee = async () => {
        try {
            const apiUrl = `${import.meta.env.VITE_API}/route/employee/get-paginated-emloyee/${organisationId}`;
            console.log("apiUrl", apiUrl);
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
    }, []); // Empty array ensures it runs only on mount


    console.log("available emp", availableEmployee);


    // to filter the employee based on first nanae , last name
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
    console.log("filter", filteredEmployeesRecord);

    // to define the function for get the employee those selected by user.
    const handleEmployeeClick = (employee, event) => {
        event.preventDefault(); // Prevent default navigation-like behavior
        event.stopPropagation(); // Stop event propagation
        setSelectedEmployee(employee);
    };


    const employeeId = selectedEmployee?._id;
    console.log("empId", employeeId);

    return (
        <>
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

                    <div className="w-[80%]">
                        {selectedEmployee ? (
                            <ViewAssetsOfEmployee
                                key={selectedEmployee._id} // Key ensures proper re-rendering
                                employee={selectedEmployee}
                                employeeId={employeeId}
                            />
                        ) : (
                            <p className="text-center text-gray-500 text-lg font-medium mt-10">
                                Select an employee to view assets.
                            </p>
                        )}
                    </div>


                </section>
            </div>
        </>
    );
};

export default AssetsOfEmployee;
