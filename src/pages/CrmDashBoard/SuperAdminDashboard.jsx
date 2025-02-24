import {
    EventAvailable,
    EventBusy,
    Groups,
    LocationOn,
    NearMe,
    SupervisorAccount,
} from "@mui/icons-material";
import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import TempHeader from "../../components/header/TempHeader";
import useDashGlobal from "../../hooks/Dashboard/useDashGlobal";
import useDashboardFilter from "../../hooks/Dashboard/useDashboardFilter";
import useEmployee from "../../hooks/Dashboard/useEmployee";
import SuperAdminCard from "../DashBoard/Components/Card/superadmin/SuperAdminCard";
import LineGraph from "./Components/LineGraph";
import CrmBar from "./Components/CrmBar";

const SuperAdminDashboard = () => {
    const { organisationId } = useParams();
    const cardSize = "w-66 h-30"; // Adjust card size here
    // custom hooks
    const { employee, employeeLoading } = useEmployee(organisationId);

    const {
        Managers,
        managerLoading,
        location: loc,
        oraganizationLoading,
        absentEmployee,
        data,
        salaryData,
    } = useDashboardFilter(organisationId);
    const { setSelectedSalaryYear, selectedSalaryYear } = useDashGlobal();

    // Initialize AOS
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    return (
        <section className="p-2 mt-10 shadow-lg ">
            <TempHeader
                heading={"CRM Dashboard"}
                oneLineInfo={
                    "Get insights of your customer relationship managemnet's data with interactive charts and reports"
                }
            />
            <br />
            <div className="md:px-8 px-2 w-full mt-2">
                <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 mt-6 w-full gap-2 md:gap-5">
                    <SuperAdminCard
                        icon={Groups}
                        color={"!bg-blue-500"}
                        data={employee?.totalEmployees}
                        isLoading={employeeLoading}
                        title={"Total Customers"}
                        data-aos="fade-up"
                        cardSize={cardSize}
                    />
                    <SuperAdminCard
                        color={"!bg-green-500"}
                        isLoading={employeeLoading}
                        icon={EventAvailable}
                        data={
                            !isNaN(employee?.totalEmployees)
                                ? employee?.totalEmployees - absentEmployee
                                : 0
                        }
                        title={"Active Customers"}
                        data-aos="fade-up"
                        cardSize={cardSize}
                    />
                    <SuperAdminCard
                        title={"Inactive Customers"}
                        icon={EventBusy}
                        color={"!bg-red-500"}
                        data={absentEmployee}
                        isLoading={employeeLoading}
                        data-aos="fade-up"
                        cardSize={cardSize}
                    />
                    <SuperAdminCard
                        color={"!bg-amber-500"}
                        icon={SupervisorAccount}
                        data={Managers?.length}
                        isLoading={managerLoading}
                        title={"Account Managers"}
                        data-aos="fade-up"
                        cardSize={cardSize}
                    />
                    <SuperAdminCard
                        color={"!bg-orange-500"}
                        isLoading={false}
                        icon={LocationOn}
                        data={loc?.locationCount}
                        title={"Regions Covered"}
                        data-aos="fade-up"
                        cardSize={cardSize}
                    />
                    <SuperAdminCard
                        color={"!bg-indigo-500"}
                        isLoading={false}
                        icon={NearMe}
                        // data={remoteEmployeeCount}
                        title={"Conversion Rate"}
                        data-aos="fade-up"
                        cardSize={cardSize}
                    />

                </div>
                <div className="w-full md:gap-4 md:space-y-0 space-y-3 mt-4 flex md:flex-row flex-col items-center">
                    <div className="w-[100%] md:w-[50%]">
                        <LineGraph
                            salarydata={salaryData}
                            selectedyear={selectedSalaryYear}
                            setSelectedYear={setSelectedSalaryYear}
                        />
                    </div>
                    <div className="w-[100%] md:w-[50%]">
                        <CrmBar
                            isLoading={oraganizationLoading}
                            attendenceData={data}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SuperAdminDashboard;
