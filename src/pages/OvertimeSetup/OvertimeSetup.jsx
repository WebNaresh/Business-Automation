import React, { useState, useContext } from "react";
import {
  Checkbox,
  TextField,
  Button,
  FormControlLabel,
  FormGroup,
  FormControl,
  RadioGroup,
  Radio,
  FormLabel,
  Tooltip,
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Grid,
} from "@mui/material";
import { Settings } from "@mui/icons-material";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import axios from "axios";
import Setup from "../SetUpOrganization/Setup";
import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import { useQuery } from "react-query";
import { TestContext } from "../../State/Function/Main";

// Custom styles
const CustomCard = styled(Card)`
  background-color: #ffffff;
  border: 1px solid #d0e2ff;
  border-radius: 10px;
`;

const CustomButton = styled(Button)`
  background-color: #00509e;
  color: white;
  font-family: "Roboto", sans-serif;
  font-weight: bold;
  &:hover {
    background-color: #003f7f;
  }
`;
console.log(CustomButton)

const CustomTypography = styled(Typography)`
  color: #003f7f;
  font-weight: bold;
`;

const OvertimeSetup = () => {
  // hook
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const { organisationId } = useParams();

  //state
  const [overtimeAllowed, setOvertimeAllowed] = useState(false);
  const [minimumOvertimeHours, setMinimumOvertimeHours] = useState("");
  const [overtimeAllowanceRequired, setOvertimeAllowanceRequired] =
    useState(false);
  const [allowanceParameter, setAllowanceParameter] = useState("perHour");
  const [allowanceAmount, setAllowanceAmount] = useState("");

  // get query
  useQuery(
    ["overtimeSettings", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get/${organisationId}/overtime`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data || {};
    },
    {
      onSuccess: (settings) => {
        console.log("settiogn" , settings)
        setOvertimeAllowed(settings.overtimeAllowed || false);
        setMinimumOvertimeHours(settings.minimumOvertimeHours || "");
        setOvertimeAllowanceRequired(
          settings.overtimeAllowanceRequired || false
        );
        setAllowanceParameter(settings.allowanceParameter || "perHour");
        setAllowanceAmount(settings.allowanceAmount || "");
      },
      onError: () => {},
    }
  );

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleCheckboxChange = (setter) => (event) => {
    setter(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Validate the form inputs
      if (!overtimeAllowed) {
        handleAlert(
          true,
          "error",
          "Please check 'Overtime Allowed' before proceeding."
        );
        return;
      }

      if (!overtimeAllowanceRequired) {
        handleAlert(
          true,
          "error",
          "Please check 'Overtime allowance' before proceeding."
        );
        return;
      }

      if (overtimeAllowed) {
        const minHours = Number(minimumOvertimeHours);

        if (isNaN(minHours) || minHours <= 0 || minHours > 24) {
          handleAlert(
            true,
            "error",
            "Number of Hours Allowed for Overtime must be greater than 0 and less than or equal to 24."
          );
          return;
        }
      }

      const laskh = 1000000;

      if (overtimeAllowanceRequired) {
        const allowance = Number(allowanceAmount);

        if (isNaN(allowance) || allowance <= 0 || allowance > laskh) {
          handleAlert(
            true,
            "error",
            `Overtime Allowances Amount is required, and less than or equal to ${laskh}.`
          );
          return;
        }
      }

      // Proceed with form submission if validation passes
      const overtimeSettings = {
        overtimeAllowed,
        minimumOvertimeHours: Number(minimumOvertimeHours),
        overtimeAllowanceRequired,
        allowanceParameter,
        allowanceAmount: Number(allowanceAmount),
        organizationId: organisationId,
      };

      await axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/overtime`,
        overtimeSettings,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      handleAlert(true, "success", "Overtime setup successfully.");
    } catch (error) {
      console.log(error);
      handleAlert(
        true,
        "error",
        "Error occurred while setting up the overtime."
      );
    }
  };

  return (
    <>
      <Setup>
        <Box className="bg-white min-h-screen w-full p-8" >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CustomCard className="shadow-md rounded-sm border">
              <CardContent>
                <CustomTypography
                  variant="h5"
                  className="mb-4 flex items-center"
                >
                  <Settings className="mr-2  text-gray-700" /> 
                  <div>
                  <h1 className="!text-lg font-medium text-gray-800">Overtime</h1>
                  <p className="text-xs font-medium text-gray-500">
                    Configure Overtime Allowance settings
                  </p>
                </div>
                </CustomTypography>
             
                <Divider className="mb-4 pt-4" />
                <form onSubmit={handleSubmit}>
                  <FormGroup>
                    {/* <Tooltip */}
                      {/* title="Enable or disable overtime for employees"
                      arrow
                      //  placement="left"
                    > */}
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={overtimeAllowed}
                            onChange={handleCheckboxChange(setOvertimeAllowed)}
                          />
                        }
                        label="Overtime Allowed"
                      />
                    {/* </Tooltip> */}
                    {overtimeAllowed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        //  placement="left"
                      >
                        <Grid container spacing={2} className="mb-4">
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Number of Hours Allowed for Overtime"
                              type="number"
                              value={minimumOvertimeHours}
                              onChange={handleInputChange(
                                setMinimumOvertimeHours
                              )}
                              inputProps={{ min: 0, max: 24 }}
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                        <Tooltip
                          title="Specify if overtime allowances are required"
                          arrow
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={overtimeAllowanceRequired}
                                onChange={handleCheckboxChange(
                                  setOvertimeAllowanceRequired
                                )}
                              />
                            }
                            label="Overtime Allowances Required"
                          />
                        </Tooltip>
                        {overtimeAllowanceRequired && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <FormControl component="fieldset" className="mb-4">
                              <FormLabel component="legend">
                                Overtime Allowances Amount Parameter
                              </FormLabel>
                              <RadioGroup
                                row
                                value={allowanceParameter}
                                onChange={handleInputChange(
                                  setAllowanceParameter
                                )}
                              >
                                <FormControlLabel
                                  value="perHour"
                                  control={<Radio />}
                                  label="Per Hour"
                                />
                                <FormControlLabel
                                  value="perDay"
                                  control={<Radio />}
                                  label="Per Day"
                                />
                              </RadioGroup>
                            </FormControl>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  label="Overtime Allowances Amount"
                                  type="number"
                                  value={allowanceAmount}
                                  onChange={handleInputChange(
                                    setAllowanceAmount
                                  )}
                                  inputProps={{ min: 0 }}
                                  fullWidth
                                />
                              </Grid>
                            </Grid>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </FormGroup>
                  <br />
                  {/* <CustomButton
                    variant="contained"
                    type="submit"
                    className="py-2 mt-4"
                    startIcon={<SaveIcon />}
                  >
                    Save
                  </CustomButton> */}

                  <Button variant="contained" type="submit">
          Save
        </Button>
                </form>
              </CardContent>
            </CustomCard>
          </motion.div>
        </Box>
      </Setup>
    </>
  );
};

export default OvertimeSetup;
