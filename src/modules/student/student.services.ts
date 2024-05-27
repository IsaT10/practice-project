import { Student } from './student.model';
import { TStudent } from './student.interface';

const createStudentIntoDB = async (student: TStudent) => {
  //  statics methods
  if (await Student.isUserExists(student.id)) {
    throw new Error('User already exists');
  }

  const result = Student.create(student);
  // ------------ instance methods
  // const studentInstance = new Student(student);
  // if (await studentInstance.isUserExists(student.id)) {
  //   throw new Error('User already exists');
  // }
  // const result = await studentInstance.save();

  return result;
};

const getAllStudentFromDB = async () => {
  const result = await Student.find();
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id });
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDelete: true });
  return result;
};

export {
  createStudentIntoDB,
  getAllStudentFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
};
