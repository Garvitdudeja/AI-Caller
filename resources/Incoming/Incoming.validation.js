import Joi from "joi";
import DataHelper from "../../helpers/v1/data.helpers.js";
const _DataHelper = new DataHelper();
import ResponseHelper from '../../helpers/v1/response.helpers.js';
const response = new ResponseHelper();
import IncomingResource from './Incoming.resources.js';
const _Incoming = new IncomingResource();
import MobileResource from '../Mobile/Mobile.resources.js';
const _Mobile = new MobileResource();

export default class IncomingValidation {

    async createOne(req, res, next) {
        console.log('IncomingValidation@createOne');
        // const schema = {
        //     'mobile_number': Joi.string().required(),
        //     'questions': Joi.array().optional(),
        //     'voice': Joi.string().optional(),
        //     "question_to_ask": Joi.array().optional(),
        // }

        // let errors = await _DataHelper.joiValidation(req.body, schema);
        // if (errors) {
        //     return response.badRequest("invalid request data", res, errors);
        // }
        // const mobile = await _mobile.findByMobileNumber(req.body.mobile_number);
        // if(mobile){
        //     return response.conflict("Mobile Number already exists", res, {});
        // }
        next();
    }

    async getConversationsByMobile(req, res, next) {
        console.log('IncomingValidation@getConversations');
        const {id} = req.params
        const mobile = await _Mobile.getOneById(req.params.id);
        if(!id || !mobile.user_id.equals(req.user._id)){
            return response.notFound("Mobile number not found", res, {});
        }
        next();
    }
    

};

