import { Info } from "@mui/icons-material";
import HolidayVillageOutlinedIcon from "@mui/icons-material/HolidayVillageOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import axios from "axios";
import dayjs from "dayjs";
import React, { useContext, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";
import ReusableModel from "../../../components/Modal/component";
import Setup from "../Setup";
import HolidayRow from "./components/holiday-row";
import MiniForm from "./components/miniform";
import usePublicHoliday from "./components/usePublicHoliday";

const PublicHoliday = () => {
  const { setAppAlert } = useContext(UseContext);
  const [openModal, setOpenModal] = useState(false);
  const [actionModal, setActionModal] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [region, setRegion] = useState("");
  const [operation, setOperation] = useState("");
  const [selectedHolidayId, setSelectedHolidayId] = useState(null);
  const queryClient = useQueryClient();

  const orgId = useParams().organisationId;
  const { data, locations } = usePublicHoliday();
  console.log(`🚀 ~ locations:`, locations);

  const [inputdata, setInputData] = useState({
    name: "",
    date: dayjs(new Date()),
    type: "",
    region: "",
    organizationId: "",
  });

  console.log(`🚀 ~ file: PublicHoliday.jsx:77 ~ data:`, data);

  const handleClose = () => {
    setOpenModal(false);
    setActionModal(false);
    setOperation("");
    setSelectedHolidayId(null);
    setInputData({
      name: "",
      year: "",
      date: dayjs(),
      day: "",
      month: "",
      type: "",
      region: "",
      organizationId: "",
    });
  };
  const handleDateChange = (newDate) => {
    setInputData((prev) => ({
      ...prev,
      date: newDate.toISOString(),
    }));
  };

  const doTheOperation = async () => {
    const id = selectedHolidayId;

    if (operation === "edit") {
      const patchData = {
        name,
        type,
        region,
        date: inputdata.date,
        organizationId: orgId,
      };
      await axios
        .patch(
          `${import.meta.env.VITE_API}/route/holiday/update/${selectedHolidayId}`,
          patchData
        )
        .then((response) => {
          console.log("Holiday  updated successfully.");
          setOpenModal(false);
          setAppAlert({
            alert: true,
            type: "success",
            msg: "Holiday  updated successfully.",
          });
          queryClient.invalidateQueries("holidays");
        })
        .catch((error) => {
          console.error("Error updating holiday:", error);
        });
    } else if (operation === "delete") {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API}/route/holiday/delete/${id}`
        );
        console.log("Holiday deleted successfully.");
        setOpenModal(false);
        setAppAlert({
          alert: true,
          type: "success",
          msg: "Holiday deleted successfully.",
        });
        queryClient.invalidateQueries("holidays");
      } catch (error) {
        console.error("Error deleting holiday:", error);
        setAppAlert({
          alert: true,
          type: "error",
          msg: "Error deleting holiday!",
        });
      }
    } else {
      console.log("Nothing changed");
      setAppAlert({
        alert: true,
        type: "error",
        msg: "error occured!",
      });
    }

    handleClose();
  };

  return (
    <section className="bg-gray-50 overflow-hidden min-h-screen w-full">
      <Setup>
        <article className=" bg-white  w-full h-max shadow-md rounded-sm border items-center">
          <div className="p-4 border-b-[.5px] flex items-center justify-between gap-3 w-full border-gray-300">
            <div className="flex gap-3 ">
              <div className="mt-1">
                <HolidayVillageOutlinedIcon />
              </div>
              <div>
                <h1 className="!text-lg">Public Holidays</h1>
                <p className="text-xs text-gray-600">
                  Add public holidays which will applicable to all employees.
                  Ex: Independence day.
                </p>
              </div>
            </div>
            <Button variant="contained" onClick={() => setOpenModal(true)}>
              Add Holiday
            </Button>
          </div>
          {data?.length > 0 ? (
            <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
              <table className="min-w-full bg-white text-left !text-sm font-light">
                <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                  <tr className="!font-semibold ">
                    <th scope="col" className="!text-left pl-8 py-3 w-1/12">
                      Sr. No
                    </th>
                    <th scope="col" className="py-3 w-2/12">
                      Holiday Name
                    </th>
                    <th scope="col" className=" py-3 w-2/12">
                      Date
                    </th>
                    <th scope="col" className=" py-3 w-2/12">
                      Type
                    </th>
                    <th scope="col" className=" py-3 w-2/12">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((data, id) => (
                    <HolidayRow {...{ data, id }} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="!text-2xl" />
                <h1 className="text-lg font-semibold">Add Public Holidays</h1>
              </article>
              <p>No public holidays found. Please add the public holidays</p>
            </section>
          )}

          <ReusableModel
            heading="Add Public Holiday"
            subHeading="Add a public holiday to your organisation"
            open={openModal}
            onClose={handleClose}
          >
            <MiniForm locations={locations} data={data} onClose={handleClose} />
          </ReusableModel>

          <Dialog fullWidth open={actionModal} onClose={handleClose}>
            <DialogContent>
              {operation === "edit" ? (
                <>
                  <h1 className="text-xl pl-2 font-semibold font-sans">
                    Edit Holiday
                  </h1>
                  <div className="flex gap-3 flex-col mt-3">
                    <TextField
                      required
                      size="small"
                      className="w-full"
                      label="Holiday name"
                      type="text"
                      name="name"
                      value={name}
                      onChange={(e) => {
                        if (e.target.value.length <= 35) {
                          setName(e.target.value);
                        }
                      }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]} required>
                        <DatePicker
                          label="Holiday date"
                          slotProps={{
                            textField: {
                              size: "small",
                              fullWidth: true,
                              style: { marginBottom: "8px" },
                            },
                          }}
                          value={inputdata.date}
                          onChange={(newDate) => handleDateChange(newDate)}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                    <FormControl size="small" fullWidth>
                      <InputLabel id="holiday-type-label">
                        Holiday type
                      </InputLabel>
                      <Select
                        labelId="holiday-type-label"
                        id="demo-simple-select"
                        label="holiday type"
                        className="mb-[8px]"
                        value={type}
                        name="type"
                        onChange={(e) => setType(e.target.value)}
                      >
                        <MenuItem value="Optional">Optional</MenuItem>
                        <MenuItem value="Mandatory">Mandatory</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl size="small" fullWidth>
                      <InputLabel id="region-label">Region</InputLabel>
                      <Select
                        labelId="region-label"
                        id="demo-simple-select"
                        label="Region"
                        className="mb-[8px]"
                        onChange={(e) => setRegion(e.target.value)}
                        value={region}
                        name="region"
                      >
                        {locations?.length > 0 ? (
                          locations?.map((location, idx) => (
                            <MenuItem key={idx} value={location.shortName}>
                              {location.shortName}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value={""}>add location first</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </div>

                  <div className="mt-5 flex gap-5 justify-end">
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={handleClose}
                    >
                      cancel
                    </Button>
                    <Button
                      onClick={doTheOperation}
                      color="primary"
                      variant="contained"
                    >
                      Apply
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogContent>
                    <p>
                      Please confirm your decision to delete this holiday, as
                      this action cannot be undone.
                    </p>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleClose}
                      variant="outlined"
                      color="primary"
                      size="small"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={doTheOperation}
                      color="error"
                    >
                      Delete
                    </Button>
                  </DialogActions>
                </>
              )}
            </DialogContent>
          </Dialog>
        </article>
      </Setup>
    </section>
  );
};

export default PublicHoliday;
