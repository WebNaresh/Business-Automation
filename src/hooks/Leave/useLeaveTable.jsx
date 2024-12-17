import axios from "axios";
import { useContext } from "react";
import { useQuery } from "react-query";
import { UseContext } from "../../State/UseState/UseContext";

const useLeaveTable = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const { data: withOutLeaves } = useQuery(
    "withOutLeaves-leave-table",
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/leave/getEmployeeCurrentYearLeave`,
        {
          headers: { Authorization: authToken },
        }
      );

      return response.data;
    }
  );

  const { data, isLoading, isError, error } = useQuery(
    "employee-leave-table",
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/leave/getEmployeeLeaveTable`,
        {
          headers: { Authorization: authToken },
        }
      );

      return response.data;
    }
  );

  return { data, isLoading, isError, error, withOutLeaves };
};

export default useLeaveTable;
