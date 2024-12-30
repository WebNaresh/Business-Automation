const catchAsyncError = require("../../middleware/catchAssyncError");
const { EmployeeSurveyModel, EmployeeResponseModel, EmployeeSurveyPermissionModel } = require("../../models/EmployeeSurveySchema/EmployeeSurveySchema");
const { sendSurveyEmail } = require("../../utils/surveyEmail");
const { EmployeeModel } = require("../../models/employeeSchema")

//-------------------------Communication Permission-------------------------
//POST and PUT API 
exports.manageEmployeeSurveyPermission = catchAsyncError(async (req, res) => {
  try {
    const organizationId = req.params.organizationId;
    const { surveyPermission } = req.body;

    let existingSurveyPermission = await EmployeeSurveyPermissionModel.findOne({ organisationId: organizationId });

    if (!existingSurveyPermission) {
      const newSurveyPermission = new EmployeeSurveyPermissionModel({
        surveyPermission,
        organisationId: organizationId
      });

      existingSurveyPermission = await newSurveyPermission.save();
      return res.status(201).json(existingSurveyPermission);
    }

    existingSurveyPermission.surveyPermission = surveyPermission;
    const updatedSurveyPermission = await existingSurveyPermission.save();
    res.status(200).json(updatedSurveyPermission);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to manage communication permission",
      details: error.message,
    });
  }
});

// GET API 
exports.getEmployeeSurveyPermission = catchAsyncError(async (req, res, next) => {
  const organizationId = req.params.organizationId;

  const surveyPermission = await EmployeeSurveyPermissionModel.findOne({ organisationId: organizationId });

  if (!surveyPermission) {
    return res.status(404).json({ message: "Survey permission not found for this organization" });
  }

  res.status(200).json(surveyPermission);
});

//-----------------------------Employee Survey Form---------------------------------
// POST API 
exports.addEmployeeSurvey = catchAsyncError(async (req, res, next) => {
  try {
    const { title, description, questions, employeeSurveyStartingDate, employeeSurveyEndDate, creatorId, status, from, to, subject, body, employeeCredential } = req.body;
    const organizationId = req.params.organizationId;

    const surveyStartDate = new Date(employeeSurveyStartingDate).setHours(0, 0, 0, 0);

    const newSurvey = new EmployeeSurveyModel({
      title,
      description,
      questions,
      employeeSurveyStartingDate,
      employeeSurveyEndDate,
      creatorId,
      status,
      organisationId: organizationId,
      to,
      from,
      subject,
      body,
      employeeCredential
    });

    await newSurvey.save();

    const today = new Date().setHours(0, 0, 0, 0);

    // Send emails only if the survey's start date is today or earlier
    if (today >= surveyStartDate) {
      for (const recipient of to) {
        const employee = await EmployeeModel.findOne({ email: recipient.value });

        if (!employee) {
          return res.status(404).json({
            success: false,
            message: `Employee with email ${recipient.value} not found`,
          });
        }

        const surveyLink = employee._id
          ? `${process.env.BASE_URL}/organisation/${organizationId}/employee-survey/${employee._id}`
          : `${process.env.BASE_URL}/organisation/${organizationId}/employee-survey`;

        const employeeName = `${employee?.first_name || ''} ${employee?.last_name || ''}`;

        const mailOptions = {
          from,
          to: recipient.value,
          subject: "Employee Survey Invitation",
          html: `
              <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
                <p>Dear ${employeeName},</p>
                <p>We hope this message finds you well.</p>
                <p>At AEIGS software, we highly value your feedback to improve our services. Your opinion matters!</p>
                <p>We kindly invite you to participate in our Employee Survey. Your responses will help us understand your needs better and serve you more effectively.</p>
                <p>To begin the survey, please click on the following link:</p>
                <p><a href="${surveyLink}" target="_blank" style="color: #007bff;">Take the Survey</a></p>
                <p>Your input is crucial to us, and we appreciate your time in advance.</p>
                <p>If you have any questions or concerns regarding the survey, please do not hesitate to contact us.</p>
                <p>Thank you for your continued support!</p>
                <p>Best regards,</p>
                <p>AEIGS software Team</p>
                <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
                <p style="font-size: 12px; color: #999;">
                  This email and any attachments are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you have received this email in error, please notify the sender immediately and delete it from your system.
                </p>
                <p style="font-size: 12px; color: #999;">
                  Address: 603, Haware grand heritage, Kaspate Wasti, Wakad, Pune, Maharashtra 411057<br>
                  Email: <a href="mailto:arganitservices@gmail.com" style="color: #999;">arganitservices@gmail.com</a><br>
                  Phone: 9082462161
                </p>
              </div>
            `,
        };

        await sendSurveyEmail(mailOptions);
      }

      return res.status(201).json({
        success: true,
        data: newSurvey,
        message: "Survey created and emails sent successfully",
      });
    } else {
      return res.status(201).json({
        success: true,
        data: newSurvey,
        message: "Survey created successfully. Emails will be sent when the survey starts.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Fill all required field",
      details: error.message,
    });
  }
});

// PUT API 
exports.updateEmployeeSurvey = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, questions, employeeSurveyStartingDate, employeeSurveyEndDate, to, creatorId, status, from, subject, body, employeeCredential } = req.body;
  const organizationId = req.params.organizationId;

  try {
    const existingSurvey = await EmployeeSurveyModel.findById(id);

    if (!existingSurvey) {
      return res.status(404).json({ success: false, message: "Survey not found" });
    }

    const updateData = {
      title,
      description,
      questions,
      employeeSurveyStartingDate,
      employeeSurveyEndDate,
      to,
      creatorId,
      status,
      employeeCredential
    };

    const updatedSurvey = await EmployeeSurveyModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!updatedSurvey) {
      return res.status(404).json({ success: false, message: "Survey not found" });
    }

    // Send email to each recipient
    for (const recipient of to) {
      const employee = await EmployeeModel.findOne({ email: recipient.value });

      if (!employee) {
        console.log(`Employee with email ${recipient.value} not found`);
        continue;
      }

      const surveyLink = employee._id
        ? `${process.env.BASE_URL}/organisation/${organizationId}/employee-survey/${employee._id}`
        : `${process.env.BASE_URL}/organisation/${organizationId}/employee-survey`;
      const employeeName = `${employee?.first_name || 'Employee'} ${employee?.last_name || ''}`;

      const mailOptions = {
        from,
        to: recipient.value,
        subject: subject || "Updated Employee Survey",
        html: `
            <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
              <p>Dear ${employeeName},</p>
              <p>We hope this message finds you well.</p>
              <p>At AEIGS software, we highly value your feedback to improve our services. Your opinion matters!</p>
              <p>We kindly invite you to participate in our Employee Survey. Your responses will help us understand your needs better and serve you more effectively.</p>
              <p>To begin the survey, please click on the following link:</p>
              <p><a href="${surveyLink}" target="_blank" style="color: #007bff;">Take the Survey</a></p>
              <p>Your input is crucial to us, and we appreciate your time in advance.</p>
              <p>If you have any questions or concerns regarding the survey, please do not hesitate to contact us.</p>
              <p>Thank you for your continued support!</p>
              <p>Best regards,</p>
              <p>AEIGS software Team</p>
              <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
              <p style="font-size: 12px; color: #999;">
                This email and any attachments are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you have received this email in error, please notify the sender immediately and delete it from your system.
              </p>
              <p style="font-size: 12px; color: #999;">
                Address: 603, Haware grand heritage, Kaspate Wasti, Wakad, Pune, Maharashtra 411057<br>
                Email: <a href="mailto:arganitservices@gmail.com" style="color: #999;">arganitservices@gmail.com</a><br>
                Phone: 9082462161
              </p>
            </div>
          `,
      };

      await sendSurveyEmail(mailOptions);
    }

    res.status(200).json({
      success: true,
      data: updatedSurvey,
      message: "Survey updated and emails sent successfully",
    });
  } catch (error) {
    console.error("Error updating survey:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update survey and send email",
      details: error.message,
    });
  }
});

// DELETE API
exports.deleteEmployeeSurvey = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedSurvey = await EmployeeSurveyModel.findByIdAndDelete(id);

    if (!deletedSurvey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    res.status(200).json({ message: "Survey deleted successfully" });
  } catch (error) {
    console.error("Error deleting survey:", error);
    res.status(500).json({ message: "Failed to delete survey" });
  }
});

//--------------------Survey List---------------------------
// GET API for Draft Survey
exports.getDraftSurveys = catchAsyncError(async (req, res, next) => {
  const creatorId = req.user.user._id;
  const organisationId = req.params.organizationId;
  const role = req.user.user.profile;

  let draftSurveys;

  if (role.includes('Super-Admin')) {
    draftSurveys = await EmployeeSurveyModel.find({
      status: false,
      organisationId: organisationId,
      $or: [
        { creatorId: creatorId, creatorRole: 'Super-Admin' },
        { creatorRole: 'HR' }
      ]
    });
  } else if (role.includes('HR')) {
    draftSurveys = await EmployeeSurveyModel.find({
      status: false,
      organisationId: organisationId,
      creatorId: creatorId,
      creatorRole: 'HR'
    });
  } else {
    return res.status(403).json({ message: "You do not have access to draft surveys" });
  }

  res.status(200).json(draftSurveys);
});

// GET API to fetch a single survey by ID
exports.getEmployeeSurveyById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  try {
    const survey = await EmployeeSurveyModel.findById(id);
    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }
    res.status(200).json(survey);
  } catch (error) {
    console.error("Error fetching survey:", error);
    res.status(500).json({ message: "Failed to fetch survey" });
  }
});



// GET API to fetch a single open survey by ID
exports.getOpenSurveyById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  try {
    const survey = await EmployeeSurveyModel.findOne({ _id: id, status: true });

    if (!survey) {
      return res.status(404).json({ message: "Open survey not found" });
    }

    res.status(200).json(survey);
  } catch (error) {
    console.error("Error fetching open survey:", error);
    res.status(500).json({ message: "Failed to fetch open survey" });
  }
});

// POST API to add employee response survey
exports.addEmployeeResponseSurvey = catchAsyncError(async (req, res, next) => {
  const { surveyId, title, description, questions, employeeId, responseStatus, employeeCredential } = req.body;

  // Check if a response already exists for this surveyId and employeeId
  const existingResponse = await EmployeeResponseModel.findOne({ surveyId, employeeId });

  if (existingResponse) {
    return res.status(400).json({ error: 'Employee already responded to this survey' });
  }

  const newResponse = new EmployeeResponseModel({
    surveyId,
    title,
    description,
    questions,
    employeeId,
    responseStatus,
    employeeCredential
  });

  const savedResponse = await newResponse.save();
  res.status(201).json(savedResponse);
});

// PUT API to update a survey response
exports.updateEmployeeSurveyResponse = catchAsyncError(async (req, res, next) => {
  const { responseId } = req.params;
  const { surveyId, title, description, questions, employeeId, responseStatus, employeeCredential } = req.body;

  try {
    const updateSurveyResponse = await EmployeeResponseModel.findByIdAndUpdate(
      responseId,
      { surveyId, title, description, questions, employeeId, responseStatus, employeeCredential },
      { new: true, runValidators: true }
    );

    if (!updateSurveyResponse) {
      return res.status(404).json({ message: "Survey response not found" });
    }

    res.status(200).json(updateSurveyResponse);
  } catch (error) {
    console.error("Error updating response survey:", error);
    res.status(500).json({ message: "Failed to update response survey" });
  }
});

//get api for save survey
exports.getSaveSurveys = catchAsyncError(async (req, res, next) => {
  const creatorId = req.user.user._id;
  const role = req.user.user.profile;

  let filter;

  filter = {
    organisationId: req.params.organizationId,
  };

  // else {
  //   filter = {
  //     $or: [
  //       { creatorId: creatorId }
  //     ]
  //   };
  // }

  const saveSurveys = await EmployeeSurveyModel.find(filter);
  res.status(200).json(saveSurveys);
});

//Get Closed Survey
exports.getClosedSurveys = catchAsyncError(async (req, res, next) => {
  try {
    const role = req.user.user.profile;
    const creatorId = req.user.user._id;
    const organisationId = req.params.organizationId;
    const currentDate = new Date();

    // Calculate the date 6 months ago from the current date
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

    let filter;
    if (role.includes("Super-Admin")) {
      filter = {
        status: true,
        organisationId: organisationId,
        employeeSurveyEndDate: {
          $gte: sixMonthsAgo
        }
      };
    } else {
      filter = {
        status: true,
        creatorId: creatorId,
        organisationId: organisationId,
        employeeSurveyEndDate: {
          $gte: sixMonthsAgo
        }
      };
    }

    const closedSurveys = await EmployeeSurveyModel.find(filter);
    res.status(200).json(closedSurveys);
  } catch (error) {
    console.error("Error fetching closed surveys:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch closed surveys",
      details: error.message,
    });
  }
});


// GET API to fetch open surveys
exports.getOpenSurveys = catchAsyncError(async (req, res, next) => {
  const userEmails = req.user.user.email;
  const creatorId = req.user.user._id;
  const role = req.user.user.profile;
  const currentDate = new Date();

  let filter;
  if (role.includes("Super-Admin")) {
    filter = {
      status: true,
      organisationId: req.params.organizationId,
      employeeSurveyStartingDate: { $lte: currentDate },
      employeeSurveyEndDate: { $gte: currentDate },
    };
  } else {
    filter = {
      status: true,
      employeeSurveyStartingDate: { $lte: currentDate },
      employeeSurveyEndDate: { $gte: currentDate },
      $or: [
        { "to": { $elemMatch: { value: userEmails } } },
        { creatorId: creatorId }
      ]
    };
  }

  const openSurveys = await EmployeeSurveyModel.find(filter);
  res.status(200).json(openSurveys);
});

// GET API to fetch employee survey responses
exports.getEmployeeSurveyResponses = catchAsyncError(async (req, res, next) => {
  const userEmployeeId = req.user.user._id;
  const userRole = req.user.user.role;

  let surveyResponses;

  if (userRole === 'Super-Admin') {
    surveyResponses = await EmployeeResponseModel.find();
  } else {
    surveyResponses = await EmployeeResponseModel.find({ employeeId: userEmployeeId });
  }

  if (!surveyResponses.length) {
    return res.status(404).json({ message: 'No survey responses found' });
  }

  res.status(200).json(surveyResponses);
});

// GET API to fetch a single response survey by ID
exports.getEmployeeResponseSurveyById = catchAsyncError(async (req, res, next) => {
  const { responseId } = req.params;
  try {
    const responseSurvey = await EmployeeResponseModel.findById(responseId).populate("employeeId");
    if (!responseSurvey) {
      return res.status(404).json({ message: "Response survey not found" });
    }
    res.status(200).json(responseSurvey);
  } catch (error) {
    console.error("Error fetching responseSurvey:", error);
    res.status(500).json({ message: "Failed to fetch responseSurvey" });
  }
});

// GET API to fetch a response survey by surveyId
exports.getEmployeeResponseSurveyBySurveyId = catchAsyncError(async (req, res, next) => {
  const { surveyId } = req.params;
  try {
    const responseSurvey = await EmployeeResponseModel.find({ surveyId }).populate("employeeId");
    if (!responseSurvey) {
      return res.status(404).json({ message: "Response survey not found" });
    }
    res.status(200).json(responseSurvey);
  } catch (error) {
    console.error("Error fetching response survey:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

