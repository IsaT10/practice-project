import { Types } from 'mongoose';
import { AcademicSemesterCodeNameMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  if (AcademicSemesterCodeNameMapper[payload.name] !== payload.code) {
    throw new Error('Invalid semester code !');
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

const getAllAcademicSemesterFromDB = async () => {
  const result = await AcademicSemester.find();
  return result;
};

const getSingleAcademicSemesterFromDB = async (id: string | Types.ObjectId) => {
  const result = await AcademicSemester.findById(id);
  return result;
};

const updateAcademicSemesterInDB = async (
  id: string,
  payload: Partial<TAcademicSemester>
) => {
  if (
    payload.name &&
    payload.code &&
    AcademicSemesterCodeNameMapper[payload.name] !== payload.code
  ) {
    throw new Error('Invalid semester ');
  }
  const result = await AcademicSemester.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

export {
  createAcademicSemesterIntoDB,
  getAllAcademicSemesterFromDB,
  getSingleAcademicSemesterFromDB,
  updateAcademicSemesterInDB,
};
