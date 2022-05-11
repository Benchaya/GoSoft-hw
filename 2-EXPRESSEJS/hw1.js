const express = require('express');
const game24solver = require('24game-solver/dist/24game-solver')

const app = express();
app.use(express.json());

const isNum = (n) => {
    try { n = parseInt(n); }
    catch { return false; }
    if(!n) return false;
    return true;
};
const isNum19 = (n) => (n > 0 && n < 10);

app.get('/:n1/:n2/:n3/:n4', (req, res) => {

    const b = req.params;

    if(!b.n1 || !b.n2 || !b.n3 || !b.n4) {
        return res.status(403).send('error not found data')
    }

    if(!isNum(b.n1) || !isNum(b.n2) || !isNum(b.n3) || !isNum(b.n4)) {
        return res.status(403).send('error need a number')
    }

    if(!isNum19(b.n1) || !isNum19(b.n2) || !isNum19(b.n3) || !isNum19(b.n4)) {
        return res.status(403).send('error range must be 1-9')
    }

    const result = game24solver([parseInt(b.n1), parseInt(b.n2), parseInt(b.n3), parseInt(b.n4)], 24);

    if(result.length == 0) return res.send("FAIL NO SOLUTION FOULD")
    
    res.send({
        msg: "SUCCESS",
        data: result
    })
})

app.listen(3000 , () => {
    console.log('Server Run');
});