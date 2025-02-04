import React, { useContext } from 'react';
import { UseContext } from '../../../State/UseState/UseContext';
import axios from 'axios';
import { useQuery } from 'react-query';

export function FamilyInfo({ empId }) {
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

    // Emergency Contact Data
    const emergencyContact = {
        emergency_contact_no: profile?.emergency_contact_no || '-',
        emergency_contact_name: profile?.emergency_contact_name || '-',
        relationship_with_emergency_contact: profile?.relationship_with_emergency_contact || '-',
        alternate_contact_no: profile?.alternate_contact_no || '-',
        emergency_medical_condition: profile?.emergency_medical_condition || '-',
    };

    // Family Members Data
    const familyMembers = {
        parent_name: profile?.parent_name || '-',
        spouse_name: profile?.spouse_name || '-',
        father_first_name: profile?.father_first_name || '-',
        father_middal_name: profile?.father_middal_name || '-',
        father_last_name: profile?.father_last_name || '-',
        father_occupation: profile?.father_occupation || '-',
        mother_first_name: profile?.mother_first_name || '-',
        mother_middal_name: profile?.mother_middal_name || '-',
        mother_last_name: profile?.mother_last_name || '-',
        mother_occupation: profile?.mother_occupation || '-',
    };

    if (isLoading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>Error loading profile data</div>; // Error handling
    }

    return (
        <div className="p-4 space-y-6">
            {/* Emergency Contact Section */}
            <div className="border border-gray-300 rounded-md p-4 bg-white shadow-md">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">Emergency Contact</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(emergencyContact).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                            <span className="text-gray-600 font-medium capitalize">
                                {key.replace(/_/g, ' ')}
                            </span>
                            <span className="text-gray-800">{value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Family Members Section */}
            <div className="border border-gray-300 rounded-md p-4 bg-white shadow-md">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">Family Members</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(familyMembers).map(([key, value]) => (
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

