import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import UserProfile from "../../hooks/UserData/useUser";
import useSignup from "../../hooks/useLoginForm";

const SignIn = () => {
  // state
  const { setEmail, setPassword, email, password } = useSignup();
  const { handleAlert } = useContext(TestContext);
  // navigate
  const redirect = useNavigate();

  // to get current user information and user role
  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const user = getCurrentUser();
  const role = useGetCurrentRole();
  console.log(user, role);

  useEffect(() => {
    if (user?._id) {
      if (role === "Super-Admin" || role === "Delegate-Super-Admin")
        return redirect("/");
      else if (role === "HR")
        return redirect(
          `/organisation/${user?.organizationId}/dashboard/HR-dashboard`
        );
      else if (
        role === "Delegate-Department-Head" ||
        role === "Department-Head"
      )
        return redirect(
          `/organisation/${user?.organizationId}/dashboard/DH-dashboard`
        );
      else if (role === "Accountant")
        return redirect(
          `/organisation/${user?.organizationId}/dashboard/employee-dashboard`
        );
      else if (role === "Manager")
        return redirect(
          `/organisation/${user?._id}/dashboard/manager-dashboard`
        );
      else if (role === "Employee")
        return redirect(
          `/organisation/${user?.organizationId}/dashboard/employee-dashboard`
        );
    }
    // eslint-disable-next-line
  }, [role, window.location.pathname]);

  // to define the funciton for handle role
  const handleRole = useMutation(
    (data) => {
      console.log("Data==", data);
      const res = axios.post(
        `${import.meta.env.VITE_API}/route/employee/changerole`,
        data
      );
      return res;
    },
    {
      onSuccess: (response) => {
        // Cookies.set("role", response?.data?.roleToken);

        Cookies.set("role", response.data.roleToken, {
          expires: 4 / 24,
        });
        window.location.reload();
      },
    }
  );

  // to define the fuction for logged in
  const handleLogin = useMutation(
    async (data) => {
      const res = await axios.post(
        `${import.meta.env.VITE_API}/route/employee/login`,
        data
      );

      return res;
    },

    {
      onSuccess: async (response) => {
        Cookies.set("aegis", response.data.token, { expires: 4 / 24 });
        handleAlert(
          true,
          "success",
          `Welcome ${response.data.user.first_name} you are logged in successfully`
        );

        if (response.data.user?.profile?.includes("Super-Admin")) {
          handleRole.mutate({
            role: "Super-Admin",
            email: response.data.user?.email,
          });
          return redirect(
            `/organisation/${response?.data?.user?.organizationId}/dashboard/super-admin`
          );
        } else if (
          response.data.user?.profile?.includes("Delegate-Super-Admin")
        ) {
          handleRole.mutate({
            role: "Delegate-Super-Admin",
            email: response.data.user?.email,
          });
          return redirect("/");
        } else if (response.data.user?.profile?.includes("HR")) {
          handleRole.mutate({ role: "HR", email: response.data.user?.email });
          return redirect(
            `/organisation/${response?.data?.user?.organizationId}/dashboard/HR-dashboard`
          );
        } else if (response?.data?.user?.profile?.includes("Manager")) {
          handleRole.mutate({
            role: "Manager",
            email: response.data.user?.email,
          });
          return redirect(
            `/organisation/${response?.data?.user?.organizationId}/dashboard/manager-dashboard`
          );
        } else if (response.data.user?.profile?.includes("Department-Head")) {
          handleRole.mutate({
            role: "Department-Head",
            email: response?.data.user?.email,
          });
          return redirect(
            `/organisation/${response?.data.user?.organizationId}/dashboard/DH-dashboard`
          );
        } else if (
          response?.data.user?.profile?.includes("Delegate-Department-Head")
        ) {
          handleRole.mutate({
            role: "Delegate-Department-Head",
            email: response?.data?.user?.email,
          });
          return redirect(
            `/organisation/${response?.data?.user?.organizationId}/dashboard/DH-dashboard`
          );
        } else if (response.data.user?.profile?.includes("Department-Admin")) {
          handleRole.mutate({
            role: "Department-Admin",
            email: response.data.user?.email,
          });
          return redirect(
            `/organisation/${response?.data?.user?.organizationId}/dashboard/employee-dashboard`
          );
        } else if (response.data.user?.profile?.includes("Accountant")) {
          handleRole.mutate({
            role: "Accountant",
            email: response.data.user?.email,
          });
          return redirect(
            `/organisation/${response?.data?.user?.organizationId}/dashboard/employee-dashboard`
          );
        } else if (
          response.data.user?.profile?.includes("Delegate-Accountant")
        ) {
          handleRole.mutate({
            role: "Delegate-Accountant",
            email: response.data.user?.email,
          });
          return redirect(
            `/organisation/${response?.data?.user?.organizationId}/dashboard/employee-dashboard`
          );
        } else if (response.data.user?.profile?.includes("Employee")) {
          handleRole.mutate({
            role: "Employee",
            email: response.data.user?.email,
          });
          return redirect(
            `/organisation/${response?.data?.user?.organizationId}/dashboard/employee-dashboard`
          );
        }
        window.location.reload();
      },

      onError: (error) => {
        console.error(error);

        handleAlert(
          true,
          error?.response.status !== 401 ? "success" : "error",
          error?.response?.data?.message ||
            "Failed to sign in. Please try again."
        );
      },
    }
  );

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      handleAlert(true, "warning", "All fields are manadatory");
      return false;
    }
    // Check if email is in lowercase
    if (email !== email.toLowerCase()) {
      handleAlert(true, "warning", "Email must be in lowercase");
      return false;
    }
    const data = { email, password };
    handleLogin.mutate(data);
  };

  const [focusedInput, setFocusedInput] = React.useState(null);
  const [visible, setVisible] = useState(false);
  const handleFocus = (fieldName) => {
    setFocusedInput(fieldName);
  };

  return (
    <>
      <section className="lg:min-h-screen  flex w-full">
        <div className="!w-[40%]  md:justify-start lg:flex hidden text-white flex-col items-center justify-center lg:h-screen relative border border-r px-4">
          <img src="/v1/register.svg" className="h-full" alt="logo" />
        </div>

        <article className="lg:w-[60%] h-screen  !bg-white w-full flex lg:justify-start justify-center  items-center lg:items-start flex-col ">
          <form
            onSubmit={onSubmit}
            autoComplete="off"
            className="flex  lg:px-20  sm:w-max w-[90%]  justify-center flex-col  lg:h-[80vh]"
          >
            <div className="flex flex-col space-x-4 lg:items-start items-center">
              <div className="flex flex-col gap-1  w-full items-center justify-center space-y-1">
                <img src="/smartea.jpeg" className="h-[45px]" alt="logo" />
                <h1 className="font-[600] text-center w-full text-3xl">
                  Sign In
                </h1>
              </div>
            </div>
            <div className="mt-6 sm:w-[400px] w-full space-y-2 ">
              <label
                htmlFor={email}
                className={" font-semibold text-gray-500 text-md"}
              >
                Email Address
              </label>
              <div
                className={`
                flex  rounded-md px-2  bg-white py-[6px]
                ${
                  focusedInput === "email"
                    ? "outline-blue-500 outline-3 !border-blue-500 border-[2px]"
                    : "border-gray-200 border-[.5px]"
                }`}
              >
                <Email className="text-gray-700" />
                <input
                  name="email"
                  autoComplete="off"
                  id="email"
                  placeholder="abc@gmail.com"
                  onFocus={() => {
                    handleFocus("email");
                  }}
                  onBlur={() => setFocusedInput(null)}
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value.toLowerCase())
                  }
                  type="email"
                  className={` 
                  border-none  bg-white w-full outline-none px-2`}
                />
              </div>

              <div className="space-y-1 !mt-5 w-full ">
                <label
                  htmlFor={password}
                  className={" font-semibold text-gray-500 text-md"}
                >
                  Password
                </label>

                <div
                  className={`
                flex  rounded-md px-2 sm:w-[400px] w-full  bg-white py-[6px]
                ${
                  focusedInput === "password"
                    ? "outline-blue-500 outline-3 !border-blue-500 border-[2px]"
                    : "border-gray-200 border-[.5px]"
                }`}
                >
                  <Lock className="text-gray-700" />
                  <input
                    name="password"
                    autoComplete="off"
                    id="password"
                    onFocus={() => {
                      handleFocus("password");
                    }}
                    onBlur={() => setFocusedInput(null)}
                    type={visible ? "text" : "password"}
                    placeholder="*****"
                    label="Password"
                    onChange={(event) => setPassword(event.target.value)}
                    className={` 
                 
                    border-none bg-white w-full outline-none px-2`}
                  />

                  <button
                    type="button"
                    onClick={() => setVisible(visible === true ? false : true)}
                  >
                    {visible ? (
                      <VisibilityOff className="text-gray-700" />
                    ) : (
                      <Visibility className="text-gray-700" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-5 mt-4">
              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={handleLogin.isLoading}
              >
                {handleLogin.isLoading ? (
                  <>
                    <CircularProgress CircularProgress size={20} /> Log in
                  </>
                ) : (
                  "Log in"
                )}
              </Button>
            </div>
            <div className="flex items-center justify-center  gap-2 my-2">
              <Link
                to="/forgot-password"
                className="font-medium hover:font-bold transition-all "
              >
                Forgot password?
              </Link>

              <Link
                to={
                  window.location.pathname === "/sign-up"
                    ? "/sign-in"
                    : "/sign-up"
                }
                className="font-medium text-primary hover:underline transition-all "
              >
                Sign up for SMarTea
              </Link>
            </div>
          </form>
        </article>
      </section>
    </>
  );
};

export default SignIn;
