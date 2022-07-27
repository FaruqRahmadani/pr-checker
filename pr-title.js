async function checkPRTitle() {
  try {
    const title = github.context.payload.pull_request.title;
    const labels = github.context.payload.pull_request.labels;

    let config;
    try {
      config = await getJSON(configPath);
    } catch (e) {
      core.setFailed(`Couldn't retrieve the config file specified - ${e}`);
      return;
    }
    let { CHECKS, LABEL, MESSAGES } = JSON.parse(config);
    LABEL.name = LABEL.name || "title needs formatting";
    LABEL.color = LABEL.color || "eee";
    CHECKS.ignoreLabels = CHECKS.ignoreLabels || [];
    MESSAGES = MESSAGES || {};
    MESSAGES.success = MESSAGES.success || "All OK";
    MESSAGES.failure = MESSAGES.failure || "Failing CI test";
    MESSAGES.notice = MESSAGES.notice || "";

    for (let i = 0; i < labels.length; i++) {
      for (let j = 0; j < CHECKS.ignoreLabels.length; j++) {
        if (labels[i].name == CHECKS.ignoreLabels[j]) {
          core.info(`Ignoring Title Check for label - ${labels[i].name}`);
          removeLabel(labels, LABEL.name);
          return;
        }
      }
    }

    try {
      core.info(`Creating label (${LABEL.name})...`);
      let createResponse = await octokit.issues.createLabel({
        owner,
        repo,
        name: LABEL.name,
        color: LABEL.color,
      });
      core.info(`Created label (${LABEL.name}) - ${createResponse.status}`);
    } catch (error) {
      // Might not always be due to label's existence
      core.info(`Label (${LABEL.name}) already created.`);
    }
    if (CHECKS.prefixes && CHECKS.prefixes.length) {
      for (let i = 0; i < CHECKS.prefixes.length; i++) {
        if (title.startsWith(CHECKS.prefixes[i])) {
          removeLabel(labels, LABEL.name);
          core.info(MESSAGES.success);
          return;
        }
      }
    }

    if (CHECKS.regexp) {
      let re = new RegExp(CHECKS.regexp, CHECKS.regexpFlags || "");
      if (re.test(title)) {
        removeLabel(labels, LABEL.name);
        core.info(MESSAGES.success);
        return;
      }
    }

    await titleCheckFailed(CHECKS, LABEL, MESSAGES);
  } catch (error) {
    core.info(error);
  }
}

async function titleCheckFailed(CHECKS, LABEL, MESSAGES) {
  try {
    if (MESSAGES.notice.length) {
      core.notice(MESSAGES.notice);
    }

    await addLabel(LABEL.name);

    if (CHECKS.alwaysPassCI) {
      core.info(MESSAGES.failure);
    } else {
      core.setFailed(MESSAGES.failure);
    }
  } catch (error) {
    core.info(error);
    if (CHECKS.alwaysPassCI) {
      core.info(`Failed to add label (${LABEL.name}) to PR`);
    } else {
      core.setFailed(`Failed to add label (${LABEL.name}) to PR`);
    }
  }
}