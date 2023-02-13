const path = require('path');
const express = require('express');
const app = express();
const listenPort = process.env.PORT || 5000;
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

app.use(cors({
    origin: process.env.CLIENT_URL,
    // origin: 'http://localhost:3000/',
    credentials: true
}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const smtp_login = process.env.SMTP_LOGIN;
const smtp_password = process.env.SMTP_PASSWORD;

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: smtp_login, // generated ethereal user
        pass: smtp_password, // generated ethereal password
    },
});

app.get('/', (req, res) => {
    res.send('Server for portfolio works correct!');
});

app.get('/download', (req, res) => {
    res.sendFile(path.join(__dirname, 'CV.pdf'));
});

app.post('/message', async (req, res) => {
    let info = await transporter.sendMail({
        email: req.body.email,
        from: req.body.name, // sender address
        to: smtp_login, // list of receivers
        subject: "My portfolio", // Subject line
        text: req.body.message, // plain text body
        html: `${req.body.message} <br/><br/><br/> 
        <em>Sender name: ${req.body.name}</em><br/>
        <b>Sender address: ${req.body.email}</b>`, // html body
    });
    res.send('Message sent!');
});

app.listen(listenPort, () => {
    console.log("server running on port " + listenPort);
});