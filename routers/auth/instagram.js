require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');
const qs = require('qs');
const {v4: uuidv4} = require('uuid');

const clientId_instagram = process.env.INSTAGRAM_CLIENT_ID
const clientSecret_instagram = process.env.INSTAGRAM_CLIENT_SECRET
const redirectUri_instagram = process.env.INSTAGRAM_REDIRECT || 'http://localhost:2400/auth/instagram/callback'

router.get('/', (req, res) => {
    const state = uuidv4();
    res.redirect(`https://api.instagram.com/oauth/authorize?client_id=${clientId_instagram}&redirect_uri=${redirectUri_instagram}&response_type=code&scope=user_profile&state=${state}`);
})

router.get('/callback', (req, res) => {
    const body = {
        client_id: clientId_instagram,
        client_secret: clientSecret_instagram,
        code: req.query.code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri_instagram
    }
    axios.post(`https://api.instagram.com/oauth/access_token`, qs.stringify(body), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(res => res.data['access_token'])
        .then(_token => {
            res.json({ token: _token })
        }).catch(err => res.status(500).json({ message: err.message }));
})

module.exports = router;