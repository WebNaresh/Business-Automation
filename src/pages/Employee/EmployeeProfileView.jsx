import React, { useContext, useState } from 'react';
import { FaUser, FaBriefcase, FaFileAlt, FaClipboardList } from 'react-icons/fa'; // Example icon imports
import { PersonalInfo } from './Component/PersonalInfo';
import { OfficialInfo } from './Component/OfficialInfo';
import { AdditionalInfo } from './Component/AdditionalInfo';
import { FamilyInfo } from './Component/FamilyInfo';
import { useParams, useNavigate } from 'react-router-dom';
import { UseContext } from '../../State/UseState/UseContext';
import axios from 'axios';
import { useQuery } from 'react-query';


const EmployeeProfileView = () => {
  const { empId, organisationId } = useParams();
  const navigate = useNavigate(); // Initialize navigate
  const [activeTab, setActiveTab] = useState('personal');
  const tabs = [
    { value: 'personal', label: 'Personal ', icon: <FaUser />, content: <PersonalInfo empId={empId} /> },
    { value: 'family', label: 'Family ', icon: <FaUser />, content: <FamilyInfo empId={empId} /> },
    { value: 'additionalInfo', label: 'Additional ', icon: <FaUser />, content: <AdditionalInfo empId={empId} /> },
    { value: 'work', label: 'Official ', icon: <FaBriefcase />, content: <OfficialInfo empId={empId} /> },
    { value: 'documents', label: 'Documents', icon: <FaFileAlt />, content: <div>Documents Info Content</div> },
    { value: 'attendance', label: 'Attendance', icon: <FaClipboardList />, content: <div>Attendance Info Content</div> },
  ];

  const handleTabChange = (value) => {
    setActiveTab(value);

    if (value === 'documents') {
      navigate(`/organisation/${organisationId}/mis-report`); // Redirect to documents page
    } else if (value === 'attendance') {
      navigate(`/organisation/${organisationId}/leave`); // Redirect to leave page
    }
  };

  const activeTabContent = tabs.find(tab => tab.value === activeTab)?.content;

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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}


      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 grid grid-cols-1 md:grid-cols-[300px,1fr] gap-6">
        {/* Left Column: Profile Info */}
        <div className="space-y-4 bg-white p-4 rounded-md shadow-md mt-4">
          {/* Profile Photo and Info */}
          {activeTab === 'personal' || activeTab === 'family' || activeTab === 'work' || activeTab === 'documents' || activeTab === 'attendance' || activeTab === 'additionalInfo' ? (
            <div className="relative w-full aspect-square rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-white">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                <div className="w-8 h-8 mb-2">+</div>
                <span className="text-sm text-center px-4">Your Profile Photo comes here</span>
              </div>
            </div>
          ) : null}

          <div className="text-center">
            <div className="text-center">
              {/* Display Full Name */}
              <div className="font-semibold text-lg">
                {profile?.first_name} {profile?.last_name}
              </div>

              {/* Display Employee ID */}
              <div className="text-sm text-gray-500 mt-2">
                Employee ID: {profile?.empId}
              </div>

              {/* Display Designation */}
              <div className="text-sm text-gray-500 mt-2">
                Designation: {profile?.designation?.[0]?.title || 'Not Available'}
              </div>

              {/* Display Joining Date */}
              <div className="text-sm text-gray-500 mt-2">
                Joining Date: {profile?.joining_date ? new Date(profile?.joining_date).toLocaleDateString() : 'Not Available'}
              </div>

              {/* Display Department */}
              <div className="text-sm text-gray-500 mt-2">
                Department: {profile?.deptname?.[0]?.title || 'Not Available'}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Dynamic Content Based on Active Tab */}
        <div className="bg-white p-4 rounded-md shadow-md">
          <header className="bg-blue-500 text-white p-2">
            {/* Tabs Navigation */}
            <div className="flex justify-between w-full py-2 space-x-2 bg-blue-500">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleTabChange(tab.value)}
                  className={`flex items-center gap-2 px-4 py-1 text-sm font-medium ${activeTab === tab.value
                    ? 'text-white border-b-2 border-white'
                    : 'text-gray-300 hover:text-white'
                    }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </header>

          <h2 className="text-xl font-semibold mb-4">

          </h2>
          <div className="space-y-4">
            {activeTabContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfileView;
