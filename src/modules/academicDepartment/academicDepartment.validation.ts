import { z } from 'zod';

const CreateAcademicDepartmentSchemaValidation = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Academic Department name is required',
      invalid_type_error: 'Academic Department  must be string',
    }),

    academicFaculty: z.string({
      required_error: 'Academic Faculty is required',
      invalid_type_error: 'Academic Faculty must be string',
    }),
  }),
});

const UpdateAcademicDepartmentSchemaValidation = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Academic Department name is required',
        invalid_type_error: 'Academic Department  must be string',
      })
      .optional(),

    academicFaculty: z
      .string({
        required_error: 'Academic Faculty is required',
        invalid_type_error: 'Academic Faculty must be string',
      })
      .optional(),
  }),
});

export {
  CreateAcademicDepartmentSchemaValidation,
  UpdateAcademicDepartmentSchemaValidation,
};
