import { z } from 'zod'


// Request Body for Create Exercise Event
export const CreateExerciseEventRequest = z.object({
  exerciseId: z.string().nonempty(),
  fileExtension: z.string().nonempty(), 
  fileSize: z.number().int().positive()  
})

export type CreateExerciseEventRequestT = z.infer<typeof CreateExerciseEventRequest>


// Response Body for Create Exercise Event
export const CreateExerciseEventResponse = z.object({
  exerciseEventId: z.string().uuid(),
  uploadUrl: z.string() 
})

export type CreateExerciseEventResponseT = z.infer<typeof CreateExerciseEventResponse>