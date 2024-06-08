import { Types } from 'mongoose';

export type TPreRequisiteCourses = {
  course: Types.ObjectId;
  isDeleted?: boolean;
};

export type TCourse = {
  title: string;
  code: number;
  prefix: string;
  credits: number;
  preRequisiteCourses: TPreRequisiteCourses[];
  isDeleted?: boolean;
};
