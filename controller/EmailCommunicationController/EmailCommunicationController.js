const catchAssyncError = require("../../middleware/catchAssyncError");
const {
  EmailCommunicationModal,
} = require("../../models/EmailCommunicationSchema/EmailCommunicationSchema");
const { sendEmailMegha } = require("../../utils/sendEmails");

exports.sendEmailCommunication = catchAssyncError(async (req, res, next) => {
  try {
    const {
      communication,
      from,
      to,
      cc,
      bcc,
      subject,
      body,
      valediction,
      signature,
    } = req.body;
    const creatorId = req.user.user._id;
    const { organizationId } = req.params;

    const mailOptions = {
      from,
      to: to.map((recipient) => recipient.value).join(", "),
      cc: cc ? cc.map((recipient) => recipient.value).join(", ") : undefined,
      bcc: bcc ? bcc.map((recipient) => recipient.value).join(", ") : undefined,
      subject,
      html: `<div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
       <p style="margin: 0 0 10px; line-height: 1.5;">${body}</p>
       <p style="margin: 20px 0 10px; line-height: 1.5; font-weight: bold;">${valediction}</p>
       <p style="margin: 0 0 10px; line-height: 1.5;">${signature}</p>
       <p>If you did not initiate this request, please ignore this email. Your account security is important to us.</p>
       <p>Thank you for choosing AEIGS software.</p>
       <p><strong>Best regards,</strong></p>
       <p>AEIGS software Team</p>
       <p>Email: <a href="mailto:arganitservices@gmail.com">arganitservices@gmail.com</a></p>
       <p>Phone: 9082462161</p>
       <p>Address: 603, Haware grand heritage, Kaspate Wasti, Wakad, Pune, Maharashtra 411057</p>
       <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
        <p style="font-size: 12px; color: #999;">
         This email and any attachments are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you have received this email in error, please notify the sender immediately and delete it from your system.
        </p>
       </div>`,
    };
    await sendEmailMegha(mailOptions);

    const emailCommunication = new EmailCommunicationModal({
      communication,
      from,
      to,
      cc,
      bcc,
      subject,
      body,
      valediction,
      signature,
      status: "Sent",
      organizationId,
      creatorId,
    });

    await emailCommunication.save();
    console.log("email communicaiton", emailCommunication);

    return res.status(201).json({
      success: true,
      data: emailCommunication,
      message: "Email sent  successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send email communication",
      details: error.message,
    });
  }
});

exports.saveForLatterEmailCommunication = catchAssyncError(
  async (req, res, next) => {
    try {
      const {
        communication,
        from,
        to,
        cc,
        bcc,
        subject,
        body,
        valediction,
        signature,
      } = req.body;
      const creatorId = req.user.user._id;
      const { organizationId } = req.params;

      const addEmailCommunication = new EmailCommunicationModal({
        communication,
        from,
        to,
        cc,
        bcc,
        subject,
        body,
        valediction,
        signature,
        status: "UnSend",
        organizationId,
        creatorId,
      });

      await addEmailCommunication.save();

      return res.status(201).json({
        success: true,
        data: addEmailCommunication,
        message: "Save communication successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to save communicaiton  ",
        details: error.message,
      });
    }
  }
);

exports.updateEmailCommunication = catchAssyncError(async (req, res, next) => {
  try {
    const {
      communication,
      from,
      to,
      cc,
      bcc,
      subject,
      body,
      valediction,
      signature,
    } = req.body;
    const creatorId = req.user.user._id;
    const { organizationId, emailCommunicationId } = req.params;

    // Create email options
    const mailOptions = {
      from,
      to: to.map((recipient) => recipient.value).join(", "),
      cc: cc ? cc.map((recipient) => recipient.value).join(", ") : undefined,
      bcc: bcc ? bcc.map((recipient) => recipient.value).join(", ") : undefined,
      subject,
      html: `<p>${body}</p><p>${valediction}</p><p>${signature}</p>`,
    };

    // Send the email
    await sendMailCommunications(mailOptions);

    // Update communication details in the database
    const updatedEmailCommunication =
      await EmailCommunicationModal.findByIdAndUpdate(
        emailCommunicationId,
        {
          communication,
          from,
          to,
          cc,
          bcc,
          subject,
          body,
          valediction,
          signature,
          status: "Sent",
          organizationId,
          creatorId,
        },
        { new: true }
      );

    if (!updatedEmailCommunication) {
      return res.status(404).json({
        success: false,
        message: "Email communication not found",
      });
    }

    return res.status(201).json({
      success: true,
      data: updatedEmailCommunication,
      message: "Email update successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update communication",
      details: error.message,
    });
  }
});

exports.getEmailCommunication = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const getEmailCommunications = await EmailCommunicationModal.find({
      organizationId,
    });
    if (!getEmailCommunications) {
      return res.status(404).json({ message: "No data found" });
    }
    res.status(200).json({ success: true, data: getEmailCommunications });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

exports.deleteEmailCommunicationById = catchAssyncError(
  async (req, res, next) => {
    try {
      const { organizationId, emailCommunicationId } = req.params;

      const existingEmailCommunciationData =
        await EmailCommunicationModal.findOne({
          _id: emailCommunicationId,
          organizationId: organizationId,
        });

      if (!existingEmailCommunciationData) {
        return res.status(404).json({ message: "No data  found" });
      }

      const deleteEmailCommunication =
        await EmailCommunicationModal.findByIdAndDelete(emailCommunicationId);
      res.status(200).json({
        success: true,
        data: deleteEmailCommunication,
        message: "Email communication deleted successfully.",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete email communicaton",
        details: error.message,
      });
    }
  }
);
