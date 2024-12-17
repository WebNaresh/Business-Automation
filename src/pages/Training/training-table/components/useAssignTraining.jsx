import axios from "axios";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import useGetUser from "../../../../hooks/Token/useUser";

const useAssignTraining = (trainingId) => {
  const { authToken } = useGetUser();
  const { organisationId } = useParams();
  const getAllEmployee = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/employee/get-org-employee/${organisationId}/${trainingId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  const { data: employees, isLoading: employeeFetching } = useQuery(
    `getAllEmployee-${organisationId}-${trainingId}`,
    getAllEmployee,
    { refetchOnMount: false }
  );

  return { employees, employeeFetching };
};

export default useAssignTraining;
