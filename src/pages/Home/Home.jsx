import { Button, Skeleton } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import "react-multi-carousel/lib/styles.css";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";

const Home = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const getOrgList = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API}/route/organization/get`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  const { data, isLoading } = useQuery("orgDatas", getOrgList);
  return (
    <>
      <div className="md:p-8 py-4 px-0 bg-white h-screen">
        <div className="flex items-center h-[70vh] justify-center w-full">
          <div className="xl:!w-max w-full md:px-8 px-0 flex justify-center items-center xl:justify-end xl:items-end  flex-col">
            <div className="w-full lg:w-max md:px-0 px-2">
              <h1 className="md:text-4xl xs:text-2xl font-light">
                Welcome to{" "}
                <span className="md:text-4xl xl:text-left text-center xs:text-2xl gradient font-semibold text-primary">
                  InnovateTech
                </span>{" "}
              </h1>
              <h2 className="md:text-5xl xs:text-3xl sm:text-4xl leading-tight font-bold mb-4">
                Transforming
                <span className="text-primary font-bold"> Ideas into Reality</span>
              </h2>

              <p className="md:text-xl w-[80%] xs:text-base mb-8 text-gray-600 md:leading-relaxed xs:leading-normal">
                Embark on a journey of innovation with us. Experience the power of{" "}
                <span className="font-bold text-primary">InnovateTech</span>, where cutting-edge solutions meet your business needs.
              </p>

              {isLoading ? (
                <Skeleton
                  variant="rounded"
                  height={50}
                  className="w-[35%]"
                  animation="pulse"
                />
              ) : data?.organizations.length <= 0 ? (
                <Link className="!w-max !block" to={"/add-organisation"}>
                  <button className="!w-max flex group justify-center  gap-2 items-center rounded-md px-4 py-3 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500">
                    Create Your Organisation{" "}
                    <FaArrowCircleRight className="group-hover:translate-x-1 transition-all" />
                  </button>
                </Link>
              ) : (
                <Link to={"/organizationList"} className="!w-max !block">
                  <Button variant="contained" className="gap-4">
                    Go To Organisation{" "}
                    <FaArrowCircleRight className="group-hover:translate-x-1 transition-all" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="xl:block hidden">
            <img src="Home.svg" className="h-[400px]" alt="none" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
