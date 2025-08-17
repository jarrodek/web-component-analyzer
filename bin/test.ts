/* eslint-disable no-undef */
import { configure, processCLIArgs, run } from "@japa/runner";
import { assert } from "@japa/assert";
import { snapshot } from "@japa/snapshot";
import * as reporters from '@japa/runner/reporters'

processCLIArgs(process.argv.splice(2));

const activated = ['spec']
if (process.env.GITHUB_ACTIONS === 'true') {
  activated.push('github')
}

configure({
	suites: [
    {
      name: 'unit',
      files: ["test/**/*-test.ts", "test/**/*.spec.ts"],
    },
  ],
  
  plugins: [
    assert(),
    snapshot({
      // snapshotDir: "test/snapshots/results",
    }),
  ],
	reporters: {
    activated,
    list: [reporters.spec(), reporters.ndjson(), reporters.dot(), reporters.github()],
  },
});

run();
