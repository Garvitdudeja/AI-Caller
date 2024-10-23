const fcm = require('fcm-node')
const nFPath = require('./../../config/v1/norvell-napp-firebase-adminsdk-aunk7-62663f9a8b.json');
const { v4: uuidv4 } = require('uuid');

export default class PushNotificationHelper {
    constructor(){
        try{
            
            this.FCM = new fcm(nFPath, null, uuidv4());
        }
        catch(err){

            throw new Error(err.message);
                        
        }
    }

    sendSingleNotification(token, dataRequest, title, body){
        let dataString = JSON.stringify(dataRequest)
        let message = {
            data : {
                appointment : JSON.stringify(dataRequest)
            },
            notification: {
                title: title,
                body: body
            },
            to: token
        }
        
        this.FCM.send(message, (err,response) => {
            console.log("INSIDE THE SEND FUNCTION");
            if(err){
                
                throw new Error(err);
            }
            else 
            {
                
                return true
            }
        })
    }  
    
    sendMultipleNotification(token, data={}, title, body){
        let message = {
            ...data,
            notification: {
                title: title,
                body: body
            }
        }

        this.FCM.sendToMultipleToken(message, token, (err, response) => {
            if(err){
                throw new Error(err.message);
            }
            else
            {
                return true
            }
        })
    }
}