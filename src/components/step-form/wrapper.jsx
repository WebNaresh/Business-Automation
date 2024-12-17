import { useEffect } from "react";
import Header from "./header";

const StepFormWrapper = ({
  totalSteps,
  step,
  goToStep,
  // nextStep,
  // prevStep,
  // isFirstStep,
  // isLastStep,
  children,
  className,
  stepper,
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);
  return (
    <div className={`p-2 flex flex-col gap-4   m-4 rounded-lg ${className}`}>
      <Header {...{ goToStep, totalSteps, step, stepper }} />
      {children}
      {/* <Bottom {...{ isFirstStep, isLastStep, nextStep, prevStep }} /> */}
    </div>
  );
};

export default StepFormWrapper;
