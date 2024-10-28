import UserModel from "./User.model.js";

export default class UserResource {
    async createOne(data){
        console.log("UserResource@createOne");
        const user = await UserModel.create(data);
        return user;
    }

    async findByEmail(email){
        console.log("UserResource@findByEmail");
        const user = await UserModel.findOne({email});
        return user;
    }

    async getOne(id){
        console.log("UserResource@getOne");
        const user = await UserModel.findById(id);
        return user;
    }


}