import { Skeleton } from "@mui/material";
import React from "react";
import { useParams } from "react-router";
import Setup from "../Setup";

import { SchoolOutlined } from "@mui/icons-material";
import useSetupTraining from "../../../hooks/QueryHook/Setup/training";
import MiniForm from "./components/mini-form";

const Training = () => {
  const { organisationId } = useParams();

  const { data, isLoading, mutate, isFetching } =
    useSetupTraining(organisationId);

  return (
    <>
      <section className="bg-gray-50 overflow-hidden min-h-screen w-full">
        <Setup>
          <article className=" bg-white  w-full h-max shadow-md rounded-sm border items-center">
            <div className="p-4 border-b-[.5px] flex justify-between gap-3 w-full border-gray-300">
              <div className="flex gap-3">
                <div className="mt-1">
                  <SchoolOutlined />
                </div>
                <div>
                  <h1 className="!text-lg">Training</h1>
                </div>
              </div>
            </div>
            {isLoading || isFetching ? (
              <div className="p-5 flex flex-col gap-5">
                <Skeleton variant="rectangular" height={32} />
                <Skeleton variant="rectangular" height={32} />
              </div>
            ) : (
              // data?.data && (
              <MiniForm
                data={data?.data}
                mutate={mutate}
                organisationId={organisationId}
              />
              // )
            )}
          </article>
        </Setup>
      </section>
    </>
  );
};

export default Training;
