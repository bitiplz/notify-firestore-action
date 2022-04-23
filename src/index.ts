import * as core from "@actions/core";
import * as admin from "firebase-admin";

let firebase: admin.app.App;

const init = () => {
  try {
    const sa = core.getInput("sa");

    firebase = admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(sa)),
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
