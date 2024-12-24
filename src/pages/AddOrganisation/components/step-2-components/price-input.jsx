import React from "react";
import { packageArray } from "../../../../utils/Data/data";
import PricingCard from "./pricing-card";

const PriceInput = ({ field }) => {
  return (
    <div className="grid grid-cols-1   md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 ">
      <div className="flex justify-center ">
        <PricingCard
          h1="Essential Plan"
          price={30}
          onChange={field.onChange}
          downDescriptionText="Click to view the other benefits"
          packageId={import.meta.env.VITE_BASICPLAN || "plan_NgWEcv4vTZx"}
          value={field.value}
          // selected={field.value?.packageId === (import.meta.env.VITE_BASICPLAN || "plan_NgWEcv4vTZx")}
          mapArray={packageArray.filter(
            (doc, index) => doc.Essential === "✓" && index <= 6
          )}
        />
      </div>
      <div className="flex justify-center ">
        <PricingCard
          h1="Basic Plan"
          price={55}
          onChange={field.onChange}
          packageId={import.meta.env.VITE_BASICPLAN || "plan_NgWEcv4vEvrZFc"}
          value={field.value}
          // selected={field.value?.packageId === (import.meta.env.VITE_BASICPLAN || "plan_NgWEcv4vEvrZFc")}
          mapArray={packageArray.filter(
            (doc, index) => doc.Basic === "✓" && index <= 6
          )}
        />
      </div>
      <div className="flex justify-center ">
        <PricingCard
          h1="Intermediate Plan"
          price={85}
          downDescriptionText="Click to 19 more packages"
          mapArray={packageArray
            .filter((doc, index) => doc.Intermediate === "✓" && index <= 6)
            .reverse()}
          packageId={
            import.meta.env.VITE_INTERMEDIATE || "plan_NgWFMMrbumeC2U"
          }
          onChange={field.onChange}
          value={field.value}
          //  selected={field.value?.packageId === (import.meta.env.VITE_BASICPLAN || "plan_NgWFMMrbumeC2U")}
        />
      </div>
      <div className="flex justify-center ">
        <PricingCard
          h1="Enterprise Plan"
          price={"Need Basis"}
          downDescriptionText="Click to 27 more packages"
          mapArray={packageArray
            .filter((doc, index) => doc.Enterprise === "✓")
            .reverse()
            .filter((doc, index) => index <= 6)}
          packageId={import.meta.env.VITE_ENTERPRISE || "plan_NgWFtyZ4Ifd8WD"}
          onChange={field.onChange}
          value={field.value}
          // selected={field.value?.packageId === (import.meta.env.VITE_BASICPLAN || "plan_NgWFtyZ4Ifd8WD")}
        />
      </div>
    </div>
  );
};

export default PriceInput;
