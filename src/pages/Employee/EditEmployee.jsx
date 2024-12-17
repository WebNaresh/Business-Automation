import {
  AddCircle,
  Business,
  CheckCircle,
  Person,
  West,
} from "@mui/icons-material";
import {  IconButton } from "@mui/material";
import React from "react";
import { useNavigate,  } from "react-router-dom";
import StepFormWrapper from "../../components/step-form/wrapper";
import useMultiStepForm from "../../hooks/useStepForm";
import Test1 from "./Component/Test1";
import Test2 from "./Component/Test2";
import Test3 from "./Component/Test3";
import Test4 from "./Component/Test4";


const EditEmployee = () => {
  const {
    step,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    totalSteps,
    goToStep,
  } = useMultiStepForm(4);
  const navigate = useNavigate();
   
  // to define the steppar
  const stepper = [
    {
      label: "Personal Details",
      icon: Person,
    },
    {
      label: "Company Info",
      icon: Business,
    },
    {
      label: "Additional Fields",
      icon: AddCircle,
    },
    {
      label: "Confirm",
      icon: CheckCircle,
    },
  ];
  
  // swtiching the component based on Next and Prev button
  const useSwitch = (step) => {
    switch (step) {
      case 1:
        return <Test1 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
      case 2:
        return <Test2 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
      case 3:
        return <Test3 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
      case 4:
        return <Test4 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen h-auto">
      <header className="text-xl w-full pt-6 flex items-start gap-2 bg-white shadow-md p-4">
        <IconButton onClick={() => navigate(-1)}>
          <West className=" !text-xl" />
        </IconButton>
        <div className="flex justify-between w-full">
          <div>
            Edit Employee
            <p className="text-xs text-gray-600">
              Welcome your employees by editing their profiles here.
            </p>
          </div>
        </div>
      </header>

      <section className="md:px-8 flex space-x-2 md:py-6">
        <article className="w-full rounded-lg bg-white">
          <div className="w-full md:px-5 px-1">
            <StepFormWrapper
              {...{
                goToStep,
                totalSteps,
                step,
                isFirstStep,
                nextStep,
                prevStep,
                isLastStep,
                stepper,
              }}
            >
              {useSwitch(step)}
            </StepFormWrapper>
          </div>
        </article>
      </section>
    </div>
  );
};

export default EditEmployee;
