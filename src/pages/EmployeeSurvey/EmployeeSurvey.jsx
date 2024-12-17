import { IconButton, Button } from "@mui/material";
import React from "react";
import { West } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import OpenSurveyList from "./components/OpenSurveyList";
import CloseSurveyList from "./components/CloseSurveyList";
import SaveAsDraft from "./components/SaveAsDraft";
import UserProfile from "../../hooks/UserData/useUser";
import SaveSurveyList from "./components/SaveSurveyList";

const EmployeeSurvey = () => {
    // Hooks
    const { getCurrentUser, useGetCurrentRole } = UserProfile();
    const role = useGetCurrentRole();

    console.log("useGetCurrentRole..........", role)
    const navigate = useNavigate();
    const user = getCurrentUser();
    const param = useParams();
    const organisationId = param?.organisationId;
    const employeeId = param?.employeeId;

    console.log("employeeId", employeeId);

    // User Role Check
    const isAdminOrHR = user?.profile.includes('Super-Admin') || user?.profile.includes('HR');

    // Create new survey navigation
    const handleCreateNewSurvey = () => {
        navigate(`/organisation/${organisationId}/create-new-survey`);
    }

    return (
        <div className="bg-gray-50 min-h-screen h-auto">
            <header className="text-xl w-full pt-6 flex flex-col md:flex-row items-start md:items-center gap-2 bg-white shadow-md p-4">
                {/* Back Button */}
                <div className="flex-shrink-0">
                    <IconButton onClick={() => navigate(-1)}>
                        <West className="text-xl" />
                    </IconButton>
                </div>

                {/* Main Header Content */}
                <div className="flex flex-col md:flex-row justify-between w-full md:ml-4">
                    <div className="mb-2 md:mb-0 md:mr-4">
                        <h1 className="text-xl font-bold">Employee Survey</h1>
                        <p className="text-sm text-gray-600">
                            {employeeId === undefined && isAdminOrHR && role !== 'Employee'
                                ? "Here you can create employee survey"
                                : "Here you can fill employee survey"}
                        </p>
                    </div>
                </div>
            </header>
            <section className="xs:px-8 xs:py-2">
                {employeeId === undefined && isAdminOrHR && role !== 'Employee' && (
                    <div className="py-4 border-b-[.5px] flex justify-between gap-3 w-full border-gray-300">
                        <div className="flex justify-end w-full">
                            <Button
                                className="!font-semibold !bg-sky-500 flex gap-2"
                                variant="contained"
                                onClick={handleCreateNewSurvey}
                                sx={{ textTransform: "none" }}
                            >
                                Create New Survey
                            </Button>
                        </div>
                    </div>
                )}
                <div className="px-4 py-2 bg-white w-full h-max shadow-md rounded-2m border my-8">
                    <OpenSurveyList />
                </div>
                {employeeId === undefined && isAdminOrHR && role !== 'Employee' && (
                    <>
                        <div className="px-4 py-2 bg-white w-full h-max shadow-md rounded-2m border my-8">
                            <SaveSurveyList />
                        </div>
                        <div className="px-4 py-2 bg-white w-full h-max shadow-md rounded-2m border my-8">
                            <CloseSurveyList />
                        </div>
                        <div className="px-4 py-2 bg-white w-full h-max shadow-md rounded-2m border my-8">
                            <SaveAsDraft />
                        </div>
                    </>
                )}
            </section>
        </div>
    );
};

export default EmployeeSurvey;
