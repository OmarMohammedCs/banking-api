import { Router } from "express";
import { balance, deposit, me, transactions, transfer } from "../controllers/users.js";
import validate from "../middlewares/validate.js";
import { transferValidation } from "../validations/transferValidation.js";

const routerUsers = Router();

routerUsers.get("/me",me);
routerUsers.post('/deposit',deposit);
routerUsers.post('/transfer',transferValidation, validate,transfer)
routerUsers.get('/transactions',transactions)
routerUsers.get('/balance', balance)

export default routerUsers;