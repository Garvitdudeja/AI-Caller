export default class UserController {
    
    
    async getAll(req,res){
        let category = await _UserBrand.getAll();
        return response.success('successfully found user', res, category);
    }

}