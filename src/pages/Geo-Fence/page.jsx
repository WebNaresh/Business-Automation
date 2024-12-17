import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { useState } from "react";
import ReusableModal from "../../components/Modal/component";
import HeaderBackComponent from "../../components/header/component";
import useGetCurrentLocation from "../../hooks/Location/useGetCurrentLocation";
import AddGeoFencing from "./components/AddGeoFencing";
import GeoFencingCard from "./components/GeoFenceCard";
import useOrgGeo from "./useOrgGeo";

const GeoFencing = () => {
  const [open, setOpen] = useState(false);
  const { data } = useOrgGeo();
  const { data: locationData } = useGetCurrentLocation();

  return (
    <>
      <HeaderBackComponent
        heading={"Geo Fencing"}
        oneLineInfo={`You can activate geofencing for a specific zone`}
      />
      <div className="px-6 text-Brand-washed-blue/brand-washed-blue-10">
        <div className="flex justify-between items-center">
          {" "}
          <div className="py-4">Added Geo-Fenced Zones</div>
          <Button
            className="!h-fit gap-2 !w-fit"
            variant="contained"
            size="medium"
            disabled={!!!data}
            onClick={() => {
              setOpen(true);
            }}
          >
            <Add /> Add
          </Button>
        </div>
        <div className="flex gap-4 overflow-auto py-4">
          {data
            ? data?.area?.map((item) => (
              <GeoFencingCard key={item} item={item} />
            ))
            : "Sorry but you have not enable geo fencing checkbox from setup page."}
        </div>
        <ReusableModal
          open={open}
          heading={"Add Geo Fencing"}
          subHeading={"You can activate geofencing for a specific zone"}
          onClose={() => setOpen(false)}
        >
          <AddGeoFencing onClose={() => setOpen(false)} data={locationData} />
        </ReusableModal>
      </div>
    </>
  );
};

export default GeoFencing;
