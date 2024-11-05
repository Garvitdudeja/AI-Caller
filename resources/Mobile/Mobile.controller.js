import MobileResource from "./Mobile.resources.js"
import _ from 'lodash'
const _Mobile = new MobileResource()
import ResponseHelper from "../../helpers/v1/response.helpers.js";
const response = new ResponseHelper();

export default class MobileController {
    
    async updateNumberInfo(req,res){
        console.log("MobileController@updateNumberInfo")
        let userData = _.pick(req.body,['questions','voice','mobile_number','question_to_ask']);
        console.log(userData)
        let data = await _Mobile.updateOne(userData.mobile_number, userData);
        return response.success('successfully Upadted Number Info', res, data);
    }

    async createOne(req,res){
        console.log("MobileController@createOne")
        let userData = _.pick(req.body,['questions','voice','mobile_number','question_to_ask']);
        userData.user_id = req.user._id;
        let data = await _Mobile.createOne(userData);
        return response.success('Number Addded Successfully', res, data);
    }

    async getAll(req,res){
        console.log("MobileController@getAll")
        let data = await _Mobile.getAll(req.query);
        return response.success('Data Found Sucess', res, data);
    }

}