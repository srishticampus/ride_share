import { Schema, model } from "mongoose";

const contactUsSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true
  }
}, { timestamps: true });

export default model('ContactUs', contactUsSchema);