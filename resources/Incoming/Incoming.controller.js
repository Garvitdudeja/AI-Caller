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
import axios from "axios";
import FormData from 'form-data';


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
    console.log(mobileInfo)
    // Respond to Twilio with instructions for the call
    const twiml = new twilio.twiml.VoiceResponse();
    if (!req.cookies.data) {
      twiml.say({ voice: mobileInfo.voice }, "Welcome to " + mobileInfo.user_id.company.name + ". How can I assist you today?");
      const logCall = await _Incoming.createOne({ From, To, CallSid, Mobile_ID: mobileInfo._id })
      const AiSystemData = await _DataHelper.getAISystemData(mobileInfo.user_id);
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
              content: "Welcome to " + mobileInfo.user_id.company.name + ". How can I assist you today?",
            },
          ],
          currentQuestion: "Welcome to " + mobileInfo.user_id.company.name + ". How can I assist you today?",
          _id: logCall._id,
          receivingNumber: To,
          callingNumber: From,
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
    let messages = cookieData.messages;
    const voiceInput = formData["SpeechResult"].toString();

    // Add user message to the chat log
    messages.push({ role: "user", content: voiceInput });

    const mobileInfo = await _Mobile.findByMobileNumber(cookieData.receivingNumber);

    // Save the conversation to your DB
    const logCall = await _Incoming.addConversation(cookieData._id, {
      assistant: cookieData.currentQuestion,
      user: voiceInput,
    });

    // Generate response using OpenAI
    const chatCompletion = await openai.chat.completions.create({
      model: "chatgpt-4o-latest",
      messages,
      temperature: 0,
      max_tokens: 100,
    });

    const assistanceResponse = chatCompletion.choices[0].message.content;
    messages.push({ role: "assistant", content: assistanceResponse });

    // 🍪 Update cookie data for continuity
    res.cookie(
      "data",
      JSON.stringify({
        ...cookieData,
        messages,
        currentQuestion: assistanceResponse,
      })
    );

    // 🔗 Fire-and-forget Zoho API call using multipart/form-data
    try {
      const zohoApiUrl =
        "https://www.zohoapis.com/crm/v7/functions/storeaicalls_1/actions/execute?auth_type=apikey&zapikey=1003.ea52eed87a0014942321fe35b0a9b557.2958e2de5bb055884936bb746b431c82";

      const zohoForm = new FormData();
      zohoForm.append(
        "arguments",
        JSON.stringify({
          twilioId: cookieData._id,
          Phone: cookieData.callingNumber,
          Question: cookieData.currentQuestion,
          Answer: voiceInput,
        })
      );

      // Send in background (non-blocking)
      axios
        .post(zohoApiUrl, zohoForm, {
          headers: zohoForm.getHeaders(),
        })
        .then((response) => {
          console.log("Zoho response:", response.data);
        })
        .catch((error) => {
          console.error("Zoho CRM error:", error.response?.data || error.message);
        });
    } catch (err) {
      console.error("Error setting up Zoho CRM request:", err.message);
    }

    // 🗣 Respond to user with the AI's message
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say({ voice: mobileInfo.voice }, assistanceResponse);
    twiml.redirect({ method: "POST" }, "/api/v1/incoming/incoming-call");

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  }

  async getConversationsByMobile(req, res) {
    console.log("IncomingController@getConversations")
    let data = await _Incoming.getConversationsByMobile(req.params.id, req.query);
    return response.success('Data Found Sucess', res, data);
  }

  async getConversationById(req, res) {
    console.log("IncomingController@getConversationById")
    let data = await _Incoming.getConversationsByID(req.params.id);
    return response.success('Data Found Sucess', res, data);
  }
}
