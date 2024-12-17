import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { Skeleton } from "@mui/material";
import React from "react";
import { useParams } from "react-router";
import Setup from "../Setup";
import useSetupRemotePunching from "../../../hooks/QueryHook/Setup/remote-punching";
import MiniForm from "./components/mini-form";

const RemoteSetup = () => {
  //get organisationId
  const { organisationId } = useParams();
  const { data, isLoading, mutate } = useSetupRemotePunching(organisationId);
  return (
    <>
      <section className="bg-gray-50 overflow-hidden min-h-screen w-full">
        <Setup>
          <article className=" bg-white  w-full h-max shadow-md rounded-sm border items-center">
            <div className="p-4 border-b-[.5px] flex justify-between gap-3 w-full border-gray-300">
              <div className="flex gap-3">
                <div className="mt-1">
                  <FingerprintIcon />
                </div>
                <div>
                  <h1 className="!text-lg">Remote Punching And Geo Fencing</h1>
                  <p className="text-xs text-gray-500">
                    Configure remote punching and geo fencing settings
                  </p>
                </div>
              </div>
            </div>
            {isLoading ? (
              <div className="p-5 flex flex-col gap-5">
                <Skeleton variant="rectangular" height={32} />
                <Skeleton variant="rectangular" height={32} />
              </div>
            ) : (
              data && <MiniForm data={data} mutate={mutate} />
            )}
          </article>
        </Setup>
      </section>
    </>
  );
};

export default RemoteSetup;
