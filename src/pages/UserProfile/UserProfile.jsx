import { zodResolver } from "@hookform/resolvers/zod";
import { ContactEmergency } from "@mui/icons-material";
import ChatIcon from "@mui/icons-material/Chat";
import InfoIcon from "@mui/icons-material/Info";
import { Button, Divider, Paper, Skeleton } from "@mui/material";
import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
// import Loader from "../../components/Modal/Selfi-Image/components/Loader";
import useLoadModel from "../../hooks/FaceMode/useFaceModal";
import UserProfile from "../../hooks/UserData/useUser";
import useHook from "../../hooks/UserProfile/useHook";
import { getSignedUrl, uploadFile } from "../../services/api";
import ResetNewPassword from "../ResetNewPassword/ResetNewPassword";
import CircularProgress from "@mui/material/CircularProgress";

import AddNewUserId from "../AddNewUserId/AddNewUserId";

const EmployeeProfile = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const userId = user._id;
  const queryClient = useQueryClient();
  const { UserInformation } = useHook();
  const [url, setUrl] = useState();
  const fileInputRef = useRef();
  const [file, setFile] = useState();
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const {
    detectFaceOnlyMutation,
    uploadImageToBackendMutation,
    loading,
    setLoading,
    employeeOrgId,
  } = useLoadModel();

  const UserProfileSchema = z.object({
    additional_phone_number: z
      .string()
      .max(10, { message: "Phone Number must be 10 digits" })
      .refine((value) => value.length === 10 || value.length === 0, {
        message: "Phone Number must be either 10 digits or empty",
      })
      .optional(),
    chat_id: z.string().optional(),
    status_message: z.string().optional(),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    defaultValues: {},
    resolver: zodResolver(UserProfileSchema),
  });

  // Fetch user profile data using useQuery
  const { data: profileData } = useQuery(
    ["employeeProfile", userId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get/profile/${userId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
    
      onSuccess: (data) => {
        setValue("chat_id", data?.employee?.chat_id || "");
        setValue(
          "additional_phone_number",
          String(data?.employee?.additional_phone_number || "")
        );
        setValue("status_message", data?.employee?.status_message || "");
        handleAlert(true, "success", "Profile data loaded successfully!");
      },

      onError: () => {},
    }
  );
  console.log("profile data", profileData);

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
  //delete
  const deleteProfilePhotoMutation = useMutation(
    async () => {
      await axios.delete(
        `${process.env.REACT_APP_API}/route/employee/photo/${userId}`,
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
  console.log("Deleting photo for userId:", userId);
  console.log("Using authToken:", authToken);

  // add user data to database
  const AddAdditionalInformation = useMutation(
    (data) =>
      axios.post(
        `${process.env.REACT_APP_API}/route/employee/profile/add/${userId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),

    {
      onSuccess: () => {
        handleAlert(true, "success", "Additional details added successfully!");
        reset();
        queryClient.invalidateQueries(["employeeProfile", userId]);
        queryClient.invalidateQueries({ queryKey: ["emp-profile"] });
      },
      onError: () => {},
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
        ...data,
        user_logo_url: imageUrl?.Location.split("?")[0],
      };

      console.log("requestData", requestData);
      // Immediately update the local state with new values
      setValue("chat_id", requestData.chat_id);
      setValue("additional_phone_number", requestData.additional_phone_number);
      setValue("status_message", requestData.status_message);

      await AddAdditionalInformation.mutateAsync(requestData);
      //  queryClient.invalidateQueries({ queryKey: ["employeeProfile"] });
    } catch (error) {
      console.error("error", error);
      handleAlert(true, "error", error.message);
    }
  };

 

  return (
    <div>
      <Paper
        sx={{
          width: "100%",
          maxWidth: "800px",
          margin: "6% auto",
          padding: "20px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 className="text-lg font-semibold md:text-xl">Account Setting</h1>
        </div>
        <div className=" mb-8">
          <p className="text-xs text-gray-600  text-center">
            Manage your account here.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-around items-center w-full h-[25vh]">
            <div className="w-[50%]">
              <div>
                <input
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div className="w-full h-full flex flex-col justify-center items-center">
                  {loading ? (
                    <CircularProgress />
                  ) : url || UserInformation?.user_logo_url ? (
                    <img
                      id="image-1"
                      src={url || UserInformation?.user_logo_url}
                      alt="profile-pic"
                      className="object-cover"
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <Skeleton variant="circular" width="150px" height="150px" />
                  )}

                  {/* <Loader
                    isLoading={loading}
                    outerClassName="!w-screen !h-screen"
                  /> */}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="flex justify-center h-full bg-[#1976d2] shadow-md pt-1 pb-1 pr-4 pl-4 rounded-md font-semibold mt-2 text-white"
                  >
                    {UserInformation?.user_logo_url
                      ? "Update Profile Picture"
                      : "Select Profile Picture"}
                  </button>

                  {/* Delete Profile Photo Button */}
                  <button
                    type="button"
                    // variant="contained"
                    color="error" // Red color for delete action
                    className="flex justify-center h-full bg-[#d21919] shadow-md pt-1 pb-1 pr-4 pl-4 rounded-md font-semibold mt-2 text-white"
                    onClick={handleDeleteProfilePhoto}
                  >
                    Delete Profile Photo
                  </button>
                </div>
              </div>
            </div>

            <div className="w-[50%] ml-20">
              <div className="w-full h-full flex flex-col items-start">
                <h1
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#333",
                    textAlign: "center",
                  }}
                  className="text-left"
                >
                  {`${user?.first_name} ${user?.last_name}`}
                </h1>
                <h1 className="text-lg font-semibold text-left">
                  {user?.profile.join(", ")}
                </h1>

                <div className="w-full">
                  <h1 className="text-lg text-left" style={{ color: "#000" }}>
                    <span>
                      <strong>Status:</strong>{" "}
                      {UserInformation?.status_message || ""}
                    </span>
                  </h1>
                  <h1 className="text-lg text-left" style={{ color: "#000" }}>
                    <span>
                      <strong>Chat ID:</strong> {UserInformation?.chat_id || ""}
                    </span>
                  </h1>
                  <h1 className="text-lg text-left" style={{ color: "#000" }}>
                    <span>
                      <strong>Contact:</strong>{" "}
                      {UserInformation?.additional_phone_number || ""}
                    </span>
                  </h1>

                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="flex justify-center h-full bg-[#1976d2] shadow-md pt-1 pb-1 pr-4 pl-4 rounded-md font-semibold mt-2 text-white"
                  >
                    Reset Password
                  </button>

                  <button
                    type="button"
                    // onClick={handelchangeUserid}
                    onClick={() => setOpen1(true)}
                    className="flex justify-center h-full bg-[#1976d2] shadow-md pt-1 pb-1 pr-4 pl-4  rounded-md font-semibold mt-2 text-white"
                  >
                    Create User Id
                  </button>
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className="w-full py-6">
            <Divider variant="fullWidth" orientation="horizontal" />
          </div>

          <div className="px-5 space-y-4 mt-4">
            <div className="space-y-2 ">
              <AuthInputFiled
                name="additional_phone_number"
                icon={ContactEmergency}
                control={control}
                type="text"
                placeholder="Contact"
                label="Contact"
                errors={errors}
                error={errors.additional_phone_number}
              />
            </div>
            <div className="space-y-2 ">
              <AuthInputFiled
                name="chat_id"
                icon={ChatIcon}
                control={control}
                type="text"
                placeholder="Chat Id"
                label="Chat Id"
                errors={errors}
                error={errors.chat_id}
              />
            </div>
            <div className="space-y-2 ">
              <AuthInputFiled
                name="status_message"
                icon={InfoIcon}
                control={control}
                type="text"
                placeholder="status"
                label="status"
                errors={errors}
                error={errors.status_message}
              />
            </div>

            <div className="flex gap-4 mt-4 justify-center">
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Paper>

      <ResetNewPassword open={open} handleClose={handleClose} />
      <AddNewUserId open1={open1} handleClose1={handleClose1} />
    </div>
  );
};

export default EmployeeProfile;






