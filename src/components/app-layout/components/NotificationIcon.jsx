import { Badge } from "@mui/material";
import { useEffect, useState } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import useGetUser from "../../../hooks/Token/useUser";
import UserProfile from "../../../hooks/UserData/useUser";
import useNotification from "../../../pages/AllNotifications/components/useNotification";

const NotificationIcon = () => {
  const { decodedToken: decoded } = useGetUser();
  const location = useLocation();
  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const user = getCurrentUser();
  const [orgId, setOrgId] = useState(null);
  useEffect(() => {
    if ((role === "Super-Admin", "Delegate-Super-Admin")) {
      getOrganizationIdFromPathname(location.pathname);
    } else {
      setOrgId(user?.organizationId);
    }
    // eslint-disable-next-line
  }, [location.pathname, orgId]);
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
  const { dummyData } = useNotification();

  const totalCount = dummyData.reduce((acc, item) => acc + item.count, 0);

  return (
    <Link to={`/organisation/${orgId}/notification`}>
      <Badge
        variant={"standard"}
        color={"error"}
        badgeContent={totalCount ?? 0}
      >
        <IoIosNotificationsOutline className="text-black text-2xl" />
      </Badge>
    </Link>
  );
};

export default NotificationIcon;
