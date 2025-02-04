import axios from "axios";
import { useQuery } from "react-query";
import useDebounce from "../../../../hooks/QueryHook/Training/hook/useDebounce";
import useAuthToken from "../../../../hooks/Token/useAuth";

const useGetInvestmentSection = (search, page, empId = undefined) => {
  const authToken = useAuthToken();
  const debouncedSearchTerm = useDebounce(search, 500);
  const getInvestmentSection = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API}/route/tds/getInvestment?search=${debouncedSearchTerm}&page=${page}&employeeId=${empId}`,
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
  };
  const { data: investments, isFetching } = useQuery({
    queryKey: ["getInvestments", debouncedSearchTerm, page, empId],
    queryFn: getInvestmentSection,
    refetchOnMount: false,
  });

  return { investments, isFetching };
};

export default useGetInvestmentSection;
