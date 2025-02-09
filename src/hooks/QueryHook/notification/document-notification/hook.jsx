import axios from "axios";
import { useQuery } from "react-query";
import useGetUser from "../../../Token/useUser";
import UserProfile from "../../../UserData/useUser";

const useDocNotification = () => {
  const { getCurrentUser } = UserProfile();
  const { authToken } = useGetUser();
  const user = getCurrentUser();
  const organisationId = user && user.organizationId;
  const getUserDocNotification = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API}/route/org/get-pending-document/${organisationId}`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data.data;
  };

  const { data, isLoading, isFetching } = useQuery(
    "doc-requests",
    getUserDocNotification
  );

  console.log("dfdf", data);

  return {
    data,
    isLoading,
    isFetching,
  };
};

export default useDocNotification;
