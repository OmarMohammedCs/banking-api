// External imports
import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';

// Internal imports
import connectDB from './db/db.js';
import routerAuth from './routes/auth.js';
import routerUsers from './routes/users.js';
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';

// Configurations
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to DB
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Routes
const apiV1Router = express.Router();
apiV1Router.use('/auth', routerAuth);
apiV1Router.use('/users', routerUsers);
app.use('/api/v1', apiV1Router);

// Global error handler
app.use(globalErrorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
