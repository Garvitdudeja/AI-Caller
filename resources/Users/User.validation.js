import Joi from "joi";

export default class UserValidation {

    async signup(req,res,next){
        console.log('UserValidation@signup')
        const Schema = Joi.object({
            email: Joi.string().email().required(),
            first_name: Joi.string(),
            password:   Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        })
        const { error, value } = Schema.validate(req.body)
        console.log(error, value);
        if (error) {
            // Respond with a 400 status and the error message
            return res.status(400).json({ message: error.details[0].message });
        }
        next();
    }

};

