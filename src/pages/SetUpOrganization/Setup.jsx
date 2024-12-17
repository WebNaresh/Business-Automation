// import { West } from "@mui/icons-material";
// import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
// import React from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import BackComponent from "../../components/BackComponent/BackComponent";
// import useSetupSideNav from "../../hooks/Nav/useSetupSideNav";

// const Setup = ({ children }) => {
//   const { organisationId } = useParams("");

//   const { linkData } = useSetupSideNav({ organisationId });
//   const navigate = useNavigate();

//   return (
//     <>
//       <section className="bg-gray-50 min-h-screen w-full">
//         <header className="md:block hidden text-xl w-full pt-6 bg-white shadow-md p-4">
//           <BackComponent />
//           <Link onClick={() => navigate(-1)}>
//             <West className="mx-4 !text-xl" />
//           </Link>
//           Organisation Setup
//         </header>
//         <article className="md:p-4 p-0 w-full h-full flex gap-4">
//           <aside className="md:flex md:w-[30%] lg:!w-[20%]  flex-col items-center shadow-lg justify-center bg-white h-screen overflow-y-auto w-full">
//             <div className="h-auto min-h-screen  w-full">
//               <div className=" px-4 py-3 gap-4 border-b-[.5px] bg-gray-200 flex w-full items-center border-gray-300">
//                 <div className="rounded-full h-[30px] w-[30px] flex items-center justify-center">
//                   <SettingsOutlined className="!text-md text-sky-400 hover:!rotate-180 cursor-pointer" />
//                 </div>
//                 <h1 className="!text-lg tracking-wide">Setup</h1>
//               </div>

//               {linkData?.map((item, id) => {
//                 return (
//                   <Link
//                     to={item?.href}
//                     key={id}
//                     className={`group ${
//                       item.active && "bg-sky-100 !text-blue-500"
//                     } ${
//                       item.isVisible !== true && "!hidden"
//                     } hover:bg-sky-100 transition-all flex w-full items-center text-gray-700 gap-4 px-4 py-3 cursor-pointer`}
//                   >
//                     <item.icon className="!text-2xl group-hover:!text-blue-500 !font-thin" />
//                     <h1 className="group-hover:!text-blue-500">
//                       {item?.label}
//                     </h1>
//                   </Link>
//                 );
//               })}
//             </div>
//           </aside>

//           <div className="SetupSection bg-white w-[100%] lg:!w-[80%] md:!w-[70%] shadow-md rounded-sm border  items-center">
//             <header className="block md:hidden text-xl w-full pt-2 bg-white shadow-md p-2 my-2">
//               <BackComponent />
//               <div className="inline" onClick={() => navigate(-1)}>
//                 <West className="mx-4 !text-xl" />
//               </div>
//               Organisation Setup
//             </header>
//             {children}
//           </div>
//         </article>
//       </section>
//     </>
//   );
// };

// export default Setup;

import { West } from "@mui/icons-material";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BackComponent from "../../components/BackComponent/BackComponent";
import useSetupSideNav from "../../hooks/Nav/useSetupSideNav";

const Setup = ({ children }) => {
  const { organisationId } = useParams("");
  const { linkData } = useSetupSideNav({ organisationId });
  const navigate = useNavigate();

  return (
    <>
      <section className="bg-gray-50 min-h-screen w-full">
        <header className="md:block hidden text-xl w-full pt-6 bg-white shadow-md p-4">
          <BackComponent />
          <Link onClick={() => navigate(-1)}>
            <West className="mx-4 !text-xl" />
          </Link>
          Organisation Setup
        </header>
        <article className="md:p-4 p-0 w-full h-full flex gap-4">
          <aside className="md:flex hidden md:w-[30%] lg:!w-[20%]  flex-col items-center shadow-lg justify-center bg-white h-screen overflow-y-auto w-full">
            <div className="h-auto min-h-screen  w-full">
              <div className=" px-4 py-3 gap-4 border-b-[.5px] bg-gray-200 flex w-full items-center border-gray-300">
                <div className="rounded-full h-[30px] w-[30px] flex items-center justify-center">
                  <SettingsOutlined className="!text-md text-sky-400 hover:!rotate-180 cursor-pointer" />
                </div>
                <h1 className="!text-lg tracking-wide">Setup</h1>
              </div>

              {linkData?.map((item, id) => {
                return (
                  <Link
                    to={item?.href}
                    key={id}
                    className={`group ${
                      item.active && "bg-sky-100 !text-blue-500"
                    } ${
                      item.isVisible !== true && "!hidden"
                    } hover:bg-sky-100 transition-all flex w-full items-center text-gray-700 gap-4 px-4 py-3 cursor-pointer`}
                  >
                    <item.icon className="!text-2xl group-hover:!text-blue-500 !font-thin" />
                    <h1 className="group-hover:!text-blue-500">
                      {item?.label}
                    </h1>
                  </Link>
                );
              })}
            </div>
          </aside>

          <div className="SetupSection bg-white w-[100%] lg:!w-[80%] md:!w-[70%]  shadow-md rounded-sm border  items-center">
            <header className="block md:hidden text-xl w-full pt-2 bg-white shadow-md p-2 my-2">
              <BackComponent />
              <div className="inline" onClick={() => navigate(-1)}>
                <West className="mx-4 !text-xl" />
              </div> 
              Organisation Setup
            </header>
            {children}
          </div>
        </article>
      </section>
    </>
  );
};

export default Setup;
