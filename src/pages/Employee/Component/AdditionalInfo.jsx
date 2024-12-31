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
    education: profile?.additionalInfo['Education'] || '-',
    emergency_contact: profile?.additionalInfo['Emergency Contact'] || '-',
    marital_status: profile?.additionalInfo['Marital Status'] || '-',
    middle_name: profile?.additionalInfo['Middle Name'] || '-',
    passport_no: profile?.additionalInfo['Passport No'] || '-',
    permanent_address: profile?.additionalInfo['Permanent Address'] || '-',
    primary_nationality: profile?.additionalInfo['Primary Nationality'] || '-',
    relative_information: profile?.additionalInfo['Relative Information'] || '-',


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
