require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');
const qs = require('qs');

const clientId_google = process.env.GOOGLE_CLIENT_ID
const clientSecret_google = process.env.GOOGLE_CLIENT_SECRET
const redirectUri_google = 'http://localhost:2400/auth/google/callback'

router.get('/', (req, res) => {
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId_google}&redirect_uri=${redirectUri_google}&response_type=code&scope=openid`);
});

router.get('/callback', (req, res) => { 
    const body = {
        client_id: clientId_google,
        client_secret: clientSecret_google,
        code: req.query.code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri_google
    }
    
    axios.post(`https://oauth2.googleapis.com/token`, qs.stringify(body), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(res => res.data['access_token'])
        .then(_token => {
            res.json({ token: _token })
        }).catch(err => res.status(500).json({ message: err.message }))
});

module.exports = router;