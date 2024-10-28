'use strict';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import ResponseHelper from '../../helpers/v1/response.helpers.js';
const response = new ResponseHelper();


import UserResource from '../../resources/Users/User.resources.js';
const _User = new UserResource();

// const AdminResource = require('./../../resources/v1/admin/admin.resources')
// const _Admin = new AdminResource()

// const RolesResource = require('./../../resources/v1/roles/roles.resources');
// const _Role = new RolesResource()

// // const UserRolesResource = require('./../../resources/v1/userRoles/user_roles.resources')
// // const _UserRoles = new UserRolesResource();

// const ApiTokenResource = require('../../resources/v1/apiTokens/apiToken.resources');
// const _ApiToken = new ApiTokenResource()

export default class AuthorizationMiddleware {


    async auth(req, res, next) {
        console.log('AuthorizationMiddleware@auth');

        if (!req.headers['authorization']) {
            return response.unauthorized('missing api token', res, false);
        }

        let token = req.headers['authorization'];

        try {

            jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, decoded) => {
                if (err) {
                    return response.unauthorized(err.message, res, false)
                }
                req.user = await _User.getOne(decoded.id)

                // if(!req.user.dataValues.is_active){
                //     return response.unauthorized("user is inactive", res, false);
                // }
                // if(req.user.dataValues.is_admin_approved == 0){
                //     return response.unauthorized("User blocked! Contact Admin.", res, false);
                // }
                // if(req.user.dataValues.is_admin_approved == 2){
                //     return response.unauthorized("Account Under Verification! Contact Admin. ", res, false);
                // }
                if (req.user === null) {
                    return response.unauthorized("invalid token", res, false);
                }

                next()
            });
        }
        catch (error) {
            return response.unauthorized(error.message, res, false);
        }

    }



}