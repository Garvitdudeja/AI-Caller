import UserResources from "./User.resources.js"
const _user = new UserResources();
import ResponseHelper from "../../helpers/v1/response.helpers.js";
const response = new ResponseHelper();
import DataHelper from "../../helpers/v1/data.helpers.js";
const _DataHelper = new DataHelper();
import _ from "lodash";
export default class UserController {


    async createOne(req, res) {
        console.log('UserController@createOne')
        const data = _.pick(req.body, ['email', 'first_name', 'password'])
        data.password = await _DataHelper.hashPassword(data.password)
        const user = await _user.createOne(data);
        return response.success("User created successfully", res, user)
    }


    async login(req, res) {
        console.log('UserController@login')
        const data = _.pick(req.body, ['email', 'password'])
        console.log(req.user, "user");
        if (await _DataHelper.validatePassword(data.password, req.user.password)) {
            const token  = await _DataHelper.generateToken({id: req.user._id});
            return response.success("User Login Sucess", res, {user: req.user, token})
        }else{
            return response.badRequest("Email address or Password don't match", res, {})
        }
    }

}