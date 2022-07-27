## Usage

Create a config file `.github/pr-title-checker-config.json` like this one below:

```json
{
  "LABEL": {
    "name": "title needs formatting",
    "color": "EEEEEE"
  },
  "CHECKS": {
    "prefixes": ["fix: ", "feat: "],
    "regexp": "docs\\(v[0-9]\\): ",
    "regexpFlags": "i",
    "ignoreLabels" : ["dont-check-PRs-with-this-label", "meta"]
  },
  "MESSAGES": {
    "success": "All OK",
    "failure": "Failing CI test",
    "notice": ""
  }
}
```

## Create Workflow

Create a workflow (eg: `.github/workflows/pr-title-checker.yml` see [Creating a Workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file)) to utilize the pr-title-checker action with content:

```yaml
name: "PR Title Checker"
on:
  pull_request_target:
    types:
      - opened
      - edited
      - synchronize
      - labeled
      - unlabeled

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: thehanimo/pr-title-checker@v1.3.4
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          pass_on_octokit_error: false
          configuration_path: ".github/pr-title-checker-config.json"
```