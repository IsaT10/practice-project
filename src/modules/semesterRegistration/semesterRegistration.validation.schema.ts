import { z } from 'zod';
import { semesterRegistrationStatus } from './semesterRegistration.constant';

const CreateSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string(),
    status: z.enum([...(semesterRegistrationStatus as [string, ...string[]])]),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    minCredits: z.number(),
    maxCredits: z.number(),
  }),
});

const UpddateSemesterRegistrationValidationSchema = z
  .object({
    body: z.object({
      academicSemester: z.string().optional(),
      status: z
        .enum([...(semesterRegistrationStatus as [string, ...string[]])])
        .optional(),
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
      minCredits: z.number().optional(),
      maxCredits: z.number().optional(),
    }),
  })
  .strict();

export {
  CreateSemesterRegistrationValidationSchema,
  UpddateSemesterRegistrationValidationSchema,
};
