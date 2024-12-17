import React from "react";
import { useNavigate } from "react-router-dom";
import ReusableModal from "../../components/Modal/component";
import useGetDelegateSuperAdmin from "../../hooks/QueryHook/Delegate-Super-Admin/hook";
import MiniForm from "./components/form";

const AddDelegate = () => {
  const navigate = useNavigate();
  const { data, isLoading, isFetching } = useGetDelegateSuperAdmin();
  const handleClose = () => {
    navigate(-1);
  };
  return (
    <ReusableModal
      heading={"Add Delegate Super Admin"}
      open={true}
      onClose={handleClose}
    >
      {isLoading || isFetching ? "Loading" : <MiniForm data={data} />}
    </ReusableModal>
  );
};

export default AddDelegate;
