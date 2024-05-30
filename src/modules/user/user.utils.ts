// import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
// import { User } from './user.model';

// const findLastStudentId = async () => {
//   const lastStudent = await User.findOne(
//     {
//       role: 'student',
//     },
//     { id: 1, _id: 0 }
//   )
//     .sort({ createdAt: -1 })
//     .lean();

//   console.log(lastStudent);
//   return lastStudent ? lastStudent.id : undefined;
// };

// export const generateStudentId = async (payload: TAcademicSemester) => {
//   let currentId = (0).toString();

//   const lastStudentId = await findLastStudentId();
//   const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
//   const lastStudentYear = lastStudentId?.substring(0, 4);
//   const currentStudentSemesterCode = payload.code;
//   const currentStudentYear = payload.year;

//   if (
//     lastStudentId &&
//     lastStudentSemesterCode === currentStudentSemesterCode &&
//     lastStudentYear === currentStudentYear
//   ) {
//     currentId = lastStudentId.substring(6);
//   }

//   let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
//   incrementId = `${payload?.year}${payload?.code}${incrementId}`;

//   return incrementId;
// };

import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

// This function finds the last student ID for the given semester year and code
const findLastStudentId = async (year: string, code: string) => {
  const regex = new RegExp(`^${year}${code}`);
  const lastStudent = await User.find(
    {
      role: 'student',
      id: { $regex: regex },
    },
    { id: 1, _id: 0 }
  )
    .sort({ createdAt: -1 })
    .lean()
    .limit(1);

  return lastStudent.length > 0 ? lastStudent[0].id : undefined;
};

// This function generates a new student ID based on the given semester information
export const generateStudentId = async (payload: TAcademicSemester) => {
  const year = payload.year.toString().slice(0, 4);
  const code = payload.code;

  const lastStudentId = await findLastStudentId(year, code);
  let currentId = (0).toString();

  if (lastStudentId) {
    currentId = lastStudentId.substring(6);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `${year}${code}${incrementId}`;

  return incrementId;
};
