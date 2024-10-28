import express from 'express';
import ResponseHelper from '../../helpers/v1/response.helpers.js';
const responseHelper = new ResponseHelper();
import UserValidation from './User.validation.js';
const validate = new UserValidation();
import UserController from './User.controller.js';
const user = new UserController(); 
const router = express.Router(); // Use Router() instead of express()

router.post('/sign-up', validate.signup,user.createOne);
router.post('/login', validate.login,user.login);

export default router;
