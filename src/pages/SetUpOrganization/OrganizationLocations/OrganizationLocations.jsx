import { Add, Info } from "@mui/icons-material";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import { Button } from "@mui/material";
import React, { useState } from "react";
import { IntlProvider } from "react-intl";
import Setup from "../Setup";
import LocationAdd from "./components/location-add";
import LocationRow from "./components/location-row";
import useDepartmentLocation from "./hooks/useDepartmentLocation";

const OrganizationLocations = () => {
  const [open, setOpen] = useState(false);
  const {
    locationList,
    addLocationMutation,
    deleteLocationMutation,
    updateLocationMutation,
  } = useDepartmentLocation();
  return (
    <section className="bg-gray-50 min-h-screen w-full">
      <Setup>
        <div className=" w-full h-full bg-white   shadow-xl  rounded-sm">
          <IntlProvider locale="en">
            <div className="p-4  border-b-[.5px] border-gray-300 flex  justify-between gap-3 w-full">
              <div className="flex  gap-3 ">
                <div className="mt-1">
                  <AddLocationAltOutlinedIcon />
                </div>
                <div>
                  <h1 className="!text-lg">Location</h1>
                  <p className="text-xs text-gray-600">
                    Add organisation location here.
                  </p>
                </div>
              </div>
              <Button
                className="!bg-[#0ea5e9]"
                variant="contained"
                onClick={() => setOpen(true)}
              >
                <Add />
                Add location
              </Button>
            </div>

            {locationList && locationList?.length === 0 ? (
              <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                <article className="flex items-center mb-1 text-red-500 gap-2">
                  <Info className="text-2xl" />
                  <h1 className="text-xl font-semibold">Add Location</h1>
                </article>
                <p>No location found. Please add a location.</p>
              </section>
            ) : (
              <div className="overflow-scroll">
                <table className="min-w-full bg-white text-left text-sm font-light">
                  <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                    <tr className="!font-medium">
                      <th scope="col" className="px-3 py-3 whitespace-nowrap">
                        Sr. No
                      </th>
                      <th scope="col" className="px-3 py-3 ">
                        Continent
                      </th>
                      <th scope="col" className="px-3 py-3 ">
                        Country
                      </th>
                      <th scope="col" className="px-3 py-3 ">
                        State
                      </th>
                      <th scope="col" className="px-3 py-3 ">
                        City
                      </th>
                      <th scope="col" className="px-3 py-3 ">
                        Short Name
                      </th>
                      <th scope="col" className="px-3 py-3 ">
                        Address
                      </th>
                      <th scope="col" className="px-3 py-3 ">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {locationList?.map((location, index) => (
                      <LocationRow
                        {...{
                          location,
                          index,
                          deleteLocationMutation,
                          updateLocationMutation,
                        }}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <LocationAdd
              open={open}
              onClose={() => setOpen(false)}
              addLocationMutation={addLocationMutation}
            />
          </IntlProvider>
        </div>
      </Setup>
    </section>
  );
};

export default OrganizationLocations;
