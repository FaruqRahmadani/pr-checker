const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
const issue_number = github.context.issue.number;

async function addLabel(name) {
  core.info(`Adding label (${name
  }) to PR...`);
  let addLabelResponse = await octokit.issues.addLabels({
    owner,
    repo,
    issue_number,
    labels: [name],
  });
  core.info(`Added label (${name
  }) to PR - ${addLabelResponse.status
  }`);
}

async function removeLabel(labels, name) {
  try {
    if (
      !labels
        .map((label) => label.name.toLowerCase())
        .includes(name.toLowerCase())
    ) {
      return;
    }

    core.info("No formatting necessary. Removing label...");
    let removeLabelResponse = await octokit.issues.removeLabel({
      owner,
      repo,
      issue_number,
      name: name,
    });
    core.info(`Removed label - ${removeLabelResponse.status
    }`);
  } catch (error) {
    core.info(`Failed to remove label (${name
    }) from PR: ${error
    }`);
  }
}