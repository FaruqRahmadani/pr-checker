import * as core from "@actions/core";
import * as github from "@actions/github";
const passOnOctokitError = process.env.INPUT_PASS_ON_OCTOKIT_ERROR === "true";
const { Octokit } = require("@octokit/action");

let octokit;

// most @actions toolkit packages have async methods
async function run() {
  checkPRTitle()
}

async function handleOctokitError(e) {
  core.info(`Octokit Error - ${e}`);
  if (passOnOctokitError) {
    core.info("Passing CI regardless");
  } else {
    core.setFailed("Failing CI test");
  }
}

try {
  octokit = new Octokit();
} catch (e) {
  handleOctokitError(e);
}

if (octokit) {
  run();
}
