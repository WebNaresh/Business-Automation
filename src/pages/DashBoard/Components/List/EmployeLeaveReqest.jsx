
import { Info } from "@mui/icons-material";
import { Avatar, Card } from "@mui/material";
import Divider from "@mui/material/Divider";
import axios from "axios";
import { format } from "date-fns";
import React, { useContext, useEffect } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { UseContext } from "../../../../State/UseState/UseContext";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";


const EmployeeLeaveRequest = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);
  
  const { data: EmployeeLeavesRequest } = useQuery(
    "employeeleaves",
    async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/leave/get`,
          {
            headers: { Authorization: authToken },
          }
        );
        return response.data.leaveRequests;
      } catch (err) {
        throw err;
      }
    }
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card elevation={3} className="mt-4">
        <div
          className="bg-gray-100 rounded-md w-full shadow-md"
          data-aos="fade-up"
        >
          <div className="flex w-full px-4 items-center justify-between">
            <div className="flex items-center gap-2 py-1">
              <h1 className="text-xl my-2 font-bold text-[#67748E]">
                Employee Leave Request
              </h1>
            </div>
            <Link
              to={"/notification"}
              className="flex group justify-center gap-2 items-center rounded-md h-max px-4 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
            >
              View All
            </Link>
          </div>
          <Divider variant="fullWidth" orientation="horizontal" />
          {EmployeeLeavesRequest?.length > 0 ? (
            EmployeeLeavesRequest?.slice(0, 3)?.map((item, id) => (
              <motion.div
                className="p-4"
                key={id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: id * 0.2 }}
              >
                <div className="gap-3 flex">
                  <Avatar variant="circle" />
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-lg tracking-tight">
                        {item?.employeeId?.first_name}{" "}
                        {item?.employeeId?.last_name}
                      </h1>
                      <h1 className={`font-bold text-sm text-[#67748E]`}>
                        {item.title}
                      </h1>
                    </div>
                    <p className="text-md">
                      {format(new Date(item?.start), "PP")} -{" "}
                      {format(new Date(item?.end), "PP")}{" "}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="!text-2xl" />
                <h1 className="text-xl font-semibold">No record found</h1>
              </article>
              <p>Currently no leave request is pending</p>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default EmployeeLeaveRequest;
