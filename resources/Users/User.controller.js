import UserResources from "./User.resources.js"
const _user = new UserResources();
import ResponseHelper from "../../helpers/v1/response.helpers.js";
const response = new ResponseHelper();
import DataHelper from "../../helpers/v1/data.helpers.js";
const _DataHelper = new DataHelper();
import _ from "lodash";
export default class UserController {
    
    
    async createOne(req,res){
        console.log('UserController@createOne')
        const data = _.pick(req.body,['email','first_name','password'])
        data.password = await _DataHelper.hashPassword(data.password)
        const user = await _user.createOne(data);
        return response.success("User created successfully", res, user)
    }


    async login(req,res){
        console.log('UserController@login')
        const data = _.pick(req.body,['email','password'])
        if(await _DataHelper.validatePassword(data.password,"wqejowqekpoqw")){

        }
        return response.success("User created successfully", res, {})
    }

}