import { z } from 'zod';

const CreateEnrolledCourseValidationSchema = z.object({
  body: z.object({
    offeredCourse: z.string(),
  }),
});

export { CreateEnrolledCourseValidationSchema };
