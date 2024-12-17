import { AddCircle, QuestionMark } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import React, { useState } from "react";
import PackageInfo from "../../../../components/Modal/PackagesModal/package-info";
const array = [
  {
    packageName: "Access control",
    Basic: "✓",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Dual approval workflow",
    Basic: "✓",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Employee onboarding / offboarding",
    Basic: "✓",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Department creation",
    Basic: "✓",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Dashboard",
    Basic: "✓",
    Intermediate: "✓",
    Enterprise: "✓",
  },
];

// const PricingCard = ({
//   h1 = "Basic Plan",
//   price = 55,
//   mapArray = array,
//   downDescriptionText = "Click to 11 more packages",
//   onChange = () => null,
//   packageId,
//   value,
//   disabled = false,
//   button = true,
// }) => {
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   return (
//     // <div
//     //   className={`group shadow-xl w-[280px] relative rounded-lg bg-brand-primary-blue/brand-primary-blue-1 p-[20px] flex flex-col gap-2 border  hover:border-brand/primary-blue ${
//     //     value?.packageId === packageId
//     //       ? "border-brand/primary-blue"
//     //       : "border-Brand-washed-blue/brand-washed-blue-8"
//     //   }`}
//     //   onClick={() => {
//     //     if (!disabled) {
//     //       onChange({ packageName: h1, packageId });
//     //     }
//     //   }}
//     // >
//     <div
//   className={`group shadow-xl w-full max-w-[270px] relative rounded-lg bg-brand-primary-blue/brand-primary-blue-1 p-[20px] flex flex-col gap-2 border hover:border-brand/primary-blue ${
//     value?.packageId === packageId
//       ? "border-brand/primary-blue"
//       : "border-Brand-washed-blue/brand-washed-blue-8"
//   }`}
//   onClick={() => {
//     if (!disabled) {
//       onChange({ packageName: h1, packageId });
//     }
//   }}
// >

//       <div className=""></div>
//       <IconButton
//         color="info"
//         className="h-8 w-8 !absolute !bg-brand/primary-blue right-4 top-4"
//         aria-label="check"
//         onClick={() => setConfirmOpen(true)}
//       >
//         <QuestionMark className="text-white text-xs" />
//       </IconButton>
//       <h1 className="text-2xl font-medium">{h1}</h1>
//       <h3 className="text-lg font-bold">
//         ₹ {price} <span className="text-sm font-medium">/emp</span>
//       </h3>
//       <div className="text-sm">billed quarterly</div>
//       {/* <div
//         className="text-brand/primary-blue cursor-pointer"
//         onClick={() => setConfirmOpen(true)}
//       >
//         {descriptionText}
//       </div> */}
//       <div className="flex flex-col gap-2 text-sm">
//         {mapArray.map((doc, key) => {
//           return (
//             <div key={key} className="flex gap-2">
//               <div className="w-6 h-6 text-center">✓</div>
//               <div className=" text-Brand-washed-blue/brand-washed-blue-10">
//                 {doc?.packageName}
//               </div>
//             </div>
//           );
//         })}
//         <div
//           className="flex gap-2 text-brand/primary-blue cursor-pointer"
//           onClick={async () => setConfirmOpen(true)}
//         >
//           <div className="w-6 h-6 text-center ">
//             <AddCircle className="text-xs" fontSize="small" />
//           </div>
//           <div>{downDescriptionText}</div>
//         </div>
//       </div>
//       {button && (
//         <Button
//           type="submit"
//           className="bg-brand/primary-blue w-full rounded-md p-1 text-white"
//           disabled={disabled}
//           variant="contained"
//         >
//           Get Started
//         </Button>
//       )}
//       <PackageInfo
//         open={confirmOpen}
//         handleClose={() => {
//           setConfirmOpen(false);
//         }}
//       />
//     </div>
//   );
// };
const PricingCard = ({
  h1 = "Basic Plan",
  price = 55,
  mapArray = array,
  downDescriptionText = "Click to 11 more packages",
  onChange = () => null,
  packageId,
  value,
  disabled = false,
  button = true,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div
      className={`group shadow-xl w-full max-w-[270px]  relative rounded-lg bg-brand-primary-blue/brand-primary-blue-1 p-[20px] flex flex-col gap-2 border hover:border-brand/primary-blue ${
        value?.packageId === packageId
          ? "border-brand/primary-blue" // Highlight selected card
          : "border-Brand-washed-blue/brand-washed-blue-8"
      }`}
      onClick={() => {
        if (!disabled) {
          onChange({ packageName: h1, packageId });
        }
      }}
    >
      <IconButton
        color="info"
        className="h-8 w-8 !absolute !bg-brand/primary-blue right-4 top-4"
        aria-label="check"
        onClick={() => setConfirmOpen(true)}
      >
        <QuestionMark className="text-white text-xs" />
      </IconButton>
      <div className="flex-grow">
      <h1 className="text-2xl font-medium">{h1}</h1>
      <h3 className="text-lg font-bold">
        ₹ {price} <span className="text-sm font-medium">/emp</span>
      </h3>
      <div className="text-sm">billed quarterly</div>
      <div className="flex flex-col gap-2 text-sm">
        {mapArray.map((doc, key) => (
          <div key={key} className="flex gap-2">
            <div className="w-6 h-6 text-center">✓</div>
            <div className="text-Brand-washed-blue/brand-washed-blue-10">
              {doc?.packageName}
            </div>
          </div>
        ))}
        <div
          className="flex gap-2 text-brand/primary-blue cursor-pointer"
          onClick={async () => setConfirmOpen(true)}
        >
          <div className="w-6 h-6 text-center ">
            <AddCircle className="text-xs" fontSize="small" />
          </div>
          <div>{downDescriptionText}</div>
        </div>
        </div>
      </div>
      {button && (
        <Button
          type="submit"
          className="bg-brand/primary-blue w-full  rounded-md p-1 text-white"
          disabled={disabled}
          variant="contained"
        >
          Get Started
        </Button>
      )}
      <PackageInfo
        open={confirmOpen}
        handleClose={() => {
          setConfirmOpen(false);
        }}
      />
    </div>
  );
};

export default PricingCard;
