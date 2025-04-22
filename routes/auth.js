import {Router} from 'express';
import {login, logout, reqister} from '../controllers/auth.js'
import {
    signupValidation,
    loginValidation,
  } from '../validations/userValidation.js';
import validate from '../middlewares/validate.js';
const routerAuth = Router();

routerAuth.post('/login', loginValidation, validate, login);
routerAuth.post('/register', signupValidation, validate, reqister);
routerAuth.post('/logout', logout);


export default routerAuth;