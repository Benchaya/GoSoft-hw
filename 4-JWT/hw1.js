const express = require('express');
const jsonwebtoken = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

const port = 3000;
const jwtkey = "abc1234adasdagalkjksajkjal;j;l";

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/login.html")
});

app.get('/home', (req, res) => {
    console.log(req.cookies)
    if(!req.cookies.token) return res.redirect('/error')

    jsonwebtoken.verify(req.cookies.token, jwtkey, (err, result) => {
        if(err) return res.redirect('/error')
        res.sendFile(__dirname + "/public/home.html")
    })
});

app.get('/error', (req, res) => {
    res.sendFile(__dirname + "/public/error.html")
});

app.get('/style.css', (req, res) => {
    res.sendFile(__dirname + "/public/style.css")
});

app.post('/login', (req, res) => {
    const username = req.body.user;
    const password = req.body.pass;

    if(username != "benchaearng" || password != "bibimbubz") {
        res.cookie('error', 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
        return res.status(400).redirect('/')
    }
    

    const token = jsonwebtoken.sign({
        user: username
    }, jwtkey)

    res.cookie('token',token)
    res.redirect('/home')
})

app.get('/logout', (req, res) => {
    res.cookie('token', '')
    res.redirect('/')
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});