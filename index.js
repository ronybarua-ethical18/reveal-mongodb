const express = require("express");
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const todoHandler = require('./routeHandler/todoHandler')
const userHandler = require('./routeHandler/userHandler')
const app = express();

app.use(express());
app.use(express.json());
dotenv.config()
//database connection with mongoose
mongoose.connect('mongodb://localhost/todos')
.then(res => console.log('connection successful'))
.catch(err => console.log(err))

//default error handler
const errorHandler = (err, req, res, next) =>{
    if(res.headerSent){
        return next(err)
    }
    else{
        res.status(500).json({error: err})
    }
}

app.use(errorHandler)

//applicatin routes
app.use('/todo', todoHandler)
app.use('/user', userHandler)

app.listen(5000, (req, res) => {
 console.log('listening to port 5000')
});
