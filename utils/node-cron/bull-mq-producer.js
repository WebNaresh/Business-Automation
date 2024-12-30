const { Queue, Worker } = require("bullmq");
const { OrganisationModel } = require("../../models/organizationSchema");
const { customEmailClass } = require("../email/email-class");
const { redisClient } = require("../redis");

class SubscriptionUpdater {
  constructor() {
    console.log("Queue created");
    this.updateQueue = new Queue("update-subscription", {
      connection: redisClient.client,
    });
    this.emailNotificationQueue = new Queue("email-queue", {
      connection: redisClient.client,
    });
    this.worker = new Worker(
      "update-subscription",
      async (job) => {
        try {
          console.log(`Processing job ${job.id} with data:`, job.data);
          // Here you would put the logic to update the subscription date
          await this.updateSubscriptionDate(job.data);
          console.log("Subscription date updated successfully");
        } catch (error) {
          console.log("Error while updating subscription date", error);
        }
      },
      {
        connection: redisClient.client,
      }
    );
    this.emailWorker = new Worker(
      "email-queue",
      async (job) => {
        // return job.data;
        try {
          await customEmailClass.sendEmail(
            job.data,
            "Subscription Update",
            getHtmlContent(job.data)
          );
          console.log("Email sent successfully");
        } catch (error) {
          console.log("Error while updating subscription date", error);
        }
      },
      {
        connection: redisClient.client,
      }
    );
  }

  async addJob(data) {
    const job = await this.updateQueue.add("updateDate", data);
    console.log(`Job ${job.id} added to the queue`);
  }
  async addToEmailQueue(data) {
    const job = await this.emailNotificationQueue.add("send-email", data);
    console.log(`Job ${job.id} added to the email queue`);
  }

  processJobs() {
    this.updateQueue.process("updateDate", async (job) => {
      // Here you would put the logic to update the subscription date
      console.log(`Processing job ${job.id} with data:`, job.data);
    });
  }

  async updateSubscriptionDate(data) {
    await OrganisationModel.findByIdAndUpdate(data._id, {
      $set: {
        subscriptionDetails: {
          expirationDate: data.expirationDate,
          startDate: data.startDate,
        },
        packageInfo: data.packageInfo,
        upcomingPackageInfo: {
          packageName: null,
          packageStartDate: null,
          packageEndDate: null,
          memberCount: 0,
        },
      },
    });
    console.log("Subscription date updated successfully");
  }
  getHtmlContent(organization) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscription Deactivation Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            width: 80%;
            margin: 0 auto;
        }
        .header {
            background-color: #f8f8f8;
            padding: 10px;
            text-align: center;
            border-bottom: 1px solid #ddd;
        }
        .content {
            padding: 20px;
        }
        .footer {
            background-color: #f8f8f8;
            padding: 10px;
            text-align: center;
            border-top: 1px solid #ddd;
            margin-top: 20px;
        }
        .highlight {
            color: #d9534f;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Subscription Deactivation Notification</h1>
        </div>
        <div class="content">
            <p>Hello <strong>Test</strong>,</p>
            <p>This is an important notification to update you that your AEGIS HRMS subscription has been <span class="highlight">deactivated</span> and entered into the grace period due to non-renewal.</p>
            <p>Here are the details of your subscription:</p>
            <ul>
                <li><strong>Business Name:</strong> ${
                  organization?.orgName
                }</li>
                <li><strong>Validity Ended:</strong> ${moment(
                  organization?.subscriptionDetails.expirationDate
                ).format("DD-MM-YYYY")}</li>
            </ul>
            <p>Please note that because of this deactivation, your employees will be unable to submit punches like Remote Punch and QR Punch, etc. Furthermore, all HR users will be unable to access the HR Portal till the subscription is renewed.</p>
            <p>We request you to renew your subscription at your earliest convenience to avoid service disruption.</p>
            <a href="${
              process.env.BASE_URL
            }" class="button">Login to Manage Subscription</a>
            <p>Feel free to reach out to support in case you need any help.</p>
            <p>Team AEGIS</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Runtime HRMS. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
  }
}

// Usage:

module.exports = { BullMQ: new SubscriptionUpdater() };
