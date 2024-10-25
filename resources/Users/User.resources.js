import UserModel from "./UserModel.js";

export default class UserResource {
    async createOne(data){
        const user = await UserModel.create(data);
        return user;
    }
}