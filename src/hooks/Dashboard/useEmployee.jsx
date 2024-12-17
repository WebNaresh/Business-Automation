import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../Token/useAuth";

const useEmployee = (organisationId, page) => {
  const authToken = useAuthToken();
  const getEmployees = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get-paginated-emloyee/${organisationId}?page=${page}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const {
    data: employee,
    isLoading: employeeLoading,
    isFetching: empFetching,
  } = useQuery(["employee-data", organisationId, page], getEmployees);
  return { employee, employeeLoading, empFetching };
};

export default useEmployee;
