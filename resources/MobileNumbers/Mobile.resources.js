import mobile_number_model from "./MobileModel.js"

export default class MobileResource {
    async updateOne(mobile_number, data){
        try{
            const updateddata = mobile_number_model.updateOne({'number': mobile_number}, data, {new: true});
            return updateddata;
        }catch(err){
            return false
        }
    }

    async createOne(data){
        try{
            const mobile = mobile_number_model.create(data);
            return mobile;
        }catch(err){
            return false
        }
    }
}