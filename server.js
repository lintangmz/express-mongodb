const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Todo = require('./models/todo')

const port = 3000

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const dburl = 'mongodb://localhost:27017/todolistdb'
mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true })

app.get('/', (req, res) => {
    Todo.find()
    .then(result => {
        res.render('index', { data: result })
        console.log(result)
    })
})

app.post('/', (req, res) => {
    const todo = new Todo({
        todo: req.body.todoValue
    })
    todo.save()
    .then(result => {
        res.redirect('/')
    })
})

app.delete('/:id', (req, res) => {
    Todo.findByIdAndDelete(req.params.id)
    .then(result => {
        console.log(result)
    })
})

app.listen(port, () => {
    console.log('Server is runnning on port: ' + port)
})