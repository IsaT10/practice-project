import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import {
  deleteAdminFromDB,
  getAllAdminFromDB,
  getSingleAdminFromDB,
  updateAdminInDB,
} from './admin.services';

const getAdmins = catchAsync(async (req, res) => {
  const admins = await getAllAdminFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: admins,
    success: true,
    message: 'Admins are retrived successfully',
  });
});

const getSingleAdmin = catchAsync(async (req, res) => {
  const { adminId } = req.params;
  const admin = await getSingleAdminFromDB(adminId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: admin,
    success: true,
    message: 'Admin are retrived successfully',
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const { adminId } = req.params;

  const { admin } = req.body;
  const result = await updateAdminInDB(adminId, admin);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: result,
    success: true,
    message: 'Admin is updated successfully',
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { adminId } = req.params;
  const result = await deleteAdminFromDB(adminId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: result,
    success: true,
    message: 'Admin is deleted successfully',
  });
});

export { getAdmins, getSingleAdmin, updateAdmin, deleteAdmin };
