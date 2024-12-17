import { Add, Info } from "@mui/icons-material";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import { Button } from "@mui/material";
import React, { useState } from "react";
import Setup from "../SetUpOrganization/Setup";
import DesignationRow from "./components/desingation-row";
import AddDesignation from "./components/mini-form-add";
import useDesignation from "./hooks/useDesignation";

const Designation = () => {
  const [click, setClick] = useState(false);
  const {
    designation,
    addDesignationMutation,
    updateDesignationMutation,
    deleteDesignationMutation,
    isFetching,
  } = useDesignation();

  return (
    <>
      <section className="bg-gray-50 overflow-hidden min-h-screen w-full">
        <Setup>
          <article className=" bg-white  w-full  h-max shadow-md rounded-sm border  items-center">
            <div className="p-4 border-b-[.5px] flex  justify-between gap-3 w-full border-gray-300">
              <div className="flex gap-3 ">
                <div className="mt-1">
                  <AssignmentIndOutlinedIcon />
                </div>
                <div>
                  <h1 className="!text-lg">Designation</h1>
                  <p className="text-xs text-gray-600">
                    Add multiple designation to your organisation.
                  </p>
                </div>
              </div>
              <Button
                className="!font-semibold !bg-sky-500 flex items-center gap-2"
                onClick={() => setClick(true)}
                variant="contained"
              >
                <Add />
                Add Designation
              </Button>
            </div>
            {designation?.length > 0 ? (
              <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
                <table className="min-w-full bg-white text-left !text-sm font-light">
                  <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                    <tr className="!font-semibold ">
                      <th scope="col" className="!text-left pl-8 py-3 w-1/12">
                        Sr. No
                      </th>
                      <th scope="col" className="py-3 w-8/12">
                        Designation Name
                      </th>
                      <th scope="col" className="px-6 py-3 w-2/12">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!isFetching &&
                      designation?.map((data, id) => (
                        <DesignationRow
                          key={id}
                          {...{
                            data,
                            id,
                            deleteDesignationMutation,
                            updateDesignationMutation,
                          }}
                        />
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                <article className="flex items-center mb-1 text-red-500 gap-2">
                  <Info className="text-2xl" />
                  <h1 className="text-lg font-semibold">Add Designation</h1>
                </article>
                <p>No designation found. Please add a designation.</p>
              </section>
            )}
            <AddDesignation
              {...{
                open: click,
                handleClose: () => setClick(false),
                addDesignationMutation,
              }}
            />
          </article>
        </Setup>
      </section>
    </>
  );
};

export default Designation;
