// // Inside the workflowService.js file

// const { EmployeeModel } = require("../models/employeeSchema");
// const { WorkFlowModel } = require("../models/workflow/workflow");

// async function initiateWorkflow(modelId, modelName, data) {
//   const approver = await EmployeeModel.findById(data.creator);

//   const workFlowData = {
//     apperover: approver,
//     message: `Employee ${data._id} created with ${JSON.stringify(
//       data.toObject()
//     )}`,
//     status: "Pending",
//     repoteeID: data.creator,
//     link: `/test/${data._id}`,
//     data: data.toObject(),
//   };

//   const workflow = new WorkFlowModel(workFlowData);
//   await workflow.save();

//   const model = await modelName.findByIdAndUpdate(
//     modelId,
//     { workflow: workflow._id },
//     { new: true }
//   );

//   return { model, workflow };
// }

// async function AcceptRequest() {
//   try {
//     const { id } = req.params;
//     const workflow = await WorkFlowModel.findById(id);
//     const modelName = id.constuctor.modelName;

//     if (!workflow) return "Workflow not found";
//     if (workflow.status !== "Pending")
//       return "Workflow is not in pending queue";

//     workflow.status = "Accepted";
//     const updateWorkFlow = await modelName.find(workflow);
//     updateWorkFlow.isVisible = true;
//     updateWorkFlow.save();

//     return { updateWorkFlow };
//   } catch (error) {
//     console.log(error);
//   }
// }

// module.exports = { initiateWorkflow, AcceptRequest };
