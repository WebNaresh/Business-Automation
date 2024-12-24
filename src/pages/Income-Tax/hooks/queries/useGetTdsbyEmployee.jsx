import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../../../../hooks/Token/useAuth";

const useGetTdsbyEmployee = (empId, financialYear) => {
  const authToken = useAuthToken();
  const getTdsForEmployee = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API}/route/tds/getTDSDetails/${empId}/${financialYear}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: tdsForEmployee, isFetching } = useQuery({
    queryKey: ["tdsDetails", empId, financialYear],
    queryFn: getTdsForEmployee,
    refetchOnMount: false,
  });

  return { tdsForEmployee, isFetching };
};

export default useGetTdsbyEmployee;
