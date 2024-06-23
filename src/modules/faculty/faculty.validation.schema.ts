import { z } from 'zod';

const UserNameValidationSchema = z.object(
  {
    firstName: z
      .string()
      .trim()
      .min(1, { message: 'First name is required.' })
      .regex(
        /^[A-Z][a-z]*$/,
        'First name must start with a capital letter followed by lowercase letters.'
      ),
    middleName: z.string().trim().optional(),
    lastName: z.string().trim().min(1, 'Last name is required.'),
  },
  { required_error: 'Name is required' }
);

const UpdateUserNameValidationSchema = z.object(
  {
    firstName: z
      .string()
      .trim()
      .min(1, { message: 'First name is required.' })
      .regex(
        /^[A-Z][a-z]*$/,
        'First name must start with a capital letter followed by lowercase letters.'
      )
      .optional(),
    middleName: z.string().trim().optional(),
    lastName: z.string().trim().min(1, 'Last name is required.').optional(),
  },
  { required_error: 'Name is required' }
);

const CreateFacultyValidationSchema = z.object({
  body: z.object({
    password: z.string().min(8, 'Password can not be less than 8 character'),
    faculty: z.object({
      name: UserNameValidationSchema,
      designation: z.string(),
      gender: z.enum(['male', 'female', 'other'], {
        errorMap: () => ({
          message:
            "The gender field can only be one of the following: 'male', 'female', or 'other'.",
        }),
      }),
      dateOfBirth: z.string().optional(),
      email: z.string().email('Provide a valid email.'),
      contactNo: z.string({ message: '' }),
      emergencyContactNo: z
        .string()
        .min(1, 'Emergency contact number is required.'),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
        errorMap: () => ({
          message:
            "The blood group can only be one of the following: 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', or 'O-'.",
        }),
      }),
      presentAddress: z.string().min(1, 'Present address is required.'),
      permanentAddress: z.string().min(1, 'Permanent address is required.'),
    }),
  }),
});

const UpdateFacultyValidationSchema = z.object({
  body: z.object({
    faculty: z.object({
      name: UpdateUserNameValidationSchema.optional(),
      gender: z
        .enum(['male', 'female', 'other'], {
          errorMap: () => ({
            message:
              "The gender field can only be one of the following: 'male', 'female', or 'other'.",
          }),
        })
        .optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email('Provide a valid email.').optional(),
      contactNo: z.string({ message: '' }).optional(),
      emergencyContactNo: z
        .string()
        .min(1, 'Emergency contact number is required.')
        .optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
          errorMap: () => ({
            message:
              "The blood group can only be one of the following: 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', or 'O-'.",
          }),
        })
        .optional(),
      presentAddress: z
        .string()
        .min(1, 'Present address is required.')
        .optional(),
      permanentAddress: z
        .string()
        .min(1, 'Permanent address is required.')
        .optional(),
    }),
  }),
});

export { CreateFacultyValidationSchema, UpdateFacultyValidationSchema };
