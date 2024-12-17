import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { Checkbox, FormControlLabel, Skeleton } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import Setup from "../Setup";
const AddRoles = () => {
  const { organisationId } = useParams("");
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();

  const fetchProfiles = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/profile/role/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Error fetching data");
    }
  };

  const { data, isLoading } = useQuery("profiles", fetchProfiles);

  const AddProfiles = useMutation(
    (data) =>
      axios.patch(
        `${process.env.REACT_APP_API}/route/profile/role/${organisationId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["profiles"] });
        handleAlert(true, "success", "Roles created successfully.");
      },
      onError: () => {
        handleAlert(true, "error", "Error from server");
      },
    }
  );

  const [roleState, setRoleState] = useState({});

  useEffect(() => {
    setRoleState(data?.roles);
    // eslint-disable-next-line
  }, [isLoading]);

  const handleRoleChange = (role) => {
    setRoleState((prevRoles) => ({
      ...prevRoles,
      [role]: {
        ...prevRoles[role],
        isActive: !prevRoles[role].isActive,
      },
    }));
  };

  const handleSubmit = async () => {
    await AddProfiles.mutateAsync(roleState);
  };

  return (
    <>
      <section className="bg-gray-50 min-h-screen w-full">
        <Setup>
          <div>
            <div className="p-4 border-b-[.5px] flex   gap-4 w-full border-gray-300">
              <div className="mt-1">
                <GroupOutlinedIcon />
              </div>
              <div>
                <h1 className="!text-lg">Manage Roles</h1>
                <p className="text-xs text-gray-600">
                  Select multiple roles to able to manage your organisation.
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4 flex flex-col flex-wrap">
                {Array.from({ length: 5 }, (_, id) => (
                  <div
                    key={id}
                    className=" flex justify-between p-2 rounded-md "
                  >
                    <div className="flex gap-2 w-full">
                      <Skeleton width={"5%"} height={45} />
                      <Skeleton width={"30%"} height={45} />
                    </div>
                    <Skeleton width={"20%"} height={45} />
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {Object.entries(roleState ?? [])?.map(([role, obj], index) => (
                  <div
                    key={index}
                    className="border-gray-200 flex justify-between py-2 px-6"
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={obj.isActive}
                          onChange={() => handleRoleChange(role)}
                        />
                      }
                      label={role}
                    />
                    {/* {obj.isActive && (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={obj.isApprover || false}
                            onChange={(event) =>
                              handleIsApproverChange(event, role)
                            }
                          />
                        }
                        label="Is Approver"
                      />
                    )} */}
                  </div>
                ))}
                <div className="px-6 py-2 w-full">
                  <button
                    onClick={handleSubmit}
                    className=" flex  group justify-center gap-2 items-center rounded-md px-6 py-2 text-md  text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </Setup>
      </section>
    </>
  );
};

export default AddRoles;
