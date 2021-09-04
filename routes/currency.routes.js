const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const router = Router();
const axios = require('axios');

const apiKey = "99017fc6f14192bc8e12f370ec3dbcf2";
// const basicCurrency='RUB';
const url = `http://data.fixer.io/api/latest?access_key=${apiKey}`;

router.get('/', auth, async (request, response) => {
    try {
        const currency = await axios.get(url)
        response.status(201).json({
            currency: currency.data
        })
    } catch (e) {
        response.status(500).json({ message: 'Service is currently unavailable' });
    }
})

module.exports = router;



