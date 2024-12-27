import { useParams } from "react-router-dom";

type Props = {};

const DepartmentEmployee = (props: Props) => {
  const params = useParams<{
    organisationId: string;
    departmentId: string;
  }>();
  console.log(`🚀 ~ file: page.tsx:7 ~ params:`, params);
  console.log(`🚀 ~ file: page.tsx:4 ~ props:`, props);
  return <div>Page</div>;
};

export default DepartmentEmployee;
