import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import { Button } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import Setup from "../SetUpOrganization/Setup";

const LetterSetup = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const { organisationId } = useParams();
  const { setAppAlert } = useContext(UseContext);

  useEffect(() => {
    fetchData();

    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/letter/get/${organisationId}`
      );
      const fetchedData = response.data;

      // Update formData state with fetched data
      setFormData(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      // If there's an error fetching data, set a default form data based on document names
      const initialFormData = {};
      const documentNames = [
        "EmploymentOfferLetter",
        "AppointmentLetter",
        "PromotionLetter",
        "TransferLetter",
        "TerminationLetter",
        "ResignationAcceptanceLetter",
        "ConfirmationLetter",
        "PerformanceAppraisalLetter",
        "WarningLetter",
        "SalaryIncrementLetter",
        "TrainingInvitationLetter",
        "EmployeeRecognitionLetter",
      ];

      documentNames.forEach((name) => {
        initialFormData[name] = { workflow: false };
      });
      setFormData(initialFormData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/route/letter/post/${organisationId}`,
        formData
      );
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Changes Updated Successfully",
      });
    } catch (error) {
      console.error("Error submitting data:", error);
      // Handle error if needed
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (documentName, checked) => {
    setFormData((prevData) => ({
      ...prevData,
      [documentName]: {
        ...prevData[documentName],
        workflow: checked,
      },
    }));
  };

  return (
    <div>
      <section className="bg-gray-50 overflow-hidden min-h-screen w-full">
        <Setup>
          <article className=" bg-white  w-full h-max shadow-md rounded-sm border items-center">
            <div className="p-4 border-b-[.5px] flex items-center justify-between gap-3 w-full border-gray-300">
              <div className="flex gap-3 ">
                <div className="mt-1">
                  <FolderOutlinedIcon />
                </div>
                <div>
                  <h1 className="!text-lg">Letter Setup</h1>
                  <h1 className="text-xs">
                    Here you can manage different types of letters for your
                    organisation
                  </h1>
                </div>
              </div>
            </div>

            <div className="mt-2 p-1 w-[840px]">
              <div className="flex items-center justify-center">
                <h2 className="text-sm text-gray-400 w-[300px]">
                  Manager Workflow
                </h2>
              </div>
            </div>

            {Object.entries(formData).map(([documentName, values]) => (
              <div key={documentName} className="p-4">
                <div className="flex justify-start items-center mb-2">
                  <h2 className="text-lg w-[300px]">
                    {documentName.replace(/([a-z])([A-Z])/g, "$1 $2")}
                  </h2>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`${documentName}-managerWorkflow`}
                      checked={values.workflow}
                      onChange={(e) =>
                        handleChange(documentName, e.target.checked)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="p-4">
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </article>
        </Setup>
      </section>
    </div>
  );
};

export default LetterSetup;
