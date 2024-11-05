import MobileNumberModel from "./Mobile.model.js"
import DataHelper from "../../helpers/v1/data.helpers.js";
const _DataHelper = new DataHelper();

export default class MobileResource {
    async updateOne(mobile_number, data) {
        console.log('MobileResource@updateOne');
        try {
            // console.log(data)
            // return
            const updateddata = MobileNumberModel.updateOne({ 'mobile_number': mobile_number }, { $set: data }, { new: true });
            return updateddata;
        } catch (err) {
            return false
        }
    }

    async createOne(data) {
        console.log('MobileResource@createOne');
        try {
            console.log(data)
            const mobile = MobileNumberModel.create(data);
            return mobile;
        } catch (err) {
            return false
        }
    }

    async findByMobileNumber(number) {
        console.log('MobileResource@findByMobileNumber');
        try {
            const mobile = MobileNumberModel.findOne({ mobile_number: number });
            return mobile;
        } catch (err) {
            return false
        }
    }

    async getAll(searchCondition) {
        console.log('MobileResource@getAll');
        try {
            let condtion = {}
            if (searchCondition.search && searchCondition.search != null) {
                condtion.mobile_number = { $regex: new RegExp(searchCondition.search, 'i') };
            }
            const count = await MobileNumberModel.find(condtion)
            const { pageNo,totalPages,offset,limit } = await _DataHelper.pagination(count.length, searchCondition.page,searchCondition.limit)
            console.log(pageNo,totalPages,offset,limit)
            const result = await MobileNumberModel.find(condtion).skip(offset).limit(limit)
            return {
                page: pageNo,
                limit: limit,
                totalPages,
                mobile: result
            };
        } catch (err) {
            console.log(err)
            return false
        }

    }
}