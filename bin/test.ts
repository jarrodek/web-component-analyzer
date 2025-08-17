import { configure, processCLIArgs, run } from "@japa/runner";
import { assert } from "@japa/assert";
import { snapshot } from "@japa/snapshot";
import path from "path";

processCLIArgs(process.argv.splice(2));

configure({
  files: ["test/**/*-test.ts", "test/**/*.spec.ts"],
  plugins: [
    assert(),
    snapshot({
      snapshotDir: "test/snapshots/results",
    }),
  ],
});

run();
