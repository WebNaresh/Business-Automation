import React from "react";
import HeaderBackComponent from "../../components/header/component";
import InputForm from "./components/input-form";

const SelfLeaveNotification = () => {
  return (
    <div className="flex w-full flex-col gap-6">
      <HeaderBackComponent heading="Self Leave Notification" />
      <div className="w-full flex justify-between px-14">
        <InputForm />
      </div>
    </div>
  );
};

export default SelfLeaveNotification;
