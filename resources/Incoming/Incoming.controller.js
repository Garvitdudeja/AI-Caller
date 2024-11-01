import IncomingResource from "./Incoming.resources.js";
const _Incoming = new IncomingResource();
import _ from "lodash";
import ResponseHelper from "../../helpers/v1/response.helpers.js";
const response = new ResponseHelper();
import twilio from "twilio";
import MobileResource from "../Mobile/Mobile.resources.js";
const _Mobile = new MobileResource();
import OpenAI from "openai";

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
    console.log(mobileInfo.question_to_ask[0])
    const twiml = new twilio.twiml.VoiceResponse();
    if (!req.cookies.messages) {
      twiml.say(mobileInfo.question_to_ask[0]);
      res.cookie(
        "messages",
        JSON.stringify([
          {
            role: "system",
            content:
              "We are Globe Integrity the best Insurance company in USA we have insurances that you can imagine",
          },
          {
            role: "assistant",
            content: mobileInfo.question_to_ask[0],
          },
        ])
      );
    }
    twiml.gather({
      input: ["speech"],
    speechTimeout: "auto",
      speechModel: "experimental_conversations",
      enhanced: true,
      action: "api/v1/incoming/respond",
    });
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  }

  async incomingResponse(req, res) {
    const formData = req.body;
    let messages = JSON.parse(req.cookies.messages || []);
    const voiceInput = formData["SpeechResult"].toString();
    messages.push({ role: "user", content: voiceInput });

    // OpenAi
    const chatCompletion = await openai.chat.completions.create({
      model: "chatgpt-4o-latest",
      messages,
      temperature: 0,
      max_tokens: 100,
    });

    const assistanceResponse = chatCompletion.choices[0].message.content;
    messages.push({ role: "assistant", content: assistanceResponse });
    res.cookie("messages", JSON.stringify(messages));
    console.log(assistanceResponse);
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say({ voice: "Polly.Joanna" }, assistanceResponse);
    twiml.redirect({ method: "POST" }, "/incoming-call");
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  }
}
