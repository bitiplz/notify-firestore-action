import * as core from "@actions/core";
import * as admin from "firebase-admin";

import { fileSync } from "tmp";
import { writeSync } from "fs";

let firebase: admin.app.App;

const init = () => {
  try {
    const sa = core.getInput("sa");

    const tmpFile = fileSync({ postfix: ".json" });
    writeSync(tmpFile.fd, sa);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = tmpFile.name;

    firebase = admin.initializeApp({
      databaseURL: core.getInput("url"),
    });
  } catch (error) {
    core.setFailed(JSON.stringify(error));
    process.exit(core.ExitCode.Failure);
  }
};

const update = (path: string, field: string, value: any) => {
  firebase
    .firestore()
    .doc(path)
    .update({ [field]: value })
    .then(
      () => {
        process.exit(core.ExitCode.Success);
      },
      (reason) => {
        core.setFailed(JSON.stringify(reason));
        process.exit(core.ExitCode.Failure);
      }
    );
};

const processAction = () => {
  init();

  try {
    const path = core.getInput("path");
    const field = core.getInput("field");
    const value = core.getInput("value");

    update(path, field, value);
  } catch (error) {
    core.setFailed(JSON.stringify(error));
    process.exit(core.ExitCode.Failure);
  }
};

processAction();
