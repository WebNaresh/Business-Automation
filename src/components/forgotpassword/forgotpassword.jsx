import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import axios from "axios";
import React, { useContext } from "react";
import { TestContext } from "../../State/Function/Main";
import useSignup from "../../hooks/useLoginForm";

const ForgotPassword = () => {
  const { setEmail, email } = useSignup();
  const { handleAlert } = useContext(TestContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/forgot-password`,
        {
          email,
        }
      );
      handleAlert(true, "success", response.data.message);
    } catch (error) {
      console.error("API error:", error.response);
      handleAlert(true, "error", error?.response?.data?.message);
    }
  };

  return (
    <>

    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full mb-4">
            <LockOutlinedIcon style={{ fontSize: '2rem' }} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
          <p className="text-sm text-gray-600 text-center mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent px-3 py-2"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Submit
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="/sign-in" className="text-blue-600 hover:underline">
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  </>
  
  
  );
};

 export default ForgotPassword;








 

 // import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import Avatar from "@mui/material/Avatar";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import Container from "@mui/material/Container";
// import CssBaseline from "@mui/material/CssBaseline";
// import Grid from "@mui/material/Grid";
// import Link from "@mui/material/Link";
// import TextField from "@mui/material/TextField";
// import Typography from "@mui/material/Typography";
// import axios from "axios";
// import React, { useContext } from "react";
// import { TestContext } from "../../State/Function/Main";
// import useSignup from "../../hooks/useLoginForm";

// const ForgotPassword = () => {
//   const { setEmail, email } = useSignup();
//   const { handleAlert } = useContext(TestContext);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/employee/forgot-password`,
//         {
//           email,
//         }
//       );
//       handleAlert(true, "success", response.data.message);
//     } catch (error) {
//       console.error("API error:", error.response);
//       handleAlert(true, "error", error?.response?.data?.message);
//     }
//   };

//   return (
//     <>
//       <Container
//         component="main"
//         sx={{ marginTop: 5, border: "1px solid white" }}
//       >
//         <CssBaseline />
//         <Box
//           sx={{
//             marginTop: 8,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         >
//           <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
//             <LockOutlinedIcon />
//           </Avatar>
//           <Typography variant="h5">Forgot Password</Typography>
//           <Box
//             component="form"
//             onSubmit={handleSubmit}
//             noValidate
//             sx={{ mt: 1 }}
//           >
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="email"
//               label="Email Address"
//               name="email"
//               value={email}
//               onChange={(event) => setEmail(event.target.value)}
//               autoComplete="email"
//               autoFocus
//             />

//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//               onClick={handleSubmit}
//             >
//               Submit
//             </Button>
//             <Grid container>
//               <Grid item>
//                 <Link
//                   href="/sign-in"
//                   variant="body2"
//                   sx={{ pl: 5, textAlign: "center" }}
//                 >
//                   Sign In
//                 </Link>
//               </Grid>
//             </Grid>
//           </Box>
//         </Box>
//       </Container>
//     </>
//   );
// };

// export default ForgotPassword;