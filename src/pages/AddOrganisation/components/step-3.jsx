import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calculate,
  FactoryOutlined,
  RecyclingRounded,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import useOrg from "../../../State/Org/Org";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useGetUser from "../../../hooks/Token/useUser";
import { packagesArray } from "./data";

// to define the package count schema
const packageCountSchema = z.object({
  count: z
    .string()
    .refine((doc) => Number(doc) > 0, { message: "Count is greater than 0" }),
  cycleCount: z.string().refine((doc) => Number(doc) > 0, {
    message: "Cycle Count is greater than 0",
  }),
  coupan: z.string().optional(),
  paymentType: z.enum(["Phone_Pay", "RazorPay"]),
});

const Step3 = ({ prevStep }) => {
  // to define the state, hook and import the other function

  const data = useOrg();
  const { authToken, decodedToken } = useGetUser();
  const config = {
    headers: {
      Authorization: authToken,
    },
  };
  const {
    count,
    cycleCount,
    paymentType,
    packageInfo,
    setVerifyToken,
    coupan,
  } = data;
  const navigate = useNavigate();

  // use useForm
  const { control, handleSubmit, formState } = useForm({
    defaultValues: {
      count,
      cycleCount,
      paymentType,
      coupan,
    },
    resolver: zodResolver(packageCountSchema),
  });
  const getPackagesPrice = packagesArray
    .filter((item) => data?.packages?.find((pkg) => item?.label === pkg.label))
    .reduce((acc, item) => acc + item.price, 0);
  const getPriceMain = useMemo(() => {
    const expirationDate = moment().add(3 * data?.cycleCount, "months");
    const dateDifference = expirationDate.diff(moment(), "days");
    if (data?.packageInfo?.packageName === "Basic Plan") {
      const perDayPrice = 55 / dateDifference;
      return Math.round(perDayPrice * dateDifference);
    } else if (data?.packageInfo?.packageName === "Essential Plan") {
      const perDayPrice = 30 / dateDifference;
      return Math.round(perDayPrice * dateDifference);
    } else if (data?.packageInfo?.packageName === "Intermediate Plan") {
      const perDayPrice = 85 / dateDifference;
      return Math.round(perDayPrice * dateDifference);
    } else {
      return 115 + Number(getPackagesPrice) ?? 0;
    }
  }, [data?.cycleCount, data?.packageInfo?.packageName, getPackagesPrice]);
  // to define the handleForm function to add organization

  const handleForm = async () => {
    if (data.packageInfo === undefined) {
      return "Please Select Plan And Package";
    }

    let totalPrice =
      getPriceMain * data?.count -
      (data?.verifyToken?.discount
        ? Number((getPriceMain * data?.count) / data?.verifyToken?.discount) ??
          0
        : 0);
    const mainData = {
      ...data,
      coupan: data?.verifyToken?.coupan,
      packageInfo: data?.packageInfo?.packageName,
      totalPrice: totalPrice + totalPrice * 0.02,
    };

    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/organization`,
      mainData,
      config
    );
    return response.data;
  };

  const { mutate } = useMutation({
    mutationFn: handleForm,
    onSuccess: async (data) => {
      if (data?.paymentType === "Phone_Pay") {
        window.location.href = data?.redirectUrl;
      } else if (data?.paymentType === "RazorPay") {
        const options = {
          key: data?.key,
          amount: data?.order?.amount,
          currency: "INR",
          name: "Aegis Plan for software", //your business name
          description: "Get Access to all premium keys",
          image: data?.organization?.image,
          order_id: data.order.id, //This
          callback_url: data?.callbackURI,
          prefill: {
            name: `${decodedToken?.user?.first_name} ${decodedToken?.user?.last_name}`, //your customer's name
            email: decodedToken?.user?.email,
            contact: decodedToken?.user?.phone_number,
          },
          notes: {
            address:
              "C503, The Onyx-Kalate Business Park, near Euro School, Shankar Kalat Nagar, Wakad, Pune, Pimpri-Chinchwad, Maharashtra 411057",
          },
          theme: {
            color: "#1976d2",
          },
          modal: {
            ondismiss: function () {
              console.log("Checkout form closed by the user");
            },
          },
        };
        const razor = new window.Razorpay(options);
        razor.open();
      } else {
        handleAlert(true, "success", data?.message);
        //
        navigate("/organizationList");
      }
    },
    onError: async (data) => {
      console.error(`🚀 ~ file: mini-form.jsx:48 ~ data:`, data);

      handleAlert(
        true,
        "error",
        data?.response?.data?.message || "Please fill all mandatory field"
      );
    },
  });
  const { handleAlert } = useContext(TestContext);
  const { errors } = formState;

  // State to track selected packages
  const [selectedPackages, setSelectedPackages] = useState([]);

  useEffect(() => {
    const storedPackages =
      JSON.parse(localStorage.getItem("selectedPackages")) || [];
    setSelectedPackages(storedPackages);
  }, []);

  // Handle checkbox change
  // const handleCheckboxChange = (value) => {
  //   setSelectedPackages((prev) =>
  //     prev.includes(value) ? prev.filter((pkg) => pkg !== value) : [...prev, value]
  //   );
  // };
  const handleCheckboxChange = (value) => {
    const updatedPackages = selectedPackages.includes(value)
      ? selectedPackages.filter((pkg) => pkg !== value)
      : [...selectedPackages, value];

    setSelectedPackages(updatedPackages);
    // Update local storage
    localStorage.setItem("selectedPackages", JSON.stringify(updatedPackages));
  };

  // Calculate total price based on selected packages
  const calculateTotalPrice = () => {
    return selectedPackages.reduce((total, pkg) => {
      const packageObj = packagesArray.find((item) => item.value === pkg);
      return total + (packageObj ? packageObj.price : 0);
    }, 0);
  };
  console.log(calculateTotalPrice);

  // to define the onSubmit function
  const onSubmit = async (data) => {
    setVerifyToken(null);

    mutate();
  };

  // const totalPrice = calculateTotalPrice(); // Calculate total price

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="item-center flex flex-col"
        noValidate
      >
        <div className="grid grid-cols-2 w-full gap-4">
          <AuthInputFiled
            name="count"
            icon={Calculate}
            control={control}
            type="number"
            placeholder="Member Count"
            label="Member Count *"
            errors={errors}
            error={errors.count}
          />
          <AuthInputFiled
            name="cycleCount"
            icon={RecyclingRounded}
            control={control}
            type="number"
            placeholder="Cycle count used for recycle your subscription"
            label="Cycle Count *"
            errors={errors}
            error={errors.cycleCount}
            descriptionText={
              "if you select 2 then you will be charged every 3 months subscription with 2 cycle it mean it will be 6 months subscription just amount will be charged one time."
            }
          />
        </div>

        {packageInfo?.packageName === "Enterprise Plan" && (
          <div className="flex flex-col pb-4 mb-4">
            <div className="package-selection">
              <h3 className="text-gray-500 text-md font-semibold mb-4">
                Select Package Additions:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {packagesArray.map((pkg) => (
                  <div
                    key={pkg.value}
                    className={`border rounded-md shadow-sm p-3 transition-transform transform ${
                      selectedPackages.includes(pkg.value)
                        ? "bg-blue-100 scale-105"
                        : "bg-white hover:bg-gray-100"
                    }`}
                    style={{ width: "260px", height: "50px" }}
                  >
                    <label className="flex items-center h-full cursor-pointer">
                      <input
                        type="checkbox"
                        id={pkg.value}
                        checked={selectedPackages.includes(pkg.value)}
                        onChange={() => handleCheckboxChange(pkg.value)}
                        className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 flex flex-col justify-center">
                        <span className="font-medium text-sm">
                          {pkg.label} - &nbsp; ({pkg.price} rs)
                        </span>
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 w-full gap-4">
          <div className="my-2">
            <AuthInputFiled
              name="coupan"
              icon={FactoryOutlined}
              control={control}
              type="text"
              placeholder="Ex: ABCD12345A"
              label="Enter Coupon code "
              errors={errors}
              error={errors.coupan}
              descriptionText={
                "You can request for coupan code to get discount"
              }
            />
          </div>
        </div>
        {/* <div className="flex justify-center space-x-4 mt-4">
        <Button type="button" variant="outlined" onClick={prevStep} className="!w-max !mx-auto mb-2">Back</Button>

        <Button type="submit" variant="contained" className="!w-max !mx-auto">
          Confirm & Pay
        </Button>
        </div> */}
        <div className="flex justify-center space-x-4 mt-4">
          <Button
            type="button"
            variant="outlined"
            onClick={prevStep}
            className="!w-max mb-2"
          >
            Back
          </Button>

          <Button type="submit" variant="contained" className="!w-max">
            Confirm & Pay
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Step3;
