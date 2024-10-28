import express from 'express';
import ResponseHelper from '../../helpers/v1/response.helpers.js';
import MobileValidation from './Mobile.validation.js';
import MobileController from './Mobile.controller.js';
const responseHelper = new ResponseHelper();
const validate = new MobileValidation();
const mobile = new MobileController();

const router = express.Router(); // Use Router() instead of express()

router.patch('/',validate.updateOne,mobile.updateNumberInfo);
router.post('/',validate.createOne,mobile.updateNumberInfo);

export default router;
