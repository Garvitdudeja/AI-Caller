import express from "express";
import dotenv from "dotenv";
import twilio from "twilio";
import morgan from "morgan";
import OpenAI from "openai";
import cookieParser from "cookie-parser";
import UserRoutes from "./resources/Users/User.routes.js";
import MobileRoutes from "./resources/MobileNumbers/Mobile.routes.js";
import mongoose from "mongoose";
mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log("Database connection established")
})
dotenv.config();
const app = express();
app.use(cookieParser());

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);



const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});
app.use(express.json());
app.use(express.urlencoded());
app.use(morgan("tiny"));
app.use("/api/v1/users",UserRoutes);
app.use("/api/v1/mobile",MobileRoutes);

app.get("/", (req, res) => {
  res.json({ success: "Server Running" });
});
const InitialMessage = "Hello,  how are you?";

// Route to handle incoming calls
app.post("/incoming-call", (req, res) => {
  const { From, To, CallSid } = req.body; // Extract call details from the request body
  console.log(`Received call from: ${From} to: ${To}, Call SID: ${CallSid}`);

  // Respond to Twilio with instructions for the call
  const twiml = new twilio.twiml.VoiceResponse();
  if (!req.cookies.messages) {
    twiml.say(InitialMessage);
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
          content: InitialMessage,
        },
      ])
    );
  }
  twiml.gather({
    input: ["speech"],
    speechTimeout: "auto",
    speechModel: "experimental_conversations",
    enhanced: true,
    action: "/respond",
  });
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

app.post("/respond", async (req, res) => {
  const formData = req.body;
  let messages = JSON.parse(req.cookies.messages || [])
  const voiceInput = formData["SpeechResult"].toString();
  messages.push({role: "user", content: voiceInput})

  // OpenAi
  const chatCompletion = await openai.chat.completions.create({
    model: "chatgpt-4o-latest",
    messages,
    temperature: 0,
    max_tokens: 100,
  });

  const assistanceResponse = chatCompletion.choices[0].message.content;
  messages.push({role: "assistant", content: assistanceResponse})
  res.cookie("messages",JSON.stringify(messages) )
  console.log(assistanceResponse);
  const twiml = new twilio.twiml.VoiceResponse();
  twiml.say({voice: 'Polly.Joanna'},assistanceResponse);
  twiml.redirect({ method: "POST" }, "/incoming-call");
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

// Function to create an outgoing call
const createCall = async () => {
  try {
    const call = await client.calls.create({
      url: "http://demo.twilio.com/docs/voice.xml",
      to: "+917009330672",
      from: process.env.PHONE_NUMBER,
      // from: "+15005550006",
      // to: "+917009330672",
    });
    console.log(call.sid);
  } catch (error) {
    console.error("Error creating call:", error);
  }
};

// createCall();

app.listen(process.env.PORT || 3000, () => {
  console.log("Server Listening on port " + (process.env.PORT || 3000));
});
