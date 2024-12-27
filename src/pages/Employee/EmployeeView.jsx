// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Container, Button, Box, Slide } from "@mui/material";
// import axios from "axios";
// import { useQuery } from "react-query";
// import { useContext } from "react";
// import { UseContext } from "@/State/UseState/UseContext";

// const EmployeeView = () => {
//   const { organisationId, empId } = useParams();
//   const [showFirstSlide, setShowFirstSlide] = useState(true);
//   const navigate = useNavigate();
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];


//   // Fetch user profile data using useQuery
//   const { data: profileData } = useQuery(
//     ["employeeProfile", empId],
//     async () => {
//       const response = await axios.get(
//         `${import.meta.env.VITE_API}/route/employee/get/profile/${empId}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data.employee
//         ;
//     },

//   );
//   console.log("profile data", profileData);


//   const handleClose = () => {
//     navigate(`/organisation/${organisationId}/employee-list`);
//   };

//   return (
//     <Container>
//       <Button onClick={handleClose} variant="outlined" color="primary">
//         Go Back
//       </Button>
//       <Box>
//         <Slide direction="left"  mountOnEnter unmountOnExit>
//           <Box p={4} className="slide-container">

//           </Box>
//         </Slide>

//         <Slide direction="left" mountOnEnter unmountOnExit>
//           <Box p={4} className="slide-container">
//             {/* This is the blank slide */}
//           </Box>
//         </Slide>
//       </Box>

//     </Container>
//   );
// };

// export default EmployeeView;

import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Box, Typography, Grid, Card, CardContent, Divider, Slide } from "@mui/material";
import axios from "axios";
import { useQuery } from "react-query";
import { UseContext } from "@/State/UseState/UseContext";

const EmployeeView = () => {
  const { organisationId, empId } = useParams();
  const navigate = useNavigate();
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  // Fetch user profile data using useQuery
  const { data: profileData } = useQuery(
    ["employeeProfile", empId],
    async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/route/employee/get/profile/${empId}`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data.employee;
    }
  );

  const handleClose = () => {
    navigate(`/organisation/${organisationId}/employee-list`);
  };

  if (!profileData) {
    return (
      <Container>
        <Typography variant="h6">Loading Employee Profile...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button onClick={handleClose} variant="outlined" color="primary" sx={{ mb: 2 , mt : 2 }}>
        Go Back
      </Button>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Employee Profile - {profileData.first_name} {profileData.last_name}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Personal Information */}
          <Typography variant="h6" gutterBottom>Personal Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography><strong>Name:</strong> {profileData.first_name} {profileData.last_name}</Typography>
              <Typography><strong>Email:</strong> {profileData.email}</Typography>
              <Typography><strong>Phone:</strong> {profileData.phone_number}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography><strong>Date of Birth:</strong> {new Date(profileData.date_of_birth).toLocaleDateString()}</Typography>
              <Typography><strong>Gender:</strong> {profileData.gender}</Typography>
              <Typography><strong>Citizenship:</strong> {profileData.citizenship}</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />

          {/* Company Information */}
          <Typography variant="h6" gutterBottom>Company Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography><strong>Employee ID:</strong> {profileData.empId}</Typography>
              <Typography><strong>Department:</strong>  {profileData?.deptname?.map((dept, index) => (
                <span key={index}>{dept?.departmentName}</span>
              ))}</Typography>
              <Typography><strong>Designation:</strong>{profileData?.designation
                ?.map((designation, index) => (
                  <span key={index}>{designation.designationName}</span>
                ))}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography><strong>Joining Date:</strong> {new Date(profileData.joining_date).toLocaleDateString()}</Typography>
              <Typography><strong>Employment Type:</strong> {profileData.employmentType?.title || "N/A"}</Typography>
              <Typography><strong>Location:</strong>  {profileData?.worklocation?.map((location, index) => (
                <span key={index}>{location?.city}</span>
              ))}</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />

          {/* Other Information */}
          <Typography variant="h6" gutterBottom>Other Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography><strong>Bank Account No:</strong> {profileData.bank_account_no}</Typography>
              <Typography><strong>PAN Card No:</strong> {profileData.pan_card_number}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography><strong>Aadhar Card No:</strong> {profileData.adhar_card_number}</Typography>
              <Typography><strong>Address:</strong> {profileData.address}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EmployeeView;

