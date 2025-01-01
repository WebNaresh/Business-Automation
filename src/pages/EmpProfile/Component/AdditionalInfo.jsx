import React, { useContext } from 'react';
import { UseContext } from '../../../State/UseState/UseContext';
import axios from 'axios';
import { useQuery } from 'react-query';

export function AdditionalInfo({ empId }) {
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
    education: profile?.additionalInfo?.['Education'] || '-',
    emergency_contact: profile?.additionalInfo?.['Emergency Contact'] || '-',
    marital_status: profile?.additionalInfo?.['Marital Status'] || '-',
    middle_name: profile?.additionalInfo?.['Middle Name'] || '-',
    passport_no: profile?.additionalInfo?.['Passport No'] || '-',
    permanent_address: profile?.additionalInfo?.['Permanent Address'] || '-',
    primary_nationality: profile?.additionalInfo?.['Primary Nationality'] || '-',
    relative_information: profile?.additionalInfo?.['Relative Information'] || '-',
  };

  if (isLoading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>Error loading profile data</div>; // Error handling
  }

  return (
    <div className="p-4">
      <div className="border border-gray-300 rounded-md p-4 bg-white shadow-md">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Additional Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(personalData).map(([key, value]) => (
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
