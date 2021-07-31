require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');
const qs = require('qs');


const clientId_slack = process.env.SLACK_CLIENT_ID
const clientSecret_slack = process.env.SLACK_CLIENT_SECRET
const refreshToken_slack = process.env.SLACK_REFRESH_TOKEN
const redirectUri_slack = 'http://localhost:2400/auth/slack/callback'

router.get('/', (req, res) => {
    res.redirect(`https://slack.com/oauth/v2/authorize?client_id=${clientId_slack}&scope=&user_scope=identity.basic`);
});

router.get('/callback', (req, res) => {
    const body = {
        client_id: clientId_slack,
        client_secret: clientSecret_slack,
        code: req.query.code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri_slack,
        refresh_token: refreshToken_slack
    }
    axios.post(`https://slack.com/api/oauth.v2.access`, qs.stringify(body), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(res => res.data.authed_user['access_token'])
        .then(_token => {
            res.json({ token: _token })
        }).catch(err => res.status(500).json({ message: err.message }));
});

module.exports = router;