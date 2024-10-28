import Joi from "joi";
import DataHelper from "../../helpers/v1/data.helpers.js";
const _DataHelper = new DataHelper();
import ResponseHelper from '../../helpers/v1/response.helpers.js';
const response = new ResponseHelper();
import MobileResource from './Mobile.resources.js';
const _mobile = new MobileResource();

export default class MobileValidation {

    async updateOne(req, res, next) {
        console.log('MobileValidation@updateOne');
        const schema = {
            'mobile_number': Joi.string().required(),
            'questions': Joi.array().optional(),
            'voice': Joi.string().optional()
        }

        let errors = await _DataHelper.joiValidation(req.body, schema);

        if (errors) {
            return response.badRequest("invalid request data", res, errors);
        }
        const mobileInfo = await _mobile.findByMobileNumber(req.body.mobile_number);
        if(!mobileInfo){
            return response.notFound("Mobile number not found", res, {});
        }
        console.log(req.user._id)
        next();
    }


    async createOne(req, res, next) {
        console.log('MobileValidation@createOne');
        const schema = {
            'mobile_number': Joi.string().required(),
            'questions': Joi.array().optional(),
            'voice': Joi.string().optional(),
            "question_to_ask": Joi.array().optional(),
        }

        let errors = await _DataHelper.joiValidation(req.body, schema);
        if (errors) {
            return response.badRequest("invalid request data", res, errors);
        }
        const mobile = await _mobile.findByMobileNumber(req.body.mobile_number);
        if(mobile){
            return response.conflict("Mobile Number already exists", res, {});
        }
        next();
    }

};

