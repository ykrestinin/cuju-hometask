import { expect } from "@playwright/test";
import { test } from "../fixtures/test-data";
import { uploadFile } from "../helpers/upload";
import { logger } from "../helpers/logger";
import {
  createExerciseEvent,
  pollExerciseEventStatus,
  deleteExerciseEvent,
} from "../helpers/api";
import fs from "fs";

test.describe("Happy Path: Create, Upload, Poll Exercise Event", () => {
  test(
    "Verify Create, Upload, Poll Exercise Event",
    { tag: "@api" },
    async ({ request, testData }) => {
      const { userId, exerciseId, filePath } = testData;

      let createData: Awaited<ReturnType<typeof createExerciseEvent>>; // to hold created exercise event data
      await test.step("Create Exercise Event", async () => {
        createData = await createExerciseEvent(
          request,
          userId,
          exerciseId,
          fs.statSync(filePath).size
        );
        logger.info({ createData }, "Exercise event created");
        // Store exerciseEventId for cleanup
        testData.exerciseEventId = createData.exerciseEventId;
      });

      await test.step("Upload File to uploadUrl", async () => {
        logger.info("Uploading file to presigned URL");
        const uploadStatus = await uploadFile(
          request,
          createData.uploadUrl,
          filePath,
          "video/quicktime"
        );
        expect(uploadStatus).toBe(200);
        logger.info({ uploadStatus }, "File uploaded");
      });

      await test.step("Poll Exercise Event Status", async () => {
        const statusData = await pollExerciseEventStatus(
          request,
          createData.exerciseEventId
        );
        expect(statusData.status).toBe("scored");
        expect(statusData.score).toBeDefined();
        logger.info({ statusData }, "Polling done");
      });
    }
  );
});
