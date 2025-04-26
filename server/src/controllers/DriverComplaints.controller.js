import Complaint from '../models/DriverComplaintModel.js';

export const createComplaint = async (req, res) => {
  try {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map(err => err.message)
      });
    }

    const complaint = new Complaint({
      subject: req.body.subject,
      incidentDate: req.body.incidentDate,
      priorityLevel: req.body.priorityLevel,
      description: req.body.description,
      attachment: req.body.attachment,
      submittedBy: req.body.driverId,
      status: 'pending' 
    });

    const savedComplaint = await complaint.save();

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: savedComplaint
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit complaint',
      error: err.message
    });
  }
};

export const getComplaints = async (req, res) => {
  try {
    const { driverId } = req.params;
    
    if (!driverId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid driver ID format'
      });
    }

    const complaints = await Complaint.find({ submittedBy: driverId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: complaints
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaints',
      error: err.message
    });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaint',
      error: err.message
    });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['pending', 'in-progress', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Complaint status updated',
      data: updatedComplaint
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update complaint status',
      error: err.message
    });
  }
};
export default {
   createComplaint
  };