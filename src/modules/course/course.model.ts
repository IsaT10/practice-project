import { Schema, model } from 'mongoose';
import {
  TCourse,
  TCourseFaculty,
  TPreRequisiteCourses,
} from './course.interface';

const PreRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    isDeleted: { type: Boolean, default: false },
  },
  { _id: false }
);

const CourseSchema = new Schema<TCourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    prefix: { type: String, required: true },
    code: { type: Number, required: true, trim: true },
    credits: {
      type: Number,
      required: true,
    },
    preRequisiteCourses: [PreRequisiteCoursesSchema],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Course = model<TCourse>('Course', CourseSchema);

const CourseFacultySchema = new Schema<TCourseFaculty>({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    unique: true,
  },
  faculties: [{ type: Schema.Types.ObjectId, ref: 'Faculty' }],
});

export const CourseFaculty = model<TCourseFaculty>(
  'CourseFaculty',
  CourseFacultySchema
);
