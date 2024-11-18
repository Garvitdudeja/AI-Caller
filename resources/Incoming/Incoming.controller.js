import IncomingResource from "./Incoming.resources.js";
const _Incoming = new IncomingResource();
import _ from "lodash";
import ResponseHelper from "../../helpers/v1/response.helpers.js";
const response = new ResponseHelper();
import twilio from "twilio";
import MobileResource from "../Mobile/Mobile.resources.js";
const _Mobile = new MobileResource();
import OpenAI from "openai";
import DataHelper from "../../helpers/v1/data.helpers.js";
const _DataHelper = new DataHelper();

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});


const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export default class IncomingController {
  async createOne(req, res) {
    console.log("IncomingController@createOne");
    let userData = _.pick(req.body, [
      "questions",
      "voice",
      "mobile_number",
      "question_to_ask",
    ]);
    userData.user_id = req.user._id;
    let data = await _Incoming.createOne(userData);
    return response.success("Incoming Call Logged", res, data);
  }

  async handleIncoming(req, res) {
    const { From, To, CallSid } = req.body; // Extract call details from the request body
    console.log(`Received call from: ${From} to: ${To}, Call SID: ${CallSid}`);
    const mobileInfo = await _Mobile.findByMobileNumber(To);
    // Respond to Twilio with instructions for the call
    const twiml = new twilio.twiml.VoiceResponse();
    if (!req.cookies.data) {
      twiml.say({ voice: mobileInfo.voice },"Welcome to Globe Integrity Insurance. How can I assist you today?");
      const logCall = await _Incoming.createOne({From,To,CallSid,Mobile_ID: mobileInfo._id })
      const AiSystemData =  await _DataHelper.getAISystemData(mobileInfo.question_to_ask);
      res.cookie(
        "data",
        JSON.stringify({
          "messages": [
            {
              role: "system",
              content:
              AiSystemData
            },
            {
              role: "assistant",
              content: "Welcome to Globe Integrity Insurance. How can I assist you today?",
            },
          ], 
          currentQuestion: "Welcome to Globe Integrity Insurance. How can I assist you today?",
          _id: logCall._id,
          receivingNumber: To,
        })
      );
    }
    twiml.gather({
      input: ["speech"],
    speechTimeout: "auto",
      speechModel: "experimental_conversations",
      enhanced: true,
      action: "/api/v1/incoming/respond",
    });
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  }

  async incomingResponse(req, res) {
    const formData = req.body;
    let cookieData = JSON.parse(req.cookies.data || []);
    let messages = cookieData.messages
    const voiceInput = formData["SpeechResult"].toString();


    messages.push({ role: "user", content: voiceInput });
    const mobileInfo = await _Mobile.findByMobileNumber(cookieData.receivingNumber);
    const logCall = await  _Incoming.addConversation(cookieData._id, {assistant: cookieData.currentQuestion,user: voiceInput})
    // OpenAi
    const chatCompletion = await openai.chat.completions.create({
      model: "chatgpt-4o-latest",
      messages,
      temperature: 0,
      max_tokens: 100,
    });

    const assistanceResponse = chatCompletion.choices[0].message.content;
    messages.push({ role: "assistant", content: assistanceResponse });
    res.cookie("data", JSON.stringify({...cookieData, messages, currentQuestion: assistanceResponse}));
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say({ voice: mobileInfo.voice }, assistanceResponse);
    twiml.redirect({ method: "POST" }, "/api/v1/incoming/incoming-call");
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  }


  async getConversationsByMobile(req,res){
    console.log("IncomingController@getConversations")
    let data = await _Incoming.getConversationsByMobile(req.params.id,req.query);
    return response.success('Data Found Sucess', res, data);
  }

  async getConversationById(req,res){
    console.log("IncomingController@getConversationById")
    let data = await _Incoming.getConversationsByID(req.params.id);
    return response.success('Data Found Sucess', res, data);
  }
}
