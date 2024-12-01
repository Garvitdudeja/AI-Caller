import express from 'express';
import ResponseHelper from '../../helpers/v1/response.helpers.js';
const responseHelper = new ResponseHelper();
import UserValidation from './User.validation.js';
const validate = new UserValidation();
import UserController from './User.controller.js';
const user = new UserController(); 
const router = express.Router(); // Use Router() instead of express()
import AuthorizationMiddleware from '../../middleware/v1/authorize.js';
const auth = new AuthorizationMiddleware();

router.post('/sign-up', validate.signup,user.createOne);
router.post('/log-in', validate.login,user.login);
router.patch('/update',[auth.auth],validate.updateUser,user.updateUser);

export default router;
