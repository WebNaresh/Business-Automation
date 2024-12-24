import { MoreVert } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import GetAppIcon from "@mui/icons-material/GetApp";
import {
  Container,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import Form16DeleteModal from "../../components/Modal/Form16Modal/Form16DeleteModal";
import Form16Download from "../../components/Modal/Form16Modal/Form16Download";
import Form16UploadModal from "../../components/Modal/Form16Modal/Form16UploadModal";

const Form16Hr = () => {
  // state and other thing
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [nameSearch, setNameSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [deptSearch, setDeptSearch] = useState("");
  const [availableEmployee, setAvailableEmployee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [numbers, setNumbers] = useState([]);
  const { organisationId } = useParams();

  //employee fetch
  const fetchAvailableEmployee = async (page) => {
    try {
      const apiUrl = `${import.meta.env.VITE_API}/route/employee/get-paginated-emloyee/${organisationId}?page=${page}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: authToken,
        },
      });
      setAvailableEmployee(response.data.employees);
      setCurrentPage(page);
      setTotalPages(response.data.totalPages || 1);
      // Generate an array of page numbers
      const numbersArray = Array.from(
        { length: response.data.totalPages || 1 },
        (_, index) => index + 1
      );
      setNumbers(numbersArray);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAvailableEmployee(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  //   pagination
  const prePage = () => {
    if (currentPage !== 1) {
      fetchAvailableEmployee(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage !== totalPages) {
      fetchAvailableEmployee(currentPage + 1);
    }
  };

  const changePage = (id) => {
    fetchAvailableEmployee(id);
  };
  //   for morevert icon
  const [anchorEl, setAnchorEl] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);

  const handleClick = (e, id) => {
    setAnchorEl(e.currentTarget);
    setEmployeeId(id);
  };
  const handleCloseIcon = () => {
    setAnchorEl(null);
  };

  // Modal states and function for upload
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // for open
  const handleUploadModalOpen = () => {
    setUploadModalOpen(true);
  };
  //   for close
  const handleUploadModalClose = () => {
    setUploadModalOpen(false);
  };

  // Modal states and function for download or view form 16
  const [downloadModalOpen, setDownLoadModalOpen] = useState(false);
  // for open
  const handleDownLoadModalOpen = () => {
    setDownLoadModalOpen(true);
  };
  //   for close
  const handleDownLoadModalClose = () => {
    setDownLoadModalOpen(false);
  };

  // Modal states and function for delete form 16
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // for open
  const handleDeleteModalOpen = () => {
    setDeleteModalOpen(true);
  };
  //   for close
  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };
  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
        <article className=" bg-white w-full h-max shadow-md rounded-sm border items-center">
          <Typography variant="h4" className="text-center mb-6 mt-2">
            Form-16
          </Typography>
          <p className="text-xs text-gray-600 text-center">
            Upload , download and view form-16 of your employee here.
          </p>
          <div className="p-4 border-b-[.5px] flex flex-col md:flex-row items-center justify-between gap-3 w-full border-gray-300">
            <div className="flex items-center gap-3 mb-3 md:mb-0 w-full md:w-auto">
              <TextField
                onChange={(e) => setNameSearch(e.target.value)}
                placeholder="Search Employee Name...."
                variant="outlined"
                size="small"
                sx={{ width: { xs: "100%", sm: 300 } }}
              />
            </div>
            <div className="flex items-center gap-3 mb-3 md:mb-0 w-full md:w-auto">
              <TextField
                onChange={(e) => setDeptSearch(e.target.value)}
                placeholder="Search Department Name...."
                variant="outlined"
                size="small"
                sx={{ width: { xs: "100%", sm: 300 } }}
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <TextField
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Search Location ...."
                variant="outlined"
                size="small"
                sx={{ width: { xs: "100%", sm: 300 } }}
              />
            </div>
          </div>

          <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
            <table className="min-w-full bg-white  text-left !text-sm font-light">
              <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                <tr className="!font-semibold">
                  <th scope="col" className="!text-left pl-8 py-3">
                    Sr. No
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    First Name
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Last Name
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Email
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Location
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Department
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Phone Number
                  </th>
                  <th scope="col" className="pl-8 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {availableEmployee
                  .filter((item) => {
                    return (
                      (!nameSearch.toLowerCase() ||
                        (item.first_name !== null &&
                          item.first_name !== undefined &&
                          item.first_name
                            .toLowerCase()
                            .includes(nameSearch))) &&
                      (!deptSearch ||
                        (item.deptname !== null &&
                          item.deptname !== undefined &&
                          item.deptname.some(
                            (dept) =>
                              dept.departmentName !== null &&
                              dept.departmentName
                                .toLowerCase()
                                .includes(deptSearch.toLowerCase())
                          ))) &&
                      (!locationSearch.toLowerCase() ||
                        item.worklocation.some(
                          (location) =>
                            location &&
                            location.city !== null &&
                            location.city !== undefined &&
                            location.city.toLowerCase().includes(locationSearch)
                        ))
                    );
                  })
                  .map((item, id) => (
                    <tr className="!font-medium border-b" key={id}>
                      <td className="!text-left pl-8 py-3">{id + 1}</td>
                      <td className="py-3 pl-8">{item?.first_name}</td>
                      <td className="py-3 pl-8">{item?.last_name}</td>
                      <td className="py-3 pl-8">{item?.email}</td>
                      <td className="py-3 pl-8">
                        {item?.worklocation?.map((location, index) => (
                          <span key={index}>{location?.city}</span>
                        ))}
                      </td>
                      <td className="py-3 pl-8 ">
                        {item?.deptname?.map((dept, index) => (
                          <span key={index}>{dept?.departmentName}</span>
                        ))}
                      </td>
                      <td className="py-3 pl-8 ">{item?.phone_number}</td>
                      <td className="py-3 pl-8 ">
                        <MoreVert
                          onClick={(e) => handleClick(e, item._id)} // Pass item._id to handleClick
                          className="cursor-pointer"
                        />
                        <Menu
                          elevation={2}
                          anchorEl={anchorEl}
                          key={id}
                          open={Boolean(anchorEl)}
                          onClose={handleCloseIcon}
                        >
                          <Tooltip title="Button for uploading form 16">
                            <MenuItem
                              onClick={() => {
                                handleUploadModalOpen();
                              }}
                            >
                              <CloudUploadIcon
                                color="primary"
                                aria-label="edit"
                                style={{
                                  color: "#f50057",
                                  marginRight: "10px",
                                }}
                              />
                            </MenuItem>
                          </Tooltip>
                          <Tooltip title="Button for downloading or view  form 16">
                            <MenuItem onClick={() => handleDownLoadModalOpen()}>
                              <GetAppIcon
                                color="primary"
                                aria-label="edit"
                                style={{
                                  color: "#2196f3",
                                  marginRight: "10px",
                                }}
                              />
                            </MenuItem>
                          </Tooltip>
                          <Tooltip title="Button for deleting  form 16">
                            <MenuItem onClick={() => handleDeleteModalOpen()}>
                              <DeleteIcon
                                color="primary"
                                aria-label="edit"
                                style={{
                                  color: "#2196f3",
                                  marginRight: "10px",
                                }}
                              />
                            </MenuItem>
                          </Tooltip>
                        </Menu>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <nav
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "30px",
                marginBottom: "20px",
              }}
            >
              <ul
                style={{ display: "inline-block", marginRight: "5px" }}
                className="pagination"
              >
                <li
                  style={{ display: "inline-block", marginRight: "5px" }}
                  className="page-item"
                >
                  <button
                    style={{
                      color: "#007bff",
                      padding: "8px 12px",
                      border: "1px solid #007bff",
                      textDecoration: "none",
                      borderRadius: "4px",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    className="page-link"
                    onClick={prePage}
                  >
                    Prev
                  </button>
                </li>
                {numbers.map((n, i) => (
                  <li
                    key={i}
                    className={`page-item ${currentPage === n ? "active" : ""}`}
                    style={{
                      display: "inline-block",
                      marginRight: "5px",
                    }}
                  >
                    <a
                      href={`#${n}`}
                      style={{
                        color: currentPage === n ? "#fff" : "#007bff",
                        backgroundColor:
                          currentPage === n ? "#007bff" : "transparent",
                        padding: "8px 12px",
                        border: "1px solid #007bff",
                        textDecoration: "none",
                        borderRadius: "4px",
                        transition: "all 0.3s ease",
                      }}
                      className="page-link"
                      onClick={() => changePage(n)}
                    >
                      {n}
                    </a>
                  </li>
                ))}
                <li style={{ display: "inline-block" }} className="page-item">
                  <button
                    style={{
                      color: "#007bff",
                      padding: "8px 12px",
                      border: "1px solid #007bff",
                      textDecoration: "none",
                      borderRadius: "4px",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    className="page-link"
                    onClick={nextPage}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </article>
      </Container>

      {/* for upload*/}
      <Form16UploadModal
        handleClose={handleUploadModalClose}
        organizationId={organisationId}
        open={uploadModalOpen}
        employeeId={employeeId}
      />

      {/* for download or view  */}
      <Form16Download
        handleClose={handleDownLoadModalClose}
        organizationId={organisationId}
        open={downloadModalOpen}
        employeeId={employeeId}
      />

      {/* for delete form 16 */}
      <Form16DeleteModal
        handleClose={handleDeleteModalClose}
        organizationId={organisationId}
        open={deleteModalOpen}
        employeeId={employeeId}
      />
    </>
  );
};

export default Form16Hr;
