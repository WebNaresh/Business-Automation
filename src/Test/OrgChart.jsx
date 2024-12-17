import { West } from "@mui/icons-material";
import { Avatar, CircularProgress, IconButton } from "@mui/material";
import axios from "axios";
import OrgTree from "react-org-tree";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import useAuthToken from "../hooks/Token/useAuth";

export default function OrgChart() {
  const { organizationId } = useParams();
  const authToken = useAuthToken();
  const { data: orgChart, isLoading } = useQuery("orgChart", async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/employee/getOrgTree/${organizationId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return data;
  });

  const data = !isLoading ? orgChart : [];

  // ${
  //                    data.name === "HR"
  //                      ? "border-t-[3px] border-green-500"
  //                      : data.name === "Manager"
  //                      ? "border-t-[3px] border-blue-500"
  //                      : "border-t-[3px] border-gray-500"
  //                  }

  const navigate = useNavigate();

  return (
    <>
      <header className="text-xl w-full pt-6 flex items-start gap-2 border-b shadow-md p-4">
        <IconButton onClick={() => navigate(-1)}>
          <West className=" !text-xl" />
        </IconButton>

        <div className="flex justify-between w-full">
          <div>Organisation Hierarchy</div>
        </div>
      </header>
      <div className="flex   p-4 h-auto bg-white   justify-center w-full">
        <div className=" bg-white  overflow-x-auto  ">
          {isLoading ? (
            <CircularProgress />
          ) : (
            <div className="w-max  flex justify-center my-10">
              <OrgTree
                expandAll={true}
                data={data}
                horizontal={false}
                collapsable={true}
                labelClassName="!p-0 !m-0 !bg-transparent !shadow-none"
                renderContent={(data) => {
                  return (
                    <div
                      className={` border !bg-gray-50 !text-gray-900 rounded-md !p-4  !px-12`}
                    >
                      <div className="flex  !bg-gray-50 items-center gap-2">
                        <Avatar
                          src={data.image}
                          sx={{ width: 40, height: 40 }}
                        />
                        <div>
                          <h1 className=" flex text-lg font-medium gap-2">
                            {data.title}
                          </h1>
                          <p className="text-sm text-gray-600 ">{data.name}</p>
                          <p className="text-sm text-gray-600 ">{data?.desg}</p>
                          </div>
                      </div>
                    </div>
                  );
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
