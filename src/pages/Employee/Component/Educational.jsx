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

  // Default Educational Data
  const educationalDetails = [
    {
      srNo: 1,
      instituteName: "ABC High School",
      instituteLocation: "City A",
      degree: "SSC",
      duration: "2010 - 2012",
    },
    {
      srNo: 2,
      instituteName: "XYZ Junior College",
      instituteLocation: "City B",
      degree: "HSC",
      duration: "2012 - 2014",
    },
    {
      srNo: 3,
      instituteName: "LMN University",
      instituteLocation: "City C",
      degree: "Bachelor of Science",
      duration: "2014 - 2018",
    },
    {
      srNo: 4,
      instituteName: "PQR University",
      instituteLocation: "City D",
      degree: "Master of Science",
      duration: "2018 - 2020",
    },
  ];

  return (
    <div className="p-4">
      <div className="border border-gray-300 rounded-md p-4 bg-white shadow-md">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Educational Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-600">
                <th className="border border-gray-300 px-4 py-2 text-left">Sr No</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Institute Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Institute Location</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Degree</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
              </tr>
            </thead>
            <tbody>
              {educationalDetails.map((edu, index) => (
                <tr key={index} className="text-gray-800">
                  <td className="border border-gray-300 px-4 py-2">{edu.srNo}</td>
                  <td className="border border-gray-300 px-4 py-2">{edu.instituteName}</td>
                  <td className="border border-gray-300 px-4 py-2">{edu.instituteLocation}</td>
                  <td className="border border-gray-300 px-4 py-2">{edu.degree}</td>
                  <td className="border border-gray-300 px-4 py-2">{edu.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
