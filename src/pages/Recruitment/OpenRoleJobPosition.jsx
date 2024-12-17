import React, { useState } from "react";
import { Info, West } from "@mui/icons-material";
import { Container, Box, Button, Grid, Chip } from "@mui/material";
import { useParams } from "react-router";
import { formatDistanceToNow } from "date-fns";
import useRecruitmentQuery from "../../hooks/RecruitmentHook/useRecruitmentQuery";
import MovingIcon from "@mui/icons-material/Moving";
import { Link } from "react-router-dom";
import ViewJobRoleModal from "../../components/Modal/RecruitmentModal/ViewJobRoleModal";

const OpenJobPosition = () => {
  const { organisationId } = useParams();
  const { getOpenJobRole } = useRecruitmentQuery(organisationId);
  console.log("open job role", getOpenJobRole);

  // for preview data
  const [viewJobModal, setViewJobModal] = useState(false);
  const [openJobRoleData, setOpenJobRoleData] = useState(null);

  const handleOpenViewJobModal = (data) => {
    setViewJobModal(true);
    setOpenJobRoleData(data);
  };
  const handleCloseViewJobModal = () => {
    setViewJobModal(false);
  };

  return (
    <>
      <header className="text-lg w-full pt-6 bg-white border  p-4">
        <Link to={-1}>
          <West className="mx-4 !text-xl" />
        </Link>
        Open Jobs Role
      </header>

      <Container maxWidth="xl py-6 h-auto min-h-[70vh] bg-gray-50">
        <div className="flex items-center justify-between  mb-4">
          <div className="space-y-1">
            <h2 className="text-2xl tracking-tight">Jobs</h2>
            <p className="text-sm text-muted-foreground">
              Here you can apply for job role.
            </p>
          </div>
        </div>

        <article className="gap-6 flex flex-wrap w-full h-max rounded-sm items-center">
          {getOpenJobRole && getOpenJobRole.length > 0 ? (
            getOpenJobRole.map((job) => (
              <Grid key={job?._id} item className="w-max">
                <Box className="w-[300px] rounded-sm flex justify-between items-start bg-white border py-4">
                  <div className="flex-1">
                    <div className="px-4 py-1">
                      <Chip
                        color="primary"
                        label={
                          job?.status === "Approved"
                            ? "Published"
                            : "Not Published"
                        }
                        variant="outlined"
                        icon={<MovingIcon />}
                      ></Chip>
                    </div>
                    <h1 className="text-xl px-4 font-semibold">
                      {job?.position_name}
                    </h1>
                    <p className="px-4">{job?.organizationId?.orgName}</p>
                    <p className="px-4">
                      {job?.location_name?.city} ({job?.mode_of_working?.label})
                    </p>
                    <p className="px-4">
                      Posted on: {formatDistanceToNow(new Date(job.createdAt))}{" "}
                      ago
                    </p>
                    <div className="px-4  py-4 flex   space-x-32">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>  handleOpenViewJobModal(job)}
                      >
                        View
                      </Button>
                      <Button variant="outlined" color="primary">
                        Apply
                      </Button>
                    </div>
                  </div>
                </Box>
              </Grid>
            ))
          ) : (
            <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="!text-2xl" />
                <h1 className="text-lg font-semibold">Open Job Role</h1>
              </article>
              <p>No jobs found.</p>
            </section>
          )}
        </article>
      </Container>

      <ViewJobRoleModal
        handleClose={handleCloseViewJobModal}
        open={viewJobModal}
        data={openJobRoleData}
      />
    </>
  );
};

export default OpenJobPosition;
