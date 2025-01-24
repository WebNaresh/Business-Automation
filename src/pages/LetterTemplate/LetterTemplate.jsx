import React, { useState } from "react";
import { TextField, Button, Paper, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { jsPDF } from "jspdf";

const OfferLetter = () => {
  const [candidateName, setCandidateName] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [address, setAddress] = useState("");
  const [openPreview, setOpenPreview] = useState(false);

  // Function to generate the offer letter
  const generateLetter = () => {
    return `
      Elana Mohammad, MD
      9436 Feather Street, Santynel, New Delhi
      +91 1234567890
      hello@reallygreatsite.com

      ${new Date().toDateString()}

      ${candidateName}
      Recruitment Consultant
      ${address}

      Dear ${candidateName},

      We are pleased to offer you the position of ${position} with an annual salary of ${salary}. 
      Your joining date will be ${joiningDate}. Please let us know if you have any questions.

      Best regards,
      Dr. Elana Mohammad, MD
    `;
  };

  // Function to download the offer letter as a PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    const letterContent = generateLetter();

    // Add content to the PDF
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);
    const lineHeight = 10;

    // Split the content into lines for better readability
    const lines = doc.splitTextToSize(letterContent, 180); // Wrap lines within 180mm
    let y = 20; // Start y-coordinate for text

    lines.forEach((line, index) => {
      doc.text(line, 15, y + index * lineHeight);
    });

    // Save the generated PDF
    doc.save(`${candidateName}_Offer_Letter.pdf`);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh", backgroundColor: "#f4f6f8" }}
    >
      <Grid item xs={12} sm={8} md={6}>
        <Paper elevation={3} style={{ padding: "20px", borderRadius: "10px" }}>
          <Typography
            variant="h5"
            align="center"
            style={{ marginBottom: "20px", fontWeight: "bold" }}
          >
            Offer Letter Generator
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Candidate Name"
                variant="outlined"
                fullWidth
                size="small"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Position"
                variant="outlined"
                fullWidth
                size="small"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Salary"
                variant="outlined"
                fullWidth
                size="small"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Joining Date"
                variant="outlined"
                fullWidth
                size="small"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Company Address"
                variant="outlined"
                fullWidth
                size="small"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={downloadPDF}
                style={{ marginTop: "10px" }}
              >
                Download Offer Letter PDF
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setOpenPreview(true)}
                style={{ marginTop: "10px", marginLeft: "10px" }}
              >
                Preview Offer Letter
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Preview Modal */}
      <Dialog open={openPreview} onClose={() => setOpenPreview(false)} fullWidth maxWidth="md">
        <DialogTitle>Offer Letter Preview</DialogTitle>
        <DialogContent>
          <Typography variant="body1" style={{ whiteSpace: "pre-line" }}>
            {generateLetter()}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreview(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default OfferLetter;
