import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
import useForm16NotificationHook from "../../../hooks/QueryHook/notification/Form16Notification/useForm16NotificationHook";
import useMissedPunchNotificationCount from "../../../hooks/QueryHook/notification/MissedPunchNotification/MissedPunchNotification";
import usePayslipNotificationHook from "../../../hooks/QueryHook/notification/PayslipNotification/usePayslipNotificaitonHook";
import useAdvanceSalaryData from "../../../hooks/QueryHook/notification/advance-salary-notification/useAdvanceSalary";
import useDepartmentNotification from "../../../hooks/QueryHook/notification/department-notification/hook";
import useDocNotification from "../../../hooks/QueryHook/notification/document-notification/hook";
import useJobPositionNotification from "../../../hooks/QueryHook/notification/job-position-notification/useJobPositionNotification";
import useLeaveNotificationHook from "../../../hooks/QueryHook/notification/leave-notification/hook";
import useLoanNotification from "../../../hooks/QueryHook/notification/loan-notification/useLoanNotificaiton";
import usePunchNotification from "../../../hooks/QueryHook/notification/punch-notification/hook";
import useShiftNotification from "../../../hooks/QueryHook/notification/shift-notificatoin/hook";
import useTDSNotificationHook from "../../../hooks/QueryHook/notification/tds-notification/hook";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import useOrgGeo from "../../Geo-Fence/useOrgGeo";
import useLeaveNotification from "../../SelfLeaveNotification/useLeaveNotification";
import UseEmployeeShiftNotification from "../../SelfShiftNotification/UseEmployeeShiftNotification";

const useNotification = () => {
  const { cookies } = useContext(UseContext);
  const { organisationId } = useParams();
  const token = cookies["aegis"];
  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const user = getCurrentUser();
  const role = useGetCurrentRole();
  const { data } = useLeaveNotificationHook(); //super admin and manager side notification
  const { data: shiftNotification, accData } = useShiftNotification(); //super admin and manager side notification

  const { data: employeeShiftNotification } = UseEmployeeShiftNotification(); //employee side notification
  const { data: selfLeaveNotification } = useLeaveNotification();
  const [emp, setEmp] = useState();
  const { data: data3 } = usePunchNotification();

  const authToken = useAuthToken();

  //states
  const [shiftCount, setShiftCount] = useState(0);
  const [shiftAccCount, setShiftAccCount] = useState(0);
  const [employeeShiftCount, setEmployeeShiftCount] = useState(0);
  const [leaveCount, setLeaveCount] = useState(0);
  const [employeeLeaveCount, setEmployeeLeaveCount] = useState(0);
  const [loanCount, setLoanCount] = useState(0);
  const [empLoanCount, setEmpLoanCount] = useState(0);
  const [advanceSalaryCount, setAdvanceSalaryCount] = useState(0);
  const [empAdvanceSalaryCount, setEmpAdvanceSalaryCount] = useState(0);

  const { data: orgData } = useSubscriptionGet({
    organisationId,
  });

  //super admin and manager side leave notification count
  useEffect(() => {
    if (data && data?.leaveRequests && data?.leaveRequests?.length > 0) {
      let total = 0;
      data?.leaveRequests.forEach((item) => {
        total += item.notificationCount;
      });
      setLeaveCount(total);
    } else {
      setLeaveCount(0);
    }
  }, [data]);

  //employee side leave notification count
  useEffect(() => {
    if (
      selfLeaveNotification &&
      selfLeaveNotification?.leaveRequests &&
      selfLeaveNotification?.leaveRequests?.length > 0
    ) {
      let total = 0;
      selfLeaveNotification?.leaveRequests?.forEach((item) => {
        total += item.approveRejectNotificationCount;
      });
      setEmployeeLeaveCount(total);
    } else {
      setEmployeeLeaveCount(0);
    }
  }, [selfLeaveNotification]);

  const Leavecount =
    role === "Super-Admin" || role === "Manager"
      ? leaveCount
      : employeeLeaveCount;

  //super admin and manager side shift notification count
  useEffect(() => {
    if (shiftNotification && shiftNotification?.length > 0) {
      let total = 0;
      shiftNotification.forEach((item) => {
        total += item.notificationCount;
      });
      setShiftCount(total);
    } else {
      setShiftCount(0);
    }
  }, [shiftNotification]);

  //Account side shift notification count
  useEffect(() => {
    if (accData && accData?.length > 0) {
      let total = 0;
      accData.forEach((item) => {
        total += item.accNotificationCount;
      });
      setShiftAccCount(total);
    } else {
      setShiftAccCount(0);
    }
  }, [accData]);

  //employee side shift notification count
  useEffect(() => {
    if (
      employeeShiftNotification &&
      employeeShiftNotification?.requests &&
      employeeShiftNotification?.requests?.length > 0
    ) {
      let total = 0;
      employeeShiftNotification?.requests.forEach((item) => {
        total += item?.approveRejectNotificationCount || 0;
      });
      setEmployeeShiftCount(total);
    } else {
      setEmployeeShiftCount(0);
    }
  }, [employeeShiftNotification]);

  const count =
    role === "Super-Admin" || role === "Manager"
      ? shiftCount
      : role === "Accountant"
      ? shiftAccCount
      : employeeShiftCount;

  //Employee Side remote and geofencing Notification count
  const employeeId = user?._id;
  const { data: EmpNotification } = useQuery({
    queryKey: ["EmpDataPunchNotification", employeeId],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/punch/get-notification/${employeeId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: employeeId !== undefined,
  });

  // Calculate total notificationCount for geoFencingArea false
  const punchNotifications = data3?.punchNotification || [];
  const totalFalseStartNotificationsCount = punchNotifications
    .filter((item) => item.geoFencingArea === false)
    .reduce(
      (total, item) =>
        total +
        (item.punchData?.reduce(
          (sum, punch) => sum + punch.notificationCount,
          0
        ) || 0),
      0
    );

  const totalFalseStopNotificationsCount = punchNotifications
    .filter((item) => item.geoFencingArea === false)
    .reduce(
      (total, item) =>
        total +
        (item.punchData?.reduce(
          (sum, punch) => sum + punch.stopNotificationCount,
          0
        ) || 0),
      0
    );
  const totalFalseNotificationsCount =
    totalFalseStartNotificationsCount + totalFalseStopNotificationsCount;

  const totalTrueStartNotificationsCount = punchNotifications
    .filter((item) => item.geoFencingArea === true)
    .reduce(
      (total, item) =>
        total +
        (item.punchData?.reduce(
          (sum, punch) => sum + punch.notificationCount,
          0
        ) || 0),
      0
    );

  const totalTrueStopNotificationsCount = punchNotifications
    .filter((item) => item.geoFencingArea === true)
    .reduce(
      (total, item) =>
        total +
        (item.punchData?.reduce(
          (sum, punch) => sum + punch.stopNotificationCount,
          0
        ) || 0),
      0
    );

  const totalTrueNotificationsCount =
    totalTrueStopNotificationsCount + totalTrueStartNotificationsCount;
  // remote punch notification count
  let remotePunchingCount;
  if (role === "Employee") {
    const punchData = EmpNotification?.punchData?.[0];
    console.log("punchData", punchData);

    if (punchData?.geoFencingArea === false) {
      remotePunchingCount = punchData.approveRejectNotificationCount;
    } else {
      remotePunchingCount = 0;
    }
  } else {
    remotePunchingCount = totalFalseNotificationsCount;
  }
  console.log("remotePunchingCount", remotePunchingCount);

  let geoFencingCount;
  if (role === "Employee") {
    // Check if geoFencingArea is true and then assign the approveRejectNotificationCount
    const punchData = EmpNotification?.punchData?.[0];
    console.log("punchData", punchData);

    if (punchData?.geoFencingArea === true) {
      geoFencingCount = punchData.approveRejectNotificationCount;
    } else {
      geoFencingCount = 0;
    }
  } else {
    geoFencingCount = totalTrueNotificationsCount;
  }

  //selected employee list for geofencing
  const { data: geofencingData } = useOrgGeo(user?.organizationId);

  //match currect user and selcted employee in list
  const isUserMatchInEmployeeList = geofencingData?.area?.some((area) =>
    area.employee.includes(employeeId)
  );

  //Notification for loan
  const { getEmployeeRequestLoanApplication, getLoanEmployee } =
    useLoanNotification();
  console.log(
    "getEmployeeRequestLoanApplication",
    getEmployeeRequestLoanApplication
  );

  //get notification count of loan
  useEffect(() => {
    if (
      getEmployeeRequestLoanApplication &&
      getEmployeeRequestLoanApplication?.length > 0
    ) {
      let total = 0;
      getEmployeeRequestLoanApplication?.forEach((item) => {
        total += item.notificationCount;
      });
      setLoanCount(total);
    } else {
      setLoanCount(0);
    }

    if (getLoanEmployee && getLoanEmployee?.length > 0) {
      let total = 0;
      getLoanEmployee?.forEach((item) => {
        total += item.acceptRejectNotificationCount;
      });
      setEmpLoanCount(total);
    } else {
      setEmpLoanCount(0);
    }
  }, [getEmployeeRequestLoanApplication, getLoanEmployee]);

  const countLoan =
    role === "Super-Admin" || role === "HR" || role === "Delegate-Super-Admin"
      ? loanCount
      : empLoanCount;

  //notification Count for advance salary
  const { getAdvanceSalary, advanceSalaryNotificationEmp } =
    useAdvanceSalaryData();

  //get notification count of advance salary
  useEffect(() => {
    if (getAdvanceSalary && getAdvanceSalary?.length > 0) {
      let total = 0;
      getAdvanceSalary?.forEach((item) => {
        total += item.notificationCount;
      });
      setAdvanceSalaryCount(total);
    } else {
      setAdvanceSalaryCount(0);
    }

    if (
      advanceSalaryNotificationEmp &&
      advanceSalaryNotificationEmp?.length > 0
    ) {
      let total = 0;
      advanceSalaryNotificationEmp?.forEach((item) => {
        total += item.acceptRejectNotificationCount;
      });
      setEmpAdvanceSalaryCount(total);
    } else {
      setEmpAdvanceSalaryCount(0);
    }
  }, [getAdvanceSalary, advanceSalaryNotificationEmp]);

  const countAdvance =
    role === "Super-Admin" || role === "HR" || role === "Delegate-Super-Admin"
      ? advanceSalaryCount
      : empAdvanceSalaryCount;

  const { data: data4 } = useDocNotification();
  const { data: tds } = useTDSNotificationHook();

  // const { missPunchData, getMissedPunchData } =
  //   useMissedPunchNotificationCount();
  // const MissPunchCountMA = missPunchData?.reduce((total, employee) => {
  //   const employeeTotal = employee.unavailableRecords?.reduce((sum, record) => {
  //     return sum + (record.notificationCount || 0);
  //   }, 0);
  //   return total + employeeTotal;
  // }, 0);

  // const MissPunchCountHR = missPunchData?.reduce((total, employee) => {
  //   const employeeTotal = employee.unavailableRecords?.reduce((sum, record) => {
  //     return sum + (record.MaNotificationCount || 0);
  //   }, 0);
  //   return total + employeeTotal;
  // }, 0);

  // const MissPunchCountEmp = getMissedPunchData?.reduce((total, employee) => {
  //   const employeeTotal = employee.unavailableRecords?.reduce((sum, record) => {
  //     return sum + (record.HrNotificationCount || 0);
  //   }, 0);
  //   return total + employeeTotal;
  // }, 0);

  // let MissPunchCount;
  // if (role === "Super-Admin" || role === "Manager") {
  //   MissPunchCount = MissPunchCountMA ?? 0;
  // } else if (role === "HR") {
  //   MissPunchCount = MissPunchCountHR ?? 0;
  // } else if (role === "Employee") {
  //   MissPunchCount = MissPunchCountEmp ?? 0;
  // } else {
  //   MissPunchCount = 0;
  // }
  const { missPunchData, getMissedPunchData } =
    useMissedPunchNotificationCount();

  const calculateNotificationCount = (data, key) => {
    return (
      data?.reduce((total, employee) => {
        return (
          total +
          employee.unavailableRecords?.reduce((sum, record) => {
            return sum + (record[key] || 0);
          }, 0)
        );
      }, 0) || 0
    );
  };

  const MissPunchCountMA = calculateNotificationCount(
    missPunchData,
    "notificationCount"
  );
  const MissPunchCountHR = calculateNotificationCount(
    missPunchData,
    "MaNotificationCount"
  );
  const MissPunchCountEmp = calculateNotificationCount(
    getMissedPunchData,
    "HrNotificationCount"
  );

  let MissPunchCount;
  switch (role) {
    case "Super-Admin":
    case "Manager":
      MissPunchCount = MissPunchCountMA;
      break;
    case "HR":
      MissPunchCount = MissPunchCountHR;
      break;
    case "Employee":
      MissPunchCount = MissPunchCountEmp;
      break;
    default:
      MissPunchCount = 0;
  }

  //////////////////////////////////////////////
  const { Form16Notification } = useForm16NotificationHook();

  const { getJobPositionToMgr, getNotificationToEmp } =
    useJobPositionNotification();
  const { PayslipNotification } = usePayslipNotificationHook();
  console.log("PayslipNotification", PayslipNotification);

  const { getDepartmnetData, getDeptNotificationToEmp } =
    useDepartmentNotification();

  const tdsRoute = useMemo(() => {
    if (
      role === "Accountant" ||
      role === "Super-Admin" ||
      role === "Delegate-Super-Admin"
    ) {
      return "/notification/income-tax";
    }
    return "/";
  }, [role]);

  // for missed punch notification count
  // let missedPunchNotificationCount;
  // if (
  //   role === "HR" ||
  //   role === "Super-Admin" ||
  //   role === "Delegate-Super-Admin" ||
  //   role === "Manager"
  // ) {
  //   missedPunchNotificationCount = missPunchData?.length ?? 0;
  // } else {
  //   missedPunchNotificationCount = getMissedPunchData?.length ?? 0;
  // }

  // for form 16 notification count
  let form16NotificationCount;
  if (role === "Employee") {
    form16NotificationCount = Form16Notification?.length ?? 0;
  } else {
    form16NotificationCount = 0;
  }

  // for payslip notification count

  const totalNotificationCount =
    PayslipNotification?.reduce((total, notification) => {
      return total + notification.NotificationCount;
    }, 0) || 0;

  // for view job position count
  let jobPositionCount;
  if (role === "Employee") {
    jobPositionCount = getNotificationToEmp?.length ?? 0;
  } else {
    jobPositionCount = getJobPositionToMgr?.length ?? 0;
  }

  // department notification count
  console.log("role", role);
  let departmentNotificationCount;

  if (role === "Employee") {
    departmentNotificationCount = getDeptNotificationToEmp?.length ?? 0;
  } else if (
    role === "HR" ||
    role === "Super-Admin" ||
    role === "Delegate-Super-Admin"
  ) {
    departmentNotificationCount = getDepartmnetData?.length ?? 0;
  } else {
    departmentNotificationCount = 0;
  }

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

  const dummyData = [
    {
      name: "Leave Notification",
      count: Leavecount,
      color: "#FF7373",
      url: "/leave-notification",
      url2: "/self/leave-notification",
      visible: true,
    },

    {
      name: "Shift Notification",
      count: count,
      color: "#3668ff",
      url: `/organisation/${organisationId}/shift-notification`,
      url2: "/self/shift-notification",
      visible:
        orgData?.organisation?.packageInfo === "Essential Plan" ? false : true,
    },

    ...(role === "Super-Admin" || role === "Manager" || role === "HR"
      ? [
          {
            name: "Remote Punching Notification",
            count: remotePunchingCount,
            color: "#51FD96",
            url: "/punch-notification",
            url2: "/remote-punching-notification",
            visible:
              orgData?.organisation?.packageInfo === "Essential Plan" ||
              orgData?.organisation?.packageInfo === "Basic Plan"
                ? false
                : true,
          },
          {
            name: "Geo Fencing Notification",
            count: geoFencingCount,
            color: "#51FD96",
            url: `/organisation/${organisationId}/geo-fencing-notification`,
            url2: `/organisation/${organisationId}/geofencing-notification`,
            visible:
              orgData?.organisation?.packageInfo === "Essential Plan" ||
              orgData?.organisation?.packageInfo === "Basic Plan"
                ? false
                : true,
          },
        ]
      : // For Employees, conditionally show either Remote Punching or Geo Fencing based on `isUserMatchInEmployeeList`
        [
          isUserMatchInEmployeeList
            ? {
                name: "Geo Fencing Notification",
                count: geoFencingCount,
                color: "#51FD96",
                url: `/organisation/${organisationId}/geo-fencing-notification`,
                url2: `/organisation/${organisationId}/geofencing-notification`,
                visible:
                  orgData?.organisation?.packageInfo === "Essential Plan" ||
                  orgData?.organisation?.packageInfo === "Basic Plan"
                    ? false
                    : true,
              }
            : {
                name: "Remote Punching Notification",
                count: remotePunchingCount,
                color: "#51FD96",
                url: "/punch-notification",
                url2: "/remote-punching-notification",
                visible:
                  orgData?.organisation?.packageInfo === "Essential Plan" ||
                  orgData?.organisation?.packageInfo === "Basic Plan"
                    ? false
                    : true,
              },
        ]),
    {
      name: "Document Approval Notification",
      count: data4?.data?.doc?.length ?? 0,
      color: "#FF7373",
      url: "/doc-notification",
      visible:
        orgData?.organisation?.packageInfo ===
        ("Essential Plan" || "Basic Plan")
          ? false
          : true,
    },
    {
      name: "Loan Notification",
      count: countLoan,
      color: "#51E8FD",
      url: "/loan-notification",
      url2: "/loan-notification-to-emp",
      visible:
        orgData?.organisation?.packageInfo === "Essential Plan" ? false : true,
    },
    {
      name: "Advance Salary Notification",
      count: countAdvance,
      color: "#FF7373",
      url: "/advance-salary-notification",
      url2: "/advance-salary-notification-to-emp",
      visible:
        orgData?.organisation?.packageInfo === "Essential Plan" ? false : true,
    },
    {
      name: "Missed Punch Notification",
      count: MissPunchCount,
      color: "#51E8FD",
      url: "/missedPunch-notification",
      url2: "/missed-punch-notification-to-emp",
      visible:
        orgData?.organisation?.packageInfo === "Essential Plan" ? false : true,
    },

    {
      name: "Payslip Notification",
      count: totalNotificationCount,
      color: "#51E8FD",
      url2: "/payslip-notification-to-emp",
      visible: role === "Employee",
    },
    {
      name: "Form-16 Notification",
      count: form16NotificationCount,
      color: "#FF7373",
      url2: "/form16-notification-to-emp",
      visible: true,
    },

    {
      name: "TDS Notification",
      // count: Number(tds) ?? 0,
      count: typeof tds === "number" ? tds : 0,
      color: "#51E8FD",
      url: tdsRoute,
      url2: "/notification/income-tax-details",
      visible: true,
    },
    {
      name: "Job Position Notification",
      count: jobPositionCount,
      color: "#51E8FD",
      url: "/job-position-to-mgr",
      url2: "/job-position-to-emp",
      visible:
        orgData?.organisation?.packageInfo ===
        ("Essential Plan" || "Basic Plan")
          ? false
          : true,
    },
    {
      name: "Add Department Request",
      count: departmentNotificationCount,
      color: "#51E8FD",
      url: "/department-notification-approval",
      url2: "/department-notification-to-emp",
      visible: true,
    },
  ];
  return { dummyData };
};

export default useNotification;
