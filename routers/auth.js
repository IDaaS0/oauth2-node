require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');
const qs = require('qs');

// Github
const clientId_github = process.env.GITHUB_CLIENT_ID
const clientSecret_github = process.env.GITHUB_CLIENT_SECRET

router.get('/github', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientId_github}`);
})

router.get('/github/callback', (req, res) => {
    const body = {
        client_id: clientId_github,
        client_secret: clientSecret_github,
        code: req.query.code
    };
    const opts = {headers: {accept: 'application/json'}};
    axios.post(`https://github.com/login/oauth/access_token`, body, opts)
        .then(res => res.data['access_token'])
        .then(_token => {
            res.json({ token: _token });
        }).catch(err => res.status(500).json({ message: err.message }));
});

// Google 
const clientId_google = process.env.GOOGLE_CLIENT_ID
const clientSecret_google = process.env.GOOGLE_CLIENT_SECRET

router.get('/google', (req, res) => {
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId_google}&redirect_uri=${redirectUri_google}&response_type=code&scope=openid`);
});

router.get('/google/callback', (req, res) => { 
    const body = {
        client_id: clientId_google,
        client_secret: clientSecret_google,
        code: req.query.code,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:2400/auth/google/callback'
    }

    console.log(body)
    
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