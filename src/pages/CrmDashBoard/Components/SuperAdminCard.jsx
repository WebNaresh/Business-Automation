import { Avatar } from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import AdminCardSke from "../../Skeletons/AdminCardSke";

const SuperAdminCard = ({
  title,
  icon: Icon,
  data,
  color,
  isLoading,
  className = "",
  cardSize, // New prop for card size
  DHcardSize,
}) => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const sizeClass = cardSize || DHcardSize;
  // "w-52 h-30
  return (
    <div
      whileHover={{ scale: 1.05 }}
      //className={` h-28 relative p-4 bg-gradient-to-r from-blue-50 to-blue-100 border rounded-lg shadow-lg flex flex-col items-center justify-center transition-transform duration-300 mt-4 mb-4 ${className} ${sizeClass}`}
      className={`h-28 relative p-4 bg-[#174E63] border rounded-lg shadow-lg flex flex-col items-center justify-center transition-transform duration-300 mt-4 mb-4 ${className} ${sizeClass}`}

    >
      {isLoading ? (
        <AdminCardSke />
      ) : (
        <>
          <div
            whileHover={{ scale: 1.15, rotate: 10 }}
            className={`flex items-center justify-center ${color} rounded-full p-2 shadow-lg mb-2 absolute -top-8 ${sizeClass}`}
            style={{ width: "4rem", height: "4rem", background: "#174E63" }} // Explicitly set icon container size
          >
            <Avatar
              className="text-white"
              sx={{
                bgcolor: "transparent",
                width: "2.5rem", //  icon size
                height: "2.5rem",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "none",
              }}
              variant="rounded"
            >
              <Icon style={{ fontSize: "2em" }} />
            </Avatar>
          </div>

          <div className="text-center mt-12 space-y-1">
            <h1 className="text-xl font-bold text-white mb-0.5">{title}</h1>
            <h2 className="text-lg font-bold text-white">{data}</h2>
          </div>

        </>
      )}
    </div>
  );
};

export default SuperAdminCard;
