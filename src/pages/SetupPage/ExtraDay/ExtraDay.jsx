import { zodResolver } from "@hookform/resolvers/zod";
import { Business } from "@mui/icons-material";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import { Button, CircularProgress } from "@mui/material"; 
import axios from "axios";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../hooks/Token/useAuth";
import Setup from "../../SetUpOrganization/Setup";
import { TestContext } from "../../../State/Function/Main";

const ExtraDay = () => {
  const authToken = useAuthToken();
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();

  const formSchema = z.object({
    extraDay: z.boolean(),
  });

  const { control, formState, handleSubmit, setValue } = useForm({
    defaultValues: {
      extraDay: false,
    },
    resolver: zodResolver(formSchema),
  });

  const { errors } = formState;

  const onSubmit = async (data) => {
    console.log("extra day", data);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/route/add/extra-day`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      console.log("response", response);

      if (response && response.data && response.data.success) {
        handleAlert(true, "success", "Extra day is added successfully");
      }

      queryClient.invalidateQueries("extra-day");
    } catch (error) {
      console.log("Error occurred due to add extra day", error.message);
    }
  };

  const { isLoading } = useQuery(
    "extra-day",
    async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/route/get/extra-day`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        console.log("dddddd", data);

        if (data && data.extraDay) {
          setValue("extraDay", data.extraDay.extraDay);
        }
      },
    }
  );

  return (
    <div>
      <section className="bg-gray-50 overflow-hidden min-h-screen w-full">
        <Setup>
          <article className=" bg-white  w-full h-max shadow-md rounded-sm border items-center">
            <div className="p-4 border-b-[.5px] flex items-center justify-between gap-3 w-full border-gray-300">
              <div className="flex gap-3 ">
                <div className="mt-1">
                  <PaidOutlinedIcon />
                </div>
                <div>
                  <h1 className="!text-lg">Extra Day</h1>
                  <p className="text-xs text-gray-600">
                    This setup is used to add the extra day.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5">
              {isLoading ? ( // Show loader when data is loading
                <div className="flex justify-center items-center">
                  <CircularProgress /> {/* Loader icon */}
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} action="">
                  <div className="flex justify-between gap-4">
                    <div className="w-full mb-8">
                      <AuthInputFiled
                        name="extraDay"
                        icon={Business}
                        control={control}
                        type="checkbox"
                        placeholder="Extra Day"
                        label="extraDay"
                        errors={errors}
                        error={errors.extraDay}
                        descriptionText={
                          "Does this organisation allow extra day pay."
                        }
                      />
                    </div>
                  </div>
                  <div className="py-2 mt-6">
                    <Button
                      className="mt-4"
                      size="small"
                      type="submit"
                      variant="contained"
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </article>
        </Setup>
      </section>
    </div>
  );
};

export default ExtraDay;
