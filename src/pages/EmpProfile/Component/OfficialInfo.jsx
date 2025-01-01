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
        profile: profile?.profile || '-',
        empId: profile?.empId || '-',
        employmentType: profile?.employmentType?.title || '-',
        joining_date: profile?.joining_date
            ? new Date(profile?.joining_date).toLocaleDateString()
            : '-',
        companyemail: profile?.companyemail || '-',
        id_card_no: profile?.id_card_no || '-',
    };

    // Segregate Work Info
    const workInfo = {
        worklocation: profile?.worklocation?.[0]?.city || '-',
        deptname: profile?.deptname?.[0]?.departmentName || '-',
        shift_allocation: profile?.shift_allocation || '-',
        current_ctc: profile?.current_ctc || '-',
        company_assets: profile?.company_assets || '-',
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
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">Basic Info</h2>
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

            {/* WORK INFO Section */}
            <div className="border border-gray-300 rounded-md p-4 bg-white shadow-md">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">Work Info</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(workInfo).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                            <span className="text-gray-600 font-medium capitalize">
                                {key.replace(/_/g, ' ')}
                            </span>
                            <span className="text-gray-800">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


