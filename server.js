const express = require('express')
const app = express()
const path = require('path')
const {v4} = require("uuid")
const port = process.env.port || 3000;

var DB_CONTACTS = [
    {id:v4(), name:"alex", value:"01010101",marked:false}
]

app.use(express.json())

app.get('/api/contacts', (req,res) => {
    setTimeout(() => {
        res.status(200).json(DB_CONTACTS)
    }, 1000);
})

app.post('/api/contacts', (req,res) => {
    const contact = {...req.body,id:v4(),marked:false}
    DB_CONTACTS.push(contact)
    res.status(201).json(contact)
})

app.put('/api/contacts/:id', (req,res) => {
    const contact = req.body
    var index = DB_CONTACTS.findIndex(c => c.id == contact.id)
    DB_CONTACTS[index] = contact
    console.log("Marking in DB", contact.id)
    res.status(201)
})

app.delete('/api/contacts/:id', (req,res) => {
    DB_CONTACTS = DB_CONTACTS.filter(c => c.id !== req.params.id)
    console.log("Deleting in DB", req.params.id)
    res.status(201).json({ok:true})
})







app.use(express.static(path.resolve(__dirname, 'client')))

app.get('/', (req,res) => {
    res.sendFile(path.resolve(__dirname,'client','index.html'))
})


app.listen(port, () => console.log("Server has been started on",port))