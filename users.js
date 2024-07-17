const express = require('express')
const { users } = require('../Data/users.json');
const router = express.Router();



router.get('/:id',(req,res) => {
    const {id} = req.params;
    const user = users.find((each) => each.id === id);
    if(!user){
        return res.status(404).json({
            Success : "False",
            Data : "Please Enter valid id ",
        });
    }

    return res.status(200).json({
        Success : "True",
        Data : user,
    });
});

router.post('/',(req,res)=> {

    const {id,name,surname,email, issuedBook,issuedDate,returnDate,subscriptionType,subscriptionDate} = req.body;
    const user = users.find((each) => each.id === id);
        if(user){
            return res.status(404).json({
                Success : "False",
                Message : "ID Already Exists !!",
            });
        }

        users.push({
            id,
            name,
            surname,
            email,
             issuedBook,
             issuedDate,
             returnDate,
             subscriptionType,
             subscriptionDate,
        });

        return res.status(200).json({
            Success : "True",
            Message : "User Created Successfully !!!",
            Data : users,
        });
    }
)



router.put('/:id',(req,res) => {
    const {id} = req.params;
    const {data} =req.body;

    const user = users.find((each) => each.id === id);
    if(!user){
        return res.status(404).json({
            Success : "False",
            Message : "User Doesen't Exist !!",
        });
    }

    const updateUserData = users.map((each) => {
        if(each.id === id){
            return {
                ...each,
                ...data,
            };
        }
        return each;
    });

    return res.status(200).json({
        Success : "True",

        message : "User Updated",
        Data : updateUserData,
    });
});


router.delete('/:id',(req,res) => {
    const {id} = req.params;
    const user = users.find((each) => each.id === id);
    if(!user){
        return res.status(404).json({
            Success : "False",
            Message : "User Dosen't Exist !!"
        });
    }

    const index = users.indexOf(user);
    users.splice(index,1);
    return res.status(200).json({
        Success : "True",
        Message : "User Deleted Successfully !!!",
        Data : users
    });
});



router.get('/subscription-details/:id',(req,res) => {
    const {id} = req.params;
    const user = users.find((each) => each.id === id);
    if(!user){
        return res.status(404).json({
            Success : "False",
            Message : "User Dosen't Exist Eith This ID",
        });
    }

    const getDateInDays = (data = "") => {
        let date;
        if(data === ""){
            date = new Date();

        }
        else{
            date = new Date(data);
        }
        let days = Math.floor(date/ (1000 * 60 * 60 * 24));
        return days;
    };

    const subscriptionType = (date) => {
        if((user.subscriptionType = "Basic")){
            date = date + 90;
        } else if((user.subscriptionType = "Standard")){
            date = date + 180;
        } else if((user.subscriptionType = "Premium")) {
            date = date + 365;
        }

        return date;
    };
   
    let returnDate = getDateInDays(user.returnDate);
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(user.subscriptionDate);
    let subscriptionExpiration = subscriptionType(subscriptionDate);
    

    const data = {
        ...user,
        isSubscriptionExpired : subscriptionExpiration <= currentDate,
        daysLeftForExpiration:
        subscriptionExpiration <= currentDate
        ? 0
        : subscriptionExpiration <= currentDate,
        fine :
        returnDate < currentDate
        ? subscriptionExpiration <= currentDate
        ? 100
        :50
        :0,
    };
    return res.status(200).json({
        Success : "True",
        Message : "Subscription Details For The User",
        data,
    })
 })

module.exports = router;