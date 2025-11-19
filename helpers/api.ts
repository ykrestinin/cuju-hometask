import type { APIRequestContext } from "@playwright/test";
import fs from "fs";
import path from "path";
import { z } from "zod";
import {
  CreateExerciseEventRequest,
  CreateExerciseEventResponseT,
} from "../schemas/CreateExerciseEventSchema";
import {
  ExerciseEventStatusSchema,
  ExerciseEventStatusT,
} from "../schemas/ExerciseEventStatusSchema";
import { logger } from "./logger";

const API_BASE_URL = process.env.API_BASE_URL;

//common API helper
export async function api<T>(
  request: APIRequestContext,
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  body?: object
): Promise<{ status: number; data: T }> {
  const fullUrl = `${API_BASE_URL}${url}`;
  const response = await request.fetch(fullUrl, {
    method,
    data: body,
    headers: { "Content-Type": "application/json" },
  });

  const status = response.status();
  const json = await response.json().catch(() => null);

  return { status, data: json as T };
}


// API-specific helpers
export async function createExerciseEvent(
  request: APIRequestContext,
  userId: string,
  exerciseId: string,
  fileSize: number
): Promise<CreateExerciseEventResponseT> {
  const body = { exerciseId, fileExtension: "mov", fileSize };
  CreateExerciseEventRequest.parse(body);

  const { status, data } = await api<CreateExerciseEventResponseT>(
    request,
    "POST",
    `/exercise/v1/user/${userId}/exercise-event`,
    body
  );

  if (status !== 201)
    throw new Error(`Failed to create exercise event, status: ${status}`);
  return data;
}

export async function pollExerciseEventStatus(
  request: APIRequestContext,
  exerciseEventId: string,
  maxRetries = 15,
  intervalMs = 2000
): Promise<ExerciseEventStatusT> {
  let attempt = 0;
  let statusData: ExerciseEventStatusT | null = null;

  while (attempt < maxRetries) {
    const { status, data } = await api<ExerciseEventStatusT>(
      request,
      "GET",
      `/exercise/v1/exercise-event/${exerciseEventId}`
    );

    if (status !== 200)
      throw new Error(
        `Failed to fetch exercise event status, status: ${status}`
      );

    statusData = ExerciseEventStatusSchema.parse(data);
    logger.info(
      { attempt: attempt + 1, status: statusData.status },
      "Polling Exercise Event"
    );

    if (statusData.status === "scored") break;

    attempt++;
    await new Promise((res) => setTimeout(res, intervalMs));
  }

  if (!statusData || statusData.status !== "scored") {
    throw new Error(
      'Exercise event did not reach "scored" status within retries'
    );
  }

  return statusData;
}
export async function deleteExerciseEvent(
  request: APIRequestContext,
  exerciseEventId: string
): Promise<void> {
  const { status } = await api(
    request,
    "DELETE",
    `/exercise/v1/exercise-event/${exerciseEventId}`
  );
  if (![200, 204].includes(status))
    throw new Error(`Failed to delete exercise event, status: ${status}`);
}
