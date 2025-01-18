import { Business, PlusOneOutlined } from "@mui/icons-material";
import StepFormWrapper from "../../components/step-form/wrapper";
import useMultiStepForm from "../../hooks/useStepForm";
import Step1 from "./components/step-1";
import Step3 from "./components/step-3";

const NewOrganisationForm = () => {
  const {
    step,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    totalSteps,
    goToStep,
  } = useMultiStepForm(2);

  // Function to switch between steps
  const useSwitch = (step) => {
    switch (step) {
      case 1:
        return <Step1 nextStep={nextStep} />;
      case 2:
        return <Step3 nextStep={nextStep} prevStep={prevStep} />;

      default:
        return null;
    }
  };

  // Define the stepper
  const stepper = [
    {
      label: "Branch Details",
      icon: Business,
    },
    {
      label: "Member Count",
      icon: PlusOneOutlined,
    },
  ];

  return (
    <div className="pt-10">
      <div className="m-4 2xl:w-[1200px] xl:w-[90%] lg:w-[90%] w-auto md:m-auto border-gray-400 border p-4 rounded-lg">
        <StepFormWrapper
          {...{
            goToStep,
            totalSteps,
            step,
            isFirstStep,
            isLastStep,
            nextStep,
            prevStep,
            stepper,
          }}
        >
          {useSwitch(step)}
        </StepFormWrapper>
      </div>
    </div>
  );
};

export default NewOrganisationForm;
