import axios from "axios";
import { useContext } from "react";
import { useQueryClient } from "react-query";
import useAuthToken from "../../../../hooks/Token/useAuth";
import UserProfile from "../../../../hooks/UserData/useUser";
import { TestContext } from "../../../../State/Function/Main";
import useGetSalaryByFY from "../queries/useGetSalaryByFY";
import useFunctions from "../useFunctions";

const useDeleteInvestment = () => {
  const { getFinancialCurrentYear } = useGetSalaryByFY();
  const user = UserProfile().getCurrentUser();
  const authToken = useAuthToken();
  const queryClient = useQueryClient();
  const { deleteConfirm, setDeleteConfirm } = useFunctions();
  const { handleAlert } = useContext(TestContext);
  const handleDelete = async () => {
    const { start, end } = getFinancialCurrentYear();
    const requestData = {
      empId: user._id,
      financialYear: `${start}-${end}`,
      name: deleteConfirm,
    };

    try {
      await axios.patch(
        `${process.env.REACT_APP_API}/route/tds/deleteInvestment`,
        requestData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      handleAlert(true, "success", `Declaration deleted successfully`);
      setDeleteConfirm(null);
      queryClient.invalidateQueries({ queryKey: [] });
    } catch (error) {
      console.log(error);
    }
  };

  return { handleDelete };
};

export default useDeleteInvestment;
