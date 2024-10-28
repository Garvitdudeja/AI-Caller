import MobileNumberModel from "./Mobile.model.js"

export default class MobileResource {
    async updateOne(mobile_number, data){
        console.log('MobileResource@updateOne');
        try{
            // console.log(data)
            // return
            const updateddata = MobileNumberModel.updateOne({'mobile_number': mobile_number},  { $set: data }, {new: true});
            return updateddata;
        }catch(err){
            return false
        }
    }

    async createOne(data){
        console.log('MobileResource@createOne');
        try{
            console.log(data)
            const mobile = MobileNumberModel.create(data);
            return mobile;
        }catch(err){
            return false
        }
    }

    async findByMobileNumber(number){
        console.log('MobileResource@findByMobileNumber');
        try{
            const mobile = MobileNumberModel.findOne({mobile_number: number});
            return mobile;
        }catch(err){
            return false
        }
    }
}