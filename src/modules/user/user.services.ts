import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';

const createStudentIntoDB = async (password: string, student: TStudent) => {
  const user: Partial<TUser> = {};

  user.password = password || (process.env.DEFAULT_PASSWORD as string);
  user.role = 'student';
  user.id = '202400001';

  const newUser = await User.create(user);

  if (Object.keys(newUser).length) {
    student.id = newUser.id;
    student.user = newUser._id;

    const newStudent = await Student.create(student);
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
