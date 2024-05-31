import { Router } from 'express';
import SutdentRouter from '../modules/student/student.route';
import UserRouter from '../modules/user/user.route';
import AcademicSemesterRouter from '../modules/academicSemester/academicSemester.route';
import AcademicFacultyRouter from '../modules/academicFaculty/academicFaculty.route';

const router = Router();

const moduleRoutes = [
  { path: '/students', route: SutdentRouter },
  { path: '/users', route: UserRouter },
  { path: '/academic-semesters', route: AcademicSemesterRouter },
  { path: '/academic-faculties', route: AcademicFacultyRouter },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
