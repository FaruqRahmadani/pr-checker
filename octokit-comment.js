async function addComment(comment) {
  core.info(`Adding comment to PR...`);
  let addCommentResponse = await octokit.issues.createComment({
    owner,
    repo,
    issue_number,
    comment,
  });
  core.info(`Added Comment to PR - ${addCommentResponse.status}`);
}