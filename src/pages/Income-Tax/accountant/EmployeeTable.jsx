import { MoreVert, Search } from "@mui/icons-material";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Stack,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useEmployee from "../../../hooks/Dashboard/useEmployee";
import InvestmentTableSkeleton from "../components/InvestmentTableSkeleton";
import useFunctions from "../hooks/useFunctions";

const MenuButton = ({
  open,
  handleClose,
  handleClick,
  anchorEl,
  organisationId,
  empId,
}) => {
  const navigate = useNavigate();
  return (
    <div>
      <Menu
        id="basic-menu"
        elevation={1}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            navigate(
              `/organisation/${organisationId}/employee/income-tax-section/${empId}`
            );
            handleClose();
          }}
        >
          View TDS Details
        </MenuItem>
        {/* <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem> */}
      </Menu>
    </div>
  );
};

const EmployeeInvestmentTable = ({ setOpen }) => {
  const { setSearch } = useFunctions();
  const { organisationId } = useParams();
  const [empId, setEmpId] = useState(null);
  const [page, setPage] = useState(1);
  const [focusedInput, setFocusedInput] = useState("");
  const { employee, empFetching } = useEmployee(organisationId, page);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <div className="flex gap-4">
        {/* input field */}

        <div className={`space-y-1  min-w-[300px] md:min-w-[40vw] w-max `}>
          <div
            onFocus={() => {
              setFocusedInput("search");
            }}
            onBlur={() => setFocusedInput(null)}
            className={` ${
              focusedInput === "search"
                ? "outline-blue-500 outline-3 border-blue-500 border-[2px] "
                : "outline-none border-gray-200 border-[.5px]"
            } flex  rounded-md items-center px-2   bg-white py-3 md:py-[6px]`}
            // className="flex  rounded-md items-center px-2   bg-white py-3 md:py-[6px] outline-none border-gray-200 border-[.5px]"
          >
            <Search className="text-gray-700 md:text-lg !text-[1em]" />
            <input
              type={"text"}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={"Search Employees"}
              className={`border-none bg-white w-full outline-none px-2  `}
              formNoValidate
            />
          </div>
        </div>
      </div>

      <div className=" w-full my-2 overflow-x-auto">
        {empFetching ? (
          <InvestmentTableSkeleton />
        ) : (
          <div className="overflow-auto ">
            <table className="w-full table-auto  border border-collapse min-w-full bg-white  text-left  !text-sm font-light">
              <thead className="border-b bg-gray-100 font-bold">
                <tr className="!font-semibold ">
                  <th scope="col" className="!text-left px-2 w-max py-3 ">
                    Sr. No
                  </th>
                  <th scope="col" className="py-3 px-2 ">
                    Employee Name
                  </th>

                  <th scope="col" className="py-3 px-2 ">
                    Employee Email
                  </th>
                  <th scope="col" className="py-3 px-2 ">
                    Designation
                  </th>
                  <th scope="col" className="py-3 px-2 ">
                    Department Name
                  </th>

                  <th scope="col" className=" py-3 px-2 ">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {employee?.employees?.map((inv, id) => (
                  <tr
                    className={` hover:bg-gray-50 bg-white  !font-medium  w-max border-b `}
                  >
                    <td className="!text-left   py-4    px-2 w-[70px]  ">
                      {id + 1}
                    </td>

                    <td className="  text-left !p-0 !w-[250px]  ">
                      <p
                        className={`
                        px-2 md:w-full w-max`}
                      >
                        {inv?.first_name} {inv?.last_name}
                      </p>
                    </td>

                    <td className=" px-2  text-left w-[30%]  ">
                      <div className="flex h-full items-center gap-2">
                        <Avatar height={30} src={inv?.user_logo_url} />
                        {inv?.email}
                      </div>
                    </td>
                    <td className="text-left w-[200px]  ">
                      <div className="px-2 flex gap-2 items-center h-max w-max  cursor-pointer">
                        {inv?.designation[0].designationName}
                      </div>
                    </td>
                    <td className="px-2 text-left w-[200px]  ">
                      {" "}
                      {inv?.deptname[0].departmentName}
                    </td>
                    <td className="flex gap-2 text-left mt-2">
                      <IconButton
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={(e) => {
                          handleClick(e);
                          setEmpId(inv?._id);
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <MenuButton
              open={open}
              handleClose={handleClose}
              handleClick={handleClick}
              anchorEl={anchorEl}
              organisationId={organisationId}
              empId={empId}
            />

            <Stack
              direction={"row"}
              className="border-[.5px] border-gray-200 bg-white  border-t-0 px-4 py-2 h-full  items-center w-full justify-between "
            >
              <div>
                <h1>
                  Showing {page} to {employee?.totalPages} of{" "}
                  {employee?.totalGoals} entries
                </h1>
              </div>
              <Pagination
                count={employee?.totalPages}
                page={page}
                color="primary"
                shape="rounded"
                onChange={(event, value) => setPage(value)}
              />
            </Stack>
          </div>
        )}

        {/* )} */}
      </div>
    </>
  );
};

export default EmployeeInvestmentTable;
