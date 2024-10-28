import MobileResource from "./Mobile.resources.js"
import _ from 'lodash'
const _Mobile = new MobileResource()

export default class MobileController {
    
    async updateNumberInfo(req,res){
        console.log("MobileController@updateNumberInfo")
        let userData = _.pick(req.body,['questions','voice','mobile_number']);
        console.log(userData)
        let data = await _Mobile.updateOne(userData.mobile_number, userData);
        return response.success('successfully Upadted Number Info', res, data);
    }

    async createOne(req,res){
        console.log("MobileController@createOne")
        let userData = _.pick(req.body,['questions','voice','mobile_number']);
        console.log(userData)
        let data = await _Mobile.createOne(userData.mobile_number, userData);
        return response.success('successfully Upadted Number Info', res, data);
    }

}