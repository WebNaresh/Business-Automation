const cron = require("node-cron");
const { OrganisationModel } = require("../../models/organizationSchema");
const { BullMQ } = require("./bull-mq-producer");

class JobEmail {
  constructor() {
    this.job1 = cron.schedule("0 */12 * * *", async () => {
      console.log("Running a job at 12:00 AM");
      console.log("I am running ");
      const expiredOrganizations = await OrganisationModel.find({
        "subscriptionDetails.expirationDate": { $lte: new Date() },
        "upcomingPackageInfo.packageName": {
          $ne: null,
        },
      });

      expiredOrganizations.forEach(async (organization) => {
        console.log("organization", organization);
        BullMQ.addJob(organization);
      });
    });
    this.job2 = cron.schedule("0 */12 * * *", async () => {
      // cron.schedule("* * * * * *", async () => {
      const currentDate = new Date();
      const expirationThresholdDate = new Date();
      expirationThresholdDate.setDate(currentDate.getDate() + 15);

      // search the organization which is expired within 15 days
      const expiredOrganizations = await OrganisationModel.find({
        "subscriptionDetails.expirationDate": {
          $gte: currentDate,
          $lte: expirationThresholdDate,
        },
      });
      expiredOrganizations.forEach(async (organization) => {
        console.log("organization", organization);
        BullMQ.addToEmailQueue(organization);
      });
    });
  }
}

module.exports = { JobEmail };
