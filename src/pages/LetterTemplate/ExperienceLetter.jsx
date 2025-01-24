import React, { useState } from "react";
import {
    TextField,
    Button,
    Paper,
    Grid,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { jsPDF } from "jspdf";

const ExperienceLetter = () => {
    const [employeeName, setEmployeeName] = useState("");
    const [designation, setDesignation] = useState("");
    const [workDuration, setWorkDuration] = useState("");
    const [relievingDate, setRelievingDate] = useState("");
    const [address, setAddress] = useState("");
    const [logo, setLogo] = useState(null);
    const [signature, setSignature] = useState(null);
    const [openPreview, setOpenPreview] = useState(false);

    // Function to generate the experience letter content
    const generateLetter = () => {
        return `
      [Company Name]
      [Company Address]
      [City, State, Zip Code]

      ${new Date().toDateString()}

      To Whom It May Concern,

      This is to certify that Mr./Ms. ${employeeName}, residing at ${address}, was employed with our organization as a ${designation} from ${workDuration}. During their tenure with us, they demonstrated exceptional dedication, professionalism, and a high level of competency in their work.

      ${employeeName} was relieved from their duties on ${relievingDate}, and we wish them success in all their future endeavors. Please feel free to contact us for any further details.

      Sincerely,
      [Your Company Name]
    `;
    };

    // Function to handle image upload
    const handleImageUpload = (e, setter) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => setter(reader.result);
        if (file) reader.readAsDataURL(file);
    };

    // Function to download the experience letter as a PDF
    const downloadPDF = () => {
        const doc = new jsPDF();
        const letterContent = generateLetter();

        // Add logo
        if (logo) {
            doc.addImage(logo, "PNG", 15, 10, 40, 20); // Adjust dimensions as needed
        }

        // Add content to the PDF
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(12);
        const lineHeight = 10;

        // Split the content into lines for better readability
        const lines = doc.splitTextToSize(letterContent, 180); // Wrap lines within 180mm
        let y = logo ? 40 : 20; // Adjust starting position based on logo

        lines.forEach((line, index) => {
            doc.text(line, 15, y + index * lineHeight);
        });

        // Add signature
        if (signature) {
            doc.addImage(signature, "PNG", 15, y + lines.length * lineHeight + 10, 40, 15); // Adjust dimensions
        }

        // Save the generated PDF
        doc.save(`${employeeName}_Experience_Letter.pdf`);
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
                        Experience Letter Generator
                    </Typography>
                    <div
                        style={{
                            maxHeight: "70vh",
                            overflowY: "auto",
                            paddingRight: "10px",
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Employee Name"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={employeeName}
                                    onChange={(e) => setEmployeeName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Designation"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={designation}
                                    onChange={(e) => setDesignation(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Work Duration"
                                    placeholder="e.g., January 2020 - December 2023"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={workDuration}
                                    onChange={(e) => setWorkDuration(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Relieving Date"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={relievingDate}
                                    onChange={(e) => setRelievingDate(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Employee Address"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1" style={{ marginBottom: "8px" }}>
                                    Upload Company Logo
                                </Typography>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, setLogo)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1" style={{ marginBottom: "8px" }}>
                                    Upload Signature
                                </Typography>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, setSignature)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={downloadPDF}
                                    style={{ marginTop: "10px" }}
                                >
                                    Download
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => setOpenPreview(true)}
                                    style={{ marginTop: "10px", marginLeft: "10px" }}
                                >
                                    Preview
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Paper>
            </Grid>

            {/* Preview Modal */}
            <Dialog
                open={openPreview}
                onClose={() => setOpenPreview(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>Experience Letter Preview</DialogTitle>
                <DialogContent>
                    {logo && (
                        <img
                            src={logo}
                            alt="Company Logo"
                            style={{ width: "100px", marginBottom: "20px" }}
                        />
                    )}
                    <Typography variant="body1" style={{ whiteSpace: "pre-line" }}>
                        {generateLetter()}
                    </Typography>
                    {signature && (
                        <img
                            src={signature}
                            alt="Signature"
                            style={{ width: "100px", marginTop: "20px" }}
                        />
                    )}
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

export default ExperienceLetter;
