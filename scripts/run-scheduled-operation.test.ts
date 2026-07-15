import { spawnSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

const script = path.join(process.cwd(), "scripts", "run-scheduled-operation.sh");

describe("retired scheduled local AI operations", () => {
  for (const operation of ["generate-daily-prompt", "collect-ai-news"]) {
    it(`rejects ${operation}`, () => {
      const result = spawnSync("bash", [script, operation, "--dry-run"], {
        encoding: "utf8",
      });

      expect(result.status).toBe(78);
      expect(result.stdout).toBe("");
      expect(result.stderr).toContain(
        "AIHaru daily prompt and AI news automation has been retired",
      );
    });
  }
});
