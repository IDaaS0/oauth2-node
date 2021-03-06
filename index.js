require('dotenv').config();
const express = require('express');
const app = express();
const port = 2400

const githubRouter= require('./routers/auth/github');
const googleRouter = require('./routers/auth/google');
const slackRouter = require('./routers/auth/slack');
const discordRouter = require('./routers/auth/discord');
const twitchRouter = require('./routers/auth/twitch');
const lineRouter = require('./routers/auth/line');
const facebookRouter = require('./routers/auth/facebook');

app.use(express.static(__dirname + '/public'));
app.use('/auth/github', githubRouter);
app.use('/auth/google', googleRouter);
app.use('/auth/slack', slackRouter);
app.use('/auth/discord', discordRouter);
app.use('/auth/twitch', twitchRouter);
app.use('/auth/line', lineRouter);
app.use('/auth/facebook', facebookRouter);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
