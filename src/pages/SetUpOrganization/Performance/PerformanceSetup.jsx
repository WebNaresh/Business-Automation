import { zodResolver } from "@hookform/resolvers/zod";
import {
  AccessTime,
  BarChart,
  ListAlt,
  Star,
  TrendingUp,
} from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../hooks/Token/useAuth";
import Setup from "../Setup";

const PerformanceSetup = () => {
  const { organisationId } = useParams();
  const authToken = useAuthToken();
  const { handleAlert } = useContext(TestContext);
  const PerformanceSchema = z.object({
    appraisalStartDate: z.object({
      startDate: z.string(),
      endDate: z.string(),
    }).refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
      message: "Appraisal start date must be before the end date.",
    }),
    appraisalEndDate: z.object({
      startDate: z.string(),
      endDate: z.string(),
    }),
    startdate: z.object({
      startDate: z.string(),
      endDate: z.string(),
    }),
    enddate: z.object({
      startDate: z.string(),
      endDate: z.string(),
    }),
    stages: z.object({
      label: z.string(),
      value: z.string(),
    }),
    goals: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
    ratings: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
    isDownCast: z.boolean().optional(),
    isFeedback: z.boolean().optional(),
    isManagerApproval: z.boolean().optional(),
    isMidGoal: z.boolean().optional(),
    isSelfGoal: z.boolean().optional(),
  });


  const { data: performance, isFetching } = useQuery(
    "performancePeriod",
    async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API}/route/performance/getSetup/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return data;
    }
  );

  const {
    formState: { errors },
    control,
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(PerformanceSchema),
    defaultValues: {
      stages: undefined,
      isDownCast: false,
      isFeedback: false,
      isNonMeasurableAllowed: false,
      isManagerApproval: false,
      isMidGoal: false,
      isSelfGoal: false,
    },
  });

  useEffect(() => {
    if (performance) {
      setValue("enddate", {
        startDate: new Date(performance.enddate).toISOString(),
        endDate: new Date(performance.enddate).toISOString(),
      });
      setValue("startdate", {
        startDate: new Date(performance.startdate).toISOString(),
        endDate: new Date(performance.startdate).toISOString(),
      });
      setValue("appraisalStartDate", {
        startDate: new Date(performance.appraisalStartDate).toISOString(),
        endDate: new Date(performance.appraisalStartDate).toISOString(),
      });
      setValue("appraisalEndDate", {
        startDate: new Date(performance.appraisalEndDate).toISOString(),
        endDate: new Date(performance.appraisalEndDate).toISOString(),
      });
      setValue(
        "goals",
        performance.goals.map((goalType) => ({
          label: goalType,
          value: goalType,
        }))
      );
      setValue("isDownCast", performance.isDownCast);
      setValue("isFeedback", performance.isFeedback);
      setValue("isManagerApproval", performance.isManagerApproval);
      setValue("isMidGoal", performance.isMidGoal);
      setValue("isNonMeasurableAllowed", performance.isNonMeasurableAllowed);
      setValue("isSelfGoal", performance.isSelfGoal);
      setValue("organizationId", performance.organizationId);
      setValue("stages", {
        label: performance.stages,
        value: performance.stages,
      });

      setValue(
        "ratings",
        performance.ratings.map((rating) => ({
          label: rating,
          value: rating,
        }))
      );
    }
    // eslint-disable-next-line
  }, [isFetching]);


  let stagesOptions = [
    {
      value: "Goal setting",
      label: "Goal setting",
    },
    {
      value: "Monitoring stage/Feedback collection stage",
      label: "Monitoring stage/Feedback collection stage",
    },
    {
      value: "KRA stage/Ratings Feedback/Manager review stage",
      label: "KRA stage/Ratings Feedback/Manager review stage",
    },
    {
      value: "Employee acceptance/acknowledgement stage",
      label: "Employee acceptance/acknowledgement stage",
    },
  ];
  let goalsOptions = [
    {
      value: "Organizational Goals",
      label: "Organizational Goals",
    },
    {
      value: "Departmental Goals",
      label: "Departmental Goals",
    },
    {
      value: "Development Goal",
      label: "Development Goal",
    },
    {
      value: "Carrier Goals",
      label: "Carrier Goals",
    },
    {
      value: "Self Goals",
      label: "Self Goals",
    },
    {
      value: "Managerial Goals",
      label: "Managerial Goals",
    },
    {
      value: "Training Goals",
      label: "Training Goals",
    },
    {
      value: "Behavioral Goals",
      label: "Behavioral Goals",
    },
  ];

  const performanceSetup = useMutation(
    async (data) => {
      console.log("data", data);
      const performanceSetting = {
        ...data,
        startdate: data.startdate.startDate,
        enddate: data.enddate.endDate,
        appraisalStartDate: data.appraisalStartDate.startDate,
        appraisalEndDate: data.appraisalEndDate.startDate,
        goals: data.goals.map((goalType) => goalType.value),
        stages: data.stages.value,
        ratings: data.ratings.map((rating) => rating.value),
      };
      await axios.post(
        `${import.meta.env.VITE_API}/route/performance/createSetup/${organisationId}`,
        { performanceSetting },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", "Performance setup created successfully");
      },
    }
  );

  const onSubmit = async (data) => {
    performanceSetup.mutate(data);
  };

  console.log("error", errors);


  return (
    <div>
      <section className="bg-gray-50 overflow-hidden min-h-screen w-full">
        <Setup>
          <article>
            <div className="p-4  border-b-[.5px] flex  justify-between  gap-3 w-full border-gray-300">
              <div className="flex gap-3 ">
                <div className="mt-1">
                  <BarChart />
                </div>
                <div>
                  <h1 className="!text-lg">Performance</h1>
                  <p className="text-xs text-gray-600">
                    Setup performance settings for your organization
                  </p>
                </div>
              </div>
            </div>
            <div className=" p-4 border-gray-200">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <AuthInputFiled
                    name="appraisalStartDate"
                    icon={AccessTime}
                    control={control}
                    type="calender"
                    label="Enter Appraisal Cycle Start Date *"
                    errors={errors}
                    error={errors.appraisalStartDate}
                  />
                  <AuthInputFiled
                    name="appraisalEndDate"
                    min={watch("appraisalStartDate")?.startDate}
                    icon={AccessTime}
                    control={control}
                    type="calender"
                    label="Enter Appraisal Cycle End Date *"
                    errors={errors}
                    error={errors.appraisalEndDate}
                  />
                </div>

                <AuthInputFiled
                  name="goals"
                  icon={TrendingUp}
                  control={control}
                  type="autocomplete"
                  options={goalsOptions}
                  optionlist={goalsOptions}
                  placeholder="Goals"
                  label="Select Goal Type *"
                  errors={errors}
                  error={errors.goals}
                />

                <AuthInputFiled
                  name="stages"
                  icon={ListAlt}
                  control={control}
                  options={stagesOptions}
                  type="select"
                  placeholder="Stages"
                  label="Select Stage *"
                  errors={errors}
                  error={errors.stages}
                />

                <div className="grid grid-cols-2 gap-4">
                  <AuthInputFiled
                    name="startdate"
                    icon={AccessTime}
                    control={control}
                    type="calender"
                    label="Enter Start Date *"
                    errors={errors}
                    error={errors.startdate}
                  />
                  <AuthInputFiled
                    name="enddate"
                    min={watch("startdate")?.startDate}
                    icon={AccessTime}
                    control={control}
                    type="calender"
                    label="Enter End Date *"
                    errors={errors}
                    error={errors.enddate}
                  />
                </div>

                <AuthInputFiled
                  name="ratings"
                  icon={Star}
                  control={control}
                  type="autocomplete"
                  optionlist={[]}
                  options={goalsOptions}
                  placeholder="Ex. 1"
                  label="Enter Ratings Type *"
                  errors={errors}
                  error={errors.ratings}
                />

                <div className="grid grid-cols-2 gap-4">
                  <AuthInputFiled
                    name="isDownCast"
                    icon={TrendingUp}
                    control={control}
                    type="checkbox"
                    placeholder="Goals"
                    label="Goals downcast downword "
                    errors={errors}
                    error={errors.isDownCast}
                  />
                  <AuthInputFiled
                    name="isFeedback"
                    icon={TrendingUp}
                    control={control}
                    type="checkbox"
                    placeholder="Goals"
                    label="360 feedback allowed"
                    errors={errors}
                    error={errors.isFeedback}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <AuthInputFiled
                    name="isManagerApproval"
                    icon={TrendingUp}
                    control={control}
                    type="checkbox"
                    placeholder="Goals"
                    label="Manager approval on self added goals"
                    errors={errors}
                    error={errors.isManagerApproval}
                  />

                  <AuthInputFiled
                    name="isMidGoal"
                    icon={TrendingUp}
                    control={control}
                    type="checkbox"
                    placeholder="Goals"
                    label="Addition of goals mid of cycle stage"
                    errors={errors}
                    error={errors.isMidGoal}
                  />
                </div>

                <AuthInputFiled
                  name="isSelfGoal"
                  icon={TrendingUp}
                  control={control}
                  type="checkbox"
                  placeholder="Goals"
                  label="Employee able to add self goals"
                  errors={errors}
                  error={errors.isSelfGoal}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"

                >
                  {performanceSetup.isLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    "submit"
                  )}
                </Button>
              </form>
            </div>
          </article>
        </Setup>
      </section>
    </div>
  );
};

export default PerformanceSetup;
