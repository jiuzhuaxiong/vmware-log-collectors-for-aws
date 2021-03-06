/*
Copyright 2018 VMware, Inc.
SPDX-License-Identifier: MIT
*/

const { lintTestEnv, sendLogsAndVerify } = require('./lint_env');
const { createSample1 } = require('./cloudtrail_testdata');

const {
  CloudTrailHttpCollector,
  CloudTrailKafkaCollector,
} = require('./index');

describe('CloudTrailKafkaCollector', () => {
  const collector = new CloudTrailKafkaCollector(lintTestEnv);

  it('processLogsJson', () => {
    const logsJson = createSample1();
    collector.processLogsJson(logsJson);
    expect(logsJson.Records).toBe(undefined);
    expect(logsJson).toMatchSnapshot();
  });
});

describe('CloudTrailHttpCollector', () => {
  const collector = new CloudTrailHttpCollector(lintTestEnv);

  describe('processLogsJson', () => {
    it('should process logs JSON', () => {
      const logsJson = createSample1();
      collector.processLogsJson(logsJson);
      expect(logsJson).toMatchSnapshot();
    });
  });

  describe('sendLogs', () => {
    it('should send request to the HTTP stream', (done) => {
      const logsJson = {
        Records: [
          {
            id: 'id1',
            field1: 'value1',
          },
        ],
      };

      const expectedReqHeaders = {
        reqheaders: {
          authorization: 'Bearer mocktoken',
          structure: 'simple',
          'content-type': 'application/json',
        },
      };

      sendLogsAndVerify(done, collector, logsJson, logsJson.Records, expectedReqHeaders);
    }, 10000);
  });
});
