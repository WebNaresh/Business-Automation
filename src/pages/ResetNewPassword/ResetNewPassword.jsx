import { zodResolver } from "@hookform/resolvers/zod";
import { Close } from "@mui/icons-material";
import { Box, IconButton, Modal } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { z } from "zod";
import { TestContext } from "../../State/Function/Main";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import UserProfile from "../../hooks/UserData/useUser";

const ResetNewPassword = ({ open, handleClose }) => {
  const { handleAlert } = useContext(TestContext);
  // const { isLoading, token } = useVerifyUser();
  const user = UserProfile().getCurrentUser();
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const [password, setPassword] = useState(false);
  const [cpassword, setCPassword] = useState(false);
  const [prevPassword, setPrevPassword] = useState(false);

  const formSchema = z
    .object({
      password: z
        .string()
        .min(8)
        .refine((value) => passwordRegex.test(value), {
          message:
            "Password must contain at least one number, one special character, and be at least 8 characters long",
        }),
      prevPassword: z
        .string()
        .min(8)
        .refine((value) => passwordRegex.test(value), {
          message:
            "Password must contain at least one number, one special character, and be at least 8 characters long",
        }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password don't match",
      path: ["confirmPassword"],
    });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    reset();
    //eslint-disable-next-line
  }, [open]);

  const resetMutation = useMutation(
    (data) => {
      console.log(`🚀 ~ data:`, data);
      const res = axios.put(
        `${process.env.REACT_APP_API}/route/employee/reset`,
        {
          password: data.password,
          email: user?.email,
          prevPassword: data?.prevPassword,
        }
      );
      return res;
    },
    {
      onSuccess: async (response) => {
        console.log(`🚀 ~ response:`, response);
        handleAlert(true, "success", "Password changed successfully");
        handleClose();
      },
      onError: async (error) => {
        console.log(`🚀 ~ error:`, error);
        handleAlert(
          true,
          "error",
          error?.response?.data?.message ?? "Server Error please try again"
        );
      },
    }
  );

  const OnSubmit = (data) => {
    console.log(`🚀 ~ data:`, data);
    resetMutation.mutate(data);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    overflow: "auto",
    maxHeight: "80vh",
    p: 4,
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          className="border-none !z-10 !pt-0 !px-0 w-max shadow-md outline-none rounded-md"
        >
          <section className="p-2 px-4 flex space-x-2 ">
            <article className="w-full rounded-md ">
              <div className="flex w-[500px] p-4 items-center flex-col gap-5 justify-center overflow-hidden bg-[white] ">
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl text-gray-700   font-semibold  tracking-tight">
                      Reset Your Password
                    </h1>
                    <IconButton onClick={handleClose}>
                      <Close className=" !text-lg" />
                    </IconButton>
                  </div>
                  <p className="text-gray-500 tracking-tight ">
                    Reset password for your AEGIS account{" "}
                  </p>
                </div>
                <form className="w-full" onSubmit={handleSubmit(OnSubmit)}>
                  <AuthInputFiled
                    name="prevPassword"
                    visible={password}
                    setVisible={setPassword}
                    control={control}
                    // icon={Work}
                    type={"password"}
                    placeholder="Ex: Test@123"
                    label="Enter Previous Password *"
                    readOnly={false}
                    maxLimit={15}
                    errors={errors}
                    error={errors.prevPassword}
                  />
                  <AuthInputFiled
                    name="password"
                    visible={cpassword}
                    setVisible={setCPassword}
                    control={control}
                    // icon={Work}
                    type={"password"}
                    placeholder="Ex: Test@123"
                    label="Enter New Password *"
                    readOnly={false}
                    maxLimit={15}
                    errors={errors}
                    error={errors.password}
                  />
                  <AuthInputFiled
                    name="confirmPassword"
                    type={"password"}
                    visible={prevPassword}
                    setVisible={setPrevPassword}
                    control={control}
                    // icon={Work}
                    placeholder="Ex: Test@123"
                    label="Confirm New Password *"
                    readOnly={false}
                    maxLimit={15}
                    errors={errors}
                    error={errors.confirmPassword}
                  />

                  <button
                    type="submit"
                    className="py-2 rounded-md border  font-bold w-full bg-blue-500 text-white"
                  >
                    Change Password
                  </button>
                </form>
              </div>
            </article>
          </section>
        </Box>
      </Modal>
    </>
  );
};

export default ResetNewPassword;
