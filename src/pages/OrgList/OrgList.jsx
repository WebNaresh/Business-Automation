import ClearIcon from "@mui/icons-material/Clear";
import {
  Avatar,
  Button,
  IconButton,
  Skeleton,
  TextField,
  Tooltip,
} from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import { motion } from "framer-motion";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeaderComponentPro from "../../components/header/HeaderComponentPro";
import useOrgList from "../../hooks/QueryHook/Orglist/hook";
import Organisation from "../Home/components/Organisation";

const OrgList = () => {
  const { data, isLoading, refetch } = useOrgList();
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search query with debouncing to reduce the number of renders
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  // Filter organizations based on search query
  const filteredOrganizations = data?.organizations?.filter((org) =>
    org.orgName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Clear search input field
  const clearSearch = () => {
    setSearchQuery("");
  };

  // Initialize AOS for animations
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // Refetch organizations when component mounts or when refetch is called
  useEffect(() => {
    refetch(); // Refetch data when component mounts
  }, [refetch]);

  // Skeleton loader animation
  const SkeletonLoader = () => (
    <div
      data-aos="fade-up"
      className="border-b-[3px] block min-w-[21rem] rounded-lg bg-white shadow-md dark:bg-neutral-200"
    >
      <div className="border-b-2 flex items-center justify-between border-[#0000002d] px-6 py-3 text-black">
        <Avatar variant="rounded" sx={{ height: 35, width: 35 }} />
      </div>
      <div className="p-6 pt-6 pb-4">
        <Skeleton
          animation="wave"
          height={35}
          width="60%"
          style={{ marginBottom: 6 }}
        />
        <Skeleton animation="wave" height={30} width="80%" />
      </div>
      <div className="p-6 py-4 flex gap-4">
        <Skeleton variant="rounded" height={30} width="30%" />
        <Skeleton variant="rounded" height={30} width="50%" />
      </div>
    </div>
  );

  return (
    <section className="p-2 mt-10 shadow-lg ">
      <HeaderComponentPro
        heading={" Organisations List"}
        oneLineInfo={
          "Effortlessly select and manage all aspects of your organisation"
        }
      />

      <div className="min-h-screen">
        {/* Search and Button Section */}
        <div className="px-8 mt-6 mb-4 w-full">
          <div className="flex md:justify-between items-start gap-4 flex-col md:flex-row">
            <div className="text-left sm:text-center md:text-center lg:text-left">
              <h1 className="md:text-lg text-xl font-semibold">
                Manage Your Organisations
              </h1>
              <p className="text-gray-600">
                Select and Manage Your Organisation
              </p>
            </div>
          </div>
        </div>
        {/* Content Section */}
        <div className="flex flex-wrap lg:justify-start md:justify-center  xs:justify-center gap-x-6 gap-y-4 px-4 md:px-8">
          {isLoading ? (
            // Display skeleton loaders while data is loading
            Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={index}
                className="flex-grow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                data-aos="fade-up"
              >
                <SkeletonLoader />
              </motion.div>
            ))
          ) : filteredOrganizations?.length === 0 ? (
            <p className="text-gray-600 text-lg" data-aos="fade-up">
              No Organisations Found
            </p>
          ) : (
            filteredOrganizations?.map((item) => (
              <motion.div
                key={item._id}
                className="h-max max-w-xs sm:max-w-sm md:max-w-md py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                data-aos="fade-up"
              >
                <div>
                  <Organisation item={item} />
                </div>
              </motion.div>
            ))
          )}
        </div>
        <br />
        <br />
      </div>
    </section>
  );
};

export default OrgList;
