import React, { useContext } from 'react';
import axios from 'axios';
import { UseContext } from '../../../State/UseState/UseContext';
import { useQuery } from 'react-query';

export function OfficialInfo({ empId }) {
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];

    // Query to fetch employee profile
    const { isLoading, data: profile, error } = useQuery(
        ["empId", empId],
        async () => {
            if (empId) {
                const response = await axios.get(
                    `${import.meta.env.VITE_API}/route/employee/get/profile/${empId}`,
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );
                return response.data.employee;
            }
        },
        { enabled: Boolean(empId) }
    );

    console.log("profile", profile);

    // Segregate Basic Info
    const basicInfo = {
        ["Profile Name"]: profile?.profile || '-',
        ["Employee ID"]: profile?.empId || '-',
        ["Employment Type"]: profile?.employmentType?.title || '-',
        Joining_Date: profile?.joining_date
            ? new Date(profile?.joining_date).toLocaleDateString()
            : '-',
        ["Official Mail Id"]: profile?.companyemail || '-',
        ["Work Location"]: profile?.worklocation?.[0]?.city || '-',
        Department: profile?.deptname?.[0]?.departmentName || '-',
        ["Shift Allocation"]: profile?.shift_allocation || '-',
    };

    // Segregate Work Info (Confidential Details)
    const workInfo = {
        ["Full Name"]: `${profile?.firstname || ''} ${profile?.lastname || ''}` || '-',
        ["Current CTC"]: profile?.current_ctc || '-',
    };

    if (isLoading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>Error loading profile data</div>; // Error handling
    }

    return (
        <div className="p-4 space-y-6">
            {/* BASIC INFO Section */}
            <div className="border border-gray-300 rounded-md p-4 bg-white shadow-md">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">Basic Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(basicInfo).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                            <span className="text-gray-600 font-medium capitalize">
                                {key.replace(/_/g, ' ')}
                            </span>
                            <span className="text-gray-800">{value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* CONFIDENTIAL DETAILS Section */}
            <div className="border border-gray-300 rounded-md p-4 bg-white shadow-md">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">Confidential Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(workInfo).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                            <span className="text-gray-600 font-medium capitalize">
                                {key.replace(/_/g, ' ')}
                            </span>
                            {typeof value === 'object' ? (
                                <div className="flex flex-col space-y-2">
                                    {Object.entries(value).map(([subKey, subValue]) => (
                                        <div key={subKey} className="flex flex-col">
                                            <span className="text-gray-600 font-medium capitalize">
                                                {subKey}
                                            </span>
                                            <span className="text-gray-800">{subValue}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-gray-800">{value}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
