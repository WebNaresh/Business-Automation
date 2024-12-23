import { MoreVert } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
} from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
// import randomColor from "randomcolor";
import { FaArrowCircleRight } from "react-icons/fa";
import { useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import EditOrganisation from "./edit-organization";

const Organisation = ({ item }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [editConfirmation, setEditConfirmation] = useState(null);
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
    setEditConfirmation(null);
  };

  const StyledTag = styled.div`
    background-color: rgb(75 85 99);
    &::after {
      background-color: rgb(75 85 99);
    }
  `;

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API}/route/organization/delete/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      handleAlert(true, "success", "Organization Deleted Successfully");
      queryClient.invalidateQueries("orgData");
      window.location.reload();
    } catch (error) {
      handleAlert(true, "error", "Failed to delete Organization");
    } finally {
      handleCloseConfirmation();
      setAnchorEl(null);
    }
  };

  const handleEdit = async (id) => {
    setEditConfirmation(true);
  };

  const truncateOrgName = (orgName) => {
    // const words = orgName.split(" ");
    // if (words.length > 4) {
    //   return words.slice(0, 4).join(" ") + " ...";
    // }

    // const wordCount = (orgName.match(/\S+/g) || []).length;
    // if (wordCount > 6) {
    //   return orgName.split(/\s+/).slice(0,6).join(" ") + " ...";
    // }
    // return orgName;

    const maxLength = 29;
    if (orgName.length > maxLength) {
      return orgName.slice(0, maxLength) + " ...";
    }
    return orgName;
  };

  const checkHasOrgDisabled = () => {
    if (item?.subscriptionDetails?.status === "Active") {
      if (
        moment(item?.subscriptionDetails?.expirationDate).diff(
          moment(),
          "days"
        ) > 0
      ) {
        return false;
      } else {
        return true;
      }
    } else if (item?.subscriptionDetails?.status === "Pending") {
      if (moment(item?.createdAt).add(7, "days").diff(moment(), "days") > 0) {
        return false;
      } else {
        return true;
      }
    }
    return true;
  };

  return (
    <>
      <div
        className="border-b-[2px] border block min-w-[18rem] max-w-[20rem] rounded-md h-fit shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out relative"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 200 }}
        data-aos="zoom-in"
        data-aos-offset="100"
      >
        <StyledTag
          className="tag "
          style={{
            backgroundColor: "rgb(75, 85, 99)",
            height: "16%",
            width: "43%",
            fontSize: "13px",
          }}
        >
          {item?.packageInfo}
        </StyledTag>

        <div
          className="border-b-2 grid grid-cols-5 items-center justify-between border-[#0000002d] px-4 py-2 text-black"
          data-aos="fade-up"
          data-aos-offset="100"
        >
          <div className="flex col-span-4 gap-2 items-center">
            <div
              className="p-[1px] ring-1 ring-gray-300"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
              data-aos="zoom-in"
              data-aos-offset="100"
            >
              <Avatar
                src={`${item?.logo_url}?v=${Date.now()})`}
                variant="rounded"
                className="w-12 h-12"
              />
            </div>
            <div className="flex flex-col">
              <h5
                className="text-sm font-semibold leading-tight text-blue-950 truncate"
                data-aos="fade-left"
                data-aos-offset="100"
              >
                {/* {item.orgName} */}
                {truncateOrgName(item.orgName)}
              </h5>
              <p
                className="text-xs text-black-800 font-mono mt-1"
                data-aos="fade-right"
                data-aos-offset="100"
              >
                Created On: {moment(item.createdAt).format("MMMM Do, YYYY")}
              </p>
            </div>
          </div>
          <div
            className="col-span-1 flex flex-row-reverse"
            data-aos="zoom-in"
            data-aos-offset="100"
          >
            <MoreVert
              onClick={(e) => handleClick(e, item)}
              className="mt-1 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
            />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleEdit(item._id)}>
                <EditOutlinedIcon
                  color="primary"
                  aria-label="edit"
                  style={{ marginRight: "8px" }}
                />
                Edit
              </MenuItem>
              <MenuItem onClick={() => handleDeleteConfirmation(item._id)}>
                <DeleteOutlineIcon
                  color="error"
                  aria-label="delete"
                  style={{ marginRight: "8px" }}
                />
                Delete
              </MenuItem>
            </Menu>
          </div>
        </div>
        <div className="p-4 pt-4 pb-2" data-aos="zoom-in" data-aos-offset="100">
          <Chip
            label={item?.industry_type}
            color="primary"
            variant="outlined"
            sx={{ color: "rgb(45 102 187)" }}
            className="chip-dark-text transition-transform duration-300 ease-in-out hover:scale-105 mb-2"
          />
          <p className="h-4 mt-1  text-xs font-bold text-black-600">
            {item?.subscriptionDetails?.status === "Pending" &&
            moment(item?.createdAt).add(7, "days").diff(moment(), "days") > 0 &&
            moment(item?.createdAt).add(7, "days").diff(moment(), "days") <
              7 ? (
              <span>
                Your{" "}
                {moment(item?.createdAt).add(7, "days").diff(moment(), "days")}{" "}
                day trial left
              </span>
            ) : (
              <span className="ml-2 py-7 ">Active Plan</span>
            )}
          </p>
        </div>
        <div
          className="p-4 py-2 flex justify-between"
          data-aos="zoom-in"
          data-aos-offset="0"
        >
          <Button
            variant="contained"
            disabled={checkHasOrgDisabled()}
            onClick={() => {
              let link;
              if (window.innerWidth <= 768) {
                link = `/organisation/${item._id}/setup`;
              } else {
                link = `/organisation/${item._id}/setup/add-roles`;
              }
              navigate(link);
            }}
          >
            Setup
          </Button>

          {!checkHasOrgDisabled() ? (
            <Link to={`/organisation/${item._id}/dashboard/super-admin`}>
              <Button variant="text" className="gap-2">
                Go to Dashboard
                <FaArrowCircleRight className="group-hover:translate-x-1 transition-transform duration-300 ease-in-out" />
              </Button>
            </Link>
          ) : (
            <Link to={`/billing`}>
              <button className="flex group justify-center gap-2 items-center rounded-md px-4 py-1 text-sm font-semibold text-blue-500 transition-all bg-white  focus-visible:outline-blue-500 duration-300 ease-in-out">
                Go to Billing
                <FaArrowCircleRight className="group-hover:translate-x-1 transition-transform duration-300 ease-in-out" />
              </button>
            </Link>
          )}
        </div>
      </div>

      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle data-aos="zoom-in" data-aos-offset="100">
          Confirm deletion
        </DialogTitle>
        <DialogContent data-aos="zoom-in" data-aos-offset="100">
          <p>
            Please confirm your decision to delete this Organization, as this
            action cannot be undone.
          </p>
        </DialogContent>
        <DialogActions data-aos="zoom-in" data-aos-offset="100">
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={handleCloseConfirmation}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={() => handleDelete(deleteConfirmation)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editConfirmation !== null}
        onClose={handleCloseConfirmation}
        fullWidth
      >
        <DialogTitle
          className="!font-semibold !text-xl"
          data-aos="zoom-in"
          data-aos-offset="100"
        >
          Edit Organisation
        </DialogTitle>

        <DialogContent data-aos="zoom-in" data-aos-offset="100">
          <EditOrganisation {...{ item, handleCloseConfirmation }} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Organisation;
