import { Schema, model } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import {
  Months,
  SemesterCode,
  SemesterName,
} from './academicSemester.constant';

const AcademicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      required: [true, 'Semester name is required'],
      enum: SemesterName,
    },
    year: {
      type: String,
      required: [true, 'Year is required'],
    },
    code: {
      type: String,
      required: [true, 'Semester code is required'],
      enum: SemesterCode,
    },
    startMonth: {
      type: String,
      required: [true, 'Start month is required'],
      enum: Months,
    },
    endMonth: {
      type: String,
      required: [true, 'End month is required'],
      enum: Months,
    },
  },
  {
    timestamps: true,
  }
);

AcademicSemesterSchema.pre('save', async function (next) {
  console.log(this);
  const isSemesterExists = await AcademicSemester.findOne({
    name: this.name,
    year: this.year,
  });

  if (isSemesterExists) {
    throw new Error('This semester is already exists');
  }

  next();
});

export const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  AcademicSemesterSchema
);
