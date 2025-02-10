import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from 'cors';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cookieParser from 'cookie-parser'
import session from 'express-session';
import MongoStore from 'connect-mongo';

import codeRoutes from './routes/codeRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Backend Started');
});

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use(helmet())

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log(err.message);
    process.exit(1)
  }
}

app.use(session({
  store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
      ttl: 14*24*60*60
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 14*24*60*60*1000
  }
}))

app.use('/code', codeRoutes);
app.use('/auth', authRoutes)

const startServer = async () => {
  await connectToDB();
  app.listen(port, () => {
    console.log(`Server Started at port ${port}`);
  });
}
startServer()

export default app;