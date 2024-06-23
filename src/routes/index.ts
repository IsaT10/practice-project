import { Router } from 'express';
import SutdentRouter from '../modules/student/student.route';
import UserRouter from '../modules/user/user.route';
import AcademicSemesterRouter from '../modules/academicSemester/academicSemester.route';
import AcademicFacultyRouter from '../modules/academicFaculty/academicFaculty.route';
import AcademicDepartmentRouter from '../modules/academicDepartment/academicDepartment.route';
import FacultyRouter from '../modules/faculty/faculty.route';
import AdminRouter from '../modules/admin/admin.route';
import CourseRouter from '../modules/course/course.route';
import SemesterRegistration from '../modules/semesterRegistration/semesterRegistration.route';
import OfferedCourses from '../modules/offeredCourse/offeredCourse.route';
import AuthRoues from '../modules/auth/auth.route';
import EnrolledCourseRoute from '../modules/enrolledCourse/enrolledCourse.route';

const router = Router();

const moduleRoutes = [
  { path: '/students', route: SutdentRouter },
  { path: '/users', route: UserRouter },
  { path: '/academic-semesters', route: AcademicSemesterRouter },
  { path: '/academic-faculties', route: AcademicFacultyRouter },
  { path: '/academic-departments', route: AcademicDepartmentRouter },
  { path: '/faculties', route: FacultyRouter },
  { path: '/admins', route: AdminRouter },
  { path: '/courses', route: CourseRouter },
  { path: '/semester-registrations', route: SemesterRegistration },
  { path: '/offered-courses', route: OfferedCourses },
  { path: '/auth', route: AuthRoues },
  { path: '/enrolled-courses', route: EnrolledCourseRoute },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
