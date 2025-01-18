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
        emergency_contact_name: profile?.emergency_contact_name || '-',
        ["Relation with emergency contact"]: profile?.relationship_with_emergency_contact || '-',
        ["Emergency Contact Number"]: profile?.emergency_contact_no || '-',
        ["Alternate Contact Number"]: profile?.alternate_contact_no || '-',
        emergency_medical_condition: profile?.emergency_medical_condition || '-',
    };

    // Family Members Data
    const familyDetails = {
        father_full_name: `${profile?.father_first_name || '-'} ${profile?.father_middal_name || ''} ${profile?.father_last_name || '-'}`,
        father_occupation: profile?.father_occupation || '-',
        father_age: profile?.father_birthdate ||  '-',
        mother_full_name: `${profile?.mother_first_name || '-'} ${profile?.mother_middal_name || ''} ${profile?.mother_last_name || '-'}`,
        mother_occupation: profile?.mother_occupation || '-',
        mother_age: profile?.mother_birthdate ||  '-',
        total_siblings: profile?.total_siblings || '0',
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
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">Emergency Contact Details</h2>
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
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">Family Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(familyDetails).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                            <span className="text-gray-600 font-medium capitalize">
                                {key.replace(/_/g, ' ')}
                            </span>
                            <span className="text-gray-800">{value}</span>
                        </div>
                    ))}
                </div>

                {/* Sibling Table */}
                <div className="mt-6">
                    <h3 className="text-md font-semibold mb-4">Siblings Details</h3>
                    <table className="table-auto border-collapse border border-gray-300 w-full text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Sr. No</th>
                                <th className="border border-gray-300 px-4 py-2">Name</th>
                                <th className="border border-gray-300 px-4 py-2">Occupation</th>
                                <th className="border border-gray-300 px-4 py-2">Age</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 5 }, (_, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                    <td className="border border-gray-300 px-4 py-2">-</td>
                                    <td className="border border-gray-300 px-4 py-2">-</td>
                                    <td className="border border-gray-300 px-4 py-2">-</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
