// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");
const util = require("util");
const rimraf = require("rimraf");
const { WebClient } = require("@slack/web-api");
const exec = util.promisify(require("child_process").exec);
const { SLACK_TOKEN, USER, TRAVIS_BUILD_WEB_URL, PULL_NUMBER } = process.env;

const web = new WebClient(SLACK_TOKEN);

async function slackReporter() {
  if (!process.env.SLACK_TOKEN) {
    return console.error(
      "Missing SLACK_TOKEN environment variable; skipping slack reporting..."
    );
  }
  const reportPath = path.join(
    __dirname,
    "..",
    "..",
    "test-output",
    "cypress",
    "json"
  );
  const reports = fs.readdirSync(reportPath);
  const slackData = await mapSlackUserByGitEmail();
  const prData = await getPullRequestData();

  const videoDir = await path.resolve(__dirname, "..", "videos");
  const videoDirFolders =
    fs
      .readdirSync(videoDir)
      .filter(item => fs.lstatSync(`${videoDir}/${item}`).isDirectory()) || [];
  videoDirFolders.forEach(folder =>
    moveVideos(`${videoDir}/${folder}`, videoDir)
  );

  const videos = fs
    .readdirSync(videoDir, { withFileTypes: true })
    .map(video => video.name);
  reports.forEach(report =>
    reportFailure(report, slackData, prData, videoDir, videos)
  );
}

async function reportFailure(report, slackData, prData, videoDir, videos) {
  try {
    const testReport = require(`../../test-output/cypress/json/${report}`);
    console.log(`test status: ${testReport.stats.failures}`);
    if (testReport.stats.failures > 0) {
      console.log("Test failures reported, attempting to send videos...");
      const testFailureData = getTestFailureData(testReport);
      testFailureData.forEach(testFailure => {
        const { suiteFile, failedTests } = testFailure;
        const matchedVideoFile = videos.find(video =>
          video.startsWith(path.parse(suiteFile).base)
        );
        console.log("Matched Video File", matchedVideoFile);
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
  return `:failed: *FAILED: ${title}*\n
${failedTests.map(test => `- ${test} \n`).join("")}\n
:travis-ci: <${TRAVIS_BUILD_WEB_URL ||
    "https://travis-ci.com/github/open-cluster-management/application-ui/pull_requests"}|View build> | :github: <${html_url ||
    "https://github.com/open-cluster-management/application-ui/pulls"}|View pull request> \n\n
${id ? `<@${id}>` : ""}`;
}

function moveVideos(path, videoDir) {
  console.log("moving video", path);
  fs
    .readdirSync(path, { withFileTypes: true })
    .forEach(file =>
      fs.copyFileSync(`${path}/${file.name}`, `${videoDir}/${file.name}`)
    );
  rimraf.sync(path);
}

async function mapSlackUserByGitEmail() {
  try {
    const { user: { id } } = await web.users.lookupByEmail({
      email: USER
    });
    return { id };
  } catch (e) {
    console.error("Failed to map user's git e-mail to Slack", e);
  }
}

async function postVideo(fileName, filePath, comment, userId) {
  try {
    console.log(`Sending video ${filePath} to ${userId}`);
    await web.files.upload({
      channels: userId,
      filename: fileName,
      file: fs.createReadStream(filePath),
      initial_comment: comment
    });
  } catch (e) {
    console.error("Slack Post Error", e);
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
    suite.suites[0].tests.forEach(test => {
      test.fail && failedTests.push(test.fullTitle);
    });
    return { suiteFile, failedTests };
  });
}

async function getPullRequestData() {
  const { TRAVIS_REPO_SLUG } = process.env;
  try {
    const { stdout } = await exec(
      `curl https://api.github.com/repos/${TRAVIS_REPO_SLUG}/pulls/${PULL_NUMBER}`
    );
    return JSON.parse(stdout);
  } catch (e) {
    console.error("Failed to fetch PR information:", e);
    return { title: "", html_url: "" };
  }
}

slackReporter();
