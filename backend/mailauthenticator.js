import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app =express();
const port = 7800;
app.use(express.json());
app.use(
  cors({
    origin:[
       "http://localhost:5174","http://localhost:5173",

    ]
  })
);

mongoose
  .connect("mongodb://localhost:27017/authdb")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));
// User schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['superAdmin', 'admin', 'agent'],
    default: 'user',
  },
  otp: { type: String },
  otpExpiry: { type: Date },
});

const UserModel = mongoose.model('authuser', UserSchema);

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Routes

// Register route
app.post('/register', async (req, res) => {
    const { name, username, email, password, role } = req.body;
  
    try {
      // Check if email is already registered
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists. Please use a different one.' });
      }
  console.log("existinguser",existingUser)
      const salt = await bcrypt.genSalt(10);
      const hashedpass = await bcrypt.hash(password, salt);
  
      const newUser = new UserModel({
        name,
        username,
        email,
        password: hashedpass,
        role: role || 'user',
      });
  
      await newUser.save();
      res.status(200).json(true);
      console.log("registerNewUser",newUser)
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
console.log(req.body)
  const user = await UserModel.findOne({ username });
  if (!user) return res.status(404).send('User not found');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).send('Invalid password');

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes
  await user.save();

  // Send OTP email
  const mailOptions = {
    from: `"Your App Name" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
  };
console.log(mailOptions)
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'OTP sent to your registered email', username });
  } catch (error) {
    console.error('Error sending OTP email:', error);
    res.status(500).send('Failed to send OTP');
  }
});

// OTP verification route
app.post('/verify-otp', async (req, res) => {
  const { username, otp } = req.body;
  console.log(req.body)

  const user = await UserModel.findOne({ username });
  if (!user) return res.status(404).send('User not found');

  if (!user.otp || user.otpExpiry < new Date()) {
    return res.status(400).send('OTP expired or invalid');
  }

  if (user.otp !== otp) return res.status(400).send('Invalid OTP');

  // Clear OTP after successful verification
  user.otp = null;
  user.otpExpiry = null;
  await user.save();
  console.log(user)
  res.status(200).send({ message: 'OTP verified. Login successful' });
});

app.listen(port, () => {
    console.log("Server started",port);
  });
