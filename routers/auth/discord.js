require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');
const qs = require('qs');

const clientId_discord = process.env.DISCORD_CLIENT_ID
const clientSecret_discord = process.env.DISCORD_CLIENT_SECRET
const redirectUri_discord = 'http://localhost:2400/auth/discord/callback'

router.get('/', (req, res) => {
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${clientId_discord}&redirect_uri=${redirectUri_discord}&response_type=code&scope=identify`)
})

router.get('/callback', (req, res) => {
    const body = {
        client_id: clientId_discord,
        client_secret: clientSecret_discord,
        code: req.query.code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri_discord
    }

    console.log(body)

    axios.post(`https://discord.com/api/v8/oauth2/token`, qs.stringify(body), {
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