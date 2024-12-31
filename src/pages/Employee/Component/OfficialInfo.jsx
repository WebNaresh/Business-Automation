import React, { useState, useEffect, useContext } from 'react';
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

    // Static fallback personal data with optional chaining
    const personalData = {
        profile: profile?.profile || '-',
        worklocation: profile?.worklocation?.[0]?.city || '-',
        deptname: profile?.deptname?.[0]?.departmentName || '-',
        employmentType: profile?.employmentType?.title || '-',
        empId: profile?.empId || '-',
       // mgrempid: profile?.mgrempid || '-',
        joining_date: profile?.joining_date
        ? new Date(profile?.joining_date).toLocaleDateString()
        : '-',
        companyemail: profile?.companyemail || '-',
        shift_allocation: profile?.shift_allocation || '-',
        current_ctc: profile?.current_ctc || '-',
        id_card_no: profile?.id_card_no || '-',
        company_assets: profile?.company_assets || '-',
    };

    // Use profile data if available, otherwise fall back to personalData
    const dataToDisplay = personalData;

    if (isLoading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>Error loading profile data</div>; // Error handling
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {Object.entries(dataToDisplay).map(([key, value], index) => (
                <div key={key} className="flex flex-col">
                    <span className="text-gray-600 font-medium capitalize">
                        {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-gray-800">{value}</span>
                </div>
            ))}
        </div>
    );
}

