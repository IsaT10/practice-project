import { Schema, model, Query } from 'mongoose';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { semesterRegistrationStatus } from './semesterRegistration.constant';
import path from 'path';

const SemesterRegistrationSchema = new Schema<TSemesterRegistration>(
  {
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: semesterRegistrationStatus,
      default: 'UPCOMING',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    maxCredits: {
      type: Number,
      required: true,
    },
    minCredits: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

SemesterRegistrationSchema.pre<Query<any, any>>(/^find/, function (next) {
  this.populate({ path: 'academicSemester', select: '-__v' });

  next();
});

export const SemesterRegistration = model<TSemesterRegistration>(
  'SemesterRegistration',
  SemesterRegistrationSchema
);
