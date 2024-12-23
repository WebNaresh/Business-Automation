import {
  Dashboard,
  EventAvailable,
  EventBusy,
  FilterAlt,
  FilterAltOff,
  Groups,
  LocationOn,
  NearMe,
  SupervisorAccount,
} from "@mui/icons-material";
import { Button, IconButton, Popover } from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect } from "react";
import { useQueryClient } from "react-query";
import { useLocation, useParams } from "react-router-dom";
import Select from "react-select";
import TempHeader from "../../components/header/TempHeader";
import useDashGlobal from "../../hooks/Dashboard/useDashGlobal";
import useDashboardFilter from "../../hooks/Dashboard/useDashboardFilter";
import useEmployee from "../../hooks/Dashboard/useEmployee";
import useSubscriptionGet from "../../hooks/QueryHook/Subscription/hook";
import LineGraph from "./Components/Bar/LineGraph";
import AttendenceBar from "./Components/Bar/SuperAdmin/AttendenceBar";
import SuperAdminCard from "./Components/Card/superadmin/SuperAdminCard";
import SkeletonFilterSection from "./Components/Skeletons/SkeletonFilterSection";
import useRemoteCount from "./hooks/useRemoteCount";

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: "#d1d5db",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#4f46e5",
    },
    "&:focus": {
      borderColor: "#4f46e5", // Blue border on focus
    },
    backgroundColor: "#ffffff", // White background
    borderRadius: "8px",
    padding: "2px",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#4f46e5" : "#ffffff", // Blue for selected option
    color: state.isSelected ? "#ffffff" : "#000000", // White text for selected option
    "&:hover": {
      backgroundColor: "#f3f4f6",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9ca3af",
  }),
};

const SuperAdmin = () => {
  const { organisationId } = useParams();
  const { remoteEmployeeCount } = useRemoteCount(organisationId);

  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const cardSize = "w-66 h-30"; // Adjust card size here

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const queryClient = useQueryClient();
  // custom hooks
  const { employee, employeeLoading } = useEmployee(organisationId);
  const { data: mainD } = useSubscriptionGet({ organisationId });

  const {
    Managers,
    managerLoading,
    location: loc,
    oraganizationLoading,
    absentEmployee,
    locationOptions,
    managerOptions,
    Departmentoptions,
    // customStyles,
    data,
    locations,
    setLocations,
    manager,
    setManager,
    department,
    setDepartment,
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
    // OLD
    // <section className="bg-gray-50 min-h-screen w-full">
    //   <header className="text-lg w-full pt-4 bg-white border-b p-4">
    //     <Link to={"/organizationList"}>
    //       <West className="mx-4 !text-xl" />
    //     </Link>
    //     Organisation Dashboard
    //   </header>

    //TEMP UPDATE
    <section className="p-2 mt-10 shadow-lg ">
      <TempHeader
        heading={"Organization Dashboard"}
        oneLineInfo={
          "Get insights of your organization's data with interactive charts and reports"
        }
      />
      <br />

      <div className="md:px-8 px-2 w-full mt-2">
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 mt-6 w-full gap-2 md:gap-5">
          {/* <div className="grid xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-4"> */}
          <SuperAdminCard
            icon={Groups}
            color={"!bg-blue-500"}
            data={employee?.totalEmployees}
            isLoading={employeeLoading}
            title={"Overall Employees"}
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
            title={"Present Today"}
            data-aos="fade-up"
            cardSize={cardSize}
          />
          <SuperAdminCard
            title={"Today's Leave"}
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
            title={"People's Manager"}
            data-aos="fade-up"
            cardSize={cardSize}
          />
          <SuperAdminCard
            color={"!bg-orange-500"}
            isLoading={false}
            icon={LocationOn}
            data={loc?.locationCount}
            title={"Locations"}
            data-aos="fade-up"
            cardSize={cardSize}
          />
          {mainD?.organisation?.packageInfo === "Intermediate Plan" && (
            <SuperAdminCard
              color={"!bg-indigo-500"}
              isLoading={false}
              icon={NearMe}
              data={remoteEmployeeCount}
              title={"Remote Employees"}
              data-aos="fade-up"
              cardSize={cardSize}
            />
          )}
        </div>

        {oraganizationLoading ? (
          <SkeletonFilterSection />
        ) : (
          <div className="mt-4 w-full bg-white border rounded-md">
            <div className="items-center justify-between flex gap-2 py-2 px-4">
              <div className="flex items-center gap-2">
                <Dashboard className="!text-[#67748E]" />
                {/* <h1 className="text-md font-bold text-[#67748E]">Dashboard</h1> */}
              </div>
              <div className="w-[70%] md:hidden flex gap-6 items-center justify-end">
                <div>
                  <IconButton onClick={handleClick}>
                    <FilterAlt />
                  </IconButton>
                </div>
              </div>

              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <div className="w-full flex-col h-auto pr-10 p-4 flex gap-4">
                  <Button
                    onClick={() => {
                      setLocations("");
                      setDepartment("");
                      setManager("");
                      queryClient.invalidateQueries("organization-attenedence");
                      queryClient.invalidateQueries("Org-Salary-overview");
                    }}
                  >
                    <FilterAltOff className="!text-[1.4em] text-white" />
                    Remove Filter
                  </Button>

                  <Select
                    placeholder={"Departments"}
                    onChange={(dept) => {
                      setDepartment(dept.value);
                      setLocations("");
                      setManager("");
                      queryClient.invalidateQueries("department-attenedence");
                    }}
                    styles={customSelectStyles} // Updated custom styles
                    value={
                      department
                        ? Departmentoptions?.find(
                            (option) => option.value === department
                          )
                        : ""
                    }
                    options={Departmentoptions}
                  />

                  <Select
                    placeholder={"Manager"}
                    components={{ IndicatorSeparator: () => null }}
                    onChange={(Managers) => {
                      setManager(Managers.value);
                      setDepartment("");
                      setLocations("");
                      queryClient.invalidateQueries("manager-attenedence");
                    }}
                    value={
                      manager
                        ? managerOptions.find((item) => item.name === manager)
                        : ""
                    }
                    styles={customSelectStyles} // Updated custom styles
                    options={managerOptions}
                  />

                  <Select
                    placeholder={"Location"}
                    components={{ IndicatorSeparator: () => null }}
                    onChange={(loc) => {
                      setLocations(loc.value);
                      setDepartment("");
                      setManager("");
                      queryClient.invalidateQueries("location-attenedence");
                    }}
                    value={
                      locations
                        ? locationOptions.find(
                            (item) => item.name === locations
                          )
                        : ""
                    }
                    styles={customSelectStyles} // Updated custom styles
                    options={locationOptions}
                  />
                </div>
              </Popover>

              {location.pathname?.includes("/super-admin") && (
                <div className="w-[80%] hidden md:flex gap-6 items-center justify-end">
                  <Button
                    onClick={() => {
                      setLocations("");
                      setDepartment("");
                      setManager("");
                      queryClient.invalidateQueries("organization-attenedence");
                    }}
                    variant="contained"
                  >
                    <FilterAltOff className="!text-[1.4em] text-white" />
                    Remove Filter One
                  </Button>

                  <Select
                    placeholder={"Departments"}
                    onChange={(dept) => {
                      setDepartment(dept.value);
                      setLocations("");
                      setManager("");
                      queryClient.invalidateQueries("department-attenedence");
                    }}
                    styles={customSelectStyles} // Updated custom styles
                    value={
                      department
                        ? Departmentoptions?.find(
                            (option) => option.value === department
                          )
                        : ""
                    }
                    options={Departmentoptions}
                  />

                  <Select
                    placeholder={"Manager"}
                    components={{ IndicatorSeparator: () => null }}
                    onChange={(Managers) => {
                      setManager(Managers.value);
                      setDepartment("");
                      setLocations("");
                      queryClient.invalidateQueries("manager-attenedence");
                    }}
                    value={
                      manager
                        ? managerOptions.find((item) => item.name === manager)
                        : ""
                    }
                    styles={customSelectStyles} // Updated custom styles
                    options={managerOptions}
                  />

                  <Select
                    placeholder={"Location"}
                    components={{ IndicatorSeparator: () => null }}
                    onChange={(loc) => {
                      setLocations(loc.value);
                      setDepartment("");
                      setManager("");
                      queryClient.invalidateQueries("location-attenedence");
                    }}
                    value={
                      locations
                        ? locationOptions.find(
                            (item) => item.name === locations
                          )
                        : ""
                    }
                    styles={customSelectStyles} // Updated custom styles
                    options={locationOptions}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="w-full md:gap-4 md:space-y-0 space-y-3 mt-4 flex md:flex-row flex-col items-center">
          <div className="w-[100%] md:w-[50%]">
            <LineGraph
              salarydata={salaryData}
              selectedyear={selectedSalaryYear}
              setSelectedYear={setSelectedSalaryYear}
            />
          </div>
          <div className="w-[100%] md:w-[50%]">
            <AttendenceBar
              isLoading={oraganizationLoading}
              attendenceData={data}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuperAdmin;
