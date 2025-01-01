import React, { useContext, useRef, useState } from 'react';
import {
  FaUser, FaBriefcase, FaFileAlt, FaClipboardList, FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { PersonalInfo } from './Component/PersonalInfo';
import { FamilyInfo } from './Component/FamilyInfo';
import { OfficialInfo } from './Component/OfficialInfo';
import { AdditionalInfo } from './Component/AdditionalInfo';
import { useNavigate } from 'react-router-dom';
import { UseContext } from '../../State/UseState/UseContext';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from "react-query";
import UserProfile from '../../hooks/UserData/useUser';
import { Skeleton } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import useLoadModel from "../../hooks/FaceMode/useFaceModal";
import { getSignedUrl, uploadFile } from "../../services/api";
import { TestContext } from '../../State/Function/Main';
import { useForm } from "react-hook-form";

const EmpProfile = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const empId = user?._id;
  const organisationId = user?.organizationId;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [url, setUrl] = useState();
  const fileInputRef = useRef();
  const [file, setFile] = useState();
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);

  const {
    detectFaceOnlyMutation,
    uploadImageToBackendMutation,
    loading,
    setLoading,
    employeeOrgId,
  } = useLoadModel();

  const {
    formState: { errors },
    handleSubmit,
    reset,

  } = useForm({
    defaultValues: {},

  });

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

  const handleTabChange = (value) => {
    setActiveTab(value);

    if (value === 'documents') {
      navigate(`/organisation/${orgId}/records`); // Redirect to documents page
    } else if (value === 'attendance') {
      navigate(`/organisation/${organisationId}/leave`); // Redirect to leave page
    }
  };



  const visibleTabs = tabs.slice(visibleStartIndex, visibleStartIndex + 6); // Show only 6 tabs at a time


  // Query to fetch employee profile
  const { isLoading, data: profile } = useQuery(
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

  // image changes
  const handleImageChange = (e) => {
    setLoading(true);
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (employeeOrgId?.employee?.faceRecognition === true) {
          const img = new Image();
          img.src = reader.result;
          const faces = await detectFaceOnlyMutation({
            img,
          });

          if (faces.length === 1) {
            setUrl(() => reader.result);
            setLoading(false);
          } else {
            setUrl(UserInformation?.user_logo_url);
            setLoading(false);
          }
        } else {
          setUrl(() => reader.result);
          setLoading(false);
        }
      };
      reader.readAsDataURL(selectedFile);
    } else {
      handleAlert(true, "error", "Please select a valid image file.");
    }
  };

  console.log("url", url);


  //delete
  const deleteProfilePhotoMutation = useMutation(
    async () => {
      await axios.delete(
        `${import.meta.env.VITE_API}/route/employee/photo/${empId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", "Profile photo deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["employeeProfile"] });
        queryClient.invalidateQueries({ queryKey: ["emp-profile"] });

        setUrl(null); // Clear the image URL from local state
      },
      onError: (error) => {
        console.error("Delete Profile Photo Error:", error);
        handleAlert(
          true,
          "error",
          error.response?.data?.message || "Failed to delete profile photo."
        );
      },
    }
  );

  // Function to trigger deletion
  const handleDeleteProfilePhoto = () => {
    deleteProfilePhotoMutation.mutate(); // Call the mutation
  };

  // add user data to database
  const AddAdditionalInformation = useMutation(
    (data) =>
      axios.post(
        `${import.meta.env.VITE_API}/route/employee/profile/add/${empId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),

    {
      onSuccess: () => {
        handleAlert(true, "success", "Profile added successfully!");
        reset();
        queryClient.invalidateQueries(["employeeProfile", empId]);
        queryClient.invalidateQueries({ queryKey: ["emp-profile"] });
      },
      onError: () => { },
    }
  );

  const onSubmit = async (data) => {
    try {
      let imageUrl;
      console.log("file", file);

      if (file) {
        const signedUrlResponse = await getSignedUrl();
        const signedUrl = signedUrlResponse.url;
        imageUrl = await uploadFile(signedUrl, file);
        await uploadImageToBackendMutation();
      }
      console.log("imageUrl", imageUrl);

      const requestData = {
        user_logo_url: imageUrl?.Location.split("?")[0],
      };

      console.log("requestData", requestData);
      await AddAdditionalInformation.mutateAsync(requestData);
    } catch (error) {
      console.error("error", error);
      handleAlert(true, "error", error.message);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 grid grid-cols-1 md:grid-cols-[300px,1fr] gap-6">

        {/* Left Column: Profile Info */}
        <div className="space-y-6 bg-white p-6 rounded-md shadow-md">
          {/* Profile Photo and Info */}
          {(activeTab === 'personal' ||
            activeTab === 'family' ||
            activeTab === 'work' ||
            activeTab === 'documents' ||
            activeTab === 'attendance' ||
            activeTab === 'additionalInfo') && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex justify-center items-center">
                  <div className="w-1/2 flex justify-center">
                    <div>
                      {/* File Input for Profile Photo */}
                      <input
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <div className="flex flex-col justify-center items-center">
                        {/* Profile Image or Skeleton Loader */}
                        {loading ? (
                          <CircularProgress />
                        ) : url || profile?.user_logo_url ? (
                          <img
                            id="image-1"
                            src={url || profile?.user_logo_url}
                            alt="profile-pic"
                            className="object-cover"
                            style={{
                              width: '150px',
                              height: '150px',
                              borderRadius: '50%',
                              border: '2px solid #1976d2',
                            }}
                          />
                        ) : (
                          <Skeleton variant="circular" width="150px" height="150px" />
                        )}
                        {/* Buttons in a Row */}
                        <div className="flex space-x-4 mt-4">
                          {/* Select Profile Button */}
                          <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="py-2 px-4 bg-[#1976d2] text-white font-semibold rounded-md shadow-md hover:bg-[#1565c0]"
                          >
                            {profile?.user_logo_url ? 'Update' : 'Select '}
                          </button>
                          {/* Delete Profile Button */}
                          <button
                            type="button"
                            className="py-2 px-4 bg-[#d21919] text-white font-semibold rounded-md shadow-md hover:bg-[#9b0b0b]"
                            onClick={handleDeleteProfilePhoto}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-36 py-2 bg-[#1976d2] text-white font-semibold rounded-md shadow-md hover:bg-[#1565c0] mt-4"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
        </div>



        {/* Right Column: Dynamic Content Based on Active Tab */}
        <div className="bg-white p-4 rounded-md shadow-md">
          <div className="font-semibold text-lg mb-4">
            Welcome {profile?.first_name} {profile?.last_name}
          </div>

          <header className="bg-blue-500 text-white p-2 flex items-center">
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

export default EmpProfile;





