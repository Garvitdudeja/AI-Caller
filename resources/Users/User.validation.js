import Joi from "joi";
import ResponseHelper from "../../helpers/v1/response.helpers.js";
const response = new ResponseHelper();
import DataHelper from "../../helpers/v1/data.helpers.js";
const _DataHelper = new DataHelper();

export default class UserValidation {
  async signup(req, res, next) {
    console.log("UserValidation@signup");
    const schema = {
      email: Joi.string().email().required(),
      first_name: Joi.string(),
      password: Joi.string(),
    };

    let errors = await _DataHelper.joiValidation(req.body, schema);

    if (errors) {
      return response.badRequest("invalid request data", res, errors);
    }
    next();
  }
}
