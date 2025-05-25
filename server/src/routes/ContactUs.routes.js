import express from 'express';
import ContactUs from '../controllers/ContactUs.controller.js';

const router = express.Router();

router.post('/createContact', ContactUs.createContactUs);
router.delete('/:id', ContactUs.deleteContactUs);
router.get('/' , ContactUs.ShowAllContactUs)
export default router;