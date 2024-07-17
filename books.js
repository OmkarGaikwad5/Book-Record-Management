const express = require('express')
const router = express.Router();
const { books } = require('../Data/books.json');
const {users} = require('../Data/users.json')



// For All Books



router.get('/', (req,res) => {
    res.status(200).json({
    Success : "True",
    Data : books,
    });
});

router.get("/issued", (req, res) => {
    //   console.log("issued Books");
    const usersWithIssuedBook = users.filter((each) => {
      if (each.issuedBook) return each;
    });
    const issuedBooks = [];
  
    usersWithIssuedBook.forEach((each) => {
      const book = books.find((book) => book.id === each.issuedBook);
  
      book.issuedBy = each.name;
      book.issuedDate = each.issuedDate;
      book.returnDate = each.returnDate;
  
      issuedBooks.push(book);
    });
    if (issuedBooks.length === 0)
      return res
        .status(404)
        .json({ success: "False", message: "No book has been issued" });
  
    return res.status(200).json({ 
        Success: "True",
         Data: issuedBooks });
  });

  router.get("/:id", (req, res) => {
    const { id } = req.params;
  
    const book = books.find((each) => each.id === id);
  
    if (!book)
      return res.status(404).json({ success: false, message: "Book not found" });
  
    return res.status(200).json({ success: true, data: book });
  });


router.get('/:name',(req,res) => {
    const {name} = req.params;
    const book = books.find((each) => each.name === name);
    if(!name){
        return res.status(404).json({
           Success : "False" ,
            Message : "Book Not Found Please Enter Correct Book Name",
        });
    } 

    return res.status(200).json({
        Success : "True",
        Data : book,
    });
});

router.post('/',(req,res) => {
    const {data} = req.body;
    if(!data) {
        return res.status(404).json({
            Success : "False",
            Message : "No Data To Add Book",
        });
    }

    const book = books.find((each) => each.id == data.id);
    if(book){
        return res.status(404).json({
            Successs : "False",
            Message : "ID Already Exists",
        });
    }

    const allBooks = {...books , data};
    return res.status(201).json({
        Success : "True",
        Message : "Book Created Successfully",
        Data : allBooks,
    });
});


router.put('/:id',(req,res) => {
const { id } = req.params;
const { data } = req.body;

const book = books.find((each) => each.id === id);

if(!book){
    return res.status(404).json({
        Success : "False",
        Message : "No Book Found With This ID",
    });
}

const updateBook = books.map((each) =>{
    if(each.id === id){
        return{
            ...each,
            ...data
        };
    }
    return each;
});

return res.status(200).json({
    Success : "True",
    Message : "Book Updated Successfully",
    Data :updateBook ,
});
})


module.exports = router;