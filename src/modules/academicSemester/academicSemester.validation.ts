import { optional, z } from 'zod';
import {
  Months,
  SemesterCode,
  SemesterName,
} from './academicSemester.constant';

const CreateAcademicSemesterSchemaValidation = z.object({
  body: z.object({
    name: z.enum([...SemesterName] as [string, ...string[]], {
      required_error: 'Semester name is required',
    }),
    year: z.string({
      required_error: 'Year is required',
    }),
    code: z.enum([...SemesterCode] as [string, ...string[]], {
      required_error: 'Semester code is required',
    }),
    startMonth: z.enum([...Months] as [string, ...string[]], {
      required_error: 'Start month is required',
    }),
    endMonth: z.enum([...Months] as [string, ...string[]], {
      required_error: 'End month is required',
    }),
  }),
});
const UpdateAcademicSemesterSchemaValidation = z.object({
  body: z.object({
    name: z.enum([...SemesterName] as [string, ...string[]]).optional(),
    year: z.string({}).optional(),
    code: z.enum([...SemesterCode] as [string, ...string[]]).optional(),
    startMonth: z.enum([...Months] as [string, ...string[]]).optional(),
    endMonth: z.enum([...Months] as [string, ...string[]]).optional(),
  }),
});

export {
  CreateAcademicSemesterSchemaValidation,
  UpdateAcademicSemesterSchemaValidation,
};
