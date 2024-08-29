import {Router} from "express";
import { getContactsForDMList, searchContacts } from "../controllers/ContactsController.js";
import {verifyToken} from  "../middlewares/AuthMiddleware.js"


const contactsRoutes=Router();
contactsRoutes.post("/search",verifyToken,searchContacts)
contactsRoutes.get("/get-contacts-for-dm",verifyToken,getContactsForDMList)
;
export default contactsRoutes;