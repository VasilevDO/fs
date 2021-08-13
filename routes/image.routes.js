const { Router } = require('express');
const config = require('config');
const Image = require('../models/Image');
const auth = require('../middleware/auth.middleware');
const router = Router();

router.post('/save', auth, async (request, response) => {
    try {
        const { url, description, tags } = request.body;
        const image = new Image({url:url,owner:request.user.userId});
        if (description) {
            image.description = description;
        }
        if (tags) {
            image.tags = tags;
        }
        await image.save();
        response.status(201).json({ image })
    } catch (e) {
        response.status(500).json({ message: 'Something went wrong. Try again later' });
    }
})


router.post('/edit', auth, async (request, response) => {
    try {
        console.log(request.body);
        const { id, description, tags } = request.body;
        const image = await Image.findOne({ _id: id });
        if (description) {
            image.description = description;
        }
        if (tags) {
            image.tags = tags
        }
        await image.save();
        response.status(201).json({ image })
    } catch (e) {
        response.status(500).json({ message: 'Something went wrong. Try again later' });
    }
})

router.post('/delete', auth, async (request, response) => {
    try {
        const { id } = request.body;
        const image = await Image.findOne({ _id: id });
        await image.delete();
        response.status(201).json({ message: 'Image was successfuly deleted' })
    } catch (e) {
        response.status(500).json({ message: 'Something went wrong. Try again later' });
    }
})


router.get('/', auth, async (request, response) => {
    try {
        const images = await Image.find({ owner: request.user.userId });
        response.json({images});
    } catch (e) {
        response.status(500).json({ message: 'Something went wrong. Try again later' });
    }
})


module.exports = router;




