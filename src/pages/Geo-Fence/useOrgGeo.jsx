import axios from "axios";
// import { useContext } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
// import { TestContext } from "../../State/Function/Main";

const useOrgGeo = (orgId) => {
  const { organisationId: paramsOrgId } = useParams();
  const organisationId = orgId || paramsOrgId;

  // const { handleAlert } = useContext(TestContext);
  const getOrgCircle = async () => {
    const result = await axios.get(
      `${import.meta.env.VITE_API}/route/geo-fence/${organisationId}`
    );
    return result.data;
  };

  const { data, error } = useQuery({
    queryKey: ["geo-fenced-areas", organisationId],
    queryFn: getOrgCircle,
    enabled: organisationId !== undefined,

    onError: (error) => {
      console.error(`🚀 ~ file: useOrgGeo.jsx:27 ~ error`, error);
      //handleAlert(true, "error", error?.response?.data?.message || "Error");
    },
  });
  return { data, error };
};

export default useOrgGeo;
