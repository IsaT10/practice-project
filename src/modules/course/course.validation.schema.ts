import { z } from 'zod';

const PreRequisiteCoursesValidationSchema = z.object({
  course: z.string().optional(),
  isDeleted: z.boolean().optional(),
});

const CreateCoureValidaionSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    prefix: z.string({ required_error: 'Prefix is required' }),
    code: z.number({
      required_error: 'Code is required',
      invalid_type_error: 'Code must be a number',
    }),
    credits: z.number({ required_error: 'Credits is required' }),
    preRequisiteCourses: z
      .array(PreRequisiteCoursesValidationSchema)
      .optional(),

    isDeleted: z.boolean().optional(),
  }),
});

const UpdateCourseValidationSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }).optional(),
    prefix: z.string({ required_error: 'Prefix is required' }).optional(),
    code: z
      .number({
        required_error: 'Code is required',
        invalid_type_error: 'Code must be a number',
      })
      .optional(),
    credits: z.number({ required_error: 'Credits is required' }).optional(),
    preRequisiteCourses: z
      .array(PreRequisiteCoursesValidationSchema)
      .optional(),

    isDeleted: z.boolean().optional(),
  }),
});

export { CreateCoureValidaionSchema, UpdateCourseValidationSchema };
