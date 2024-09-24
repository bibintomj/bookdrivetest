const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs')

app.use(express.static('public'));
app.set('view engine', 'ejs')

app.listen(3000, () => {
    console.log('Listening to port 3000');
});

app.get('/', (req, res) => {
    res.render('index')
});

app.get('/g2-test', (req, res) => {
    res.render('g2-test')
});

app.get('/g-test', (req, res) => {
    res.render('g-test')
});

app.get('/login', (req, res) => {
    res.render('login')
});
