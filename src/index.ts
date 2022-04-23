import * as core from "@actions/core";
import * as admin from "firebase-admin";

try {
  const firebase = admin.initializeApp();

  const updatePath = String(core.getInput("path"));
  const updateString = String(core.getInput("value"));

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
        core.setFailed("1");
        process.exit(core.ExitCode.Failure);
      }
    );
} catch (error) {
  core.setFailed("2");
  process.exit(core.ExitCode.Failure);
}
