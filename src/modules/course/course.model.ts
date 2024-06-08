import { Schema, model } from 'mongoose';
import { TCourse, TPreRequisiteCourses } from './course.interface';

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

const CourseSchema = new Schema<TCourse>({
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
});

export const Course = model<TCourse>('Course', CourseSchema);
