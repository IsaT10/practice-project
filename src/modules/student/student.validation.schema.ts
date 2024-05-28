import { z } from 'zod';

const UserNameValidationSchema = z.object({
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
});

const GuardianValidationSchema = z.object({
  fatherName: z.string().min(1, "Father's name is required."),
  fatherOccupation: z.string().min(1, "Father's occupation is required."),
  fatherContactNo: z.string().min(1, "Father's contact number is required."),
  motherName: z.string().min(1, "Mother's name is required."),
  motherOccupation: z.string().min(1, "Mother's occupation is required."),
  motherContactNo: z.string().min(1, "Mother's contact number is required."),
});

const LocalGuardianValidationSchema = z.object({
  name: z.string().min(1, "Local guardian's name is required."),
  occupation: z.string().min(1, "Local guardian's occupation is required."),
  contactNo: z.string().min(1, "Local guardian's contact number is required."),
  address: z.string().min(1, "Local guardian's address is required."),
});

const CreateStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().min(8, 'Password can not be less than 8 character'),
    student: z.object({
      name: UserNameValidationSchema,
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
      guardian: GuardianValidationSchema,
      localGuardian: LocalGuardianValidationSchema,
      profileImg: z.string().optional(),
    }),
  }),
});

export { CreateStudentValidationSchema };
