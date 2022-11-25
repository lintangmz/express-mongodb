require("dotenv").config();
const express = require('express')
const app = express()
const port = process.env.PORT
const mongoose = require('mongoose')

// models
const Todo = require('./models/todo')

// view engine configuration
app.set('view engine', 'ejs')

app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// connection to db
mongoose.connect(process.env.DB_CONN)
    .then(() => {
        console.log("Connected to db!");

        app.listen(port, () => console.log('Server is runnning on port: ' + port));
    })
    .catch((err) => console.log("Error connecting to the database", err))

// get method
app.get('/', (req, res) => {
    Todo.find({}, (err, tasks) => {
        res.render('todo', { todo: tasks })
    })
});

// post method
app.post('/', async (req, res) => {
    const addTask = new Todo({
        content: req.body.content
    })
    try {
        await addTask.save()

        res.redirect('/')
    } catch (err) {
        res.send(err)
    }
})

// update method
app.route('/edit/:id')
    .get((req, res) => {
        const id = req.params.id

        Todo.find({}, (err, tasks) => {
            res.render('todoEdit', { todo: tasks, idTask: id })
        })
    })
    .post((req, res) => {
        const id = req.params.id

        Todo.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err)
            res.redirect('/')
        })
    })

//DELETE
app.route("/remove/:id")
    .get((req, res) => {
        const id = req.params.id

        Todo.findByIdAndRemove(id, err => {
            if (err) return res.send(500, err)
            res.redirect("/")
        })
    })