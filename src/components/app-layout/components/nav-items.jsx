import {
  Business,
  Category,
  Dashboard,
  Description,
  Fingerprint,
  Groups,
  ListAlt,
  LocationOn,
  ModelTrainingOutlined,
  MonetizationOn,
  NotificationsActive,
  PanToolAlt,
  Payment,
  PeopleAlt,
  PersonAdd,
  PersonRemove,
  TrendingUp,
} from "@mui/icons-material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ArticleIcon from "@mui/icons-material/Article";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CallMissedIcon from "@mui/icons-material/CallMissed";
import ChatIcon from "@mui/icons-material/Chat";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import PunchClockIcon from "@mui/icons-material/PunchClock";
import ReceiptIcon from "@mui/icons-material/Receipt";
import WorkIcon from "@mui/icons-material/Work";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { SiMicrosoftexcel } from "react-icons/si";
import { useQueryClient } from "react-query";
import { useLocation } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
import useGetUser from "../../../hooks/Token/useUser";
import UserProfile from "../../../hooks/UserData/useUser";
import useGetCommunicationPermission from "../../../pages/EmployeeSurvey/useContext/Permission";
import useOrgGeo from "../../../pages/Geo-Fence/useOrgGeo";
import NavAccordion from "./NavAccordian";

const TestNavItems = ({ toggleDrawer }) => {
  // to define the route and pass the dynamic organization id
  const [orgId, setOrgId] = useState(null);
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];
  const location = useLocation();
  const [decodedToken, setDecodedToken] = useState("");
  const [emp, setEmp] = useState();
  const { decodedToken: decoded } = useGetUser();
  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const user = getCurrentUser();
  const empId = user?._id;
  const role = useGetCurrentRole();
  const queryClient = useQueryClient();

  //_--------------------geofencing---------------
  //selected employee list for geofencing
  const { data: geofencingData } = useOrgGeo(orgId);

  //match currect user and selcted employee in list
  const isUserMatchInEmployeeList = geofencingData?.area?.some((area) =>
    area.employee.includes(empId)
  );

  // Update organization ID when URL changes
  useEffect(() => {
    if ((role === "Super-Admin", "Delegate-Super-Admin")) {
      getOrganizationIdFromPathname(location.pathname);
    } else {
      setOrgId(user?.organizationId);
    }

    // eslint-disable-next-line
  }, [location.pathname]);

  useEffect(() => {
    (async () => {
      if (user?._id) {
        const resp = await axios.get(
          `${process.env.REACT_APP_API}/route/employee/get/profile/${user?._id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setEmp(resp?.data?.employee?.organizationId);
      }
    })();
    // eslint-disable-next-line
  }, []);
  const check = emp?.packageInfo === "Intermediate Plan";

  // Function to extract organization ID from pathname
  const getOrganizationIdFromPathname = (pathname) => {
    const parts = pathname.split("/");
    const orgIndex = parts.indexOf("organisation");
    let orgId;

    if (orgIndex !== -1 && parts.length > orgIndex + 1) {
      if (parts[orgIndex + 1] === null || undefined) {
        orgId = decoded?.user?.organizationId;
      } else {
        orgId = parts[orgIndex + 1];
      }
    } else {
      orgId = decoded?.user?.organizationId;
    }
    setOrgId(orgId);
  };

  const { data } = useSubscriptionGet({
    organisationId: orgId,
  });

  //git communication employee survey permission
  const organisationId = data?.organisation?._id;
  const { data: survey } = useGetCommunicationPermission(organisationId);

  // Update organization ID when URL changes
  useEffect(() => {
    if ((role === "Super-Admin", "Delegate-Super-Admin")) {
      getOrganizationIdFromPathname(location.pathname);
    } else {
      setOrgId(user?.organizationId);
    }

    // eslint-disable-next-line
  }, [location.pathname]);

  console.log(`🚀 ~ file: nav-items.jsx:136 ~ role:`, role === "Super-Admin");
  const [isVisible, setisVisible] = useState(true);

  useEffect(() => {
    setisVisible(location.pathname.includes("/organisation"));
  }, [location.pathname, organisationId]);

  useEffect(() => {
    queryClient.invalidateQueries("survey-permission");
  }, [queryClient]);

  let navItems = useMemo(
    () => {
      if (data?.organisation?.packageInfo === "Essential Plan") {
        return {
          Dashboard: {
            open: false,
            icon: <Category className=" !text-[1.2em] text-[#67748E]" />,
            isVisible: true,
            routes: [
              {
                key: "dashboard",
                isVisible: true,
                link:
                  role === "Manager"
                    ? `/organisation/${orgId}/dashboard/manager-dashboard`
                    : role === "HR"
                    ? `/organisation/${orgId}/dashboard/HR-dashboard`
                    : role === "Employee"
                    ? `/organisation/${orgId}/dashboard/employee-dashboard`
                    : "/organizationList",
                icon: <Dashboard className=" !text-[1.2em] text-[#67748E]" />,
                text: "Dashboard",
              },
            ],
            isClickable: true,
            link:
              role === "Manager"
                ? `/organisation/${orgId}/dashboard/manager-dashboard`
                : role === "HR"
                ? `/organisation/${orgId}/dashboard/HR-dashboard`
                : role === "Employee"
                ? `/organisation/${orgId}/dashboard/employee-dashboard`
                : role === "Super-Admin"
                ? `/organisation/${orgId}/dashboard/super-admin`
                : "/organizationList",
          },

          Attendence: {
            open: true,
            icon: <Category className=" !text-[1.2em] text-[#67748E]" />,
            isVisible: true,
            routes: [
              {
                key: "attendance",
                isVisible: true,
                link: `/organisation/${orgId}/leave`,
                icon: (
                  <AccessTimeOutlinedIcon className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Attendance & Leave Management",
              },
              {
                key: "view emp attendance",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Manager",
                ].includes(role)
                  ? true
                  : false,
                link: `/organisation/${orgId}/ManagementCalender`,
                icon: (
                  <AccessTimeOutlinedIcon className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Employee Attendance",
              },
            ],
          },
          Department: {
            open: false,
            isVisible:
              window.location.pathname.includes("organisation") &&
              [
                "Super-Admin",
                "Delegate-Super-Admin",
                "Delegate-Super-Admin",
                "HR",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
              ].includes(role),
            // : false
            icon: <Business className=" !text-[1.2em] text-[#67748E]" />,
            routes: [
              {
                key: "addDepartment",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Department-Head",
                  "Delegate-Department-Head",
                  "Department-Admin",
                  "Delegate-Department-Admin",
                ].includes(role),
                link: `/organisation/${orgId}/add-department`,
                icon: (
                  <AddCircleOutlineOutlinedIcon className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Add Department",
              },

              {
                key: "deptDeletion",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Department-Head",
                  "Delegate-Department-Head",
                  "Department-Admin",
                  "Delegate-Department-Admin",
                ].includes(role),
                link: `/organisation/${orgId}/dept-deletion`,
                icon: (
                  <DeleteForeverOutlinedIcon className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Delete Department",
              },
              {
                key: "departmentList",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Department-Head",
                  "Delegate-Department-Head",
                  "Department-Admin",
                  "Delegate-Department-Admin",
                ].includes(role),
                link: `/organisation/${orgId}/department-list`,
                icon: (
                  <ListAltOutlinedIcon className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Manage Department",
              },
            ],
          },
          Employee: {
            open: false,
            icon: <PeopleAlt className=" !text-[1.2em] text-[#67748E]" />,
            isVisible:
              window.location.pathname?.includes("organisation") &&
              [
                "Super-Admin",
                "Delegate-Super-Admin",
                "Delegate-Super-Admin",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
                "Accountant",
                "Delegate-Accountant",
                "HR",
                "Manager",
                "Employee",
              ]?.includes(role),
            routes: [
              {
                key: "onboarding",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Delegate-Super-Admin",
                ].includes(role),
                link: `/organisation/${orgId}/employee-onboarding`,
                icon: <PersonAdd className=" !text-[1.2em] text-[#67748E]" />,
                text: "Onboarding",
              },
              {
                key: "offboarding",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Delegate-Super-Admin",
                ].includes(role),
                link: `/organisation/${orgId}/employee-offboarding`,
                icon: (
                  <PersonRemove className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Offboarding",
              },
              {
                key: "employeeList",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "Delegate-Super-Admin",
                  "Department-Head",
                  "Delegate-Department-Head",
                  "Department-Admin",
                  "Delegate-Department-Admin",
                  "Accountant",
                  "Delegate-Accountant",
                  "HR",
                  "Manager",
                  "Employee",
                ].includes(role),
                link: `/organisation/${orgId}/employee-list`,
                icon: <Groups className=" !text-[1.2em] text-[#67748E]" />,
                text: "Employee List",
              },
            ],
          },
          Payroll: {
            open: false,
            isVisible: true,
            icon: <Payment className=" !text-[1.2em] text-[#67748E]" />,
            routes: [
              {
                key: "payslip",
                isVisible: true,
                link: `/organisation/${orgId}/view-payslip`,
                icon: <ListAlt className=" !text-[1.2em] text-[#67748E]" />,
                text: "Pay Slip",
              },

              {
                key: "createsalary",
                isVisible:
                  isVisible &&
                  [
                    "Super-Admin",
                    "Delegate-Super-Admin",
                    "HR",
                    "Accountant",
                    "Delegate-Super-Admin",
                  ].includes(role),
                link: `/organisation/${orgId}/salary-management`,
                icon: (
                  <AccountBalanceWalletOutlinedIcon className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Salary Management",
              },
            ],
          },

          Organisation: {
            open: false,
            isVisible: ["Super-Admin", "Delegate-Super-Admin"].includes(role),
            icon: <MonetizationOn className=" !text-[1.2em] text-[#67748E]" />,
            routes: [
              {
                key: "addOrganisation",
                isVisible: ["Super-Admin", "Delegate-Super-Admin"].includes(
                  role
                ),
                link: "/add-organisation",
                icon: (
                  <BusinessOutlinedIcon className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Add Organisation",
              },

              {
                key: "organisationList",
                isVisible: ["Super-Admin", "Delegate-Super-Admin"].includes(
                  role
                ),
                link: "/organizationList",
                icon: (
                  <AccountTreeOutlinedIcon className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Organisation List",
              },
              {
                key: "organisationList",
                isVisible: ["Super-Admin", "Delegate-Super-Admin"].includes(
                  role
                ),
                link: `/organisation/${orgId}/organisation-hierarchy`,
                icon: (
                  <AccountTreeOutlinedIcon className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Organisation Hierarchy",
              },
            ],
          },
        };
      } else {
        return {
          Dashboard: {
            open: false,
            icon: <Category className=" !text-[1.2em] text-[#67748E]" />,
            isVisible: true,
            routes: [
              {
                key: "dashboard",
                isVisible: true,
                link:
                  role === "Manager"
                    ? `/organisation/${orgId}/dashboard/manager-dashboard`
                    : role === "HR"
                    ? `/organisation/${orgId}/dashboard/HR-dashboard`
                    : role === "Employee"
                    ? `/organisation/${orgId}/dashboard/employee-dashboard`
                    : "/organizationList",
                icon: <Dashboard className=" !text-[1.2em] text-[#67748E]" />,
                text: "Dashboard",
              },
            ],
            isClickable: true,
            link:
              role === "Manager"
                ? `/organisation/${orgId}/dashboard/manager-dashboard`
                : role === "HR"
                ? `/organisation/${orgId}/dashboard/HR-dashboard`
                : role === "Employee"
                ? `/organisation/${orgId}/dashboard/employee-dashboard`
                : role === "Super-Admin"
                ? `/organisation/${orgId}/dashboard/super-admin`
                : "/organizationList",
          },

          Attendence: {
            open: true,
            icon: <Category className=" !text-[1.2em] text-[#67748E]" />,
            isVisible: true,
            routes: [
              {
                key: "attendance",
                isVisible: true,
                link: `/organisation/${orgId}/leave`,
                icon: (
                  <AccessTimeOutlinedIcon className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Attendance & Leave Management",
              },
              {
                key: "view emp attendance",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Manager",
                ].includes(role),
                link: `/organisation/${orgId}/ManagementCalender`,
                icon: (
                  <AccessTimeOutlinedIcon className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Employee Attendance",
              },
            ],
          },
          Report: {
            open: false,
            isVisible:
              data?.organisation?.packageInfo === "Intermediate Plan" &&
              window.location.pathname?.includes("organisation") &&
              [
                "Super-Admin",
                "Delegate-Super-Admin",
                "Accountant",
                "HR",
              ]?.includes(role),
            icon: (
              <NotificationsActive className=" !text-[1.2em] text-[#67748E]" />
            ),
            routes: [
              {
                key: "reportingMIS",
                isVisible: true,
                link: `/organisation/${orgId}/mis-report`,
                icon: (
                  <SiMicrosoftexcel className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Reporting MIS",
              },
            ],
          },
          Notification: {
            open: false,
            isVisible: true,
            icon: (
              <NotificationsActive className=" !text-[1.2em] text-[#67748E]" />
            ),
            routes: [],
            isClickable: true,
            link: `/organisation/${orgId}/notification`,
          },
          Department: {
            open: false,
            isVisible:
              window.location.pathname.includes("organisation") &&
              [
                "Super-Admin",
                "Delegate-Super-Admin",
                "Delegate-Super-Admin",
                "HR",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
              ].includes(role),
            // : false
            icon: <Business className=" !text-[1.2em] text-[#67748E]" />,
            routes: [
              {
                key: "addDepartment",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Department-Head",
                  "Delegate-Department-Head",
                  "Department-Admin",
                  "Delegate-Department-Admin",
                ].includes(role),
                link: `/organisation/${orgId}/add-department`,
                icon: (
                  <AddCircleOutlineOutlinedIcon className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Add Department",
              },

              {
                key: "deptDeletion",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Department-Head",
                  "Delegate-Department-Head",
                  "Department-Admin",
                  "Delegate-Department-Admin",
                ].includes(role),
                link: `/organisation/${orgId}/dept-deletion`,
                icon: (
                  <DeleteForeverOutlinedIcon className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Delete Department",
              },
              {
                key: "departmentList",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Department-Head",
                  "Delegate-Department-Head",
                  "Department-Admin",
                  "Delegate-Department-Admin",
                ].includes(role),
                link: `/organisation/${orgId}/department-list`,
                icon: (
                  <ListAltOutlinedIcon className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Manage Department",
              },
            ],
          },
          Employee: {
            open: false,
            icon: <PeopleAlt className=" !text-[1.2em] text-[#67748E]" />,
            isVisible:
              window.location.pathname?.includes("organisation") &&
              [
                "Super-Admin",
                "Delegate-Super-Admin",
                "Delegate-Super-Admin",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
                "Accountant",
                "Delegate-Accountant",
                "HR",
                "Manager",
                "Employee",
              ]?.includes(role),
            routes: [
              {
                key: "onboarding",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Delegate-Super-Admin",
                ].includes(role),
                link: `/organisation/${orgId}/employee-onboarding`,
                icon: <PersonAdd className=" !text-[1.2em] text-[#67748E]" />,
                text: "Onboarding",
              },
              {
                key: "offboarding",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Delegate-Super-Admin",
                ].includes(role),
                link: `/organisation/${orgId}/employee-offboarding`,
                icon: (
                  <PersonRemove className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Offboarding",
              },
              {
                key: "employeeList",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "Delegate-Super-Admin",
                  "Department-Head",
                  "Delegate-Department-Head",
                  "Department-Admin",
                  "Delegate-Department-Admin",
                  "Accountant",
                  "Delegate-Accountant",
                  "HR",
                  "Manager",
                  "Employee",
                ].includes(role),
                link: `/organisation/${orgId}/employee-list`,
                icon: <Groups className=" !text-[1.2em] text-[#67748E]" />,
                text: "Employee List",
              },
            ],
          },
          Performance: {
            open: false,
            isVisible:
              data?.organisation?.packageInfo === "Intermediate Plan" &&
              window.location.pathname?.includes("organisation") &&
              [
                "Super-Admin",
                "Delegate-Super-Admin",
                "Delegate-Super-Admin",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
                "Accountant",
                "Delegate-Accountant",
                "HR",
                "Manager",
                "Employee",
              ]?.includes(role),
            icon: <Payment className=" !text-[1.2em] text-[#67748E]" />,
            routes: [
              {
                key: "performance",
                isVisible: true,
                link: `/organisation/${orgId}/performance`,
                icon: <ListAlt className=" !text-[1.2em] text-[#67748E]" />,
                text: "Performance",
              },
            ],
          },
          Payroll: {
            open: false,
            isVisible: true,
            icon: <Payment className=" !text-[1.2em] text-[#67748E]" />,
            routes: [
              {
                key: "payslip",
                isVisible: true,
                link: `/organisation/${orgId}/view-payslip`,
                icon: <ListAlt className=" !text-[1.2em] text-[#67748E]" />,
                text: "Pay Slip",
              },
              {
                key: "IncomeTax",
                isVisible: true,
                link: `/organisation/${orgId}/income-tax-section`,
                icon: <TrendingUp className=" !text-[1.2em] text-[#67748E]" />,
                text: "Income Tax",
              },
              {
                key: "Employee TDS Details",
                isVisible:
                  window.location.pathname?.includes("organisation") &&
                  [
                    "Super-Admin",
                    "Delegate-Super-Admin",
                    "Accountant",
                    "Delegate-Accountant",
                    "HR",
                  ]?.includes(role),
                link: `/organisation/${orgId}/employee/income-tax-section`,
                icon: <TrendingUp className=" !text-[1.2em] text-[#67748E]" />,
                text: "Employee TDS Details",
              },
              {
                key: "form-16",
                isVisible: true,
                link: `/organisation/${orgId}/form-16`,
                icon: <Description className=" !text-[1.2em] text-[#67748E]" />,
                text: "Form-16",
              },

              {
                key: "createsalary",
                isVisible:
                  isVisible &&
                  [
                    "Super-Admin",
                    "Delegate-Super-Admin",
                    "HR",
                    "Accountant",
                    "Delegate-Super-Admin",
                  ].includes(role),
                link: `/organisation/${orgId}/salary-management`,
                icon: (
                  <AccountBalanceWalletOutlinedIcon className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Salary Management",
              },
            ],
          },

          "Machine Punching": {
            open: false,
            icon: <PeopleAlt className=" !text-[1.2em] text-[#67748E]" />,
            isVisible:
              window.location.pathname?.includes("organisation") &&
              [
                "Super-Admin",
                "Delegate-Super-Admin",
                "HR",
                "Employee",
              ]?.includes(role),
            routes: [
              {
                key: "punchingMachine",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Delegate-Super Admin",
                ].includes(role),
                link: `/organisation/${orgId}/emo-info-punch-status`,
                icon: (
                  <PunchClockIcon className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Punch Sync ",
              },

              {
                key: "viewAttendance",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Delegate-Super Admin",
                ].includes(role),
                link: `/organisation/${orgId}/view-attendance-biomatric`,
                icon: (
                  <AccessTimeIcon className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Time Track",
              },
              {
                key: "viewCalculate",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Delegate-Super Admin",
                ].includes(role),
                link: `/organisation/${orgId}/view-calculate-data`,
                icon: (
                  <CalendarMonthIcon className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Calendar View",
              },
              {
                key: "misspunchInOutRecord",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Delegate-Super Admin",
                ].includes(role),
                link: `/organisation/${orgId}/missed-punch-in-out`,
                icon: (
                  <CallMissedIcon className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Missed Punch ",
              },

              {
                key: "missjustify",
                isVisible: ["Employee"].includes(role),
                link: `/organisation/${orgId}/missed-justify`,
                icon: <ReceiptIcon className=" !text-[1.2em] text-[#67748E]" />,
                text: "Missed Justify",
              },
            ],
          },

          Recruitment: {
            open: false,
            icon: <PeopleAlt className=" !text-[1.2em] text-[#67748E]" />,
            isVisible:
              [
                "Super-Admin",
                "Delegate-Super-Admin",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
                "Accountant",
                "Delegate-Accountant",
                "HR",
                "Manager",
                "Employee",
              ].includes(role) &&
              data?.organisation?.packageInfo === "Enterprise Plan",
            routes: [
              {
                key: "createjobposition",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Department-Head",
                  "Delegate-Department-Head",
                  "Manager",
                ].includes(role),
                link: `organisation/${orgId}/create-job-position`,
                icon: <WorkIcon className=" !text-[1.2em] text-[#67748E]" />,
                text: "Create Job Position",
              },
              {
                key: "viewjobposition",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "HR",
                  "Department-Head",
                  "Delegate-Department-Head",
                  "Manager",
                ].includes(role),
                link: `organisation/${orgId}/view-job-position`,
                icon: (
                  <PersonRemove className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "View Job Position",
              },
              {
                key: "openjobposition",
                isVisible: [
                  "Super-Admin",
                  "Delegate-Super-Admin",
                  "Department-Head",
                  "Delegate-Department-Head",
                  "Department-Admin",
                  "Delegate-Department-Admin",
                  "Accountant",
                  "Delegate-Accountant",
                  "HR",
                  "Manager",
                  "Employee",
                ].includes(role),
                link: `organisation/${orgId}/open-job-position`,
                icon: (
                  <PersonRemove className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Open Job Role",
              },
            ],
          },
          Communication: {
            open: false,
            isVisible:
              data?.organisation?.packageInfo === "Intermediate Plan" &&
              survey?.surveyPermission,
            icon: <Business className=" !text-[1.2em] text-[#67748E]" />,
            routes: [
              {
                key: "createCommunication",
                isVisible:
                  data?.organisation?.packageInfo === "Intermediate Plan" &&
                  survey?.surveyPermission,
                link: `/organisation/${orgId}/create-communication`,
                icon: <ChatIcon className=" !text-[1.2em] text-[#67748E]" />,
                text: "Broadcast",
              },
              {
                key: "EmployeeSurvey",
                isVisible:
                  data?.organisation?.packageInfo === "Intermediate Plan" &&
                  survey?.surveyPermission,
                link:
                  user?.profile.includes("Super-Admin") ||
                  user?.profile.includes("HR")
                    ? `/organisation/${orgId}/employee-survey`
                    : `/organisation/${orgId}/employee-survey/${empId}`,
                icon: (
                  <AssignmentIcon className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Employee Survey",
              },
            ],
          },
          Branches: {
            open: false,
            isVisible: ["Super-Admin", "Delegate-Super-Admin"].includes(role),
            icon: <MonetizationOn className=" !text-[1.2em] text-[#67748E]" />,
            isClickable: true,
            routes: [],
            link: "/organizationList",
          },
          "Remote Punch": {
            open: false,
            isVisible:
              ((["Employee"].includes(role) && !isUserMatchInEmployeeList) ||
                ([
                  "Super-Admin",
                  "Manager",
                  "Delegate-Super-Admin",
                  "HR",
                ].includes(role) &&
                  data?.organisation?.packageInfo === "Enterprise Plan")) &&
              (data?.organisation?.packageInfo === "Intermediate Plan" ||
                data?.organisation?.packageInfo === "Enterprise Plan"),
            icon: <MonetizationOn className=" !text-[1.2em] text-[#67748E]" />,
            routes: [
              {
                key: "addRemoteVisitTask",
                isVisible:
                  [
                    "Super-Admin",
                    "Manager",
                    "HR",
                    "Delegate-Super-Admin",
                  ].includes(role) &&
                  data?.organisation?.packageInfo === "Enterprise Plan" &&
                  data?.organisation?.packages.includes("Remote Task"),
                link: `/organisation/${orgId}/remote-punching-tasks`,
                icon: (
                  <AssignmentIcon className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Remote Visit tasks",
              },
              {
                key: "addPunch",
                isVisible:
                  ["Employee"].includes(role) && !isUserMatchInEmployeeList,
                link: `/organisation/${orgId}/employee-remote-punching`,
                icon: <Fingerprint className=" !text-[1.2em] text-[#67748E]" />,
                text: "Remote Punch-in-out",
              },
              {
                key: "missPunch",
                isVisible:
                  ["Employee"].includes(role) && !isUserMatchInEmployeeList,
                link: `/organisation/${orgId}/remotePunching`,
                icon: <PanToolAlt className=" !text-[1.2em] text-[#67748E]" />,
                text: "Apply Miss For Punch",
              },
            ],
          },
          "Geo Fencing": {
            open: false,
            isVisible:
              (["Employee"].includes(role) && isUserMatchInEmployeeList) ||
              ["Manager", "Super-Admin", "Delegate-Super-Admin"].includes(role),
            icon: <MonetizationOn className=" !text-[1.2em] text-[#67748E]" />,
            routes: [
              {
                key: "geoFencing",
                isVisible:
                  ["Employee"].includes(role) && isUserMatchInEmployeeList,
                link: `/organisation/${orgId}/geo-fencing`,
                icon: <LocationOn className="!text-[1.2em] text-[#67748E]" />,
                text: "Geo Fencing",
              },
              {
                key: "geoFencing",
                isVisible: [
                  "Super-Admin",
                  "Manager",
                  "Delegate-Super-Admin",
                ].includes(role),
                link: `/organisation/${orgId}/remotePunching/geo-fencing`,
                icon: <LocationOn className=" !text-[1.2em] text-[#67748E]" />,
                text: "Add Geo Fencing",
              },
            ],
          },
          "Catering and food": {
            open: false,
            isVisible: data?.organisation?.packageInfo === "Intermediate Plan",
            icon: <MonetizationOn className=" !text-[1.2em] text-[#67748E]" />,
            routes: [
              {
                key: "onboarding",
                isVisible: ["Super-Admin", "HR"].includes(role),

                link: `/organisation/${orgId}/catering/onboarding`,
                icon: <ArticleIcon className=" !text-[1.2em] text-[#67748E]" />,
                text: "New Vendor Onboard",
              },
            ],
          },

          Records: {
            open: false,
            isVisible: data?.organisation?.packageInfo === "Intermediate Plan",
            icon: <MonetizationOn className=" !text-[1.2em] text-[#67748E]" />,
            routes: [
              {
                key: "empDocs",
                isVisible: true,
                link: `/organisation/${orgId}/records`,
                icon: <ArticleIcon className=" !text-[1.2em] text-[#67748E]" />,
                text: "My Records",
              },
            ],
          },

          Training: {
            open: false,
            isVisible: data?.organisation?.packageInfo === "Intermediate Plan",
            icon: <MonetizationOn className=" !text-[1.2em] text-[#67748E]" />,
            routes: [
              {
                key: "myTraining",
                isVisible: ["Employee", "Manager", "Accountant"].includes(role),
                link: "/my-training",
                icon: <ArticleIcon className=" !text-[1.2em] text-[#67748E]" />,
                text: "My Trainings",
              },
              {
                key: "manageTraining",
                isVisible:
                  ["HR", "Super-Admin", "Delegate-Super-Admin"].includes(
                    role
                  ) && window.location.pathname?.includes("organisation"),
                link: `/organisation/${orgId}/manage-training`,
                icon: (
                  <ModelTrainingOutlined className=" !text-[1.2em] text-[#67748E]" />
                ),
                text: "Manage Trainings",
              },
            ],
          },
        };
      }
    },
    // eslint-disable-next-line
    [
      isVisible,
      orgId,
      check,
      data?.organisation?.packageInfo,
      location.pathname,
      role,
      survey?.surveyPermission,
    ]
  );

  useEffect(() => {
    try {
      if (token) {
        const newToken = jwtDecode(token);

        setDecodedToken(newToken);
        if (decodedToken && decodedToken?.user?.profile) {
        }
      }
    } catch (error) {
      console.error("Failed to decode the token:", error);
    }
    // eslint-disable-next-line
  }, [token]);

  return (
    <>
      {Object.keys(navItems).map((role, i) => {
        const { icon, routes, isVisible, isClickable, link } = navItems[role];

        return (
          <NavAccordion
            key={i}
            role={role}
            icon={icon}
            routes={routes}
            toggleDrawer={toggleDrawer}
            isVisible={isVisible}
            valueBoolean={navItems[role].open}
            isClickable={isClickable}
            link={link}
          />
        );
      })}
    </>
  );
};

export default TestNavItems;
