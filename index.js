import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import cron from "node-cron";
import axios from 'axios';
import cors from 'cors';
dotenv.config();

mongoose
  .connect('mongodb+srv://hraj43:fpTadFnKkejfhVEH@cluster0.2irydqa.mongodb.net/database?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

  const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cors())
app.use(cookieParser());

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});


app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);


app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})
try {
  cron.schedule('*/2 * * * *', async() => {
    console.log('running a task every two minutes');
    const response=await axios.get(process.env.BACKEND_URI);  
    console.log(response);
  });
} catch (error) {
  console.log('err bc')
}


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
// try {
//   cron.schedule('*/2 * * * *', async () => {
//     
//   });
// } catch (error) {
//   console.log(error)
// }