require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Github
const clientId = process.env.GITHUB_CLIENT_ID
const clientSecret = process.env.GITHUB_CLIENT_SECRET

router.get('/github', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}`);
})

router.get('/github/callback', (req, res) => {
    const body = {
        client_id: clientId,
        client_secret: clientSecret,
        code: req.query.code
    };
    const opts = {headers: {accept: 'application/json'}};
    axios.post(`https://github.com/login/oauth/access_token`, body, opts)
        .then(res => res.data['access_token'])
        .then(_token => {
            res.json({ token: _token });
        }).catch(err => res.status(500).json({ message: err.message }));
});

module.exports = router;