// 1
// import { Modal, Box ,Button} from "@mui/material";
// import { useState } from "react";

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };

// const SelfOnboardingFromModal = ({ open, handleClose }) => {
//   const [employeeData, setEmployeeData] = useState({
//     empCount: 1,
//     employees: [{ firstName: '', middleName: '', lastName: '', phone: '', personalEmail: '', companyEmail: '' }],
//   });

//   const handleEmployeeChange = (index, field, value) => {
//     const newEmployees = [...employeeData.employees];
//     newEmployees[index][field] = value;
//     setEmployeeData({ ...employeeData, employees: newEmployees });
//   };

//   const addEmployee = () => {
//     if (employeeData.empCount < 100) {
//       setEmployeeData({
//         ...employeeData,
//         empCount: employeeData.empCount + 1,
//         employees: [...employeeData.employees, { firstName: '', middleName: '', lastName: '', phone: '', personalEmail: '', companyEmail: '' }],
//       });
//     }
//   };

//   const handleSubmit = async () => {
//     // Perform the API call to send the onboarding links
//     console.log("Submitting employee data:", employeeData);
//     // After successful submission, close the modal
//     handleClose();
//   };

//   return (
//     <Modal open={open} onClose={handleClose}>
//       <Box sx={style}>
//         <h2>Self-Onboarding</h2>
//         <div>
//           {employeeData.employees.map((employee, index) => (
//             <div key={index}>
//               <input
//                 type="text"
//                 placeholder="First Name"
//                 value={employee.firstName}
//                 onChange={(e) => handleEmployeeChange(index, 'firstName', e.target.value)}
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Middle Name"
//                 value={employee.middleName}
//                 onChange={(e) => handleEmployeeChange(index, 'middleName', e.target.value)}
//               />
//               <input
//                 type="text"
//                 placeholder="Last Name"
//                 value={employee.lastName}
//                 onChange={(e) => handleEmployeeChange(index, 'lastName', e.target.value)}
//                 required
//               />
//               <input
//                 type="tel"
//                 placeholder="Phone Number"
//                 value={employee.phone}
//                 onChange={(e) => handleEmployeeChange(index, 'phone', e.target.value)}
//                 required
//               />
//               <input
//                 type="email"
//                 placeholder="Personal Email"
//                 value={employee.personalEmail}
//                 onChange={(e) => handleEmployeeChange(index, 'personalEmail', e.target.value)}
//                 required
//               />
//               <input
//                 type="email"
//                 placeholder="Company Email"
//                 value={employee.companyEmail}
//                 onChange={(e) => handleEmployeeChange(index, 'companyEmail', e.target.value)}
//                 required
//               />
//             </div>
//           ))}
//           <Button onClick={addEmployee}>Add Another Employee</Button>
//           <Button onClick={handleSubmit}>Submit</Button>
//         </div>
//       </Box>
//     </Modal>
//   );
// };
// export default SelfOnboardingFromModal;



//2

// import { Modal, Box, Button, TextField, IconButton } from "@mui/material";
// import { AddCircle, Close } from "@mui/icons-material";
// import React, { useState } from "react";

// // Modal styles
// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };

// const SelfOnboardingFromModal= ({ open, handleClose }) => {
//   const [numEmployees, setNumEmployees] = useState(1);
//   const [employees, setEmployees] = useState([{ firstName: '', middleName: '', lastName: '', phone: '', personalEmail: '', companyEmail: '' }]);
//   const [submittedForms, setSubmittedForms] = useState([]);

//   const addEmployee = () => {
//     if (employees.length < 100) {
//       setEmployees([...employees, { firstName: '', middleName: '', lastName: '', phone: '', personalEmail: '', companyEmail: '' }]);
//     }
//   };

//   const handleChange = (index, field, value) => {
//     const newEmployees = [...employees];
//     newEmployees[index][field] = value;
//     setEmployees(newEmployees);
//   };

//   const handleSubmit = () => {
//     // Validate and send onboarding links here
//     const validEmployees = employees.filter(emp => emp.firstName && emp.lastName && emp.personalEmail && emp.companyEmail);
    
//     if (validEmployees.length > 0) {
//       // Simulate API call to send onboarding emails
//       setSubmittedForms([...submittedForms, ...validEmployees]);
//       handleClose(); // Close modal after submission
//     } else {
//       alert("Please fill in the required fields.");
//     }
//   };

//   return (
//     <Modal open={open} onClose={handleClose}>
//       <Box sx={style}>
//         <h2>Self-Onboarding</h2>
//         <TextField
//           label="Number of Employees"
//           type="number"
//           value={numEmployees}
//           onChange={(e) => setNumEmployees(Math.min(100, e.target.value))}
//           inputProps={{ min: 1, max: 100 }}
//         />
//         {employees.map((employee, index) => (
//           <div key={index} style={{ marginBottom: '10px' }}>
//             <TextField
//               label="First Name"
//               value={employee.firstName}
//               onChange={(e) => handleChange(index, 'firstName', e.target.value)}
//               required
//             />
//             <TextField
//               label="Middle Name"
//               value={employee.middleName}
//               onChange={(e) => handleChange(index, 'middleName', e.target.value)}
//             />
//             <TextField
//               label="Last Name"
//               value={employee.lastName}
//               onChange={(e) => handleChange(index, 'lastName', e.target.value)}
//               required
//             />
//             <TextField
//               label="Phone Number"
//               value={employee.phone}
//               onChange={(e) => handleChange(index, 'phone', e.target.value)}
//               required
//             />
//             <TextField
//               label="Personal Email"
//               value={employee.personalEmail}
//               onChange={(e) => handleChange(index, 'personalEmail', e.target.value)}
//               required
//             />
//             <TextField
//               label="Company Email"
//               value={employee.companyEmail}
//               onChange={(e) => handleChange(index, 'companyEmail', e.target.value)}
//               required
//             />
//             <IconButton onClick={() => handleChange(index, 'remove')}>
//               <Close />
//             </IconButton>
//           </div>
//         ))}
//         <IconButton onClick={addEmployee}>
//           <AddCircle />
//         </IconButton>
//         <div>
//           <Button onClick={handleSubmit} variant="contained">Submit</Button>
//           <Button onClick={handleClose}>Cancel</Button>
//         </div>

//         {/* Display submitted forms */}
//         {submittedForms.length > 0 && (
//           <div>
//             <h3>Submitted Forms:</h3>
//             {submittedForms.map((form, index) => (
//               <div key={index}>
//                 <p>{form.firstName} {form.lastName} - {form.personalEmail}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </Box>
//     </Modal>
//   );
// };
// export default  SelfOnboardingFromModal;


//3

// import { Modal, Box, Button, TextField, IconButton, Checkbox } from "@mui/material";
// import { AddCircle, Close } from "@mui/icons-material";
// import React, { useState } from "react";

// // Modal styles
// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 600,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };

// const SelfOnboardingFromModal = ({ open, handleClose }) => {
//   const [employees, setEmployees] = useState([{ firstName: '', middleName: '', lastName: '', phone: '', personalEmail: '', companyEmail: '' }]);
//   const [submittedForms, setSubmittedForms] = useState([]);
//   const [selectedForms, setSelectedForms] = useState([]);

//   const addEmployee = () => {
//     if (employees.length < 100) {
//       setEmployees([...employees, { firstName: '', middleName: '', lastName: '', phone: '', personalEmail: '', companyEmail: '' }]);
//     }
//   };

//   const handleChange = (index, field, value) => {
//     const newEmployees = [...employees];
//     newEmployees[index][field] = value;
//     setEmployees(newEmployees);
//   };

//   const handleSubmit = () => {
//     const validEmployees = employees.filter(emp => emp.firstName && emp.lastName && emp.personalEmail && emp.companyEmail);
    
//     if (validEmployees.length > 0) {
//       setSubmittedForms([...submittedForms, ...validEmployees]);
//       handleClose(); // Close modal after submission
//       setEmployees([{ firstName: '', middleName: '', lastName: '', phone: '', personalEmail: '', companyEmail: '' }]); // Reset fields
//     } else {
//       alert("Please fill in the required fields.");
//     }
//   };

//   const handleEdit = (index) => {
//     const editedEmployee = submittedForms[index];
//     setEmployees([...employees, editedEmployee]);
//     setSubmittedForms(submittedForms.filter((_, i) => i !== index)); // Remove from submitted forms
//   };

//   const handleSelect = (index) => {
//     const newSelectedForms = [...selectedForms];
//     if (newSelectedForms.includes(index)) {
//       newSelectedForms.splice(newSelectedForms.indexOf(index), 1); // Deselect
//     } else {
//       newSelectedForms.push(index); // Select
//     }
//     setSelectedForms(newSelectedForms);
//   };

//   const handleSendLinks = () => {
//     const selectedEmails = selectedForms.map(index => submittedForms[index].personalEmail);
//     alert(`Sending onboarding links to: ${selectedEmails.join(", ")}`);
//     // Reset selection after sending
//     setSelectedForms([]);
//   };

//   return (
//     <Modal open={open} onClose={handleClose}>
//       <Box sx={style}>
//         <h2>Self-Onboarding</h2>
//         {employees.map((employee, index) => (
//           <div key={index} style={{ marginBottom: '10px' }}>
//             <TextField
//               label="First Name"
//               value={employee.firstName}
//               onChange={(e) => handleChange(index, 'firstName', e.target.value)}
//               required
//             />
//             <TextField
//               label="Middle Name"
//               value={employee.middleName}
//               onChange={(e) => handleChange(index, 'middleName', e.target.value)}
//             />
//             <TextField
//               label="Last Name"
//               value={employee.lastName}
//               onChange={(e) => handleChange(index, 'lastName', e.target.value)}
//               required
//             />
//             <TextField
//               label="Phone Number"
//               value={employee.phone}
//               onChange={(e) => handleChange(index, 'phone', e.target.value)}
//               required
//             />
//             <TextField
//               label="Personal Email"
//               value={employee.personalEmail}
//               onChange={(e) => handleChange(index, 'personalEmail', e.target.value)}
//               required
//             />
//             <TextField
//               label="Company Email"
//               value={employee.companyEmail}
//               onChange={(e) => handleChange(index, 'companyEmail', e.target.value)}
//               required
//             />
//             <IconButton onClick={() => handleChange(index, 'remove')}>
//               <Close />
//             </IconButton>
//           </div>
//         ))}
//         <IconButton onClick={addEmployee}>
//           <AddCircle />
//         </IconButton>
//         <div>
//           <Button onClick={handleSubmit} variant="contained">Submit</Button>
//           <Button onClick={handleClose}>Cancel</Button>
//         </div>

//         {/* Display submitted forms */}
//         {submittedForms.length > 0 && (
//           <div>
//             <h3>Submitted Forms:</h3>
//             {submittedForms.map((form, index) => (
//               <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
//                 <Checkbox
//                   checked={selectedForms.includes(index)}
//                   onChange={() => handleSelect(index)}
//                 />
//                 <p>{form.firstName} {form.lastName} - {form.personalEmail}</p>
//                 <Button onClick={() => handleEdit(index)}>Edit</Button>
//               </div>
//             ))}
//             <Button onClick={handleSendLinks} variant="contained">Send Selected Links</Button>
//           </div>
//         )}
//       </Box>
//     </Modal>
//   );
// };

// export default SelfOnboardingFromModal;


//updated with NormalCSS
// import { Modal, Box, Button, TextField, IconButton, Checkbox } from "@mui/material";
// import { AddCircle, Close } from "@mui/icons-material";
// import React, { useState } from "react";

// // Modal styles
// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 600,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };

// const SelfOnboardingFromModal = ({ open, handleClose }) => {
//   const [numEmployees, setNumEmployees] = useState(1);
//   const [employees, setEmployees] = useState([{ firstName: '', middleName: '', lastName: '', phone: '', personalEmail: '', companyEmail: '' }]);
//   const [submittedForms, setSubmittedForms] = useState([]);
//   const [selectedForms, setSelectedForms] = useState([]);

//   const addEmployee = () => {
//     if (employees.length < 2) {
//       setEmployees([...employees, { firstName: '', middleName: '', lastName: '', phone: '', personalEmail: '', companyEmail: '' }]);
//     }
//   };

//   const handleChange = (index, field, value) => {
//     const newEmployees = [...employees];
//     newEmployees[index][field] = value;
//     setEmployees(newEmployees);
//   };

//   const handleSubmit = () => {
//     const validEmployees = employees.filter(emp => emp.firstName && emp.lastName && emp.personalEmail && emp.companyEmail);
    
//     if (validEmployees.length > 0) {
//       setSubmittedForms([...submittedForms, ...validEmployees]);
//       handleClose(); // Close modal after submission
//       setEmployees([{ firstName: '', middleName: '', lastName: '', phone: '', personalEmail: '', companyEmail: '' }]); // Reset fields
//     } else {
//       alert("Please fill in the required fields.");
//     }
//   };

//   const handleEdit = (index) => {
//     const editedEmployee = submittedForms[index];
//     setEmployees([...employees, editedEmployee]);
//     setSubmittedForms(submittedForms.filter((_, i) => i !== index)); // Remove from submitted forms
//   };

//   const handleSelect = (index) => {
//     const newSelectedForms = [...selectedForms];
//     if (newSelectedForms.includes(index)) {
//       newSelectedForms.splice(newSelectedForms.indexOf(index), 1); // Deselect
//     } else {
//       newSelectedForms.push(index); // Select
//     }
//     setSelectedForms(newSelectedForms);
//   };

//   const handleSendLinks = () => {
//     const selectedEmails = selectedForms.map(index => submittedForms[index].personalEmail);
//     alert(`Sending onboarding links to: ${selectedEmails.join(", ")}`);
//     // Reset selection after sending
//     setSelectedForms([]);
//   };

//   return (
//     <Modal open={open} onClose={handleClose}>
//       <Box sx={style}>
//         <h2>Self-Onboarding</h2>
//         <TextField
//           label="Number of Employees"
//           type="number"
//           value={numEmployees}
//           onChange={(e) => setNumEmployees(Math.min(2, e.target.value))}
//           inputProps={{ min: 1, max: 2 }}
//         />
//         {employees.map((employee, index) => (
//           <div key={index} style={{ marginBottom: '10px' }}>
//             <TextField
//               label="First Name"
//               value={employee.firstName}
//               onChange={(e) => handleChange(index, 'firstName', e.target.value)}
//               required
//             />
//             <TextField
//               label="Middle Name"
//               value={employee.middleName}
//               onChange={(e) => handleChange(index, 'middleName', e.target.value)}
//             />
//             <TextField
//               label="Last Name"
//               value={employee.lastName}
//               onChange={(e) => handleChange(index, 'lastName', e.target.value)}
//               required
//             />
//             <TextField
//               label="Phone Number"
//               value={employee.phone}
//               onChange={(e) => handleChange(index, 'phone', e.target.value)}
//               required
//             />
//             <TextField
//               label="Personal Email"
//               value={employee.personalEmail}
//               onChange={(e) => handleChange(index, 'personalEmail', e.target.value)}
//               required
//             />
//             <TextField
//               label="Company Email"
//               value={employee.companyEmail}
//               onChange={(e) => handleChange(index, 'companyEmail', e.target.value)}
//               required
//             />
//             <IconButton onClick={() => handleChange(index, 'remove')}>
//               <Close />
//             </IconButton>
//           </div>
//         ))}
//         <IconButton onClick={addEmployee}>
//           <AddCircle />
//         </IconButton>
//         <div>
//           <Button onClick={handleSubmit} variant="contained">Submit</Button>
//           <Button onClick={handleClose}>Cancel</Button>
//         </div>

//         {/* Display submitted forms */}
//         {submittedForms.length > 0 && (
//           <div>
//             <h3>Submitted Forms:</h3>
//             {submittedForms.map((form, index) => (
//               <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
//                 <Checkbox
//                   checked={selectedForms.includes(index)}
//                   onChange={() => handleSelect(index)}
//                 />
//                 <p>{form.firstName} {form.lastName} - {form.personalEmail}</p>
//                 <Button onClick={() => handleEdit(index)}>Edit</Button>
//               </div>
//             ))}
//             <Button onClick={handleSendLinks} variant="contained">Send Selected Links</Button>
//           </div>
//         )}
//       </Box>
//     </Modal>
//   );
// };

// export default SelfOnboardingFromModal;

//above code wd tailwind
// import { Modal, Box, Button, TextField, IconButton, Checkbox } from "@mui/material";
// import { AddCircle, Close } from "@mui/icons-material";
// import React, { useState } from "react";

// // Modal styles
// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 600,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };

// const SelfOnboardingFromModal = ({ open, handleClose }) => {
//   const [numEmployees, setNumEmployees] = useState(1);
//   const [employees, setEmployees] = useState([{ firstName: '', middleName: '', lastName: '', phone: '', personalEmail: '', companyEmail: '' }]);
//   const [submittedForms, setSubmittedForms] = useState([]);
//   const [selectedForms, setSelectedForms] = useState([]);

//   const addEmployee = () => {
//     if (employees.length < 100) {
//       setEmployees([...employees, { firstName: '', middleName: '', lastName: '', phone: '', personalEmail: '', companyEmail: '' }]);
//     }
//   };

//   const handleChange = (index, field, value) => {
//     const newEmployees = [...employees];
//     newEmployees[index][field] = value;
//     setEmployees(newEmployees);
//   };

//   const handleSubmit = () => {
//     const validEmployees = employees.filter(emp => emp.firstName && emp.lastName && emp.personalEmail && emp.companyEmail);
    
//     if (validEmployees.length > 0) {
//       setSubmittedForms([...submittedForms, ...validEmployees]);
//       handleClose(); // Close modal after submission
//       setEmployees([{ firstName: '', middleName: '', lastName: '', phone: '', personalEmail: '', companyEmail: '' }]); // Reset fields
//     } else {
//       alert("Please fill in the required fields.");
//     }
//   };

//   const handleEdit = (index) => {
//     const editedEmployee = submittedForms[index];
//     setEmployees([...employees, editedEmployee]);
//     setSubmittedForms(submittedForms.filter((_, i) => i !== index)); // Remove from submitted forms
//   };

//   const handleSelect = (index) => {
//     const newSelectedForms = [...selectedForms];
//     if (newSelectedForms.includes(index)) {
//       newSelectedForms.splice(newSelectedForms.indexOf(index), 1); // Deselect
//     } else {
//       newSelectedForms.push(index); // Select
//     }
//     setSelectedForms(newSelectedForms);
//   };

//   const handleSendLinks = () => {
//     const selectedEmails = selectedForms.map(index => submittedForms[index].personalEmail);
//     alert(`Sending onboarding links to: ${selectedEmails.join(", ")}`);
//     // Reset selection after sending
//     setSelectedForms([]);
//   };

//   return (
//     <Modal open={open} onClose={handleClose}>
//       <Box sx={style}>
//         <h2>Self-Onboarding</h2>
//         <TextField
//           label="Number of Employees"
//           type="number"
//           value={numEmployees}
//           onChange={(e) => setNumEmployees(Math.min(100, e.target.value))}
//           inputProps={{ min: 1, max: 100 }}
//         />
//         {employees.map((employee, index) => (
//           <div key={index} style={{ marginBottom: '10px' }}>
//             <TextField
//               label="First Name"
//               value={employee.firstName}
//               onChange={(e) => handleChange(index, 'firstName', e.target.value)}
//               required
//             />
//             <TextField
//               label="Middle Name"
//               value={employee.middleName}
//               onChange={(e) => handleChange(index, 'middleName', e.target.value)}
//             />
//             <TextField
//               label="Last Name"
//               value={employee.lastName}
//               onChange={(e) => handleChange(index, 'lastName', e.target.value)}
//               required
//             />
//             <TextField
//               label="Phone Number"
//               value={employee.phone}
//               onChange={(e) => handleChange(index, 'phone', e.target.value)}
//               required
//             />
//             <TextField
//               label="Personal Email"
//               value={employee.personalEmail}
//               onChange={(e) => handleChange(index, 'personalEmail', e.target.value)}
//               required
//             />
//             <TextField
//               label="Company Email"
//               value={employee.companyEmail}
//               onChange={(e) => handleChange(index, 'companyEmail', e.target.value)}
//               required
//             />
//             <IconButton onClick={() => handleChange(index, 'remove')}>
//               <Close />
//             </IconButton>
//           </div>
//         ))}
//         <IconButton onClick={addEmployee}>
//           <AddCircle />
//         </IconButton>
//         <div>
//           <Button onClick={handleSubmit} variant="contained">Submit</Button>
//           <Button onClick={handleClose}>Cancel</Button>
//         </div>

//         {/* Display submitted forms */}
//         {submittedForms.length > 0 && (
//           <div>
//             <h3>Submitted Forms:</h3>
//             {submittedForms.map((form, index) => (
//               <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
//                 <Checkbox
//                   checked={selectedForms.includes(index)}
//                   onChange={() => handleSelect(index)}
//                 />
//                 <p>{form.firstName} {form.lastName} - {form.personalEmail}</p>
//                 <Button onClick={() => handleEdit(index)}>Edit</Button>
//               </div>
//             ))}
//             <Button onClick={handleSendLinks} variant="contained">Send Selected Links</Button>
//           </div>
//         )}
//       </Box>
//     </Modal>
//   );
// };

// export default SelfOnboardingFromModal;

// //updated tailwinds
// import { Modal, Button, TextField, IconButton, Checkbox } from "@mui/material";
// import { AddCircle, Close } from "@mui/icons-material";
// import React, { useState } from "react";

// const SelfOnboardingFromModal = ({ open, handleClose }) => {
//   const [numEmployees, setNumEmployees] = useState(1);
//   const [employees, setEmployees] = useState([{ firstName: '', middleName: '', lastName: '', phone: '', personalEmail: '', companyEmail: '' }]);
//   const [submittedForms, setSubmittedForms] = useState([]);
//   const [selectedForms, setSelectedForms] = useState([]);

//   const addEmployee = () => {
//     if (employees.length < 100) {
//       setEmployees([...employees, { firstName: '', middleName: '', lastName: '', phone: '', personalEmail: '', companyEmail: '' }]);
//     }
//   };

//   const handleChange = (index, field, value) => {
//     const newEmployees = [...employees];
//     newEmployees[index][field] = value;
//     setEmployees(newEmployees);
//   };

//   const handleSubmit = () => {
//     const validEmployees = employees.filter(emp => 
//       emp.firstName && emp.lastName && emp.phone && emp.personalEmail && emp.companyEmail
//     );

//     if (validEmployees.length > 0) {
//       setSubmittedForms([...submittedForms, ...validEmployees]);
//       handleClose(); // Close modal after submission
//       setEmployees([{ firstName: '', middleName: '', lastName: '', phone: '', personalEmail: '', companyEmail: '' }]); // Reset fields
//     } else {
//       alert("Please fill in all required fields.");
//     }
//   };

//   const handleEdit = (index) => {
//     const editedEmployee = submittedForms[index];
//     setEmployees([...employees, editedEmployee]);
//     setSubmittedForms(submittedForms.filter((_, i) => i !== index)); // Remove from submitted forms
//   };

//   const handleSelect = (index) => {
//     const newSelectedForms = [...selectedForms];
//     if (newSelectedForms.includes(index)) {
//       newSelectedForms.splice(newSelectedForms.indexOf(index), 1); // Deselect
//     } else {
//       newSelectedForms.push(index); // Select
//     }
//     setSelectedForms(newSelectedForms);
//   };

//   const handleSendLinks = () => {
//     const selectedEmails = selectedForms.map(index => submittedForms[index].personalEmail);
//     alert(`Sending onboarding links to: ${selectedEmails.join(", ")}`);
//     // Reset selection after sending
//     setSelectedForms([]);
//   };

//   return (
//     <Modal open={open} onClose={handleClose}>
//       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//         <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
//           <h2 className="text-xl font-bold mb-4">Self-Onboarding</h2>
//           <TextField
//             className="w-full mb-4"
//             label="Number of Employees"
//             type="number"
//             value={numEmployees}
//             onChange={(e) => setNumEmployees(Math.min(100, e.target.value))}
//             inputProps={{ min: 1, max: 100 }}
//           />
//           {employees.map((employee, index) => (
//             <div key={index} className="mb-2 border p-2 rounded">
//               <TextField
//                 className="w-full mb-2"
//                 label="First Name"
//                 value={employee.firstName}
//                 onChange={(e) => handleChange(index, 'firstName', e.target.value)}
//                 required
//               />
//               <TextField
//                 className="w-full mb-2"
//                 label="Middle Name"
//                 value={employee.middleName}
//                 onChange={(e) => handleChange(index, 'middleName', e.target.value)}
//               />
//               <TextField
//                 className="w-full mb-2"
//                 label="Last Name"
//                 value={employee.lastName}
//                 onChange={(e) => handleChange(index, 'lastName', e.target.value)}
//                 required
//               />
//               <TextField
//                 className="w-full mb-2"
//                 label="Phone Number"
//                 value={employee.phone}
//                 onChange={(e) => handleChange(index, 'phone', e.target.value)}
//                 required
//               />
//               <TextField
//                 className="w-full mb-2"
//                 label="Personal Email"
//                 value={employee.personalEmail}
//                 onChange={(e) => handleChange(index, 'personalEmail', e.target.value)}
//                 required
//               />
//               <TextField
//                 className="w-full mb-2"
//                 label="Company Email"
//                 value={employee.companyEmail}
//                 onChange={(e) => handleChange(index, 'companyEmail', e.target.value)}
//                 required
//               />
//               <IconButton onClick={() => handleChange(index, 'remove')} className="absolute top-2 right-2">
//                 <Close />
//               </IconButton>
//             </div>
//           ))}
//           <div className="flex items-center mb-4">
//             <IconButton onClick={addEmployee} className="text-blue-500">
//               <AddCircle />
//             </IconButton>
//             <span className="ml-2">Add Employee</span>
//           </div>
//           <div className="flex justify-between mb-4">
//             <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
//             <Button onClick={handleClose} variant="outlined" color="secondary">Cancel</Button>
//           </div>

//           {/* Display submitted forms */}
//           {submittedForms.length > 0 && (
//             <div>
//               <h3 className="text-lg font-semibold mb-2">Submitted Forms:</h3>
//               {submittedForms.map((form, index) => (
//                 <div key={index} className="flex items-center mb-2">
//                   <Checkbox
//                     checked={selectedForms.includes(index)}
//                     onChange={() => handleSelect(index)}
//                   />
//                   <p className="flex-1">{form.firstName} {form.lastName} - {form.personalEmail}</p>
//                   <Button onClick={() => handleEdit(index)} variant="text">Edit</Button>
//                 </div>
//               ))}
//               <Button onClick={handleSendLinks} variant="contained" className="w-full">Send Selected Links</Button>
//             </div>
//           )}
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default SelfOnboardingFromModal;


// .....
import { Modal, Button, TextField, IconButton, Checkbox } from "@mui/material";
import { AddCircle, Close } from "@mui/icons-material";
import React, { useState } from "react";

const SelfOnboardingFromModal = ({ open, handleClose }) => {
  const [employees, setEmployees] = useState([]);
  const [submittedForms, setSubmittedForms] = useState([]);
  const [selectedForms, setSelectedForms] = useState([]);

  const addEmployeeForm = () => {
    if (employees.length < 100) {
      setEmployees([...employees, { firstName: '', middleName: '', lastName: '', phone: '', personalEmail: '', companyEmail: '' }]);
    }
  };

  const handleChange = (index, field, value) => {
    const newEmployees = [...employees];
    newEmployees[index][field] = value;
    setEmployees(newEmployees);
  };

  const handleSubmit = () => {
    const validEmployees = employees.filter(emp =>
      emp.firstName && emp.lastName && emp.phone && emp.personalEmail && emp.companyEmail
    );

    if (validEmployees.length > 0) {
      setSubmittedForms([...submittedForms, ...validEmployees]);
      handleClose(); // Close modal after submission
      setEmployees([]); // Reset fields
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const handleEdit = (index) => {
    const editedEmployee = submittedForms[index];
    setEmployees([...employees, editedEmployee]);
    setSubmittedForms(submittedForms.filter((_, i) => i !== index)); // Remove from submitted forms
  };

  const handleSelect = (index) => {
    const newSelectedForms = [...selectedForms];
    if (newSelectedForms.includes(index)) {
      newSelectedForms.splice(newSelectedForms.indexOf(index), 1); // Deselect
    } else {
      newSelectedForms.push(index); // Select
    }
    setSelectedForms(newSelectedForms);
  };

  const handleSendLinks = () => {
    const selectedEmails = selectedForms.map(index => submittedForms[index].personalEmail);
    alert(`Sending onboarding links to: ${selectedEmails.join(", ")}`);
    // Reset selection after sending
    setSelectedForms([]);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
          <h2 className="text-xl font-bold mb-4">Self-Onboarding</h2>

          {/* Button to add employee form */}
          <div className="flex items-center mb-4">
            <IconButton onClick={addEmployeeForm} className="text-blue-500">
              <AddCircle />
            </IconButton>
            <span className="ml-2">Add Employee</span>
          </div>

          {/* Render employee forms */}
          {employees.map((employee, index) => (
            <div key={index} className="mb-2 border p-2 rounded relative">
              <TextField
                className="w-full mb-2"
                label="First Name"
                value={employee.firstName}
                onChange={(e) => handleChange(index, 'firstName', e.target.value)}
                required
              />
              <TextField
                className="w-full mb-2"
                label="Middle Name"
                value={employee.middleName}
                onChange={(e) => handleChange(index, 'middleName', e.target.value)}
              />
              <TextField
                className="w-full mb-2"
                label="Last Name"
                value={employee.lastName}
                onChange={(e) => handleChange(index, 'lastName', e.target.value)}
                required
              />
              <TextField
                className="w-full mb-2"
                label="Phone Number"
                value={employee.phone}
                onChange={(e) => handleChange(index, 'phone', e.target.value)}
                required
              />
              <TextField
                className="w-full mb-2"
                label="Personal Email"
                value={employee.personalEmail}
                onChange={(e) => handleChange(index, 'personalEmail', e.target.value)}
                required
              />
              <TextField
                className="w-full mb-2"
                label="Company Email"
                value={employee.companyEmail}
                onChange={(e) => handleChange(index, 'companyEmail', e.target.value)}
                required
              />
              <IconButton onClick={() => handleChange(index, 'remove')} className="absolute top-2 right-2">
                <Close />
              </IconButton>
            </div>
          ))}

          <div className="flex justify-between mb-4">
            <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
            <Button onClick={handleClose} variant="outlined" color="secondary">Cancel</Button>
          </div>

          {/* Display submitted forms */}
          {submittedForms.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Submitted Forms:</h3>
              {submittedForms.map((form, index) => (
                <div key={index} className="flex items-center mb-2">
                  <Checkbox
                    checked={selectedForms.includes(index)}
                    onChange={() => handleSelect(index)}
                  />
                  <p className="flex-1">{form.firstName} {form.lastName} - {form.personalEmail}</p>
                  <Button onClick={() => handleEdit(index)} variant="text">Edit</Button>
                </div>
              ))}
              <Button onClick={handleSendLinks} variant="contained" className="w-full">Send Selected Links</Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SelfOnboardingFromModal;
