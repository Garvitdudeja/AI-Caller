import Joi from "joi";
import ResponseHelper from "../../helpers/v1/response.helpers.js";
const response = new ResponseHelper();
import DataHelper from "../../helpers/v1/data.helpers.js";
const _DataHelper = new DataHelper();
import UserResource from "./User.resources.js";
const _user = new UserResource();

export default class UserValidation {
  async signup(req, res, next) {
    console.log("UserValidation@signup");
    const schema = {
      email: Joi.string().email().required(),
      first_name: Joi.string().required(),
      password: Joi.string().required(),
    };

    let errors = await _DataHelper.joiValidation(req.body, schema);
    if (errors) {
      return response.badRequest("invalid request data", res, errors);
    }
    const user = await  _user.findByEmail(req.body.email);
    if (user.lenght>0) {
      return response.conflict("User already exists", res, user);
    }
    next();
  }

  async login(req, res, next) {
    console.log("UserValidation@login");
    const schema = {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    };

    let errors = await _DataHelper.joiValidation(req.body, schema);
    if (errors) {
      return response.badRequest("invalid request data", res, errors);
    }
    const user = await  _user.findByEmail(req.body.email);
    if (user.lenght==0) {
      return response.badRequest("User doesn't exists", res, {});
    }else{
      req.user = user;
    }
    next();
  }
}
