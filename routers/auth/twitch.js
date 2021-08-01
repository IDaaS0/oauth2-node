require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');
const qs = require('qs');

const clientId_twitch = process.env.TWITCH_CLIENT_ID
const clientSecret_twitch = process.env.TWITCH_CLIENT_SECRET
const redirectUri_twitch = 'http://localhost:2400/auth/twitch/callback'

router.get('/', (req, res) => {
    res.redirect(`https://id.twitch.tv/oauth2/authorize?client_id=${clientId_twitch}&redirect_uri=${redirectUri_twitch}&response_type=code&scope=user:read:email`)
})

router.get('/callback', (req, res) => {
    const body = {
        client_id: clientId_twitch,
        client_secret: clientSecret_twitch,
        code: req.query.code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri_twitch
    }
    axios.post(`https://id.twitch.tv/oauth2/token`, qs.stringify(body), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(res => res.data['access_token'])
        .then(_token => {
            res.json({ token: _token })
        }).catch(err => res.status(500).json({ message: err.message }));
});

module.exports = router;