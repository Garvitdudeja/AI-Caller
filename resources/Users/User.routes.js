import express from 'express';
import ResponseHelper from '../../helpers/v1/response.helpers.js';
const responseHelper = new ResponseHelper();
import UserValidation from './User.validation.js';
const validate = new UserValidation();

const router = express.Router(); // Use Router() instead of express()

router.post('/sign-up', validate.signup,(req, res) => {
    return responseHelper.success("login successfully", res, {});
});

export default router;
