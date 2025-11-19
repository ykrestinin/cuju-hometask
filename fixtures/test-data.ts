import fs from "fs";
import { test as base } from "@playwright/test";
import { v4 as uuidv4 } from "uuid";
import { deleteExerciseEvent } from "../helpers/api";
import type { APIRequestContext } from "@playwright/test";
import { logger } from "../helpers/logger";
// Test data fixture, including setup and teardown
type TestData = {
  userId: string;
  exerciseId: string;
  filePath: string;
  exerciseEventId?: string;
  request?: APIRequestContext;
};

export const test = base.extend<{ testData: TestData }>({
  testData: async ({ request }, use) => {
    const uniqueId = uuidv4();
    const tempFilePath = `./test-data/upload/tmp-${uniqueId}.mov`;

    fs.writeFileSync(tempFilePath, Buffer.from("test content"));

    const data: TestData = {
      userId: `user-${uniqueId}`,
      exerciseId: `${Math.floor(Math.random() * 50) + 1}`,
      filePath: tempFilePath,
      request,
    };

    await use(data);

    // Teardown: test file removal
    fs.unlinkSync(tempFilePath);

    // Teardown: Exercise Event removal
    if (data.exerciseEventId && data.request) {
      try {
        await deleteExerciseEvent(data.request, data.exerciseEventId);
        logger.info(`Exercise Event ${data.exerciseEventId} deleted`);
      } catch (err) {
        console.warn(
          `Failed to delete Exercise Event ${data.exerciseEventId}:`,
          err
        );
      }
    }
  },
});
