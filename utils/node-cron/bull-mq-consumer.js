const { Worker } = require("bullmq");

const worker = new Worker("email-queue", async (job) => {
  console.log("job", job.data);
  // return job.data;
  await new Promise((res, rej) => setTimeOut(() => res(job.data), 5 * 1000));
  console.log("Email sent successfully");
});
