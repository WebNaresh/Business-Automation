import { Info } from "@mui/icons-material";
import Divider from "@mui/material/Divider";
import axios from "axios";
import { format } from "date-fns";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { UseContext } from "../../../../State/UseState/UseContext";
import PublicSkeletonComponent from "../SkeletonComponents/PublicSkeletonComponent";

const PublicHolidayDisplayList = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const GetUpcomingHoliday = async () => {
    const data = await axios.get(
      `${import.meta.env.VITE_API}/route/holiday/getUpcomingHoliday`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return data;
  };

  const { data: upcomingHoliday, isLoading } = useQuery(
    ["upcomingHolidays", authToken],
    GetUpcomingHoliday
  );

  return (
    <article  >
      {isLoading ? (
        <PublicSkeletonComponent />
      ) : (
        <div className="bg-gray-200 rounded-md  w-full border">
          <div className="border-b-[2px] flex w-full px-4 items-center justify-between">
            <div className="flex items-center gap-2 py-2  ">
              <h1 className="text-lg  font-bold text-[#67748E]">
                Upcoming Public Holiday
              </h1>
            </div>
          </div>

          {upcomingHoliday?.data?.upcomingHolidays?.length <= 0 ? (
            <div className="px-5 py-2  ">
              <div className="space-x-2 items-center text-red-600  flex">
                <Info className="text-xl text-red-600" />
                <h1 className="text-lg  font-bold">No vacations</h1>
              </div>
            </div>
          ) : (
            upcomingHoliday?.data?.upcomingHolidays.map((item, id) => (
              <div key={id}>
                <div className="p-4">
                  <h1 className="text-lg">{item.name}</h1>
                  <p className="text-md">{format(new Date(item.date), "PP")}</p>
                </div>
                <Divider variant="fullWidth" orientation="horizontal" />
              </div>
            ))
          )}
        </div>
      )}
    </article>
  );
};

export default PublicHolidayDisplayList;
