import React from "react";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useParams } from "react-router-dom";
import useSignup from "../../hooks/useLoginForm";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
const ResetPassword = () => {
  const { setPassword, password, confirmPassword, setConfirmPassword } =
    useSignup();
  const { token } = useParams();
  const { handleAlert } = useContext(TestContext);
  const redirect = useNavigate(UseContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/route/employee/reset-password/${token}`,
        {
          password,
        }
      );
      handleAlert(true, "success", `Welcome ${response.data.message} `);
      redirect("/sign-in");
    } catch (error) {
      handleAlert(true, "error", error?.response?.data?.message);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center p-8 box-border h-[500px] lg:w-[900px] m-auto">
        <div className="flex w-full h-full rounded-lg shadow-xl border bg-white">
          <form className="w-full md:w-1/2 p-8 flex flex-col items-center gap-4 justify-center">
            <Typography
              color={"primary"}
              fontWeight={800}
              fontSize={20}
              className="text-2xl my-2"
            >
              Reset Password
            </Typography>
            <div className="w-full sm:[250px]">
              <TextField
                required
                size="small"
                type="password"
                label="Enter New Password"
                name="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <TextField
                required
                size="small"
                type="password"
                label="Confirm Password"
                name="confirmPassword"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="m-auto w-fit"
              onClick={handleSubmit}
            >
              Reset
            </Button>
          </form>
          <div className="md:w-1/2 md:flex hidden p-8 bg-blue-500 rounded-r-lg items-center flex-col justify-around">
            <img
              src="/argan_logo.png"
              alt="My Img"
              className="w-36 h-36 object-cover mb-6 rounded-lg p-6 bg-white"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
