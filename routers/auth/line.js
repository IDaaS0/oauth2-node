require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');
const qs = require('qs');
const {v4: uuidv4} = require('uuid');

const clientId_line = process.env.LINE_CLIENT_ID
const clientSecret_line = process.env.LINE_CLIENT_SECRET
const redirectUri_line = "http://localhost:2400/auth/line/callback"

router.get('/', (req, res) => {
    const state = uuidv4();
    res.redirect(`https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId_line}&redirect_uri=${redirectUri_line}&state=${state}&scope=profile%20openid%20email`)
})

router.get('/callback', (req, res) => {
    const body = {
        client_id: clientId_line,
        client_secret: clientSecret_line,
        code: req.query.code,
        redirect_uri: redirectUri_line,
        grant_type: 'authorization_code'
    }
    axios.post(`https://api.line.me/oauth2/v2.1/token`, qs.stringify(body), {
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