const RideSchema = new Schema({
  driverId: {
    type: Schema.Types.ObjectId,
    ref: 'Driver'
  },
  riderId: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
  },
  origin: {
    type: String,
    required: [true, 'Origin is required'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  rideDate: {
    type: Date,
    required: [true, 'Ride date is required']
  },
  rideTime: {
    type: String,
    required: [true, 'Ride time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format']
  },
  availableSeats: {
    type: Number,
    required: [true, 'Available seats are required'],
    min: [1, 'At least 1 seat must be available']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'started', 'completed', 'cancelled', 'scheduled', 'available'],
    default: 'pending'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  rideDescription: {
    type: String,
    trim: true
  },
  specialNote: {
    type: String,
    trim: true
  },
  route: {
    type: String,
    trim: true
  }
}, { timestamps: true });

export default model('Ride', RideSchema);