import {
  Dashboard,
  Fingerprint,
  ListAlt,
  LocationOn,
  ModelTrainingOutlined,
  MonetizationOn,
  NotificationsActive,
  PanToolAlt,
  Payment,
  PeopleAlt,
  PersonRemove,
  TrendingUp,
} from "@mui/icons-material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ArticleIcon from "@mui/icons-material/Article";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CallMissedIcon from "@mui/icons-material/CallMissed";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import ReceiptIcon from "@mui/icons-material/Receipt";
import WorkIcon from "@mui/icons-material/Work";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useMemo, useState } from "react";
import { AiOutlineFileSync, AiOutlineUsergroupAdd } from "react-icons/ai";
import { BiMessageAdd } from "react-icons/bi";
import { CgFileDocument } from "react-icons/cg";
import { FiUsers } from "react-icons/fi";
import { HiOutlineIdentification } from "react-icons/hi";
import { IoIosNotificationsOutline } from "react-icons/io";
import {
  IoCalendarOutline,
  IoEarthOutline,
  IoGitBranchOutline,
} from "react-icons/io5";
import { LiaUserClockSolid } from "react-icons/lia";
import { MdOutlinePunchClock } from "react-icons/md";
import { RiMapPinUserLine } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { SiMicrosoftexcel } from "react-icons/si";
import { TbUsersGroup } from "react-icons/tb";
import { VscTypeHierarchySub } from "react-icons/vsc";
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
          `${import.meta.env.VITE_API}/route/employee/get/profile/${user?._id}`,
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
      return {
        Dashboard: {
          open: false,
          icon: <RxDashboard className=" !text-[1.2rem]" />,
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
              icon: <Dashboard className=" !text-[1.2rem]" />,
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
        Notification: {
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
          icon: <VscTypeHierarchySub className=" !text-[1.2rem]" />,
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
                <AddCircleOutlineOutlinedIcon className=" !text-[1.2rem]" />
              ),
              text: "Add Department",
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
              icon: <ListAltOutlinedIcon className=" !text-[1.2rem]" />,
              text: "Manage Department",
            },
          ],
        },
        Employee: {
          open: false,
          icon: <FiUsers className=" !text-[1.2rem]" />,
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
              icon: <AiOutlineUsergroupAdd className=" !text-[1.2rem]" />,
              text: "Add Employee",
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
              icon: <TbUsersGroup className=" !text-[1.2rem]" />,
              text: "Manage Employee",
            },
          ],
        },
        Attendence: {
          open: true,
          icon: <HiOutlineIdentification className="!text-[1.5rem]" />,
          isVisible: true,
          routes: [
            {
              key: "attendance",
              isVisible: true,
              link: `/organisation/${orgId}/leave`,
              icon: <AccessTimeOutlinedIcon className=" !text-[1.2rem]" />,
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
              icon: <LiaUserClockSolid className=" !text-[1.2rem]" />,
              text: "Employee Attendance",
            },
          ],
        },
        Payroll: {
          open: false,
          isVisible: true,
          icon: <Payment className=" !text-[1.2em]" />,
          routes: [
            {
              key: "payslip",
              isVisible: true,
              link: `/organisation/${orgId}/view-payslip`,
              icon: <ListAlt className=" !text-[1.2em]" />,
              text: "Pay Slip",
            },
            {
              key: "IncomeTax",
              isVisible: true,
              link: `/organisation/${orgId}/income-tax-section`,
              icon: <TrendingUp className=" !text-[1.2em]" />,
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
              icon: <TrendingUp className=" !text-[1.2em]" />,
              text: "Employee TDS Details",
            },
            {
              key: "form-16",
              isVisible: true,
              link: `/organisation/${orgId}/form-16`,
              icon: <Description className=" !text-[1.2em]" />,
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
                <AccountBalanceWalletOutlinedIcon className=" !text-[1.2em]" />
              ),
              text: "Salary Management",
            },
          ],
        },
        "Machine Punching": {
          open: false,
          icon: <MdOutlinePunchClock className=" !text-[1.2rem]" />,
          isVisible:
            window.location.pathname?.includes("organisation") &&
            ["Super-Admin", "Delegate-Super-Admin", "HR", "Employee"]?.includes(
              role
            ),
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
              icon: <AiOutlineFileSync className=" !text-[1.2rem]" />,
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
              icon: <AccessTimeIcon className=" !text-[1.2rem]" />,
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
              icon: <IoCalendarOutline className=" !text-[1.2rem]" />,
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
              icon: <CallMissedIcon className=" !text-[1.2rem]" />,
              text: "Missed Punch ",
            },

            {
              key: "missjustify",
              isVisible: ["Employee"].includes(role),
              link: `/organisation/${orgId}/missed-justify`,
              icon: <ReceiptIcon className=" !text-[1.2rem]" />,
              text: "Missed Justify",
            },
          ],
        },
        Payroll: {
          open: false,
          isVisible: true,
          icon: <Payment className=" !text-[1.2rem]" />,
          routes: [
            {
              key: "payslip",
              isVisible: true,
              link: `/organisation/${orgId}/view-payslip`,
              icon: <ListAlt className=" !text-[1.2rem]" />,
              text: "Pay Slip",
            },
            {
              key: "IncomeTax",
              isVisible: true,
              link: `/organisation/${orgId}/income-tax-section`,
              icon: <TrendingUp className=" !text-[1.2rem]" />,
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
              icon: <TrendingUp className=" !text-[1.2rem]" />,
              text: "Employee TDS Details",
            },
            {
              key: "form-16",
              isVisible: true,
              link: `/organisation/${orgId}/form-16`,
              icon: <CgFileDocument className=" !text-[1.2rem]" />,
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
                <AccountBalanceWalletOutlinedIcon className=" !text-[1.2rem]" />
              ),
              text: "Salary Management",
            },
          ],
        },
        "Geo Fencing": {
          open: false,
          isVisible:
            (["Employee"].includes(role) && isUserMatchInEmployeeList) ||
            ["Manager", "Super-Admin", "Delegate-Super-Admin"].includes(role),
          icon: <RiMapPinUserLine className=" !text-[1.2rem]" />,
          routes: [
            {
              key: "geoFencing",
              isVisible:
                ["Employee"].includes(role) && isUserMatchInEmployeeList,
              link: `/organisation/${orgId}/geo-fencing`,
              icon: <LocationOn className="!text-[1.2rem]" />,
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
              icon: <IoEarthOutline className=" !text-[1.2rem]" />,
              text: "Add Geo Fencing",
            },
          ],
        },
        Employee: {
          open: false,
          isVisible: ["Super-Admin", "Delegate-Super-Admin"].includes(role),
          icon: <IoGitBranchOutline className=" !text-[1.2rem]" />,
          isClickable: true,
          routes: [],
          link: "/organizationList",
        },
        Training: {
          open: false,
          isVisible: data?.organisation?.packageInfo === "Intermediate Plan",
          icon: <MonetizationOn className=" !text-[1.2rem]" />,
          routes: [
            {
              key: "myTraining",
              isVisible: ["Employee", "Manager", "Accountant"].includes(role),
              link: "/my-training",
              icon: <ArticleIcon className=" !text-[1.2rem]" />,
              text: "My Trainings",
            },
            {
              key: "manageTraining",
              isVisible:
                ["HR", "Super-Admin", "Delegate-Super-Admin"].includes(role) &&
                window.location.pathname?.includes("organisation"),
              link: `/organisation/${orgId}/manage-training`,
              icon: <ModelTrainingOutlined className=" !text-[1.2rem]" />,
              text: "Manage Trainings",
            },
          ],
        },
        Report: {
          open: false,
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
          icon: <NotificationsActive className=" !text-[1.2rem]" />,
          routes: [
            {
              key: "reportingMIS",
              isVisible: true,
              link: `/organisation/${orgId}/mis-report`,
              icon: <SiMicrosoftexcel className=" !text-[1.2rem]" />,
              text: "Reporting MIS",
            },
          ],
        },
        Communication: {
          open: false,
          isVisible: true,
          icon: <IoIosNotificationsOutline className=" !text-[1.2rem]" />,
          routes: [],
          isClickable: true,
          link: `/organisation/${orgId}/notification`,
        },
        Performance: {
          open: false,
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
          icon: <Payment className=" !text-[1.2rem]" />,
          routes: [
            {
              key: "performance",
              isVisible: true,
              link: `/organisation/${orgId}/performance`,
              icon: <ListAlt className=" !text-[1.2rem]" />,
              text: "Performance",
            },
          ],
        },
        Report: {
          open: false,
          isVisible:
            window.location.pathname?.includes("organisation") &&
            [
              "Super-Admin",
              "Delegate-Super-Admin",
              "Accountant",
              "HR",
            ]?.includes(role),
          icon: <NotificationsActive className=" !text-[1.2em]" />,
          routes: [
            {
              key: "reportingMIS",
              isVisible: true,
              link: `/organisation/${orgId}/mis-report`,
              icon: <SiMicrosoftexcel className=" !text-[1.2em]" />,
              text: "Reporting MIS",
            },
          ],
        },
        Department: {
          open: false,
          icon: <PeopleAlt className=" !text-[1.2rem]" />,
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
          icon: <VscTypeHierarchySub className=" !text-[1.2rem]" />,
          routes: [
            {
              key: "addDepartment",
              isVisible: [
                "Super-Admin",
                "Delegate-Super-Admin",
                "HR",
                "Department-Head",
                "Delegate-Department-Head",
                "Manager",
              ].includes(role),
              link: `organisation/${orgId}/create-job-position`,
              icon: <WorkIcon className=" !text-[1.2rem]" />,
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
                "Department-Admin",
                "Delegate-Department-Admin",
              ].includes(role),
              link: `organisation/${orgId}/view-job-position`,
              icon: <PersonRemove className=" !text-[1.2rem]" />,
              text: "View Job Position",
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
              link: `organisation/${orgId}/open-job-position`,
              icon: <PersonRemove className=" !text-[1.2rem]" />,
              text: "Open Job Role",
            },
          ],
        },
        Branches: {
          open: false,
          isVisible: true,
          icon: <BiMessageAdd className=" !text-[1.2rem]" />,
          routes: [
            {
              key: "createCommunication",
              isVisible: true,
              link: `/organisation/${orgId}/create-communication`,
              icon: <BiMessageAdd className=" !text-[1.2rem]" />,
              text: "Broadcast",
            },
            {
              key: "EmployeeSurvey",
              isVisible: true,
              link:
                user?.profile.includes("Super-Admin") ||
                user?.profile.includes("HR")
                  ? `/organisation/${orgId}/employee-survey`
                  : `/organisation/${orgId}/employee-survey/${empId}`,
              icon: <AssignmentIcon className=" !text-[1.2rem]" />,
              text: "Employee Survey",
            },
          ],
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
          icon: <MonetizationOn className=" !text-[1.2rem]" />,
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
              icon: <AssignmentIcon className=" !text-[1.2rem]" />,
              text: "Remote Visit tasks",
            },
            {
              key: "addPunch",
              isVisible:
                ["Employee"].includes(role) && !isUserMatchInEmployeeList,
              link: `/organisation/${orgId}/employee-remote-punching`,
              icon: <Fingerprint className=" !text-[1.2rem]" />,
              text: "Remote Punch-in-out",
            },
            {
              key: "missPunch",
              isVisible:
                ["Employee"].includes(role) && !isUserMatchInEmployeeList,
              link: `/organisation/${orgId}/remotePunching`,
              icon: <PanToolAlt className=" !text-[1.2rem]" />,
              text: "Apply Miss For Punch",
            },
          ],
        },
        "Catering and food": {
          open: false,
          isVisible: data?.organisation?.packageInfo === "Intermediate Plan",
          icon: <MonetizationOn className=" !text-[1.2rem]" />,
          routes: [
            {
              key: "onboarding",
              isVisible: ["Super-Admin", "HR"].includes(role),

              link: `/organisation/${orgId}/catering/onboarding`,
              icon: <ArticleIcon className=" !text-[1.2rem]" />,
              text: "New Vendor Onboard",
            },
          ],
        },
        Records: {
          open: false,
          isVisible: data?.organisation?.packageInfo === "Intermediate Plan",
          icon: <MonetizationOn className=" !text-[1.2rem]" />,
          routes: [
            {
              key: "empDocs",
              isVisible: true,
              link: `/organisation/${orgId}/records`,
              icon: <ArticleIcon className=" !text-[1.2rem]" />,
              text: "My Records",
            },
          ],
        },
      };
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
