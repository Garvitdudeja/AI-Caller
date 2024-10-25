import UserResources from "./User.resources.js"
const _user = new UserResources();
import ResponseHelper from "../../helpers/v1/response.helpers.js";
const response = new ResponseHelper();
import _ from "lodash";
export default class UserController {
    
    
    async createOne(req,res){
        const data = _.pick(req.body,['email','first_name','password'])
        console.log(data,"dataaaaaaaaaaa")
        const user = await _user.createOne(data);
        return response.success("User created successfully", res, user)
    }
}