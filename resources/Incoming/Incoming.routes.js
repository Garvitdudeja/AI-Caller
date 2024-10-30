import express from 'express';
import ResponseHelper from '../../helpers/v1/response.helpers.js';
import IncomingValidation from './Incoming.validation.js';
import IncomingController from './Incoming.controller.js';
import AuthorizationMiddleware from '../../middleware/v1/authorize.js';
import twilio from 'twilio'
const auth = new AuthorizationMiddleware();
const responseHelper = new ResponseHelper();
const validate = new IncomingValidation();
const Incoming = new IncomingController();

const router = express.Router(); // Use Router() instead of express()

// router.patch('/',[auth.auth],validate.updateOne,Incoming.updateNumberInfo);
router.post('/',validate.createOne,Incoming.createOne);


// Route to handle incoming calls
router.post("/incoming-call",Incoming.handleIncoming);

router.post("/respond",Incoming.incomingResponse);

export default router;
