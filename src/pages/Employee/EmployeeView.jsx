import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Typography, Box, Slide } from "@mui/material";
import axios from "axios";
import {  useQuery, useQueryClient } from "react-query";

const EmployeeView = () => {
  const { organisationId, empId } = useParams();
  const [showFirstSlide, setShowFirstSlide] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch user profile data using useQuery
  const { data: profileData } = useQuery(
    ["employeeProfile", empId],
    async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/route/employee/get/profile/${empId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },

  );
  console.log("profile data", profileData);


  const handleClose = () => {
    navigate(`/organisation/${organisationId}/employee-list`);
  };

  return (
    <Container>
      <Button onClick={handleClose} variant="outlined" color="primary">
        Go Back
      </Button>
      <Box>
        <Slide direction="left" in={showFirstSlide} mountOnEnter unmountOnExit>
          <Box p={4} className="slide-container">
            {/* {employee ? (
              <>
                <Typography variant="h4">Employee Information</Typography>
                <Typography variant="h6">Name: {employee.first_name}</Typography>
                <Typography variant="h6">Email: {employee.email}</Typography>
                <Typography variant="h6">Employee ID: {employee.empId}</Typography>
                <Typography variant="h6">Department: {employee.deptname}</Typography>
                <Typography variant="h6">Designation: {employee.designation}</Typography>
              </>
            ) : (
              <Typography variant="h6">Loading...</Typography>
            )} */}
          </Box>
        </Slide>

        <Slide direction="left" in={!showFirstSlide} mountOnEnter unmountOnExit>
          <Box p={4} className="slide-container">
            {/* This is the blank slide */}
          </Box>
        </Slide>
      </Box>
      <Button
        variant="contained"
        onClick={() => setShowFirstSlide(!showFirstSlide)}
        style={{ marginTop: "20px" }}
      >
        Toggle Slide
      </Button>
    </Container>
  );
};

export default EmployeeView;
