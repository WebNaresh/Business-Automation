import React, { useState } from "react";
import { Container, Button, Typography, Paper, Stack } from "@mui/material";
import { useParams } from "react-router-dom";
import EmpInfoByDynimacally from "./EmpInfoByDynanimacally";
import EmpInfoPunchStatus from "./EmpInfoPunchStatus";
import Tooltip from "@mui/material/Tooltip";

const RenderPunchSyncFile = () => {
  // hook
  const { organisationId } = useParams();
  const [syncOption, setSyncOption] = useState("file");

  // Handler for changing sync option
  const handleSyncOptionChange = (option) => {
    setSyncOption(option);
  };

  return (

    <Container
      maxWidth="xl"
      sx={{
        backgroundColor: "gray.50",
        minHeight: "100vh",
        py: 4,
        fontFamily: "Inter, sans-serif"
      }}
    >
      <EmpInfoPunchStatus organisationId={organisationId} />
    </Container>
  );
};

export default RenderPunchSyncFile;
