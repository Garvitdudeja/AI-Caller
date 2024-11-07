import IncomingModel from "./Incoming.model.js";
import DataHelper from "../../helpers/v1/data.helpers.js";
const _DataHelper = new DataHelper();

export default class IncomingResource {

    async createOne(data){
        console.log('IncomingResource@createOne');
        try{
            const log = IncomingModel.create(data);
            return log;
        }catch(err){
            return false
        }
    }

    async addConversation(id, data){
        console.log('IncomingResource@createOne');
        try{
            const log = IncomingModel.updateOne({_id: id}, {$push: {Conversation: {...data}}});
            return log;
        }catch(err){
            return false
        }
    }

    async getConversationsByMobile(id,searchCondition){
        console.log('IncomingResource@getConversations');
        const condition = {"Mobile_ID": id}
        const count = await IncomingModel.find(condition);
        const { pageNo,totalPages,offset,limit } = await _DataHelper.pagination(count.length, searchCondition?.page,searchCondition?.limit)
        console.log(pageNo,totalPages,offset,limit)
        const result = await IncomingModel.find(condition).skip(offset).limit(limit)
        return {
            page: pageNo,
            limit: limit,
            totalPages,
            Conversations: result
        };
    }

    async getConversationsByID(id){
        console.log('IncomingResource@getConversationsByID');
        const data = await IncomingModel.findById(id);
        return data;
    }
}