import { Button } from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useContext, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import useOrg from "../../../State/Org/Org";
import PackageInfo from "../../../components/Modal/PackagesModal/package-info";
import Loader from "../../../components/app-loader/page";
import useGetUser from "../../../hooks/Token/useUser";
import { packageArray } from "../../../utils/Data/data";
import { packagesArray } from "./data";
import PricingCard from "./step-2-components/pricing-card";

const Step4 = ({ prevStep }) => {
  // to define state , hook , import other function
  const [confirmOpen, setConfirmOpen] = useState(false);
  const data = useOrg();
  const { handleAlert } = useContext(TestContext);
  const navigate = useNavigate();
  const { authToken, decodedToken } = useGetUser();
  const config = {
    headers: {
      Authorization: authToken,
    },
  };

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

  const { mutate, isLoading } = useMutation({
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

  const getPackagesPrice = packagesArray
    .filter((item) => data?.packages?.find((pkg) => item?.label === pkg.label))
    .reduce((acc, item) => acc + item.price, 0);

  // to define the function for package calculation
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
  if (data?.packageInfo === undefined) {
    return "Please Select Plan And Package";
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="px-4 grid bg-[#f8fafb] p-4 rounded-md items-center">
      <div className="p-4 gap-4 flex flex-col items-center">
        <div className=" ">
          <h2 className="text-2xl font-bold pl-24">Your Package Pricing</h2>
          <p className=" text-gray-500">
            You have selected {data?.packageInfo?.packageName}{" "}
            {data?.verifyToken?.discount
              ? `so your price will be ${
                  getPriceMain * data?.count ?? 0
                } along with coupon discount of ${
                  data?.verifyToken?.discount
                } % total price will be ${
                  getPriceMain * data?.count -
                    (getPriceMain * data?.count) / data?.verifyToken?.discount +
                    (getPriceMain * data?.count -
                      (getPriceMain * data?.count) /
                        data?.verifyToken?.discount) *
                      0.02 ?? 0
                } `
              : `Total price will be
            ${getPriceMain * data?.count ?? 0}
            Rs`}
          </p>
        </div>
        <div className="flex flex-col gap-2 !row-span-4">
          <PricingCard
            setConfirmOpen={setConfirmOpen}
            h1={data?.packageInfo?.packageName}
            downDescriptionText="Click to view the other benefits"
            packageId={process.env.REACT_APP_BASICPLAN || "plan_NgWEcv4vEvrZFc"}
            value={data?.packageId}
            price={getPriceMain}
            mapArray={returnArray(data?.packageInfo?.packageName)}
            button={false}
          />
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          <Button
            type="button"
            variant="outlined"
            onClick={prevStep}
            className="mr-2"
          >
            Back
          </Button>

          {/* <Button onClick={mutate} variant="contained">
            Submit
          </Button> */}

          <Button
            onClick={(e) => {
              e.preventDefault();
              mutate();
            }}
            variant="contained"
          >
            Submit
          </Button>

          <PackageInfo
            open={confirmOpen}
            handleClose={() => {
              setConfirmOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Step4;

const returnArray = (plan = "Basic Plan") => {
  if (plan === "Basic Plan") {
    return packageArray.filter((doc, index) => doc.Basic === "✓" && index <= 5);
  } else if (plan === "Intermediate Plan") {
    return packageArray
      .filter((doc, index) => doc.Intermediate === "✓" && index <= 5)
      .reverse();
  } else if (plan === "Essential Plan") {
    return packageArray
      .filter((doc, index) => doc.Essential === "✓" && index <= 5)
      .reverse();
  } else {
    return packageArray
      .filter((doc, index) => doc.Enterprise === "✓")
      .reverse()
      .filter((doc, index) => index <= 5);
  }
};

// import { Button } from "@mui/material";
// import axios from "axios";
// import moment from "moment";
// import React, { useContext, useMemo, useState } from "react";
// import { useMutation } from "react-query";
// import { useNavigate } from "react-router-dom";
// import { TestContext } from "../../../State/Function/Main";
// import useOrg from "../../../State/Org/Org";
// import PackageInfo from "../../../components/Modal/PackagesModal/package-info";
// import Loader from "../../../components/app-loader/page";
// import useGetUser from "../../../hooks/Token/useUser";
// import { packageArray } from "../../../utils/Data/data";
// import { packagesArray } from "./data";
// import PricingCard from "./step-2-components/pricing-card";

// const Step4 = ({prevStep}) => {
//   // to define state , hook , import other function
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const data = useOrg();
//   const { handleAlert } = useContext(TestContext);
//   const navigate = useNavigate();
//   const { authToken, decodedToken } = useGetUser();
//   const config = {
//     headers: {
//       Authorization: authToken,
//     },
//   };

//   // to define the handleForm function to add organization
//   const handleForm = async () => {
//     if (data.packageInfo === undefined) {
//       return "Please Select Plan And Package";
//     }

//     let totalPrice =
//       getPriceMain * data?.count -
//       (data?.verifyToken?.discount
//         ? Number((getPriceMain * data?.count) / data?.verifyToken?.discount) ??
//         0
//         : 0);
//     const mainData = {
//       ...data,
//       coupan: data?.verifyToken?.coupan,
//       packageInfo: data?.packageInfo?.packageName,
//       totalPrice: totalPrice + totalPrice * 0.02,
//     };

//     const response = await axios.post(
//       `${process.env.REACT_APP_API}/route/organization`,
//       mainData,
//       config
//     );
//     return response.data;
//   };

//   const { mutate, isLoading } = useMutation({
//     mutationFn: handleForm,
//     onSuccess: async (data) => {
//       if (data?.paymentType === "Phone_Pay") {
//         window.location.href = data?.redirectUrl;
//       } else if (data?.paymentType === "RazorPay") {
//         const options = {
//           key: data?.key,
//           amount: data?.order?.amount,
//           currency: "INR",
//           name: "Aegis Plan for software", //your business name
//           description: "Get Access to all premium keys",
//           image: data?.organization?.image,
//           order_id: data.order.id, //This
//           callback_url: data?.callbackURI,
//           prefill: {
//             name: `${decodedToken?.user?.first_name} ${decodedToken?.user?.last_name}`, //your customer's name
//             email: decodedToken?.user?.email,
//             contact: decodedToken?.user?.phone_number,
//           },
//           notes: {
//             address:
//               "C503, The Onyx-Kalate Business Park, near Euro School, Shankar Kalat Nagar, Wakad, Pune, Pimpri-Chinchwad, Maharashtra 411057",
//           },
//           theme: {
//             color: "#1976d2",
//           },
//           modal: {
//             ondismiss: function () {
//               console.log("Checkout form closed by the user");
//             },
//           },
//         };
//         const razor = new window.Razorpay(options);
//         razor.open();
//       } else {
//         handleAlert(true, "success", data?.message);
//         navigate("/organizationList");
//       }
//     },
//     onError: async (data) => {
//       console.error(`🚀 ~ file: mini-form.jsx:48 ~ data:`, data);

//       handleAlert(
//         true,
//         "error",
//         data?.response?.data?.message || "Please fill all mandatory field"
//       );
//     },
//   });

//   const getPackagesPrice = packagesArray
//     .filter((item) => data?.packages?.find((pkg) => item?.label === pkg.label))
//     .reduce((acc, item) => acc + item.price, 0);

//   // to define the function for package calculation
//   const getPriceMain = useMemo(() => {
//     const expirationDate = moment().add(3 * data?.cycleCount, "months");
//     const dateDifference = expirationDate.diff(moment(), "days");
//     if (data?.packageInfo?.packageName === "Basic Plan") {
//       const perDayPrice = 55 / dateDifference;
//       return Math.round(perDayPrice * dateDifference);
//     } else if (data?.packageInfo?.packageName === "Essential Plan") {
//       const perDayPrice = 30 / dateDifference;
//       return Math.round(perDayPrice * dateDifference);
//     } else if (data?.packageInfo?.packageName === "Intermediate Plan") {
//       const perDayPrice = 85 / dateDifference;
//       return Math.round(perDayPrice * dateDifference);
//     } else {
//       return 115 + Number(getPackagesPrice) ?? 0;
//     }
//   }, [data?.cycleCount, data?.packageInfo?.packageName, getPackagesPrice]);
//   if (data?.packageInfo === undefined) {
//     return "Please Select Plan And Package";
//   }

//   if (isLoading) {
//     return <Loader />;
//   }

//   return (
//     <div className="px-4 grid bg-[#f8fafb] p-4 rounded-md items-center">
//       <div className="p-4 gap-4 flex flex-col items-center">
//         <div className=" ">
//           <h2 className="text-2xl font-bold pl-24">Your Package Pricing</h2>
//           <p className=" text-gray-500" >
//             You have selected {data?.packageInfo?.packageName}{" "}
//             {data?.verifyToken?.discount
//               ? `so your price will be ${getPriceMain * data?.count ?? 0
//               } along with coupon discount of ${data?.verifyToken?.discount
//               } % total price will be ${getPriceMain * data?.count -
//               (getPriceMain * data?.count) / data?.verifyToken?.discount +
//               (getPriceMain * data?.count -
//                 (getPriceMain * data?.count) /
//                 data?.verifyToken?.discount) *
//               0.02 ?? 0
//               } `
//               : `Total price will be
//             ${getPriceMain * data?.count ?? 0}
//             Rs`}
//           </p>
//         </div>
//         <div className="flex flex-col gap-2 !row-span-4">
//           <PricingCard
//             setConfirmOpen={setConfirmOpen}
//             h1={data?.packageInfo?.packageName}
//             downDescriptionText="Click to view the other benefits"
//             packageId={process.env.REACT_APP_BASICPLAN || "plan_NgWEcv4vEvrZFc"}
//             value={data?.packageId}
//             price={getPriceMain}
//             mapArray={returnArray(data?.packageInfo?.packageName)}
//             button={false}
//           />
//         </div>
//         <div className="flex justify-center space-x-4 mt-4">

//         <Button type="button" variant="outlined" onClick={prevStep} className="mr-2">Back</Button>
//           <Button onClick={mutate} variant="contained">
//             Submit
//           </Button>
//           <PackageInfo
//             open={confirmOpen}
//             handleClose={() => {
//               setConfirmOpen(false);
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Step4;

// const returnArray = (plan = "Basic Plan") => {
//   if (plan === "Basic Plan") {
//     return packageArray.filter((doc, index) => doc.Basic === "✓" && index <= 5);
//   } else if (plan === "Intermediate Plan") {
//     return packageArray
//       .filter((doc, index) => doc.Intermediate === "✓" && index <= 5)
//       .reverse();
//   } else if (plan === "Essential Plan") {
//     return packageArray
//       .filter((doc, index) => doc.Essential === "✓" && index <= 5)
//       .reverse();
//   } else {
//     return packageArray
//       .filter((doc, index) => doc.Enterprise === "✓")
//       .reverse()
//       .filter((doc, index) => index <= 5);
//   }
// };
