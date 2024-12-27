import { Menu } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar } from "@mui/material";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import * as React from "react";
import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import useSubscriptionGet from "../../hooks/QueryHook/Subscription/hook";
import useGetUser from "../../hooks/Token/useUser";
import UserProfile from "../../hooks/UserData/useUser";
import ProfileIcon from "../profieicon/profileIcon";
import NotificationIcon from "./components/NotificationIcon";
import TestNavItems from "./components/nav-items";

export default function SwipeableTemporaryDrawer() {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const [orgId, setOrgId] = React.useState(null);
  const { decodedToken: decoded } = useGetUser();
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

  const role = UserProfile().useGetCurrentRole();

  // Update organization ID when URL changes
  React.useEffect(() => {
    // const hasEmployeeOnboarding = pathname.includes("employee-onboarding");
    getOrganizationIdFromPathname(location.pathname);
    // eslint-disable-next-line
  }, [location.pathname, orgId]);

  const { data } = useSubscriptionGet({
    organisationId: orgId,
  });

  const toggleDrawer = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const list = (
    <Box
      sx={{ width: 250, height: 100 }}
      role="presentation"
      onKeyDown={toggleDrawer}
    >
      <TestNavItems toggleDrawer={toggleDrawer} />
    </Box>
  );

  const paths = ["/sign-in", "/organizationList"];
  const isLocation = React.useMemo(() => {
    return paths.some((path) => {
      return location.pathname.includes(path) || location.pathname === "/";
    });
    // eslint-disable-next-line
  }, [location.pathname]);

  //resolved bug
  const pathsToHideOrgName = ["/add-organisation", "/organizationList"];

  return (
    <div
      className={`${
        location.pathname.includes("/sign-in") ||
        location.pathname.includes("/sign-up") ||
        location.pathname.includes("/terms-and-conditions") ||
        location.pathname.includes("/choose-role")
          ? "hidden"
          : "block"
      }`}
    >
      <AppBar position="fixed">
        <Toolbar className="flex justify-between items-center">
          <div className="flex items-center">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              edge="start"
              sx={{ marginRight: 2 }}
            >
              <Menu />
            </IconButton>
            <img
              src="/smartea.jpeg"
              className="h-[45px] rounded-md"
              alt="logo"
            />
            {/* <img
              src="/smartea.jpeg"
              className="hidden sm:flex items-center"
              about
            ></img> */}
          </div>

          <div className="flex gap-2 items-center">
            {/* {data?.organisation?.orgName &&
            !isLocation &&
            data?.organisation?.orgName}
            {role && <NotificationIcon />} */}
            {/* //resolved bug */}
            {data?.organisation?.orgName &&
              !isLocation &&
              !pathsToHideOrgName.includes(location.pathname) &&
              data?.organisation?.orgName}
            {role && <NotificationIcon />}
            <ProfileIcon />
          </div>
        </Toolbar>
      </AppBar>

      <SwipeableDrawer
        PaperProps={{ style: { background: "#00a2ad" } }}
        color="white"
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
      >
        <div className="py-2 px-10 border-b-[.5px] flex items-center gap-2 border-gray-300">
          <img src="/smartea.jpeg" className="h-[45px] rounded-lg" alt="logo" />
        </div>
        {list}
      </SwipeableDrawer>
    </div>
  );
}
