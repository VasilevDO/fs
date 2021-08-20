const { Router } = require('express');
const config = require('config');
const User = require('../models/User');
const Feedback= require('../models/Feedback');
const auth = require('../middleware/auth.middleware');
const router = Router();
const userRights = require('../userRights');

router.post('/create', auth, async (request, response) => {
    try {
        
        const user = await User.findOne({ _id: request.headers.userid });
        const rights = userRights[user.status];
        if (!rights.canSendFeedback) {
            response.status(403).json({ status: 'red', message: 'Access denied (no rights)' });
            return;
        }
        const {senderName,feedbackText}=request.body;
        const feedback=new Feedback({
            senderName:senderName,
            text:feedbackText,
            owner:user._id
        });
        //await feedback.save();
        response.status(201).json({ message: 'Feedback has been succesfully sent.' });
    } catch (e) {
        response.status(500).json({ message: 'Something went wrong. Try again later' });
    }
})

router.get('/', auth, async (request, response) => {
    try {
        const feedbacks = await Feedback.find();
        response.status(201).json({ feedbacks });
    } catch (e) {
        response.status(500).json({ message: 'Something went wrong. Try again later' });
    }
})


module.exports = router;




