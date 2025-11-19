import { z } from 'zod'

export const ExerciseEventStatusSchema = z.object({
  analysisResults: z.array(
    z.object({
      measurementData: z.object({
        distance: z.object({
          unit: z.string(),
          value: z.number()
        })
      }),
      measurementIdentifier: z.string(),
      statusCode: z.number(),
      timestamp: z.string()
    })
  ),
  estimatedAnalysisCompletedAt: z.string().optional(),
  exerciseEventId: z.string(),
  exerciseId: z.string(),
  metaData: z.object({
    startFrame: z.number()
  }),
  score: z.number().optional(),
  status: z.enum(['new', 'scored', 'uploaded']),
  timestamp: z.string(),
  userHeight: z.number(),
  userId: z.string(),
  videoLink: z.string()
})
export type ExerciseEventStatusT = z.infer<typeof ExerciseEventStatusSchema>