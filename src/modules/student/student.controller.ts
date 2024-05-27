import { Request, Response } from 'express';
import {
  createStudentIntoDB,
  deleteStudentFromDB,
  getAllStudentFromDB,
  getSingleStudentFromDB,
} from './student.services';
import StudentValidationSchema from './student.validation.schema';

const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await getAllStudentFromDB();

    res.status(200).json({
      success: true,
      result: students.length,
      message: 'Students are retrived successfully',
      data: students,
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
};

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const student = await getSingleStudentFromDB(studentId);

    res.status(200).json({
      success: true,
      message: 'Student is retrived successfully',
      data: student,
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
};

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;

    const zodParseData = StudentValidationSchema.parse(studentData);

    const newStudent = await createStudentIntoDB(zodParseData);

    res.status(200).json({
      success: true,
      message: 'Student is created successfully',
      data: newStudent,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await deleteStudentFromDB(studentId);

    res.status(200).json({
      success: true,
      message: 'Student is deleted successfully',
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err,
    });
  }
};

export { createStudent, getStudents, getSingleStudent, deleteStudent };
