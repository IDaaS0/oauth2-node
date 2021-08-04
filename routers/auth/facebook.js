require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');
const qs = require('qs');
const {v4: uuidv4} = require('uuid');

const clientId_facebook = process.env.FACEBOOK_CLIENT_ID
const clientSecret_facebook = process.env.FACEBOOK_CLIENT_SECRET
const redirectUri_facebook = process.env.FACEBOOK_REDIRECT || "http://localhost:2400/auth/facebook/callback"

router.get('/', (req, res) => {
    const state = uuidv4();
    res.redirect(`https://www.facebook.com/v11.0/dialog/oauth?client_id=${clientId_facebook}&redirect_uri=${redirectUri_facebook}&state=${state}`)
})

router.get('/callback', (req, res) => {
    const body = {
        client_id: clientId_facebook,
        client_secret: clientSecret_facebook,
        code: req.query.code,
        redirect_uri: redirectUri_facebook
    }
    axios.post(`https://graph.facebook.com/v11.0/oauth/access_token`, qs.stringify(body), {
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
