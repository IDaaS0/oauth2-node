require('dotenv').config();

const express = require('express');
const app = express();
const port = 2400

const authRouter = require('./routers/auth');

app.use(express.static(__dirname + '/public'));
app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})