import React, { useContext, useState } from 'react';
import {
  FaUser,
  FaBriefcase,
  FaFileAlt,
  FaClipboardList,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa'; // Added Prev/Next icons
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
  const [visibleStartIndex, setVisibleStartIndex] = useState(0); // For tab scrolling

  const tabs = [
    { value: 'personal', label: 'Personal', icon: <FaUser />, content: <PersonalInfo empId={empId} /> },
    { value: 'family', label: 'Family', icon: <FaUser />, content: <FamilyInfo empId={empId} /> },
    { value: 'additionalInfo', label: 'Additional', icon: <FaUser />, content: <AdditionalInfo empId={empId} /> },
    { value: 'work', label: 'Official', icon: <FaBriefcase />, content: <OfficialInfo empId={empId} /> },
    { value: 'documents', label: 'Documents', icon: <FaFileAlt />, content: <div>Documents</div> },
    { value: 'attendance', label: 'Attendance', icon: <FaClipboardList />, content: <div>Attendance</div> },
    { value: 'project', label: 'Project', icon: <FaClipboardList />, content: <div>Project</div> },
    { value: 'activity', label: 'Activity', icon: <FaClipboardList />, content: <div>Activity</div> },
    { value: 'note', label: 'Note', icon: <FaClipboardList />, content: <div>Note</div> },
    { value: 'fileManager', label: 'File Manager', icon: <FaClipboardList />, content: <div>File Manager</div> },
  ];

  const visibleTabs = tabs.slice(visibleStartIndex, visibleStartIndex + 6); // Show only 6 tabs at a time

  const handleTabChange = (value) => {
    setActiveTab(value);

    if (value === 'documents') {
      navigate(`/organisation/${organisationId}/mis-report`);
    } else if (value === 'attendance') {
      navigate(`/organisation/${organisationId}/leave`);
    }
  };

  const handlePrev = () => {
    if (visibleStartIndex > 0) {
      setVisibleStartIndex(visibleStartIndex - 1);
    }
  };

  const handleNext = () => {
    if (visibleStartIndex + 6 < tabs.length) {
      setVisibleStartIndex(visibleStartIndex + 1);
    }
  };

  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto py-6 px-4 grid grid-cols-1 md:grid-cols-[300px,1fr] gap-6">
        {/* Profile Info */}
        <div className="space-y-4 bg-white p-4 rounded-md shadow-md mt-4">
          <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-white mx-auto">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
              <span className="text-xs text-center px-2">Your Profile Photo comes here</span>
            </div>
          </div>

          <div className="text-center">

            <div className="text-sm text-gray-500 mt-2">
              Employee ID:  {profile?.empId}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Designation: {profile?.designation?.[0]?.title || '-'}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Joining Date: {profile?.joining_date ? new Date(profile?.joining_date).toLocaleDateString() : '-'}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Department: {profile?.deptname?.[0]?.title || '-'}
            </div>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="bg-white p-4 rounded-md shadow-md">
          <div className="font-semibold text-lg mb-4">
            {profile?.first_name} {profile?.last_name}
          </div>

          {/* <header className="bg-blue-500 text-white p-2 flex items-center">
            <button
              onClick={handlePrev}
              className="text-white px-2 py-1 hover:bg-blue-600"
              disabled={visibleStartIndex === 0}
            >
              <FaChevronLeft />
            </button>
            <div className="flex-1 flex justify-between overflow-hidden">
              {visibleTabs.map((tab) => (
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
            <button
              onClick={handleNext}
              className="text-white px-2 py-1 hover:bg-blue-600"
              disabled={visibleStartIndex + 6 >= tabs.length}
            >
              <FaChevronRight />
            </button>
          </header> */}
          <header className="bg-blue-500 text-white p-2 flex items-center sticky top-0 z-10">
            <button
              onClick={handlePrev}
              className="text-white px-2 py-1 hover:bg-blue-600"
              disabled={visibleStartIndex === 0}
            >
              <FaChevronLeft />
            </button>
            <div className="flex-1 flex justify-between overflow-hidden">
              {visibleTabs.map((tab) => (
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
            <button
              onClick={handleNext}
              className="text-white px-2 py-1 hover:bg-blue-600"
              disabled={visibleStartIndex + 6 >= tabs.length}
            >
              <FaChevronRight />
            </button>
          </header>



          {/* Tab Content */}
          <div className="space-y-4 mt-4">{tabs.find((tab) => tab.value === activeTab)?.content}</div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfileView;
