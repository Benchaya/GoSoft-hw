const { createPool } = require('mysql2')
const jsonwebtoken = require('jsonwebtoken')

const jwtkey = "my json web token secrey key eiei"

const sqlPool = createPool({
    namedPlaceholders: true,
    charset: 'utf8',
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "gosoft_work",
})

const express = require('express');

const app = express();
app.use(express.json());


app.use((req, res, next) => {
    if(req.path == "/login") return next()

    const auth = req.headers.authorization

    if(!auth) return res.status(400).json({msg: "error forbidden unauthorized"})

    const token = auth.split(' ')[1]

    if(!token) return res.status(400).json({msg: "error forbidden unauthorized"})

    jsonwebtoken.verify(token, jwtkey, (err, result) => {
        if(err) return res.status(400).json({msg: "error forbidden unauthorized"})
        next()
    })
})

app.post('/login', (req, res) => {
    const username = req.body.user;
    const password = req.body.pass;

    if (username != "ben.r" || password != "1234")
        return res.status(400).json({ msg: "invalid username / password" })

    const token = jsonwebtoken.sign({
        user: username
    }, jwtkey)

    res.json({
        msg: "ok",
        token: token
    })
})

app.get('/get_employee_data', (req, res) => {

    const sql = 'SELECT * FROM employee'

    sqlPool.query(sql, (err, result) => {
        if (err) return res.status(400).json({ msg: "Error" })
        res.json({ data: result })
    })

})

app.post('/create_employee_data', (req, res) => {

    if (
        !req.body.fname ||
        !req.body.lname ||
        !req.body.eid ||
        !req.body.pos ||
        !req.body.tel ||
        !req.body.email
    ) {
        return res.status(400).send("error invalid data");
    }

    const sql = 'INSERT INTO employee VALUE ( :name, :lname, :pos, :id, :tel, :mail)';

    sqlPool.query(sql, {
        id: req.body.eid,
        name: req.body.fname,
        lname: req.body.lname,
        pos: req.body.pos,
        tel: req.body.tel,
        mail: req.body.email
    }, (err, result) => {
        if (err) {
            console.log({err})
            if (err.code == "ER_DUP_ENTRY") return res.status(400).json({ msg: "Error, Duplicate Data" })
            return res.status(400).json({ msg: "Error, Unknown Error" })
        }
        res.json({ msg: "ok" })
    })


})

app.put('/update_employee_data', (req, res) => {
    if (
        !req.body.eid ||
        !req.body.pos ||
        !req.body.tel ||
        !req.body.email
    ) {
        return res.status(400).send("error invalid data");
    }

    const sql = 'UPDATE employee SET POS = :pos, TEL = :tel, EMAIL = :mail WHERE ID = :id'

    sqlPool.query(sql, {
        id: req.body.eid,
        pos: req.body.pos,
        tel: req.body.tel,
        mail: req.body.email
    }, (err, result) => {
        if (err) {
            if (err.code == "ER_DUP_ENTRY") return res.status(400).json({ msg: "Error, Duplicate Data" })
            return res.status(400).json({ msg: "Error, Unknown Error" })
        }

        if (result.affectedRows == 0) return res.status(400).json({ msg: "Error, Employee Not Found" })
        res.json({ msg: "ok" })
    })
})

app.delete('/remove_employee_data', (req, res) => {
    if (!req.body.eid) return res.status(400).send("error invalid data");

    const sql = 'DELETE FROM employee WHERE ID = :id';

    sqlPool.query(sql, { id: req.body.eid, }, (err, result) => {
        if (err) return res.status(400).json({ msg: "Error, Unknown Error" })
        if (result.affectedRows == 0) return res.status(400).json({ msg: "Error, Employee Not Found" })
        res.json({ msg: "ok" })
    })
})

app.listen(3000, () => {
    console.log(`Listening on port: 3000`);
});
//