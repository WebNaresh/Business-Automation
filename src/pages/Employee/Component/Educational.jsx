import React, { useContext } from 'react';
import { UseContext } from '../../../State/UseState/UseContext';
import axios from 'axios';
import { useQuery } from 'react-query';

export function Educational({ empId }) {
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

  if (isLoading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>Error loading profile data</div>; // Error handling
  }


  return (
    <div className="p-4">
      <div className="border border-gray-300 rounded-md p-4 bg-white shadow-md">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2 bg-[#174E63] text-white p-2 rounded-t-md">Educational Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#3E3E3E] text-white">
                <th className="border border-gray-300 px-4 py-2 text-left">Sr No</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Institute Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Institute Location</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Degree</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
              </tr>
            </thead>
            <tbody>
              {profile?.education_details && profile.education_details.length > 0 ? (
                profile.education_details.map((education, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{education.institute_name || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2">{education.institute_location || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2">{education.degree || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2">{education.duration || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="border border-gray-300 px-4 py-2 text-center">
                    No education details available
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
