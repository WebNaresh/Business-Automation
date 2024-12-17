import React from "react";
import useOrgList from "../../hooks/QueryHook/Orglist/hook";
import BillingCard from "./components/billing-card";

const Billing = () => {
  const { data, isLoading } = useOrgList();
  return (
    <div className="p-4 gap-4 flex flex-col pt-14">
      {!isLoading &&
        data?.organizations?.map((doc, i) => {
          return <BillingCard key={i} doc={doc} />;
        })}
    </div>
  );
};

export default Billing;
