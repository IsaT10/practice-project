import { z } from 'zod';

const AcademicFacultySchemaValidation = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Academic faculty name is required',
      invalid_type_error: 'Academic faculty  must be string',
    }),
  }),
});

export { AcademicFacultySchemaValidation };
