import IncomingModel from "./Incoming.model.js";

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

}