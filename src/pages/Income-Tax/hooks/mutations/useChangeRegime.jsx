import axios from "axios";
import { useContext } from "react";
import { useMutation } from "react-query";
import useAuthToken from "../../../../hooks/Token/useAuth";
import { TestContext } from "../../../../State/Function/Main";
import useGetSalaryByFY from "../queries/useGetSalaryByFY";

const useChangeRegime = () => {
  const { getFinancialCurrentYear } = useGetSalaryByFY();
  const authToken = useAuthToken();
  const { handleAlert } = useContext(TestContext);
  const changeRegimeMutation = useMutation(
    (data) => {
      const { start, end } = getFinancialCurrentYear();
      axios.put(
        `${import.meta.env.VITE_API}/route/tds/changeRegime/${start}-${end}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", `Regime changed successfully`);
      },
      onError: (error) => {
        console.log(error);
        handleAlert(true, "success", `There was an error please try later`);
      },
    }
  );

  return { changeRegimeMutation };
};

export default useChangeRegime;
