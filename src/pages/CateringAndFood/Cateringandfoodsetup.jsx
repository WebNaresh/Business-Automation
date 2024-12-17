import React, { useState, useContext } from "react";
import Setup from "../SetUpOrganization/Setup";
import axios from "axios";
// import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";

const CateringAndFoodSetup = () => {
  const [formData, setFormData] = useState({
    vendorUpload: false,
    menuApproval: false,
    hrApproval: false,
    selectedDocuments: []
  });
//   const { organisationId } = useParams();
  const { setAppAlert } = useContext(UseContext);
  
  const documentOptions = [
    "Bank Account",
    "Food Catering License",
    "Aadhar",
    "PAN",
  ];

  const handleDocumentChange = (option) => {
    setFormData((prev) => ({
      ...prev,
      selectedDocuments: prev.selectedDocuments.includes(option)
        ? prev.selectedDocuments.filter((doc) => doc !== option)
        : [...prev.selectedDocuments, option]
    }));
  };

  const handleRadioChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/vendor/foodsetuppage`,
        { formData }
      );
      setAppAlert({ show: true, type: "success", message: response.data.message });
    } catch (error) {
      console.error("API error:", error.response);
      setAppAlert({ show: true, type: "error", message: error?.response?.data?.message });
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen w-full">
      <Setup>
        <div className="p-4 border-b-[.5px] flex gap-4 w-full border-gray-300">
          <h1 className="!text-lg">Food And Catering Setup Page</h1>
          <p className="text-xs text-gray-600">Setup Your Vendor Page</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w- mx-auto p-6 bg-white shadow-md rounded-lg">
          <h1 className="!text-xl flex justify-center pb-7 font-bold">Food And Catering Setup Page</h1>

          <div>
            <label className="block text-m font-medium text-gray-700 mb-2">
              Can vendors upload documents on their own?
            </label>
            <div className="flex justify-center gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="yes"
                  checked={formData.vendorUpload}
                  onChange={() => handleRadioChange('vendorUpload', true)}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="no"
                  checked={!formData.vendorUpload}
                  onChange={() => handleRadioChange('vendorUpload', false)}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          <div>
            <label className="block text-m font-medium text-gray-700 mb-2">
              Can menu prices be approved by HR?
            </label>
            <div className="flex justify-center gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="yes"
                  checked={formData.menuApproval}
                  onChange={() => handleRadioChange('menuApproval', true)}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="no"
                  checked={!formData.menuApproval}
                  onChange={() => handleRadioChange('menuApproval', false)}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          <div>
            <label className="block text-m font-medium text-gray-700 mb-2">
              Select documents that can be uploaded by vendors:
            </label>
            {documentOptions.map((option, index) => (
              <div key={index} className="mb-2 ml-0 sm:ml-2 md:ml-4 lg:ml-[412px]">
                <input
                  type="checkbox"
                  id={option}
                  checked={formData.selectedDocuments.includes(option)}
                  onChange={() => handleDocumentChange(option)}
                  className="mr-2"
                />
                <label htmlFor={option} className="text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-m font-medium text-gray-700 mb-2">
              Do documents uploaded by vendors need approval by HR?
            </label>
            <div className="flex justify-center gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="yes"
                  checked={formData.hrApproval}
                  onChange={() => handleRadioChange('hrApproval', true)}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="no"
                  checked={!formData.hrApproval}
                  onChange={() => handleRadioChange('hrApproval', false)}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 ml-80 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 w-72"
          >
            Submit
          </button>
        </form>
      </Setup>
    </section>
  );
};

export default CateringAndFoodSetup;












// import React, { useState } from "react";
// import Setup from "../SetUpOrganization/Setup";
// import axios from "axios";
// import  { useContext } from "react";
// import { useParams } from "react-router-dom";
// import { UseContext } from "../../State/UseState/UseContext";

// const CateringAndFoodSetup = () => {
//   const [vendorUpload, setVendorUpload] = useState(false);
//   const [menuApproval, setMenuApproval] = useState(false);
//   const [selectedDocuments, setSelectedDocuments] = useState([]);
//   const [hrApproval, setHrApproval] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const { organisationId } = useParams();
//   const { setAppAlert } = useContext(UseContext);
//   const documentOptions = [
//     "Bank Account",
//     "Food Catering License",
//     "Aadhar",
//     "PAN",
//   ];

//   const handleDocumentChange = (option) => {
//     setSelectedDocuments(
//       (prev) =>
//         prev.includes(option)
//           ? prev.filter((doc) => doc !== option) // Remove if already selected
//           : [...prev, option] // Add if not selected
//     );
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/vendor/foodsetuppage`,
//         {
//           formData
//         }
//       );
//       alert(true, "success", response.data.message);
//     } catch (error) {
//       console.error("API error:", error.response);
//       alert(true, "error", error?.response?.data?.message);
//     }
//   };

//   return (
//     <section className="bg-gray-50 min-h-screen w-full ">
//       <Setup>
//         <div>
//           <div className="p-4 border-b-[.5px] flex   gap-4 w-full border-gray-300">
//             <div className="mt-1"></div>
//             <div>
//               <h1 className="!text-lg">Food And Catering Setup Page</h1>
//               <p className="text-xs text-gray-600">Setup Your Vendor Page</p>
//             </div>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="max-w- mx-auto p-6 bg-white shadow-md rounded-lg ">
//           {/* Vendor Upload Section */}
//           <div>
//             <h1 className="!text-xl flex justify-center pb-7 font-bold">
//               Food And Catering Setup Page
//             </h1>

//             <label className="block text-m font-medium text-gray-700 mb-2 ">
//               Can vendors upload documents on their own?
//             </label>
//             <div className="flex justify-center gap-6">
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   value="yes"
//                   checked={vendorUpload}
//                   onChange={() => setVendorUpload(true)}
//                   className="mr-2"
//                 />
//                 Yes
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   value="no"
//                   checked={!vendorUpload}
//                   onChange={() => setVendorUpload(false)}
//                   className="mr-2"
//                 />
//                 No
//               </label>
//             </div>
//           </div>

//           {/* Menu Approval Section */}
//           <div>
//             <label className="block text-m font-medium text-gray-700 mb-2">
//               Can menu prices be approved by HR?
//             </label>
//             <div className="flex justify-center gap-6">
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   value="yes"
//                   checked={menuApproval}
//                   onChange={() => setMenuApproval(true)}
//                   className="mr-2"
//                 />
//                 Yes
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   value="no"
//                   checked={!menuApproval}
//                   onChange={() => setMenuApproval(false)}
//                   className="mr-2"
//                 />
//                 No
//               </label>
//             </div>
//           </div>

//           {/* Document Selection Section */}
//           <div>
//             <label className="block text-m font-medium text-gray-700 mb-2">
//               Select documents that can be uploaded by vendors:
//             </label>
//             {documentOptions.map((option, index) => (
//               <div
//                 key={index}
//                 className="mb-2 ml-0 sm:ml-2 md:ml-4 lg:ml-[412px]"
//               >
//                 {/* <div className="flex "> */}
//                 <input
//                   type="checkbox"
//                   id={option}
//                   checked={selectedDocuments.includes(option)}
//                   onChange={() => handleDocumentChange(option)}
//                   className="mr-2"
//                 />
//                 {/* </div> */}
//                 <label htmlFor={option} className="text-gray-700">
//                   {option}
//                 </label>
//               </div>
//             ))}
//           </div>

//           {/* HR Approval Section */}
//           <div>
//             <label className="block text-m font-medium text-gray-700 mb-2">
//               {" "}
//              Do documents uploaded by vendors need approval by HR ?
//             </label>
//             <div className="flex justify-center gap-6">
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   value="yes"
//                   checked={hrApproval}
//                   onChange={() => setHrApproval(true)}
//                   className="mr-2"
//                 />
//                 Yes
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   value="no"
//                   checked={!hrApproval}
//                   onChange={() => setHrApproval(false)}
//                   className="mr-2"
//                 />
//                 No
//               </label>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="mt-8 ml-80 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 w-72"
//           >
//             Submit
//           </button>
//         </form>
//       </Setup>
//     </section>
//   );
// };
// export default CateringAndFoodSetup;

// import React, { useState } from "react";
// import Setup from "../SetUpOrganization/Setup";

// const CateringAndFoodSetup = () => {
//   const [vendorUpload, setVendorUpload] = useState(false);
//   const [menuApproval, setMenuApproval] = useState(false);
//   const [selectedDocuments, setSelectedDocuments] = useState([]);
//   const [hrApproval, setHrApproval] = useState(false);

//   const documentOptions = [
//     "Bank Account",
//     "Food Catering License",
//     "Aadhar",
//     "PAN",
//   ];

//   const handleDocumentChange = (option) => {
//     setSelectedDocuments((prev) =>
//       prev.includes(option)
//         ? prev.filter((doc) => doc !== option)
//         : [...prev, option]
//     );
//   };

//   return (
//     <section className="bg-gray-50 min-h-screen w-full">
//       <Setup>
//         <div>
//           <div className="p-4 border-b border-gray-300 flex gap-4 w-full">
//             <div className="mt-1"></div>
//             <div>
//               <h1 className="text-lg">Food And Catering Setup Page</h1>
//               <p className="text-xs text-gray-600">Setup Your Vendor Page</p>
//             </div>
//           </div>
//         </div>

//         <form className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg space-y-6">
//           {/* Vendor Upload Section */}
//           <div>
//             <h1 className="text-xl text-center pb-7 font-bold">
//               Food And Catering Setup Page
//             </h1>

//             <label className="block text-m font-medium text-gray-700 mb-2">
//               Can vendors upload documents on their own?
//             </label>
//             <div className="flex justify-center gap-6">
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   value="yes"
//                   checked={vendorUpload}
//                   onChange={() => setVendorUpload(true)}
//                   className="mr-2"
//                 />
//                 Yes
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   value="no"
//                   checked={!vendorUpload}
//                   onChange={() => setVendorUpload(false)}
//                   className="mr-2"
//                 />
//                 No
//               </label>
//             </div>
//           </div>

//           {/* Menu Approval Section */}
//           <div>
//             <label className="block text-m font-medium text-gray-700 mb-2">
//               Can menu prices be approved by HR?
//             </label>
//             <div className="flex justify-center gap-6">
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   value="yes"
//                   checked={menuApproval}
//                   onChange={() => setMenuApproval(true)}
//                   className="mr-2"
//                 />
//                 Yes
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   value="no"
//                   checked={!menuApproval}
//                   onChange={() => setMenuApproval(false)}
//                   className="mr-2"
//                 />
//                 No
//               </label>
//             </div>
//           </div>

//           {/* Document Selection Section */}
//           <div>
//             <label className="block text-m font-medium text-gray-700 mb-2">
//               Select documents that can be uploaded by vendors:
//             </label>
//             {documentOptions.map((option, index) => (
//               <div key={index} className="flex items-center mb-2">
//                 <input
//                   type="checkbox"
//                   id={option}
//                   checked={selectedDocuments.includes(option)}
//                   onChange={() => handleDocumentChange(option)}
//                   className="mr-2"
//                 />
//                 <label htmlFor={option} className="text-gray-700">
//                   {option}
//                 </label>
//               </div>
//             ))}
//           </div>

//           {/* HR Approval Section */}
//           <div>
//             <label className="block text-m font-medium text-gray-700 mb-2">
//               Do documents uploaded by vendors need approval by HR?
//             </label>
//             <div className="flex justify-center gap-6">
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   value="yes"
//                   checked={hrApproval}
//                   onChange={() => setHrApproval(true)}
//                   className="mr-2"
//                 />
//                 Yes
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   value="no"
//                   checked={!hrApproval}
//                   onChange={() => setHrApproval(false)}
//                   className="mr-2"
//                 />
//                 No
//               </label>
//             </div>
//           </div>

//           <div className="flex justify-center">
//             <button
//               type="submit"
//               className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 w-full max-w-xs"
//             >
//               Submit
//             </button>
//           </div>
//         </form>
//       </Setup>
//     </section>
//   );
// };

// export default CateringAndFoodSetup;
