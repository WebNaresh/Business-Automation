import React from "react";
import Card from "./components/card";
import useNotification from "./components/useNotification";

const ParentNotification = () => {
  const { dummyData } = useNotification();
  const visibleData = dummyData.filter((item) => item.visible === true);

  return (
    <div className="pt-5">
      <div className="w-full h-full gap-2 flex p-4 md:flex-wrap md:flex-row flex-col justify-center">
        <Card card={visibleData} />
      </div>
    </div>
  );
};

export default ParentNotification;
