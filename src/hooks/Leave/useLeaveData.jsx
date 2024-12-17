import axios from "axios";
import { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";

const useLeaveData = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [isCalendarOpen, setCalendarOpen] = useState(false);

  const [newAppliedLeaveEvents, setNewAppliedLeaveEvents] = useState([]);
  const queryclient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [selectEvent, setselectEvent] = useState(false);
  const [calLoader, setCalLoader] = useState(false);

  const { data, isLoading, isError, error } = useQuery(
    "employee-leave-table-without-default",
    async () => {
      setCalLoader(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/leave/getEmployeeCurrentYearLeave`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data;
    },
    {
      onSuccess: async (data) => {
        console.info(`🚀 ~ file: useLeaveData.jsx:33 ~ data:`, data);
        setCalLoader(false);
      },
      onError: async (error) => {
        console.error(`🚀 ~ file: useLeaveData.jsx:36 ~ error:`, error);
        setCalLoader(false);
      },
    }
  );

  const { data: shiftData } = useQuery(
    "shifts-calender",
    async () => {
      setCalLoader(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/shiftApply/get`,
        {
          headers: { Authorization: authToken },
        }
      );
      queryclient.invalidateQueries("employee-leave-table");
      queryclient.invalidateQueries("employee-summary-table");
      queryclient.invalidateQueries("employee-leave-table-without-default");
      return response.data;
    },
    {
      onSuccess: async () => {
        setCalLoader(false);
      },
      onError: async (error) => {
        // console.error(`🚀 ~ file: useLeaveData.jsx:36 ~ error:`, error);
        setCalLoader(false);
      },
    }
  );

  console.log("newAppliedLeaveEvents", newAppliedLeaveEvents);

  const createLeaves = async () => {
    setCalLoader(true);
    newAppliedLeaveEvents.forEach(async (value) => {
      try {
        await axios.post(
          `${process.env.REACT_APP_API}/route/leave/create`,
          value,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        handleAlert(true, "success", "Leaves created succcesfully");
      } catch (error) {
        console.error(`🚀 ~ error:`, error);
        handleAlert(
          true,
          "error",
          error?.response?.data?.message || "Leaves not created succcesfully"
        );
      }
    });
  };

  const leaveMutation = useMutation(createLeaves, {
    onSuccess: async () => {
      await queryclient.invalidateQueries({
        queryKey: ["employee-leave-table"],
      });
      await queryclient.invalidateQueries({
        queryKey: ["employee-leave-table"],
      });
      await queryclient.invalidateQueries({
        queryKey: ["employee-summary-table"],
      });
      await queryclient.invalidateQueries(
        "employee-leave-table-without-default"
      );
      setCalLoader(false);
      // handleAlert(true, "success", "Applied for leave successfully");
      setNewAppliedLeaveEvents([]);
    },
    onError: (error) => {
      setCalLoader(false);
      console.error(error);
    },
  });

  // Delete Investment Mutation need to change in backend so if manager delete leave then it should be deleted directly  from employee leave table
  const deleteLeaveMutation = useMutation(
    async ({ id, deleteReason }) => {
      setCalLoader(true);
      await axios.post(
        `${process.env.REACT_APP_API}/route/leave/delete/${id}`,
        {
          deleteReason,
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: async (data, variable) => {
        console.log(
          `🚀 ~ file: useLeaveData.jsx:138 ~ variable:`,
          variable?.onClose()
        );
        await queryclient.invalidateQueries({
          queryKey: ["employee-leave-table"],
        });
        await queryclient.invalidateQueries({
          queryKey: ["employee-leave-table"],
        });
        await queryclient.invalidateQueries({
          queryKey: ["employee-summary-table"],
        });
        await queryclient.invalidateQueries(
          "employee-leave-table-without-default"
        );
        setCalLoader(false);
        handleAlert(true, "success", "Leave deleted successfully");
      },
      onError: (error) => {
        setCalLoader(false);
        console.error(error);
        handleAlert(true, "error", "Leave not deleted successfully");
      },
    }
  );
  const handleSubmit = async (e) => {
    setCalLoader(true);
    e.preventDefault();

    setCalendarOpen(false);

    leaveMutation.mutate();
    setCalLoader(false);
  };
  const handleInputChange = () => {
    setCalendarOpen(true);
    setSelectedLeave(null);
  };

  const handleUpdateFunction = async (e) => {
    setCalLoader(true);
    setselectEvent(true);

    data?.currentYearLeaves.filter((item) => {
      return item._id !== selectedLeave?._id;
    });
    await queryclient.setQueryData(
      "employee-leave-table-without-default",
      (old) => {
        old.currentYearLeaves = old?.currentYearLeaves.filter((item) => {
          return item._id !== selectedLeave?._id;
        });
        return { ...old };
      }
    );
    setCalLoader(false);
  };

  return {
    data,
    isLoading,
    shiftData,
    isError,
    error,
    handleSubmit,
    isCalendarOpen,
    setCalendarOpen,
    newAppliedLeaveEvents,
    setNewAppliedLeaveEvents,
    handleInputChange,
    selectedLeave,
    setSelectedLeave,
    handleUpdateFunction,
    selectEvent,
    setselectEvent,
    deleteLeaveMutation,
    calLoader,
    setCalLoader,
  };
};

export default useLeaveData;
