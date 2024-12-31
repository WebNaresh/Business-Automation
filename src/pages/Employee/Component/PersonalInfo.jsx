import React, { useContext } from 'react';
import { UseContext } from '../../../State/UseState/UseContext';
import axios from 'axios';
import { useQuery } from 'react-query';

export function PersonalInfo({ empId }) {
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
    { enabled: Boolean(empId) } // Only fetch data if empId is provided
  );

  console.log("profile", profile);

  // Static fallback personal data with optional chaining
  const personalData = {
    first_name: profile?.first_name || '-',
    last_name: profile?.last_name || '-',
    email: profile?.email || '-',
    gender: profile?.gender || '-',
    phone_number: profile?.phone_number || '-',
    address: profile?.address || '-',
    citizenship: profile?.citizenship || '-',
    adhar_card_number: profile?.adhar_card_number || '-',
    pan_card_number: profile?.pan_card_number || '-',
    bank_account_no: profile?.bank_account_no || '-',
    date_of_birth: profile?.date_of_birth
      ? new Date(profile?.date_of_birth).toLocaleDateString()
      : '-',
    pwd: profile?.pwd !== undefined ? profile?.pwd : '-',
    uanNo: profile?.uanNo || '-',
    esicNo: profile?.esicNo || '-',
    height: profile?.height || '-',
    weight: profile?.weight || '-',
    blood_group: profile?.blood_group || '-',
    voting_card_no: profile?.voting_card_no || '-',
    permanent_address: profile?.permanent_address || '-',
    smoking_habits: profile?.smoking_habits || '-',
    drinking_habits: profile?.drinking_habits || '-',
    sports_interest: profile?.sports_interest || '-',
    favourite_book: profile?.favourite_book || '-',
    favourite_travel_destination: profile?.favourite_travel_destination || '-',
    disability_status: profile?.disability_status || '-',
    emergency_medical_condition: profile?.emergency_medical_condition || '-',
    short_term_goal: profile?.short_term_goal || '-',
    long_term_goal: profile?.long_term_goal || '-',
    strength: profile?.strength || '-',
    weakness: profile?.weakness || '-',
    bank_name: profile?.bank_name || '-',
    ifsc_code: profile?.ifsc_code || '-',
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
