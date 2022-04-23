import * as core from "@actions/core";
import * as admin from "firebase-admin";

try {
  const firebase = admin.initializeApp();

  firebase
    .firestore()
    .doc(core.getInput("path"))
    .update(JSON.parse(core.getInput("value")))
    .then(
      () => {
        process.exit(core.ExitCode.Success);
      },
      (reason) => {
        core.setFailed(JSON.stringify(reason));
        process.exit(core.ExitCode.Failure);
      }
    );
} catch (error) {
  core.setFailed(JSON.stringify(error));
  process.exit(core.ExitCode.Failure);
}
