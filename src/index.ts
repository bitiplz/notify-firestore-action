import * as core from "@actions/core";
import * as admin from "firebase-admin";

try {
  const firebase = admin.initializeApp();

  const updatePath = core.getInput("path");
  const updateString = core.getInput("value");

  const updateObject = updateString.split(",").reduce((acc, entry) => {
    const [k, v] = entry.split(":");
    return { ...acc, [k]: v };
  }, {});

  firebase
    .firestore()
    .doc(updatePath)
    .update(updateObject)
    .then(
      () => {
        process.exit(core.ExitCode.Success);
      },
      (reason) => {
        core.setFailed(`r:${String(reason)}`);
        process.exit(core.ExitCode.Failure);
      }
    );
} catch (error) {
  core.setFailed(JSON.stringify(error));
  process.exit(core.ExitCode.Failure);
}
