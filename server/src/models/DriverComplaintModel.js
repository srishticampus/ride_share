
import { Schema, model } from "mongoose";

const complaintSchema = new Schema({
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [100, 'Subject cannot exceed 100 characters']
  },
  incidentDate: {
    type: Date,
    required: [true, 'Incident date is required'],
    validate: {
      validator: function(date) {
        return date <= new Date();
      },
      message: 'Incident date cannot be in the future'
    }
  },
  priorityLevel: {
    type: String,
    required: [true, 'Priority level is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [20, 'Description should be at least 20 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  attachment: {
    type: String, 
    required: false
  },
  status: {
    type: String,
  },
  submittedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
}, {
  timestamps: true 
});

const Complaint = model('Complaint', complaintSchema);

export default Complaint;