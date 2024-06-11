import { z } from 'zod';
import { Days } from './offeredCourse.constant';

const timeStringSchema = z.string().refine(
  (time) => {
    const regex = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
    return regex.test(time);
  },
  {
    message: 'Invalid time format , expected "HH:MM AM|PM" in 24 hours format',
  }
);

const parseTime = (time: string) => {
  const [timePart, period] = time.split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;

  if (period === 'AM' && hours === 12) hours = 0;
  return { hours, minutes };
};

const CreateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      section: z.number(),
      maxCapacity: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: timeStringSchema, // HH: MM   00-23: 00-59
      endTime: timeStringSchema,
    })
    .refine(
      ({ startTime, endTime }) => {
        if (startTime && endTime) {
          const start = parseTime(startTime);
          const end = parseTime(endTime);
          return (
            start.hours < end.hours ||
            (start.hours === end.hours && start.minutes < end.minutes)
          );
        }
      },
      {
        message: 'Start time must be less than end time',
      }
    ),
});

const UpdateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: z.string(),
      maxCapacity: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: timeStringSchema, // HH: MM   00-23: 00-59
      endTime: timeStringSchema,
    })
    .refine(
      ({ startTime, endTime }) => {
        if (startTime && endTime) {
          const start = parseTime(startTime);
          const end = parseTime(endTime);
          return (
            start.hours < end.hours ||
            (start.hours === end.hours && start.minutes < end.minutes)
          );
        }
      },
      {
        message: 'Start time must be less than end time',
      }
    ),
});

export {
  CreateOfferedCourseValidationSchema,
  UpdateOfferedCourseValidationSchema,
};
