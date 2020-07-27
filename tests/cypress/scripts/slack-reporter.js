/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */

const fs = require("fs");
const path = require("path");
const util = require("util");
const { WebClient } = require("@slack/web-api");
const exec = util.promisify(require("child_process").exec);
const { SLACK_TOKEN, USER, TRAVIS_BUILD_WEB_URL } = process.env;

const web = new WebClient(SLACK_TOKEN);

async function slackReporter() {
  if (!process.env.SLACK_TOKEN) {
    return console.error(
      "Missing SLACK_TOKEN environment variable; skipping slack reporting..."
    );
  }
  const reportPath = path.join(__dirname, "..", "test-output", "cypress");
  const reports = fs.readdirSync(reportPath);
  const slackData = await mapSlackUserByGitEmail();
  const prData = await getPullRequestData();
  reports.forEach(report => reportFailure(report, slackData, prData));
}

async function reportFailure(report, slackData, prData) {
  try {
    const testReport = require(`../test-output/cypress/${report}`);
    if (testReport.stats.failures > 0) {
      const testFailureData = getTestFailureData(testReport);
      const videoDir = path.join(__dirname, "..", "videos");
      const videos = fs
        .readdirSync(videoDir, { withFileTypes: true })
        .map(video => video.name);

      testFailureData.forEach(testFailure => {
        const { suiteFile, failedTests } = testFailure;
        const matchedVideoFile = videos.find(video =>
          video.includes(suiteFile)
        );
        const videoFilePath = path.join(videoDir, matchedVideoFile);
        const comment = buildComment(failedTests, prData, slackData);
        postVideo(matchedVideoFile, videoFilePath, comment, slackData.id);
      });
    }
  } catch (e) {
    console.error(e);
  }
}

function buildComment(failedTests, prData, slackData) {
  const { title, html_url } = prData;
  const { id } = slackData;
  console.log(failedTests);
  return `:failed: *FAILED: ${title}*\n
${failedTests.map(test => `- ${test} \n`).join("")}\n
:travis-ci: <${TRAVIS_BUILD_WEB_URL ||
    "https://travis-ci.com/github/open-cluster-management/application-ui/pull_requests"}|View build> | :github: <${html_url ||
    "https://github.com/open-cluster-management/application-ui/pulls"}|View pull request> \n\n
${id ? `<@${id}>` : ""}`;
}

async function mapSlackUserByGitEmail() {
  try {
    const { user: { id } } = await web.users.lookupByEmail({ email: USER });
    return { id };
  } catch (e) {
    console.error("Failed to map user's git e-mail to Slack", e);
  }
}

async function postVideo(fileName, filePath, comment, userId) {
  try {
    await web.files.upload({
      channels: userId,
      filename: fileName,
      file: fs.createReadStream(filePath),
      initial_comment: comment
    });
  } catch (e) {
    console.error("Slack Post Video Response", response);
  }
}

function getTestFailureData(report) {
  const { results } = report;
  const withTestFailures = [];
  results.forEach(suite => {
    const hasFailure = suite.suites[0].tests.some(test => test.fail === true);
    hasFailure && withTestFailures.push(suite);
  });

  return withTestFailures.map(suite => {
    const searchIndex = suite.file.lastIndexOf("/") + 1;
    const suiteFile = suite.file.substring(searchIndex);
    const failedTests = [];
    suite.suites[0].tests.forEach((test, i) => {
      test.fail && failedTests.push(test.fullTitle);
    });
    return { suiteFile, failedTests };
  });
}

async function getPullRequestData() {
  const { GITHUB_TOKEN, TRAVIS_REPO_SLUG, TRAVIS_PULL_REQUEST } = process.env;
  try {
    const { stdout } = await exec(
      `curl -H "Authorization: token ${GITHUB_TOKEN}" https://api.github.com/repos/${TRAVIS_REPO_SLUG}/pulls/${TRAVIS_PULL_REQUEST}`
    );
    return JSON.parse(stdout);
  } catch (e) {
    console.error("Failed to fetch PR information:", e);
    return { title: "", html_url: "" };
  }
}

slackReporter();
