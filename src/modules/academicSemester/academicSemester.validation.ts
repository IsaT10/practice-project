import { z } from 'zod';
import { TMonth } from './academicSemester.interface';

const months: TMonth[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

const CreateAcademicSemesterSchemaValidation = z.object({
  body: z.object({
    name: z.enum(['autumn', 'summer', 'fall'], {
      required_error: 'Semester name is required',
    }),
    year: z.date({
      required_error: 'Year is required',
    }),
    code: z.enum(['01', '02', '03'], {
      required_error: 'Semester code is required',
    }),
    startMonth: z.enum([...months] as [string, ...string[]], {
      required_error: 'Start month is required',
    }),
    endMonth: z.enum([...months] as [string, ...string[]], {
      required_error: 'End month is required',
    }),
  }),
});

export { CreateAcademicSemesterSchemaValidation };
