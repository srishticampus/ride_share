import { ContactUs } from '../models/index.js';
import catchAsync from '../utils/catchAsync.js';

// Create a new contact entry
const createContactUs = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newContact = await ContactUs.create({
      name,
      email,
      message
    });

    return res.status(201).json({
      success: true,
      message: 'Your message has been submitted successfully',
      data: newContact
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to submit your message',
      error: error.message
    });
  }
};

 const deleteContactUs = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedContact = await ContactUs.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
      data: deletedContact
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete contact',
      error: error.message
    });
  }
};
const ShowAllContactUs = catchAsync(async(req , res)=>{
  const contact = await ContactUs.find()

  res.status(200).json({
     status: 'success',
    results: contact.length,
    data: {
      contact
    }
  })
})
export default {
  deleteContactUs,
  createContactUs,
  ShowAllContactUs
}