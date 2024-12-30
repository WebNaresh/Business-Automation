const { exec: execNonPromise } = require("child_process");

function exec(command) {
  return new Promise((resolve, reject) => {
    execNonPromise(command, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      if (stderr) {
        return resolve(stderr);
      }
      return resolve(stdout);
    });
  });
}

module.exports = exec;
