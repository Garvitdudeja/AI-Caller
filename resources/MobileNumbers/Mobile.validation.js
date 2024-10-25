import Joi from "joi";
import DataHelper from "../../helpers/v1/data.helpers.js";
const _DataHelper = new DataHelper();
import ResponseHelper from '../../helpers/v1/response.helpers.js';
const response = new ResponseHelper();

export default class MobileValidation {

    async updateOne(req,res,next){
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
        next();
    }

};

