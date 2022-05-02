
const express = require('express');

const app = express();
app.use(express.json());

let employees = []

const searchById = (id) => {
    for(let i=0;i<employees.length;i++) if(employees[i].eid == id) return i;
    return null;
}

const searchByTel = (tel) => {
    for(let i=0;i<employees.length;i++) if(employees[i].tel == tel) return i;
    return null;
}

const searchByEmail = (email) => {
    for(let i=0;i<employees.length;i++) if(employees[i].email == email) return i;
    return null;
}

app.get('/get_employee_data', (req, res) => {
    res.send(employees)
})

app.post('/create_employee_data', (req, res) => {
    if(
        !req.body['fname'] || 
        !req.body['lname'] || 
        !req.body['eid'] || 
        !req.body['pos'] || 
        !req.body['tel'] || 
        !req.body['email']
    ) return res.status(400).send('error')
    
    if(
        searchById(req.body['eid']) != null || 
        searchByTel(req.body['tel']) != null || 
        searchByEmail(req.body['email']) != null
    )  return res.status(400).send('error')
    
    
    employees.push({
        fname: req.body['fname'],
        lname: req.body['lname'],
        eid: req.body['eid'],
        pos: req.body['pos'],
        tel: req.body['tel'],
        email: req.body['email'],
    })

    res.send('success')
})

app.delete('/remove_employee_data', (req, res) => {
    if(!req.body['eid']) return res.status(400).send('error')
    const eid = searchById(req.body['eid']) 
    if(eid != null)  {
        employees.splice(eid, 1);
        return res.send('success')
    }
    res.status(400).send('error not found')
})

app.put('/update_employee_data', (req, res) => {
    if(
        !req.body['eid'] || 
        !req.body['pos'] || 
        !req.body['tel'] || 
        !req.body['email']
    ) return res.status(400).send('error')

    const eid = searchById(req.body['eid']) 
    if(eid != null)  {
        employees[eid]['pos'] = req.body['pos'];
        employees[eid]['tel'] = req.body['tel'];
        employees[eid]['email'] = req.body['email'];
        return res.send('success')
    }
    res.status(400).send('error not found')
})

app.listen(3000 , () => {
    console.log('Listening on port: 3000');
});
