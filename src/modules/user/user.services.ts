import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { getSingleAcademicSemesterFromDB } from '../academicSemester/academicSemester.services';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  const user: Partial<TUser> = {};

  user.password = password || (process.env.DEFAULT_PASSWORD as string);
  user.role = 'student';

  // find academic semester info
  const admissionSemester = await getSingleAcademicSemesterFromDB(
    payload.admissionSemester
  );

  if (!admissionSemester) {
    throw new Error('Academic Semester not found');
  }

  //set  generated id
  user.id = await generateStudentId(admissionSemester);

  const newUser = await User.create(user);

  if (Object.keys(newUser).length) {
    payload.id = newUser.id;
    payload.user = newUser._id;

    const newStudent = await Student.create(payload);
    return newStudent;
  }

  //  statics methods
  //   if (await Student.isUserExists(student.id)) {
  //     throw new Error('User already exists');
  //   }
  // ------------ instance methods
  // const studentInstance = new Student(student);
  // if (await studentInstance.isUserExists(student.id)) {
  //   throw new Error('User already exists');
  // }
  // const result = await studentInstance.save();
};

export { createStudentIntoDB };
