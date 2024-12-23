import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import Setup from "../SetUpOrganization/Setup";
const Inputfield = () => {
  const { organisationId } = useParams("");
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];

  const [inputDetail, setinputDetail] = useState([]);

  useEffect(() => {
    const fetchInputFieldData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/inputfield/${organisationId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        setinputDetail(response.data.inputField.inputDetail);
      } catch (error) {
        console.error("Error fetching input fields:", error);
      }
    };

    fetchInputFieldData();
  }, [authToken, organisationId]);

  const handleInputFieldChange = (field) => {
    const updatedInputField = inputDetail.map((inputField) => {
      if (inputField.label === field.label) {
        // Toggle the isActive property
        return { ...inputField, isActive: !inputField.isActive };
      }
      return inputField;
    });

    setinputDetail(updatedInputField);
  };

  const sendRequestToBackend = async () => {
    try {
      const updatedInputDetails = inputDetail.map((field) => ({
        inputDetailId: field._id, // Assuming you have a unique ID for each input detail
        isActive: field.isActive,
        label: field.label,
      }));

      // Send a PUT request to update the input fields
      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/inputfield/update/${organisationId}`,
        { inputDetails: updatedInputDetails },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      handleAlert(true, "success", response.data.message);
    } catch (error) {
      // Handle errors
      handleAlert("Failed to apply changes", "error");
    }
  };

  return (
    <>
      <section className="bg-gray-50 min-h-screen w-full">
        <Setup>
          <div>
            <div className="p-4  border-b-[.5px] flex   gap-3 w-full border-gray-300">
              <div className="flex gap-3 ">
                <div className="mt-1">
                  <PersonOutlineOutlinedIcon />
                </div>
              </div>
              <div>
                <h1 className="!text-lg">Additional Employee Data</h1>
                <p className="text-xs text-gray-600">
                  Select checkbox to know additional information about your
                  employee.
                </p>
              </div>
            </div>

            <div className="flex flex-col flex-wrap">
              {inputDetail.map((field, _id) => (
                <div
                  key={_id}
                  className="border-gray-200 flex justify-between py-2 px-6"
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.isActive}
                        onChange={() => handleInputFieldChange(field)}
                      />
                    }
                    label={field.label}
                  />
                </div>
              ))}
            </div>
            <div className="w-full px-4 py-2 mt-2">
              <Button variant="contained" onClick={sendRequestToBackend}>
                Submit
              </Button>
            </div>
          </div>
        </Setup>
      </section>
    </>
  );
};

export default Inputfield;
