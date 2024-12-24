import { Info, RequestQuote, Search, West } from "@mui/icons-material";
import { Avatar, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import usePunchNotification from "../../../hooks/QueryHook/notification/punch-notification/hook";
import useAuthToken from "../../../hooks/Token/useAuth";
import PunchMapModal from "./components/mapped-form";

const PunchAcceptModal = () => {
  // Hooks
  const { employeeId } = useParams();
  const queryClient = useQueryClient();
  const { data: punchNotifications } = usePunchNotification();
  const authToken = useAuthToken();
  const [selectedPunchId, setSelectedPunchId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  console.log("selectedPunchId", selectedPunchId);

  // Mutation to update notification count
  const mutation = useMutation(
    ({ employeeId, punchId }) => {
      return axios.patch(
        `${import.meta.env.VITE_API}/route/punch-notification/update-notification-count/${employeeId}`,
        { notificationCount: 0, selectedPunchId: punchId },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: () => {
        // Refetch the punch notifications after updating notification count
        queryClient.invalidateQueries("EmpDataPunch");
        queryClient.invalidateQueries("punch-request");
      },
      onError: (error) => {
        console.error("Error updating notification count:", error);
      },
    }
  );

  // Get particular employee punching and miss punch data
  const { data: EmpNotification, isLoading: empDataLoading } = useQuery({
    queryKey: ["EmpDataPunch", employeeId],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API}/route/punch-notification/notification-user/${employeeId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return res.data;
      } catch (error) {
        console.error("Error fetching employee notification data:", error);
      }
    },
    enabled: Boolean(employeeId),
  });

  // Function to handle employee click and set punchId
  const handleEmployeeClick = (employeeId) => {
    // Find the punch notification that matches the clicked employee
    const punchData = punchNotifications?.punchNotification?.find(
      (notification) => notification?.employeeId?._id === employeeId
    );

    if (punchData) {
      setSelectedPunchId(punchData._id);
      mutation.mutate({ employeeId, punchId: punchData._id });
    }
  };

  // Handle employee search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  return (
    <div>
      <header className="text-xl w-full pt-6 border bg-white shadow-md p-4">
        <Link to={"/organisation/:organisationId/income-tax"}>
          <West className="mx-4 !text-xl" />
        </Link>
        Employee Punch Request
      </header>
      <section className="min-h-[90vh] flex">
        {/* Show all employee data */}
        <article className="w-[25%] overflow-auto max-h-[90vh] h-full bg-white border-gray-200">
          <div className="p-6 !py-2">
            <div className="space-y-2">
              <div className="flex rounded-md items-center px-2 outline-none border-gray-200 border-[.5px] bg-white py-1 md:py-[6px]">
                <Search className="text-gray-700 md:text-lg !text-[1em]" />
                <input
                  type="text"
                  placeholder="Search Employee"
                  className="border-none bg-white w-full outline-none px-2"
                  value={searchTerm}
                  onChange={handleSearch} // Search input handler
                />
              </div>
            </div>
          </div>

          {
            punchNotifications?.punchNotification
              ?.filter(
                (notification) =>
                  notification?.geoFencingArea === false && notification?.employeeId // Filtering based on geoFencingArea being false
              )
              .map((notification, idx) =>
                notification?.employeeId ? (
                  <Link
                    onClick={() => handleEmployeeClick(notification?.employeeId?._id)} // Click handler
                    to={`/punch-notification/${notification?.employeeId?._id}`}
                    className={`px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50 ${notification?.employeeId?._id === employeeId ? "bg-blue-500 text-white hover:!bg-blue-300" : ""
                      }`}
                    key={idx}
                  >
                    <Avatar />
                    <div>
                      <h1 className="text-[1.2rem]">
                        {notification?.employeeId?.first_name} {notification?.employeeId?.last_name}
                      </h1>
                      <h1 className={`text-sm text-gray-500 ${notification?.employeeId?._id === employeeId ? "text-white" : ""}`}>
                        {notification?.employeeId?.email}
                      </h1>
                    </div>
                  </Link>
                ) : null
              )
          }

        </article>

        {/* Show particular employee data */}
        <article className="w-[75%] min-h-[90vh] border-l-[.5px] bg-gray-50">
          {empDataLoading ? (
            <div className="flex items-center justify-center my-2">
              <CircularProgress />
            </div>
          ) : employeeId ? (
            EmpNotification?.punchNotification?.length <= 0 ? (
              <div className="flex px-4 w-full items-center my-4">
                <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
                  <Info /> No Punch Request Found
                </h1>
              </div>
            ) : (
              <>
                <div className="p-4 space-y-1 flex items-center gap-3">
                  <Avatar className="text-white !bg-blue-500">
                    <RequestQuote />
                  </Avatar>
                  <div>
                    <h1 className="text-xl">Punch Requests</h1>
                    <p className="text-sm">
                      Here you will be able to approve or reject the punch
                      notifications
                    </p>
                  </div>
                </div>

                <div className="px-4">
                  {EmpNotification?.punchNotification
                    ?.filter((notification) => notification.geoFencingArea === false) // Filter by geoFencingArea
                    ?.map((items, itemIndex) => (
                      <PunchMapModal key={itemIndex} items={items} idx={itemIndex} />
                    ))}
                </div>
              </>
            )
          ) : (
            <div className="flex px-4 w-full items-center my-4">
              <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
                <Info /> Select employee to see their requests
              </h1>
            </div>
          )}
        </article>
      </section>
    </div>
  );
};

export default PunchAcceptModal;
