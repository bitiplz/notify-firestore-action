import * as core from "@actions/core";
import * as admin from "firebase-admin";

import { fileSync } from "tmp";
import { writeSync } from "fs";

try {
  const sa = core.getInput("sa");
  const projectId = core.getInput("project");

  const tmpFile = fileSync({ postfix: ".json" });
  writeSync(tmpFile.fd, sa);
  process.env.GOOGLE_APPLICATION_CREDENTIALS = tmpFile.name;

  const firebase = admin.initializeApp({
    databaseURL: `https://${projectId}.firebaseio.com`,
  });

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
        core.setFailed("1");
        process.exit(core.ExitCode.Failure);
      }
    );
} catch (error) {
  core.setFailed(JSON.stringify(error));
  process.exit(core.ExitCode.Failure);
}
