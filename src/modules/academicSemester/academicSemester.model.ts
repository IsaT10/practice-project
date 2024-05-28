import { Schema, model } from 'mongoose';
import { TAcademicSemester, TMonth } from './academicSemester.interface';

const month: TMonth[] = [
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
];

const AcademicSemesterSchema = new Schema<TAcademicSemester>({
  name: {
    type: String,
    required: [true, 'Semester name is required'],
    enum: ['autumn', 'summer', 'fall'],
  },
  year: {
    type: Date,
    required: [true, 'Year is required'],
  },
  code: {
    type: String,
    required: [true, 'Semester code is required'],
    enum: ['01', '02', '03'],
  },
  startMonth: {
    type: String,
    required: [true, 'Start month is required'],
    enum: month,
  },
  endMonth: {
    type: String,
    required: [true, 'End month is required'],
    enum: month,
  },
});

export const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  AcademicSemesterSchema
);
