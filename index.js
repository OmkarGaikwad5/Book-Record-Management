const express = require('express');
const { users } = require('./Data/users.json');
 const { books } = require('./Data/books.json');

const userRouter = require('./routes/users.js')
const booksRouter = require('./routes/books');

const app = express();

const port =8081;

app.use(express.json());



app.get('/users',(req,res) => {
    res.status(200).json({
       message :  "Server started running successfully",
    });
});

app.use("/users",userRouter);
app.use("/books",booksRouter);

app.get('/users',(req,res) =>{
    res.status(200).json({
        success : "True",
        Data : users,
    });
});







app.get('*', (req,res) => {
    res.status(404).json({
        Message : "Not Found",
    });
});

app.listen(port, () => {
    console.log(`Server started running on port ${port}`)
});
