/*
Copyright 2018 VMware, Inc.
SPDX-License-Identifier: MIT
*/

const nock = require('nock');
const { gzipLogs } = require('./lint');
const { LIntHttpEnv } = require('./lint');
const { sendLogs } = require('./index');

const lintTestEnv = new LIntHttpEnv(
  'Bearer mocktoken',
  'https://data.mock.symphony.com/le-mans/v1/streams/ingestion-pipeline-stream',
);

const sendLogsAndVerify = (done, collector, logsJson, expectedReqBody, expectedReqHeaders) => {
  nock('https://data.mock.symphony.com', expectedReqHeaders)
    .post(
      '/le-mans/v1/streams/ingestion-pipeline-stream',
      JSON.stringify(logsJson.Records),
    )
    .reply(200);

  gzipLogs(logsJson)
    .then(zippedData => sendLogs(zippedData, collector))
    .then(() => done())
    .catch(error => done.fail(error));
};

module.exports = {
  lintTestEnv,
  sendLogsAndVerify,
};
