import express from 'express';
import ResponseHelper from '../../helpers/v1/response.helpers.js';
import MobileValidation from './Mobile.validation.js';
import MobileController from './Mobile.controller.js';
import AuthorizationMiddleware from '../../middleware/v1/authorize.js';
const auth = new AuthorizationMiddleware();
const responseHelper = new ResponseHelper();
const validate = new MobileValidation();
const mobile = new MobileController();

const router = express.Router(); // Use Router() instead of express()

router.patch('/',[auth.auth],validate.updateOne,mobile.updateNumberInfo);
router.post('/',[auth.auth],validate.createOne,mobile.createOne);
router.get('/',[auth.auth],mobile.getAll);

export default router;
