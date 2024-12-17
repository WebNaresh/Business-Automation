


import { Box, Modal, TextField, IconButton, Button } from '@mui/material';
import { Close } from '@mui/icons-material';
import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import UserProfile from "../../hooks/UserData/useUser";
import useAuthToken from '../../hooks/Token/useAuth';

function AddNewUserId({ open1, handleClose1 }) {
  const [newUserid, setNewUserid] = useState('');
  const [newUseridError, setNewUseridError] = useState('');
  const user = UserProfile().getCurrentUser();
  const authToken = useAuthToken();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    overflow: 'auto',
    maxHeight: '80vh',
    p: 4,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!newUserid) {
      setNewUseridError('User ID is required');
      return;
    }

    // Validate newUserid format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newUserid)) {
      setNewUseridError('User ID must be a valid email format');
      return;
    }

    // Validate newUserid length
    if (newUserid.length < 3 || newUserid.length > 50) {
      setNewUseridError('User ID must be between 3 and 50 characters long');
      return;
    }

    try {
      // Make the POST request to your backend API
      await axios.post(
        `${process.env.REACT_APP_API}/route/employee/add-user-id`,
        {
          email: user?.email,
          newUserId: newUserid,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      // Reset newUserid and errors after successful submission
      setNewUserid('');
      setNewUseridError('');
      handleClose1(); // Close the modal after successful submission
    } catch (error) {
      // Handle the error from the backend
      if (error.response && error.response.data && error.response.data.message) {
        setNewUseridError(error.response.data.message);
      } else {
        setNewUseridError('Failed to add User ID. Please try again.');
      }
    }
  };

  return (
    <Modal
      open={open1}
      onClose={handleClose1}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}
        className="border-none !z-10 !pt-0 !px-0 w-max shadow-md outline-none rounded-md"
      >
        <section className="p-2 px-4 flex space-x-2">
          <article className="w-full rounded-md">
            <div className="flex w-[500px] p-4 items-center flex-col gap-5 justify-center overflow-hidden bg-[white]">
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl text-gray-700 font-semibold tracking-tight">
                    Create Your UserID
                  </h1>
                  <IconButton onClick={handleClose1}>
                    <Close className="!text-lg" />
                  </IconButton>
                </div>
                <p className="text-gray-500 tracking-tight">
                  Create UserID for your AEGIS account
                </p>
              </div>
              <form className="w-full" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Enter New User ID *"
                  variant="outlined"
                  value={newUserid}
                  onChange={(e) => setNewUserid(e.target.value)}
                  error={!!newUseridError}
                  helperText={newUseridError}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="py-2 rounded-md mt-4 w-full"
                >
                  Create User ID
                </Button>
              </form>
            </div>
          </article>
        </section>
      </Box>
    </Modal>
  );
}

export default AddNewUserId;



























// import { Box, Modal, TextField, IconButton, Button } from '@mui/material';
// import { Close } from '@mui/icons-material';
// import React, { useState } from 'react';
// import axios from 'axios'; // Import axios
// import UserProfile from "../../hooks/UserData/useUser";
// import useAuthToken from '../../hooks/Token/useAuth';

// function AddNewUserId({ open1, handleClose1 }) {
//   const [newUserid, setnewUserid] = useState('');
//   const [newUseridError, setnewUseridError] = useState('');
//   const user = UserProfile().getCurrentUser();
//   const authToken= useAuthToken()

//   const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     bgcolor: 'background.paper',
//     overflow: 'auto',
//     maxHeight: '80vh',
//     p: 4,
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!newUserid) {
//       setnewUseridError('User ID is required');
//       return;
//     }

//     // Validate newUserid format
//     // const newUseridPattern = /^(?=.*[_\-])[A-Za-z0-9_\-]{5,20}$/;
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!emailPattern.test(newUserid)) {
//       // setnewUseridError('User ID must be 5-20 characters long and include at least one underscore or hyphen.');
//    setnewUseridError('User ID must be a valid email format')
 
//       return;
//     }

//     // Validate newUserid length
//     if (newUserid.length < 3 || newUserid.length > 50) {
//       setnewUseridError('User ID must be between 3 and 50 characters long');
//       return;
//     }

//     try {
//       // Make the POST request to your backend API

//       await axios.post(`${process.env.REACT_APP_API}/route/employee/add-user-id`, {
//          email: user?.email, 
//         newUserId: newUserid,
//       },{Authorization: authToken}
//     );

//       // Reset newUserid and errors after successful submission
//       setnewUserid('');
//       setnewUseridError('');
//       handleClose1(); // Close the modal after successful submission
//     } catch (error) {
//       setnewUserid('');
//       setnewUseridError('');
//       console.error('Error adding user ID:', error);
//       setnewUseridError('Failed to add User ID. Please try again.');
//     }
//   };

//   return (
//     <Modal
//       open={open1}
//       onClose={handleClose1}
//       aria-labelledby="modal-modal-title"
//       aria-describedby="modal-modal-description"
//     >
//       <Box
//         sx={style}
//         className="border-none !z-10 !pt-0 !px-0 w-max shadow-md outline-none rounded-md"
//       >
//         <section className="p-2 px-4 flex space-x-2">
//           <article className="w-full rounded-md">
//             <div className="flex w-[500px] p-4 items-center flex-col gap-5 justify-center overflow-hidden bg-[white]">
//               <div className="w-full">
//                 <div className="flex items-center justify-between">
//                   <h1 className="text-3xl text-gray-700 font-semibold tracking-tight">
//                     Create Your UserID
//                   </h1>
//                   <IconButton onClick={handleClose1}>
//                     <Close className="!text-lg" />
//                   </IconButton>
//                 </div>
//                 <p className="text-gray-500 tracking-tight">
//                   Create UserID for your AEGIS account
//                 </p>
//               </div>
//               <form className="w-full" onSubmit={handleSubmit}>
//                 <TextField
//                   fullWidth
//                   label="Enter New User ID *"
//                   variant="outlined"
//                   value={newUserid}
//                   onChange={(e) => setnewUserid(e.target.value)}
//                   error={!!newUseridError}
//                   helperText={newUseridError}
//                 />
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   className="py-2 rounded-md mt-4 w-full"
//                 >
//                   Create User ID
//                 </Button>
//               </form>
//             </div>
//           </article>
//         </section>
//       </Box>
//     </Modal>
//   );
// }

// export default AddNewUserId;
























